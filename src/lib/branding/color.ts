/**
 * Colour maths for brand theming.
 *
 * Hosts give us one hex value; the portal needs a whole palette from it. We do
 * that in OKLCH because it is perceptually uniform: holding hue/chroma and
 * moving lightness gives tints and shades that still read as the same colour,
 * which naive HSL does not.
 *
 * Everything here is pure and runs on both server and client — the account
 * form previews the exact palette the guest portal will render.
 */

export interface Oklch {
  /** Perceptual lightness, 0–1. */
  l: number;
  /** Chroma (saturation), 0 – ~0.37 for sRGB. */
  c: number;
  /** Hue angle in degrees, 0–360. */
  h: number;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Normalises `#abc`, `abcdef`, `#ABCDEF` → `#abcdef`. Null when unparseable. */
export function normalizeHex(input: string): string | null {
  const raw = input.trim().replace(/^#/, "");
  const expanded =
    raw.length === 3
      ? raw
          .split("")
          .map((ch) => ch + ch)
          .join("")
      : raw;
  return /^[0-9a-f]{6}$/i.test(expanded) ? `#${expanded.toLowerCase()}` : null;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = normalizeHex(hex) ?? "#000000";
  return [
    parseInt(h.slice(1, 3), 16) / 255,
    parseInt(h.slice(3, 5), 16) / 255,
    parseInt(h.slice(5, 7), 16) / 255,
  ];
}

const toLinear = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const toSrgb = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * Math.max(v, 0) ** (1 / 2.4) - 0.055);

/** Hex → OKLCH. */
export function hexToOklch(hex: string): Oklch {
  const [sr, sg, sb] = hexToRgb(hex);
  const r = toLinear(sr);
  const g = toLinear(sg);
  const b = toLinear(sb);

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  const c = Math.hypot(A, B);
  // Hue is meaningless for greys; park it on the design default so a black or
  // white brand colour still produces a coherent (neutral) set of tints.
  const h = c < 0.0005 ? 200 : ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360;
  return { l: L, c, h };
}

/** OKLCH → hex, gamut-clamped into sRGB. */
export function oklchToHex({ l, c, h }: Oklch): string {
  const hr = (h * Math.PI) / 180;
  const a = c * Math.cos(hr);
  const b = c * Math.sin(hr);

  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;

  const rgb = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];

  return `#${rgb
    .map((v) =>
      Math.round(clamp(toSrgb(v), 0, 1) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

/** CSS colour string for an OKLCH triple, rounded so the markup stays readable. */
export function css({ l, c, h }: Oklch): string {
  return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(1)})`;
}

/** Same hue, new lightness/chroma. The workhorse for deriving tints and shades. */
export function shade(base: Oklch, l: number, c: number): Oklch {
  return { l: clamp(l, 0, 1), c: Math.max(c, 0), h: base.h };
}

/** WCAG relative luminance, used only to choose readable text over a fill. */
function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Whichever of the two candidates is more readable on `background`. Hosts pick
 * brand colours from the whole spectrum — a pale yellow header needs dark text,
 * a navy one needs white — so this is decided per account, not hardcoded.
 */
export function readableOn(background: string, light: string, dark: string): string {
  return contrast(background, light) >= contrast(background, dark) ? light : dark;
}
