-- ---------------------------------------------------------------------------
-- One-off repair: give every stored host contact an explicit dial code.
--
-- Host numbers are stored as a local part plus a separate `dialCode`, and
-- `fullPhone()` recombines them by dropping the trunk "0" and prefixing the
-- code. Records written before dial codes existed have no `dialCode`, so the
-- guest "Call" link rendered tel:7949325413 — the 0 stripped, nothing put in
-- its place, and nothing that dials.
--
-- Backfill, in order of confidence:
--   1. A number already in international form ("+3531234…") tells us its own
--      country: longest-prefix match against the known codes. Derived, not
--      guessed. Numbers are left untouched; only `dialCode` is written.
--   2. A dial code stored in the old bare shape ("+44") is upgraded to the
--      current "ISO|+code" shape ("GB|+44") that distinguishes countries
--      sharing a code (US/CA are both +1).
--   3. Everything else falls back to GB|+44. This is an assumption, but a
--      narrow one: these records predate multi-country support, when the
--      editor displayed "+44" to the host without ever storing it. +44 is
--      what those hosts believed they had saved.
--
-- This writes the host-level `dialCode`, which remains the fallback for all
-- three numbers; a per-number override (`phoneDialCode` etc.) set later in the
-- editor takes precedence and is never touched here.
--
-- Idempotent: hosts that already carry an "ISO|+code" value are left alone,
-- so re-running changes nothing.
-- ---------------------------------------------------------------------------

-- Longest code first, so "+353" is matched before "+35"/"+3" could collide.
create or replace function pg_temp.dial_codes()
returns table (code text, iso text)
language sql
immutable
as $$
  select * from (values
      ('+353', 'IE'),
      ('+351', 'PT'),
      ('+213', 'DZ'),
      ('+374', 'AM'),
      ('+994', 'AZ'),
      ('+973', 'BH'),
      ('+880', 'BD'),
      ('+375', 'BY'),
      ('+591', 'BO'),
      ('+387', 'BA'),
      ('+359', 'BG'),
      ('+855', 'KH'),
      ('+237', 'CM'),
      ('+506', 'CR'),
      ('+385', 'HR'),
      ('+357', 'CY'),
      ('+420', 'CZ'),
      ('+593', 'EC'),
      ('+372', 'EE'),
      ('+251', 'ET'),
      ('+358', 'FI'),
      ('+995', 'GE'),
      ('+233', 'GH'),
      ('+502', 'GT'),
      ('+852', 'HK'),
      ('+354', 'IS'),
      ('+964', 'IQ'),
      ('+972', 'IL'),
      ('+225', 'CI'),
      ('+962', 'JO'),
      ('+254', 'KE'),
      ('+965', 'KW'),
      ('+371', 'LV'),
      ('+961', 'LB'),
      ('+370', 'LT'),
      ('+352', 'LU'),
      ('+356', 'MT'),
      ('+230', 'MU'),
      ('+373', 'MD'),
      ('+377', 'MC'),
      ('+212', 'MA'),
      ('+977', 'NP'),
      ('+234', 'NG'),
      ('+389', 'MK'),
      ('+968', 'OM'),
      ('+507', 'PA'),
      ('+974', 'QA'),
      ('+966', 'SA'),
      ('+381', 'RS'),
      ('+421', 'SK'),
      ('+386', 'SI'),
      ('+886', 'TW'),
      ('+255', 'TZ'),
      ('+216', 'TN'),
      ('+256', 'UG'),
      ('+380', 'UA'),
      ('+971', 'AE'),
      ('+598', 'UY'),
      ('+260', 'ZM'),
      ('+263', 'ZW'),
      ('+44', 'GB'),
      ('+61', 'AU'),
      ('+33', 'FR'),
      ('+49', 'DE'),
      ('+34', 'ES'),
      ('+39', 'IT'),
      ('+31', 'NL'),
      ('+54', 'AR'),
      ('+43', 'AT'),
      ('+32', 'BE'),
      ('+55', 'BR'),
      ('+56', 'CL'),
      ('+86', 'CN'),
      ('+57', 'CO'),
      ('+45', 'DK'),
      ('+20', 'EG'),
      ('+30', 'GR'),
      ('+36', 'HU'),
      ('+91', 'IN'),
      ('+62', 'ID'),
      ('+81', 'JP'),
      ('+60', 'MY'),
      ('+52', 'MX'),
      ('+64', 'NZ'),
      ('+47', 'NO'),
      ('+92', 'PK'),
      ('+51', 'PE'),
      ('+63', 'PH'),
      ('+48', 'PL'),
      ('+40', 'RO'),
      ('+65', 'SG'),
      ('+27', 'ZA'),
      ('+82', 'KR'),
      ('+94', 'LK'),
      ('+46', 'SE'),
      ('+41', 'CH'),
      ('+66', 'TH'),
      ('+90', 'TR'),
      ('+58', 'VE'),
      ('+84', 'VN'),
      ('+1', 'US'),
      ('+7', 'RU')  ) as t(code, iso);
