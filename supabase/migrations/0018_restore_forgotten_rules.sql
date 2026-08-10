-- ---------------------------------------------------------------------------
-- One-off repair: put back saved rules that were deleted by accident.
--
-- The library's delete button ("Forget") was permanent and didn't say so, and
-- rules were removed that the host wanted to keep. It's replaced in the UI by a
-- tick/untick that only controls whether a rule is on the guide in front of
-- you, so this class of accident can't recur.
--
-- Recovery is possible because adding a saved rule to a guide COPIES it: the
-- wording survives in whatever guide used it, and this re-runs 0016's harvest
-- to lift it back into the library. Anything that only ever existed as a
-- template — saved but never added to a guide — cannot be recovered this way,
-- and isn't in the tables to be found.
--
-- Idempotent, and safe to keep in the history: ON CONFLICT DO NOTHING means it
-- never duplicates a rule that's already saved. It restores whatever is in a
-- guide at the moment it runs, which is why it is a dated repair and not a
-- mechanism — a host who deliberately drops a saved rule that's still on a
-- guide would see it come back if this ever ran again.
-- ---------------------------------------------------------------------------

with harvested as (
  select
    g.account_id,
    btrim(r->>'title')                            as title,
    nullif(btrim(coalesce(r->>'reason', '')), '') as reason,
    nullif(btrim(coalesce(r->>'icon',   '')), '') as icon,
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
deduped as (
  select distinct on (account_id, lower(title))
    account_id, title, reason, icon
  from harvested
  order by account_id, lower(title), updated_at desc
),
-- Restored rules go after whatever the account already has, so recovery never
-- reshuffles a library the host has since put in an order they like.
next_position as (
  select account_id, coalesce(max(position) + 1, 0) as start
  from public.house_rule_templates
  group by account_id
)
insert into public.house_rule_templates (account_id, title, reason, icon, position)
select
  d.account_id,
  d.title,
  d.reason,
  d.icon,
  coalesce(n.start, 0)
    + (row_number() over (partition by d.account_id order by lower(d.title)))::integer - 1
from deduped d
left join next_position n on n.account_id = d.account_id
on conflict do nothing;
