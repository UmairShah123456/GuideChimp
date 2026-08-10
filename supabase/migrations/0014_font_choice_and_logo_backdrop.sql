-- ---------------------------------------------------------------------------
-- Independent heading/body fonts + logo backdrop
--
-- 0013 stored a single `font_pairing` slug, which meant hosts could only use
-- combinations we had blessed. Heading and body are now stored separately;
-- the pairings survive in the UI as one-click presets that set both.
--
-- Also adds `logo_backdrop`: most hosts upload a logo with a baked-in white
-- background, which would otherwise sit as a hard white rectangle on a coloured
-- header. 'soft' feathers the artwork's edges so that white dissolves into the
-- header, 'card' places it on a deliberate white card, and 'none' is for logos
-- that already have transparency.
-- ---------------------------------------------------------------------------

alter table public.accounts
  add column font_heading  text not null default 'outfit',
  add column font_body     text not null default 'outfit',
  add column logo_backdrop text not null default 'soft';

-- Carry every account's existing pairing across rather than resetting them.
update public.accounts
   set font_heading = case font_pairing
                        when 'editorial' then 'fraunces'
                        when 'classic'   then 'playfair'
                        when 'grotesk'   then 'space-grotesk'
                        when 'warm'      then 'lora'
                        when 'rounded'   then 'nunito'
                        else 'outfit'
                      end,
       font_body    = case font_pairing
                        when 'rounded' then 'nunito'
                        when 'outfit'  then 'outfit'
                        else 'inter'
                      end
 where font_pairing is not null;

-- Accounts predating 0013 have no pairing at all; the column defaults already
-- cover them, so nothing else to do.
alter table public.accounts drop column font_pairing;

comment on column public.accounts.font_heading is
  'Heading typeface slug (see src/lib/branding/fonts.ts). Unknown values fall back to the default font.';
comment on column public.accounts.font_body is
  'Body typeface slug (see src/lib/branding/fonts.ts). Unknown values fall back to the default font.';
comment on column public.accounts.logo_backdrop is
  'How the logo is placed on coloured headers: soft (feathered edges), card (white card) or none (transparent artwork).';
