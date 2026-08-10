import { css, hexToOklch, normalizeHex, readableOn, shade } from "./color";
import { DEFAULT_THEME, themeBySlug, tintOf, type ThemePreset } from "./themes";
import { fontBySlug, type FontFace } from "./fonts";

/** The stored values that define an account's look. */
export interface Branding {
  brand_color: string;
  theme_preset: string;
  font_heading: string;
  font_body: string;
}

export const DEFAULT_BRANDING: Branding = {
  brand_color: "#2a6e7e",
  theme_preset: DEFAULT_THEME.slug,
  font_heading: "outfit",
  font_body: "outfit",
};

export interface ResolvedBranding {
  theme: ThemePreset;
  heading: FontFace;
  body: FontFace;
  /** Inline CSS custom properties to apply to the themed subtree. */
  vars: Record<string, string>;
  /** Classes declaring both font variables. */
  fontClass: string;
}

/**
 * Turns stored branding into concrete CSS custom properties.
 *
 * Why concrete values rather than one `--h` knob: Tailwind's `@theme` block
 * resolves `var(...)` against `:root`, so redefining an input variable on a
 * subtree does not recompute the tokens built from it. Writing the final
 * `--color-*` / `--radius-*` values inline overrides those `:root` tokens for
 * the subtree, which is what makes every `bg-brand` / `text-accent` utility
 * follow the host's brand.
 *
 * Two families of accent token exist on purpose:
 *   `--color-brand*`  the host's colour as given — large fills only (header,
 *                     primary buttons, toggles), paired with `brand-contrast`.
 *   `--color-accent*` the same colour pulled to a legible lightness for text,
 *                     icons and borders on `surface`, plus its tint ramp.
 * A pale brand colour would be unreadable as body-sized text; splitting the two
 * keeps the header exactly on-brand without sacrificing contrast anywhere else.
 */
export function resolveBranding(branding: Partial<Branding> | null | undefined): ResolvedBranding {
  const theme = themeBySlug(branding?.theme_preset);
  const heading = fontBySlug(branding?.font_heading);
  const body = fontBySlug(branding?.font_body);
  const hex = normalizeHex(branding?.brand_color ?? "") ?? DEFAULT_BRANDING.brand_color;
  const brand = hexToOklch(hex);
  const n = theme.neutrals;
  const t = theme.tints;

  const contrast = readableOn(hex, "#ffffff", n.dark);
  const onLight = contrast === "#ffffff";

  // Muted text sitting on the brand fill — nudged towards whichever contrast
  // colour won, so a header subtitle stays readable on any brand.
  const brandSoft = onLight
    ? shade(brand, Math.min(brand.l + 0.36, 0.94), brand.c * 0.35)
    : shade(brand, Math.max(brand.l - 0.34, 0.2), brand.c * 0.55);

  // Text-safe version of the brand: dark enough on light themes, light enough
  // on dark ones.
  const accent = theme.dark
    ? shade(brand, Math.max(brand.l, t.textLightness), brand.c)
    : shade(brand, Math.min(brand.l, t.textLightness), brand.c);
  const accentHover = shade(accent, theme.dark ? accent.l + 0.07 : accent.l - 0.08, accent.c);

  const vars: Record<string, string> = {
    // Legacy hue knob — kept so any raw `oklch(... var(--h))` still tracks the brand.
    "--h": brand.h.toFixed(1),

    "--color-brand": hex,
    "--color-brand-hover": css(shade(brand, theme.dark ? brand.l + 0.05 : brand.l - 0.06, brand.c)),
    "--color-brand-contrast": contrast,
    "--color-brand-soft": css(brandSoft),
    // Guaranteed-dark brand tone. Used where white text is baked into the
    // design (the welcome gate over a photo), so a pale brand cannot wash it out.
    "--color-brand-deep": css(shade(brand, Math.min(brand.l, 0.4), brand.c * 0.9)),

    "--color-accent": css(accent),
    "--color-accent-hover": css(accentHover),
    "--color-accent-contrast": contrast,
    "--color-accent-subtle": css(tintOf(brand, t.subtle)),
    "--color-accent-tint": css(tintOf(brand, t.tint)),
    "--color-accent-ring": css(tintOf(brand, t.ring)),
    "--color-accent-soft": css(tintOf(brand, t.soft)),
    "--color-accent-gold": css(tintOf(brand, t.gold)),

    "--color-scrim": "#0b1116",

    "--color-page": n.page,
    "--color-surface": n.surface,
    "--color-border": n.border,
    "--color-ink": n.ink,
    "--color-ink-alt": n.inkAlt,
    "--color-body": n.body,
    "--color-body-strong": n.bodyStrong,
    "--color-muted": n.muted,
    "--color-label": n.label,
    "--color-dark": n.dark,
    "--color-nav-idle": n.navIdle,
    "--color-code-surface": n.codeSurface,
    "--color-code-ring": n.codeRing,

    "--rs": String(theme.radius.scale),
    "--rp": theme.radius.pill,
    "--radius-tile": `${10 * theme.radius.scale}px`,
    "--radius-code": `${12 * theme.radius.scale}px`,
    "--radius-sm": `${12 * theme.radius.scale}px`,
    "--radius-card": `${16 * theme.radius.scale}px`,
    "--radius-lg": `${18 * theme.radius.scale}px`,
    "--radius-header": `${28 * theme.radius.scale}px`,
    "--radius-pill": theme.radius.pill,

    "--font-sans": `var(${body.variable}), system-ui, sans-serif`,
    "--font-display": `var(${heading.variable}), system-ui, sans-serif`,
  };

  // Both classes go on the same element; when heading and body are the same
  // family the duplicate class is harmless.
  const fontClass = [heading.className, body.className].join(" ");
  return { theme, heading, body, vars, fontClass };
}
