# GuideChimp

Branded digital guidebooks for short-let & serviced accommodation hosts. Hosts
build a guide per property; guests view it on mobile via a magic link.

**Stack:** Next.js (App Router, TypeScript) · Tailwind CSS v4 · Supabase
(Postgres, Auth, Storage) · deployed on Vercel.

## Design system

Tokens are extracted verbatim from the *Guest Portal Explorations* design file
(warm-editorial direction) and live in [`src/app/globals.css`](src/app/globals.css).

`globals.css` holds the *house* look — marketing site and dashboard chrome.
Guest guides are rebranded per account by [`src/lib/branding`](src/lib/branding),
which turns the account's stored branding into concrete CSS custom properties:

| Stored on `accounts` | Drives |
| --- | --- |
| `brand_color` (any hex) | `--color-brand*` (exact colour, large fills) and `--color-accent*` (the same colour pulled to a legible lightness, plus its OKLCH tint ramp) |
| `theme_preset` | surfaces, text neutrals and corner radii — see `themes.ts` |
| `font_heading`, `font_body` | `--font-display` / `--font-sans`, chosen independently from a 14-family list loaded via `next/font` — see `fonts.ts`. The pairings in that file are UI presets that set both at once |
| `logo_backdrop` | how the logo meets a coloured header: `soft` feathers the artwork's own edges, `card` places it on a white card, `none` assumes transparency — see `BrandLogo` |

`ThemeScope` writes those values inline on the guest subtree. It has to write
*concrete* values: Tailwind's `@theme` resolves its `var()` inputs at `:root`,
so overriding an input variable further down the tree would not recompute the
tokens built from it.

Contrast is decided per account, not hardcoded: `--color-brand-contrast` picks
white or near-black over the brand fill, so a pale yellow header reads as well
as a navy one. `--color-scrim` stays dark on every theme, for white text over
photos.

Defaults: **Teal `#2a6e7e` · Warm editorial · Outfit**.

## Local setup

Requires Docker (for local Supabase) and Node 20+.

```bash
npm install
supabase start          # boots local Postgres/Auth/Storage (see ports below)
supabase db reset       # applies migrations + seed.sql
cp .env.local.example .env.local   # then paste values from `supabase status`
npm run dev             # http://localhost:3000
```

> This project uses a **non-standard local port range (5442x)** to avoid
> colliding with other Supabase projects. `supabase status` prints the matching
> URL/keys.

### Try it

- Landing: <http://localhost:3000>
- Live guest guide: <http://localhost:3000/g/demo-aspects-court>
- Expired-link state: <http://localhost:3000/g/expired-demo>
- Invalid-link state: <http://localhost:3000/g/anything-else>

## Architecture notes

- **Guest routes bypass auth.** `getGuestGuide(token)` runs with the Supabase
  *service role* (server-only) and resolves purely off the token —
  [`src/lib/guide/queries.ts`](src/lib/guide/queries.ts). The resolver is
  request-memoised via `react/cache` in
  [`src/lib/guide/resolve.ts`](src/lib/guide/resolve.ts).
- **The authenticated dashboard is bound by RLS.** Every table has member-scoped
  policies ([`supabase/migrations/0002_rls_policies.sql`](supabase/migrations/0002_rls_policies.sql));
  the session client is in [`src/lib/supabase/server.ts`](src/lib/supabase/server.ts).
- **Section content is typed JSONB.** The per-`type` shapes are the contract
  shared by guest render and (future) host editor —
  [`src/lib/guide/types.ts`](src/lib/guide/types.ts).

## Host dashboard

Behind Supabase Auth (email/password), gated by `src/middleware.ts`:

- **Onboarding** bootstraps the account (`create_account_with_owner` RPC) + first property.
- **Properties** list/grid with empty state; create & delete.
- **Property overview** — details editor (with hero upload), magic link with a
  client-generated **QR** (downloadable), view count, and per-section status.
- **Seven guide editors** ([`src/components/dashboard/editors`](src/components/dashboard/editors))
  each with a **live phone preview** that renders the exact guest components
  ([`src/components/guest/sections`](src/components/guest/sections)) as you type.
  Edits save to Supabase and appear immediately on the guest link.
- **Media uploads** to Supabase Storage (hero photos, amenity videos, host avatar, logo).
- **Link settings** — regenerate token, expiry date, PIN.
- **Branding** (own sidebar item, since it applies to every guide at once) — logo
  with backdrop handling, brand colour, theme preset and typefaces, with a live
  preview alongside the fields.
- **Account** — account name and plan.
- **Team / Billing** — stubs.

> **Cloud auth note:** email confirmation is on by default. Either click the
> confirmation email after signup, or disable *Confirm email* in Supabase →
> Authentication for faster local development.

## Status

**Done:** the complete guest portal and the full host dashboard (create account →
property → build all guide sections → share magic link). Build + typecheck green;
RLS host-write chain verified end-to-end against the cloud project.

**Follow-ups:** enforce the link PIN on the guest side (stored but not yet gated),
real team invites, live map tiles, real billing.
