import type { CSSProperties } from "react";

/**
 * The host's own logo, shown at the top of the guest guide.
 *
 * Most hosts upload artwork with a baked-in white background — a JPEG, or a PNG
 * exported without transparency. Dropped straight onto a coloured header that
 * reads as a hard white rectangle, so `backdrop` decides how it is placed.
 */

/**
 * `soft` feathers the artwork's own edges.
 *
 * The fade has to be applied to the image, not to a plate behind it: the
 * uploaded image *is* an opaque white rectangle, so anything painted behind it
 * — a plate, a glow, a radial wash — leaves that hard edge sitting on top and
 * the box is still plainly visible. Masking the image dissolves its white
 * margin into the header instead.
 *
 * The bands are deliberately shallow, and that is a real trade-off rather than
 * a guess: a fade deep enough to dissolve *all* the white starts washing out
 * the mark. This dissolves the margin a logo normally carries around itself and
 * leaves the artwork at full opacity. Hosts whose logo runs edge to edge can
 * pick `card` instead.
 *
 * The two axes are nested single-layer masks rather than one element with two
 * mask layers: compositing layers needs `mask-composite`, whose support and
 * legacy `-webkit-` value names are inconsistent enough that one axis silently
 * drops out, leaving hard left and right edges.
 */
const FADE_X: CSSProperties = {
  WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 9%, #000 91%, transparent 100%)",
  maskImage: "linear-gradient(to right, transparent 0%, #000 9%, #000 91%, transparent 100%)",
};

const FADE_Y: CSSProperties = {
  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 13%, #000 87%, transparent 100%)",
  maskImage: "linear-gradient(to bottom, transparent 0%, #000 13%, #000 87%, transparent 100%)",
};

export type LogoBackdrop = "soft" | "card" | "none";

/** Narrows a stored value; anything unrecognised falls back to the default. */
export function asBackdrop(value: string | null | undefined): LogoBackdrop {
  return value === "card" || value === "none" ? value : "soft";
}

export function BrandLogo({
  url,
  name,
  backdrop = "soft",
  className = "",
  height = "h-9",
}: {
  url: string | null | undefined;
  name: string;
  backdrop?: LogoBackdrop;
  className?: string;
  /** Tailwind height class for the artwork. */
  height?: string;
}) {
  if (!url) return null;

  const imgClass = `${height} w-auto max-w-[190px] object-contain`;
  /* eslint-disable @next/next/no-img-element -- host-supplied URL from Supabase Storage; no loader config for it */

  if (backdrop === "none") {
    return (
      <div className={`inline-flex ${className}`}>
        <img src={url} alt={name} className={imgClass} />
      </div>
    );
  }

  if (backdrop === "card") {
    return (
      <div
        className={`inline-flex rounded-[12px] bg-white px-3 py-2 shadow-[0_2px_10px_rgba(0,0,0,0.10)] ${className}`}
      >
        <img src={url} alt={name} className={imgClass} />
      </div>
    );
  }

  return (
    <div className={`inline-flex ${className}`} style={FADE_X}>
      <img src={url} alt={name} className={imgClass} style={FADE_Y} />
    </div>
  );
  /* eslint-enable @next/next/no-img-element */
}
