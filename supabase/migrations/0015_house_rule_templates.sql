-- ---------------------------------------------------------------------------
-- Saved house rules (account-level library)
--
-- House rules repeat almost verbatim across a host's portfolio — "no smoking
-- inside", "quiet after 11pm", "no unregistered guests". Retyping them into
-- every property's guide is the single most tedious part of onboarding a new
-- listing, and the copies drift apart the moment one is edited.
--
-- A saved rule belongs to the ACCOUNT, not to any guide. Adding one to a guide
-- COPIES it into that section's JSONB content, exactly as if it were typed:
-- the guide stays self-contained (guest reads never join to this table) and a
-- host can tweak the wording for one property without touching the library.
-- Deliberately a copy, not a reference — shared editing is a different feature
-- with different failure modes, and hosts expect per-property overrides.
-- ---------------------------------------------------------------------------

create table public.house_rule_templates (
  id           uuid primary key default gen_random_uuid(),
  account_id   uuid not null references public.accounts(id) on delete cascade,
  title        text not null,
  reason       text,
  -- Icon slug from RULE_ICONS in src/components/guest/rule-icons.tsx. Nullable
  -- and unconstrained: null means "guess from the wording" (the guest side
  -- falls back on the title), and an unknown slug renders the generic mark, so
  -- adding icons never needs a migration.
  icon         text,
  position     integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index house_rule_templates_account_id_idx
  on public.house_rule_templates(account_id);

-- Saving the same rule twice is a no-op rather than a duplicate: the editor's
-- "save to my rules" button is easy to press again on a rule already in the
-- library, and two identical entries in the picker is pure noise. Case- and
-- whitespace-insensitive so "No smoking" and "no smoking " collide.
create unique index house_rule_templates_account_title_key
  on public.house_rule_templates(account_id, lower(btrim(title)));

create trigger house_rule_templates_set_updated_at
  before update on public.house_rule_templates
  for each row execute function public.set_updated_at();

alter table public.house_rule_templates enable row level security;

create policy "members read saved rules"
  on public.house_rule_templates for select
  using (public.is_account_member(account_id));

create policy "members write saved rules"
  on public.house_rule_templates for all
  using (public.is_account_member(account_id))
  with check (public.is_account_member(account_id));
