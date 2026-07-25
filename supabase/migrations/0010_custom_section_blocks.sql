-- Modular custom sections. Instead of a single title/subtitle/body, a custom
-- section is now an ordered list of content blocks (text, video, photo, map,
-- steps) that the host adds on demand and the guest sees in order.
--
-- The section NAME lives in custom_sections.title (set when the section is
-- created and editable via the dashboard rename control, mirroring built-in
-- sections). The old `subtitle` column is retired from the UI but kept for
-- backwards compatibility; `body` is preserved so legacy sections still render
-- (it is surfaced as an implicit text block when `blocks` is empty).

alter table public.custom_sections
  add column if not exists blocks jsonb not null default '[]'::jsonb;

-- Backfill: turn any existing free-text body into a single text block so old
-- sections keep their content under the new model.
update public.custom_sections
set blocks = jsonb_build_array(
  jsonb_build_object(
    'id', gen_random_uuid()::text,
    'type', 'text',
    'body', body
  )
)
where blocks = '[]'::jsonb
  and body is not null
  and length(btrim(body)) > 0;
