-- Guides: a layer between properties and their content.
--
-- Until now a property WAS a guest guide — guide_sections, custom_sections,
-- magic_links and media_items all hung directly off properties, and
-- `unique (property_id, type)` capped a property at one of each section.
--
-- A property now has many guides (guest, cleaner, staff, or anything else the
-- host names), each with its own sections, custom sections and magic link.
--
-- This migration is additive. Every existing property gets one guide named
-- "Guest guide" holding exactly its current content, so live magic-link tokens
-- keep resolving to the same thing. property_id columns are retained (a guide
-- belongs to exactly one property, so they cannot drift) which lets every
-- existing RLS policy keep working untouched.

-- ---------------------------------------------------------------------------
-- guides
-- ---------------------------------------------------------------------------
create table public.guides (
  id             uuid primary key default gen_random_uuid(),
  property_id    uuid not null references public.properties(id) on delete cascade,
  name           text not null,
  -- Preset slug ('guest' | 'cleaner' | 'staff' | 'custom'). Deliberately text,
  -- not an enum: adding a guide type is a code change, not a migration.
  kind           text not null default 'guest',
  -- Per-guide overrides for built-in section names + on/off toggles. Moved down
  -- from properties.section_titles so two guides can name sections differently.
  section_titles jsonb not null default '{}'::jsonb,
  position       integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index guides_property_id_idx on public.guides(property_id);

create trigger guides_set_updated_at
  before update on public.guides
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Backfill: one guest guide per existing property, inheriting its section config
-- ---------------------------------------------------------------------------
insert into public.guides (property_id, name, kind, section_titles, position)
select p.id, 'Guest guide', 'guest', coalesce(p.section_titles, '{}'::jsonb), 0
from public.properties p;

-- ---------------------------------------------------------------------------
-- Re-parent existing content onto that guide
-- ---------------------------------------------------------------------------
alter table public.guide_sections  add column guide_id uuid references public.guides(id) on delete cascade;
alter table public.custom_sections add column guide_id uuid references public.guides(id) on delete cascade;
alter table public.magic_links     add column guide_id uuid references public.guides(id) on delete cascade;
alter table public.media_items     add column guide_id uuid references public.guides(id) on delete cascade;

update public.guide_sections t
set guide_id = g.id
from public.guides g
where g.property_id = t.property_id and g.kind = 'guest';

update public.custom_sections t
set guide_id = g.id
from public.guides g
where g.property_id = t.property_id and g.kind = 'guest';

update public.magic_links t
set guide_id = g.id
from public.guides g
where g.property_id = t.property_id and g.kind = 'guest';

update public.media_items t
set guide_id = g.id
from public.guides g
where g.property_id = t.property_id and g.kind = 'guest';

alter table public.guide_sections  alter column guide_id set not null;
alter table public.custom_sections alter column guide_id set not null;
alter table public.magic_links     alter column guide_id set not null;
alter table public.media_items     alter column guide_id set not null;

create index guide_sections_guide_id_idx  on public.guide_sections(guide_id);
create index custom_sections_guide_id_idx on public.custom_sections(guide_id);
create index magic_links_guide_id_idx     on public.magic_links(guide_id);
create index media_items_guide_id_idx     on public.media_items(guide_id);

-- One section of each type per GUIDE, rather than per property. Strictly looser
-- than the constraint it replaces, so no existing row can be rejected.
alter table public.guide_sections
  drop constraint guide_sections_property_id_type_key;

alter table public.guide_sections
  add constraint guide_sections_guide_id_type_key unique (guide_id, type);

-- ---------------------------------------------------------------------------
-- RLS — membership resolved via the parent property, mirroring custom_sections
-- ---------------------------------------------------------------------------
alter table public.guides enable row level security;

create policy "members read guides"
  on public.guides for select
  using (exists (
    select 1 from public.properties p
    where p.id = guides.property_id
      and public.is_account_member(p.account_id)
  ));

create policy "members write guides"
  on public.guides for all
  using (exists (
    select 1 from public.properties p
    where p.id = guides.property_id
      and public.is_account_member(p.account_id)
  ))
  with check (exists (
    select 1 from public.properties p
    where p.id = guides.property_id
      and public.is_account_member(p.account_id)
  ));

-- ---------------------------------------------------------------------------
-- Guide creation RPC — the guide, its preset sections and its magic link have
-- to appear together or not at all, so a half-built guide is never reachable.
-- p_types is the (possibly empty) list of built-in sections to seed; staff and
-- cleaner guides pass none and are built purely from custom sections.
-- ---------------------------------------------------------------------------
create or replace function public.create_guide(
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
  from public.guides where property_id = p_property_id;

  insert into public.guides (property_id, name, kind, position)
  values (p_property_id, coalesce(nullif(trim(p_name), ''), 'Untitled guide'),
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

grant execute on function public.create_guide(uuid, text, text, text[], jsonb, text) to authenticated;
