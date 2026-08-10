-- ---------------------------------------------------------------------------
-- Full brand controls on the account
--
-- Replaces the single `accent_hue` integer (which could only ever express one
-- OKLCH hue at a fixed lightness/chroma) with the host's actual brand colour,
-- a curated theme preset and a font pairing. Everything else in the guest
-- portal is derived from those three values at render time — see
-- src/lib/branding.
-- ---------------------------------------------------------------------------

alter table public.accounts
  add column brand_color  text not null default '#2A6E7E',
  add column theme_preset text not null default 'editorial',
  add column font_pairing text not null default 'outfit';

-- Hex is the one thing worth enforcing in the database: the CSS we generate
-- interpolates it directly. Preset/pairing slugs stay free-form (like
-- guides.kind) so adding a new theme is a code change, not a migration.
alter table public.accounts
  add constraint accounts_brand_color_hex check (brand_color ~* '^#[0-9a-f]{6}$');

-- Backfill: every existing account's hue was rendered as oklch(0.5 0.12 h), so
-- convert that exact colour to hex rather than dropping their branding on the
-- floor. Temporary — dropped at the end of this migration.
create function public.oklch_to_hex(l double precision, c double precision, h double precision)
returns text
language plpgsql
immutable
as $$
declare
  hr double precision := radians(h);
  a  double precision := c * cos(hr);
  b  double precision := c * sin(hr);
  l_ double precision;
  m_ double precision;
  s_ double precision;
  lc double precision;
  mc double precision;
  sc double precision;
  rgb double precision[];
  out text := '#';
  v  double precision;
  i  integer;
begin
  l_ := l + 0.3963377774 * a + 0.2158037573 * b;
  m_ := l - 0.1055613458 * a - 0.0638541728 * b;
  s_ := l - 0.0894841775 * a - 1.2914855480 * b;
  lc := l_ * l_ * l_;
  mc := m_ * m_ * m_;
  sc := s_ * s_ * s_;

  rgb := array[
     4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc,
    -1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc,
    -0.0041960863 * lc - 0.7034186147 * mc + 1.7076147010 * sc
  ];

  for i in 1..3 loop
    v := rgb[i];
    -- linear -> sRGB transfer
    if v <= 0.0031308 then
      v := 12.92 * v;
    else
      v := 1.055 * power(greatest(v, 0), 1.0 / 2.4) - 0.055;
    end if;
    v := least(greatest(v, 0), 1);
    out := out || lpad(to_hex(round(v * 255)::integer), 2, '0');
  end loop;

  return out;
end;
$$;

update public.accounts
   set brand_color = public.oklch_to_hex(0.5, 0.12, accent_hue);

drop function public.oklch_to_hex(double precision, double precision, double precision);

alter table public.accounts drop column accent_hue;

comment on column public.accounts.brand_color is
  'Host brand colour as #rrggbb. Drives every accent token in the guest portal.';
comment on column public.accounts.theme_preset is
  'Curated look slug (see src/lib/branding/themes.ts). Unknown values fall back to the default theme.';
comment on column public.accounts.font_pairing is
  'Font pairing slug (see src/lib/branding/fonts.ts). Unknown values fall back to the default pairing.';
