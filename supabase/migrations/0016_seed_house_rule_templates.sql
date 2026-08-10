-- ---------------------------------------------------------------------------
-- Populate the saved-rules library (added in 0015) for accounts that already
-- exist, in two passes.
--
-- 1. HARVEST. Every rule a host has already typed into a house_rules section is
--    lifted into their library, so the picker is useful the first time they
--    open it instead of asking them to retype rules they've already written.
--    Done as a query over existing content rather than a hand-written list:
--    it's correct for every account, including ones with rules nobody has read.
--
-- 2. STARTER SET. Accounts with no house rules anywhere get the generic starter
--    library, mirroring what new accounts get at signup.
--
-- Both passes are copies, matching how the feature works everywhere else — a
-- host can edit or delete any of these without it affecting a live guide.
-- Re-runnable: ON CONFLICT DO NOTHING defers to the unique title index.
-- ---------------------------------------------------------------------------

-- Pass 1 — harvest what hosts have already written.
with harvested as (
  select
    g.account_id,
    btrim(r->>'title')                                as title,
    nullif(btrim(coalesce(r->>'reason', '')), '')     as reason,
    -- Rules written before icons existed have none. Left null rather than
    -- guessed at here: the guest side and the editor both derive a mark from
    -- the wording, and that guess improves as the keyword list grows.
    nullif(btrim(coalesce(r->>'icon', '')), '')       as icon,
    s.updated_at
  from public.guide_sections s
  join public.guides g on g.id = s.guide_id
  cross join lateral jsonb_array_elements(
    case
      when jsonb_typeof(s.content->'rules') = 'array' then s.content->'rules'
      else '[]'::jsonb
    end
  ) as r
  where s.type = 'house_rules'
    and jsonb_typeof(r) = 'object'
    and btrim(coalesce(r->>'title', '')) <> ''
),
-- The same rule is usually on several properties with the wording drifted
-- slightly apart. Keep one per account, preferring the most recently edited
-- section — that's the version the host last thought about.
deduped as (
  select distinct on (account_id, lower(title))
    account_id, title, reason, icon
  from harvested
  order by account_id, lower(title), updated_at desc
)
insert into public.house_rule_templates (account_id, title, reason, icon, position)
select
  account_id,
  title,
  reason,
  icon,
  (row_number() over (partition by account_id order by lower(title)))::integer - 1
from deduped
on conflict do nothing;

-- Pass 2 — starter set for accounts pass 1 found nothing for.
--
-- A point-in-time copy of STARTER_RULE_TEMPLATES in
-- src/lib/guide/rule-templates.ts, which is what new accounts get. The two
-- aren't kept in sync on purpose: this migration is a record of what existing
-- accounts were given on this date, and editing it later would rewrite history
-- without changing any database.
insert into public.house_rule_templates (account_id, title, reason, icon, position)
select a.id, v.title, v.reason, v.icon, v.position
from public.accounts a
cross join (values
  ('No smoking inside',
   'If we are made aware that smoking is taking place inside your security deposit will be charged',
   'no-smoking', 0),
  ('No noise between 11pm and 7am',
   'Please be respectful to the neighbours by not causing noise and disturbance during quiet hours',
   'no-noise', 1),
  ('No illegal activities',
   'If we are made aware of any illegal activities taking place, inside your security deposit will be charged and police will be notified',
   'legal', 2),
  ('No gatherings or parties',
   'Strictly no parties or any type of gatherings allowed',
   'no-parties', 3),
  ('No pets',
   'This isn''t a pet friendly property unfortunately, so please do not bring any with you',
   'no-pets', 4)
) as v(title, reason, icon, position)
where not exists (
  select 1 from public.house_rule_templates t where t.account_id = a.id
)
on conflict do nothing;
