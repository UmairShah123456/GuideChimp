import type { Oklch } from "./color";

/**
 * Curated looks. A theme owns everything that is *not* the brand colour —
 * surfaces, text neutrals, corner radii — plus the recipe for turning the brand
 * colour into supporting tints. The host picks one look and one colour; the two
 * compose, so every combination stays coherent.
 *
 * Slugs are free-form in the database (like `guides.kind`): unknown values fall
 * back to DEFAULT_THEME rather than erroring, so removing a theme can never
 * break a live guide.
 */
export interface ThemePreset {
  slug: string;
  name: string;
  description: string;
  /** Dark themes flip the tint ramp: supporting tones get darker, not lighter. */
  dark: boolean;
  /** Corner radius scale (1 = the original soft look) and pill radius. */
  radius: { scale: number; pill: string };
  /** Neutral palette — surfaces and text. */
  neutrals: {
    page: string;
    surface: string;
    border: string;
    ink: string;
    inkAlt: string;
    body: string;
    bodyStrong: string;
    muted: string;
    label: string;
    dark: string;
    navIdle: string;
    codeSurface: string;
    codeRing: string;
  };
  /**
   * How far the supporting tones sit from the brand colour, as OKLCH
   * lightness/chroma pairs. `chroma` values are multipliers on the brand's own
   * chroma, so a muted brand gets muted tints and a vivid one gets vivid ones.
   */
  tints: {
    /** Lightness the brand is pushed to when used as text on `surface`. */
    textLightness: number;
    subtle: { l: number; c: number };
    tint: { l: number; c: number };
    ring: { l: number; c: number };
    soft: { l: number; c: number };
    gold: { l: number; c: number };
  };
}

const WARM_NEUTRALS: ThemePreset["neutrals"] = {
  page: "#fbfaf8",
  surface: "#ffffff",
  border: "#ecebe7",
  ink: "#1c2830",
  inkAlt: "#17242e",
  body: "#68737e",
  bodyStrong: "#3d4a54",
  muted: "#8894a0",
  label: "#9aa4ad",
  dark: "#1c2830",
  navIdle: "#d6dde2",
  codeSurface: "#f4f7f8",
  codeRing: "#d7dee2",
};

const LIGHT_TINTS: ThemePreset["tints"] = {
  textLightness: 0.5,
  subtle: { l: 0.95, c: 0.18 },
  tint: { l: 0.97, c: 0.1 },
  ring: { l: 0.88, c: 0.34 },
  soft: { l: 0.9, c: 0.34 },
  gold: { l: 0.78, c: 0.75 },
};

export const THEMES: ThemePreset[] = [
  {
    slug: "editorial",
    name: "Warm editorial",
    description: "Off-white paper, soft corners, generous type. The GuideChimp house look.",
    dark: false,
    radius: { scale: 1, pill: "999px" },
    neutrals: WARM_NEUTRALS,
    tints: LIGHT_TINTS,
  },
  {
    slug: "minimal",
    name: "Clean minimal",
    description: "Cool greys and tight corners. Reads like a well-made product, not a brochure.",
    dark: false,
    radius: { scale: 0.4, pill: "10px" },
    neutrals: {
      ...WARM_NEUTRALS,
      page: "#f6f7f9",
      border: "#e4e7ec",
      ink: "#111827",
      inkAlt: "#111827",
      body: "#5b6472",
      bodyStrong: "#374151",
      muted: "#7d8794",
      label: "#98a1ae",
      dark: "#111827",
      navIdle: "#cfd6de",
      codeSurface: "#f1f4f7",
      codeRing: "#dbe2e9",
    },
    tints: { ...LIGHT_TINTS, subtle: { l: 0.96, c: 0.14 }, tint: { l: 0.98, c: 0.08 } },
  },
  {
    slug: "bold",
    name: "Bold rounded",
    description: "Extra-round corners and richer tints. Playful, high-energy stays.",
    dark: false,
    radius: { scale: 1.6, pill: "999px" },
    neutrals: { ...WARM_NEUTRALS, page: "#fffdf9", border: "#efece5" },
    tints: {
      textLightness: 0.48,
      subtle: { l: 0.93, c: 0.32 },
      tint: { l: 0.96, c: 0.2 },
      ring: { l: 0.85, c: 0.5 },
      soft: { l: 0.88, c: 0.5 },
      gold: { l: 0.78, c: 0.85 },
    },
  },
  {
    slug: "midnight",
    name: "Midnight",
    description: "Dark surfaces with a luminous accent. Suits boutique and luxury stays.",
    dark: true,
    radius: { scale: 1, pill: "999px" },
    neutrals: {
      page: "#0f1419",
      surface: "#171e26",
      border: "#242e38",
      ink: "#f1f5f8",
      inkAlt: "#ffffff",
      body: "#9aa8b4",
      bodyStrong: "#c7d1da",
      muted: "#8593a0",
      label: "#7b8894",
      dark: "#060a0e",
      navIdle: "#3a4753",
      codeSurface: "#1c242d",
      codeRing: "#2d3944",
    },
    tints: {
      // On dark surfaces the brand has to come *up* in lightness to stay legible.
      textLightness: 0.78,
      subtle: { l: 0.28, c: 0.5 },
      tint: { l: 0.22, c: 0.35 },
      ring: { l: 0.42, c: 0.6 },
      soft: { l: 0.85, c: 0.4 },
      gold: { l: 0.8, c: 0.75 },
    },
  },
];

export const DEFAULT_THEME = THEMES[0];

export function themeBySlug(slug: string | null | undefined): ThemePreset {
  return THEMES.find((t) => t.slug === slug) ?? DEFAULT_THEME;
}

/** Absolute OKLCH for a tint step, given the brand colour's own chroma. */
export function tintOf(brand: Oklch, step: { l: number; c: number }): Oklch {
  return { l: step.l, c: brand.c * step.c, h: brand.h };
}
