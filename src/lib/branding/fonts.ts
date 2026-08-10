import {
  Outfit,
  Inter,
  Manrope,
  DM_Sans,
  Work_Sans,
  Figtree,
  Nunito,
  Space_Grotesk,
  Poppins,
  Fraunces,
  Playfair_Display,
  Lora,
  Source_Serif_4,
  Crimson_Pro,
} from "next/font/google";

/**
 * Typefaces for the guest portal.
 *
 * Heading and body are stored independently, so a host is never boxed in by our
 * taste — the pairings below are just presets that set both at once.
 *
 * Everything is a Google font loaded through `next/font`: self-hosted, hashed,
 * subsetted to latin and preloaded, so there is no render-blocking stylesheet
 * from a third party and no layout shift. Next only ships the files a rendered
 * page actually references, so a guide using two families does not pay for the
 * other twelve.
 */

const outfit = Outfit({ subsets: ["latin"], display: "swap", variable: "--font-outfit" });
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], display: "swap", variable: "--font-manrope" });
const dmSans = DM_Sans({ subsets: ["latin"], display: "swap", variable: "--font-dm-sans" });
const workSans = Work_Sans({ subsets: ["latin"], display: "swap", variable: "--font-work-sans" });
const figtree = Figtree({ subsets: ["latin"], display: "swap", variable: "--font-figtree" });
const nunito = Nunito({ subsets: ["latin"], display: "swap", variable: "--font-nunito" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], display: "swap", variable: "--font-space" });
// Poppins ships as static weights rather than a variable font, so the range we
// use has to be declared up front.
const poppins = Poppins({ subsets: ["latin"], display: "swap", variable: "--font-poppins", weight: ["400", "500", "600", "700"] });
const fraunces = Fraunces({ subsets: ["latin"], display: "swap", variable: "--font-fraunces" });
const playfair = Playfair_Display({ subsets: ["latin"], display: "swap", variable: "--font-playfair" });
const lora = Lora({ subsets: ["latin"], display: "swap", variable: "--font-lora" });
const sourceSerif = Source_Serif_4({ subsets: ["latin"], display: "swap", variable: "--font-source-serif" });
const crimson = Crimson_Pro({ subsets: ["latin"], display: "swap", variable: "--font-crimson" });

/**
 * The app's own typeface — marketing site, dashboard chrome, and the fallback
 * for anything outside a theme scope. Exported so the root layout reuses this
 * exact instance rather than loading a second copy of Outfit.
 */
export const appFont = outfit;

export interface FontFace {
  slug: string;
  name: string;
  category: "sans" | "serif";
  /** Class that declares this font's CSS variable on an element. */
  className: string;
  /** The CSS variable name that class defines. */
  variable: string;
  /** Concrete font stack, for previewing outside a theme scope. */
  stack: string;
}

const face = (
  slug: string,
  name: string,
  category: FontFace["category"],
  font: { variable: string; style: { fontFamily: string } },
  variable: string,
): FontFace => ({
  slug,
  name,
  category,
  className: font.variable,
  variable,
  stack: font.style.fontFamily,
});

export const FONTS: FontFace[] = [
  face("outfit", "Outfit", "sans", outfit, "--font-outfit"),
  face("inter", "Inter", "sans", inter, "--font-inter"),
  face("manrope", "Manrope", "sans", manrope, "--font-manrope"),
  face("dm-sans", "DM Sans", "sans", dmSans, "--font-dm-sans"),
  face("work-sans", "Work Sans", "sans", workSans, "--font-work-sans"),
  face("figtree", "Figtree", "sans", figtree, "--font-figtree"),
  face("nunito", "Nunito", "sans", nunito, "--font-nunito"),
  face("space-grotesk", "Space Grotesk", "sans", spaceGrotesk, "--font-space"),
  face("poppins", "Poppins", "sans", poppins, "--font-poppins"),
  face("fraunces", "Fraunces", "serif", fraunces, "--font-fraunces"),
  face("playfair", "Playfair Display", "serif", playfair, "--font-playfair"),
  face("lora", "Lora", "serif", lora, "--font-lora"),
  face("source-serif", "Source Serif", "serif", sourceSerif, "--font-source-serif"),
  face("crimson", "Crimson Pro", "serif", crimson, "--font-crimson"),
];

export const DEFAULT_FONT = FONTS[0];

export function fontBySlug(slug: string | null | undefined): FontFace {
  return FONTS.find((f) => f.slug === slug) ?? DEFAULT_FONT;
}

export interface FontPairing {
  slug: string;
  name: string;
  description: string;
  heading: string;
  body: string;
}

/** One-click presets. Each just sets `font_heading` + `font_body`. */
export const FONT_PAIRINGS: FontPairing[] = [
  {
    slug: "outfit",
    name: "Outfit",
    description: "Geometric sans throughout. Friendly, modern, very legible on phones.",
    heading: "outfit",
    body: "outfit",
  },
  {
    slug: "editorial",
    name: "Fraunces + Inter",
    description: "Characterful serif headings over a neutral workhorse body.",
    heading: "fraunces",
    body: "inter",
  },
  {
    slug: "classic",
    name: "Playfair + Inter",
    description: "High-contrast display serif. Reads formal and expensive.",
    heading: "playfair",
    body: "inter",
  },
  {
    slug: "grotesk",
    name: "Space Grotesk + Inter",
    description: "Technical grotesque headings. Crisp and a little unexpected.",
    heading: "space-grotesk",
    body: "inter",
  },
  {
    slug: "warm",
    name: "Lora + Inter",
    description: "Softer serif headings. Calm and hospitable without being fussy.",
    heading: "lora",
    body: "inter",
  },
  {
    slug: "rounded",
    name: "Nunito",
    description: "Rounded terminals throughout. Warm, informal, great for family stays.",
    heading: "nunito",
    body: "nunito",
  },
];

/** The preset matching a heading/body combination, if one does. */
export function matchingPairing(heading: string, body: string): FontPairing | undefined {
  return FONT_PAIRINGS.find((p) => p.heading === heading && p.body === body);
}
