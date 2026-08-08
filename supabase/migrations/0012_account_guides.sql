-- Account-level guides.
--
-- 0011 hung every guide off a property. But plenty of what a host needs to
-- document is about the business rather than any one building — how to run a
-- background check on a guest, how a VA handles the inbox, what to do about a
-- chargeback. Those apply across every property, and forcing them under one is
-- both wrong and unfindable.
--
-- A guide now belongs to an ACCOUNT, and optionally to a property:
--   property_id set  -> a guide for that place (guest, cleaner, …)
--   property_id null -> a company-wide process guide
--
-- Additive: nothing is dropped, two NOT NULLs are relaxed, and RLS is repointed
-- from the property to the account so both shapes resolve through one path.

-- ---------------------------------------------------------------------------
-- guides.account_id
-- ---------------------------------------------------------------------------
alter table public.guides
  add column account_id uuid references public.accounts(id) on delete cascade;

update public.guides g
set account_id = p.account_id
from public.properties p
where p.id = g.property_id;

alter table public.guides alter column account_id set not null;
alter table public.guides alter column property_id drop not null;

create index guides_account_id_idx on public.guides(account_id);

-- A guide's property, when it has one, must belong to the same account.
-- Without this a guide could be moved under another account's property.
create or replace function public.guide_property_matches_account()
returns trigger
language plpgsql
as $$
begin
  if new.property_id is not null then
    if not exists (
      select 1 from public.properties p
      where p.id = new.property_id and p.account_id = new.account_id
    ) then
      raise exception 'property % does not belong to account %',
        new.property_id, new.account_id;
    end if;
  end if;
  return new;
end;
$$;

create trigger guides_property_account_check
  before insert or update on public.guides
  for each row execute function public.guide_property_matches_account();

-- ---------------------------------------------------------------------------
-- Children of an account-level guide have no property.
-- ---------------------------------------------------------------------------
alter table public.guide_sections  alter column property_id drop not null;
alter table public.custom_sections alter column property_id drop not null;
alter table public.magic_links     alter column property_id drop not null;
alter table public.media_items     alter column property_id drop not null;

-- ---------------------------------------------------------------------------
-- RLS repointed: membership now resolves guide -> account, which covers both
-- property-scoped and account-level guides through a single path. The old
-- policies went guide -> property and would deny every account-level row.
-- ---------------------------------------------------------------------------
drop policy if exists "members read guides"  on public.guides;
drop policy if exists "members write guides" on public.guides;

create policy "members read guides"
  on public.guides for select
  using (public.is_account_member(account_id));

create policy "members write guides"
  on public.guides for all
  using (public.is_account_member(account_id))
  with check (public.is_account_member(account_id));

-- Membership for anything owned by a guide.
create or replace function public.can_access_guide(p_guide_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.guides g
    where g.id = p_guide_id
      and public.is_account_member(g.account_id)
  );
$$;

grant execute on function public.can_access_guide(uuid) to authenticated;

-- Existing policy names don't follow one pattern, so drop each by its real name.
drop policy if exists "members read sections"      on public.guide_sections;
drop policy if exists "members write sections"     on public.guide_sections;
drop policy if exists "members read custom sections"  on public.custom_sections;
drop policy if exists "members write custom sections" on public.custom_sections;
drop policy if exists "members read links"         on public.magic_links;
drop policy if exists "members write links"        on public.magic_links;
drop policy if exists "members read media"         on public.media_items;
drop policy if exists "members write media"        on public.media_items;

create policy "members read sections"
  on public.guide_sections for select using (public.can_access_guide(guide_id));
create policy "members write sections"
  on public.guide_sections for all
  using (public.can_access_guide(guide_id))
  with check (public.can_access_guide(guide_id));

create policy "members read custom sections"
  on public.custom_sections for select using (public.can_access_guide(guide_id));
create policy "members write custom sections"
  on public.custom_sections for all
  using (public.can_access_guide(guide_id))
  with check (public.can_access_guide(guide_id));

create policy "members read links"
  on public.magic_links for select using (public.can_access_guide(guide_id));
create policy "members write links"
  on public.magic_links for all
  using (public.can_access_guide(guide_id))
  with check (public.can_access_guide(guide_id));

create policy "members read media"
  on public.media_items for select using (public.can_access_guide(guide_id));
create policy "members write media"
  on public.media_items for all
  using (public.can_access_guide(guide_id))
  with check (public.can_access_guide(guide_id));

-- local_guide_entries resolve through their section's guide for the same reason.
drop policy if exists "members read local entries"  on public.local_guide_entries;
drop policy if exists "members write local entries" on public.local_guide_entries;

create policy "members read local entries"
  on public.local_guide_entries for select
  using (exists (
    select 1 from public.guide_sections s
    where s.id = local_guide_entries.guide_section_id
      and public.can_access_guide(s.guide_id)
  ));

create policy "members write local entries"
  on public.local_guide_entries for all
  using (exists (
    select 1 from public.guide_sections s
    where s.id = local_guide_entries.guide_section_id
      and public.can_access_guide(s.guide_id)
  ))
  with check (exists (
    select 1 from public.guide_sections s
    where s.id = local_guide_entries.guide_section_id
      and public.can_access_guide(s.guide_id)
  ));

-- ---------------------------------------------------------------------------
-- create_guide: now account-first, with an optional property.
-- ---------------------------------------------------------------------------
drop function if exists public.create_guide(uuid, text, text, text[], jsonb, text);

create or replace function public.create_guide(
  p_account_id  uuid,
  p_property_id uuid,
  p_name        text,
  p_kind        text,
  p_types       text[],
  p_contents    jsonb,
  p_token       text
)
returns public.guides
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_guide public.guides;
  v_pos   integer;
begin
  select coalesce(max(position) + 1, 0) into v_pos
  from public.guides
  where account_id = p_account_id
    and property_id is not distinct from p_property_id;

  insert into public.guides (account_id, property_id, name, kind, position)
  values (p_account_id, p_property_id,
          coalesce(nullif(trim(p_name), ''), 'Untitled guide'),
          coalesce(nullif(trim(p_kind), ''), 'custom'), v_pos)
  returning * into v_guide;

  if array_length(p_types, 1) > 0 then
    insert into public.guide_sections (property_id, guide_id, type, position, content)
    select p_property_id, v_guide.id, t::public.guide_section_type, i - 1,
           coalesce(p_contents -> t, '{}'::jsonb)
    from unnest(p_types) with ordinality as u(t, i);
  end if;

  insert into public.magic_links (property_id, guide_id, token)
  values (p_property_id, v_guide.id, p_token);

  return v_guide;
end;
$$;

grant execute on function public.create_guide(uuid, uuid, text, text, text[], jsonb, text) to authenticated;
