-- ---------------------------------------------------------------------------
-- Ensure house_rule_templates.icon exists.
--
-- 0015 was edited to include this column after it had already been pushed to a
-- database, so that environment has 0015 recorded as applied without the column
-- and `db push` will never re-run it. This migration closes that gap.
--
-- Idempotent by design: `if not exists` makes it a no-op where 0015 already
-- created the column (a database built from scratch after the edit), and adds it
-- where 0015 ran beforehand. Both end up with the same schema.
--
-- Lesson recorded rather than repeated: don't edit a migration that has run
-- anywhere. Add a new one, even when the old one looks safe to amend.
-- ---------------------------------------------------------------------------

alter table public.house_rule_templates
  add column if not exists icon text;

comment on column public.house_rule_templates.icon is
  'Icon slug from RULE_ICONS in src/components/guest/rule-icons.tsx. Null means '
  'the guest side guesses one from the rule wording; unknown slugs render the '
  'generic mark, so adding icons needs no migration.';