$$;

-- The dial code implied by a number, if it is already in "+…" form.
create or replace function pg_temp.dial_from_number(num text)
returns text
language sql
immutable
as $$
  select d.iso || '|' || d.code
  from pg_temp.dial_codes() d
  where num like d.code || '%'
  order by length(d.code) desc
  limit 1;
$$;

-- Resolve one host object to its "ISO|+code" value.
create or replace function pg_temp.host_dial_code(host jsonb)
returns text
language sql
immutable
as $$
  select coalesce(
    -- 2. already current shape ("GB|+44") — leave as is
    (select host->>'dialCode' where host->>'dialCode' like '__|+%'),
    -- 2. legacy bare code ("+44") — upgrade to the ISO-qualified shape
    (select d.iso || '|' || d.code
       from pg_temp.dial_codes() d
      where d.code = nullif(trim(host->>'dialCode'), '')),
    -- 1. derive from a number already stored in international form
    pg_temp.dial_from_number(nullif(trim(host->>'phone'), '')),
    pg_temp.dial_from_number(nullif(trim(host->>'whatsapp'), '')),
    pg_temp.dial_from_number(nullif(trim(host->>'sms'), '')),
    -- 3. documented fallback
    'GB|+44'
  );
$$;

create or replace function pg_temp.with_dial_code(host jsonb)
returns jsonb
language sql
immutable
as $$
  select case
    when host is null or jsonb_typeof(host) <> 'object' then host
    else jsonb_set(host, '{dialCode}', to_jsonb(pg_temp.host_dial_code(host)))
  end;
$$;

update public.guide_sections s
   set content = jsonb_strip_nulls(
     s.content
     || case
          when jsonb_typeof(s.content->'host') = 'object'
            then jsonb_build_object('host', pg_temp.with_dial_code(s.content->'host'))
          else '{}'::jsonb
        end
     || case
          when jsonb_typeof(s.content->'additionalHosts') = 'array'
            then jsonb_build_object('additionalHosts', (
              select coalesce(jsonb_agg(pg_temp.with_dial_code(h) order by ord), '[]'::jsonb)
              from jsonb_array_elements(s.content->'additionalHosts') with ordinality as e(h, ord)
            ))
          else '{}'::jsonb
        end
   )
 where s.type = 'emergency_contacts'
   and (
     -- only rows with a host still missing the current dial-code shape
     (jsonb_typeof(s.content->'host') = 'object'
       and coalesce(s.content->'host'->>'dialCode', '') not like '__|+%')
     or exists (
       select 1
       from jsonb_array_elements(
         case when jsonb_typeof(s.content->'additionalHosts') = 'array'
              then s.content->'additionalHosts' else '[]'::jsonb end
       ) as e(h)
       where coalesce(h->>'dialCode', '') not like '__|+%'
     )
   );
