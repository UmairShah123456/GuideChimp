import { SECTION_META } from "./defaults";
import type { GuideSectionType } from "./types";

/**
 * How a guide is presented to whoever opens its link.
 *  - `guest`: the full welcome experience — hero, greeting, check-in/checkout
 *    chips, sections grouped by stage of stay.
 *  - `staff`: a plain, utilitarian index. Same components and colours, none of
 *    the hospitality framing, which reads as wrong to someone at work.
 */
export type GuideFlavour = "guest" | "staff";

export interface GuidePreset {
  kind: string;
  label: string;
  /** What the "new guide" picker shows under the label. */
  blurb: string;
  /** Built-in sections seeded on creation. Staff guides start empty and are
   *  built from custom sections, which is what training content actually is. */
  builtins: GuideSectionType[];
  flavour: GuideFlavour;
  emoji: string;
}

const ALL_BUILTINS = SECTION_META.map((s) => s.type);

/**
 * Guide types live here rather than in a Postgres enum, so adding one is a
 * one-line change instead of a migration. `guides.kind` stores the slug.
 */
export const GUIDE_PRESETS: GuidePreset[] = [
  {
    kind: "guest",
    label: "Guest guide",
    blurb: "Everything a guest needs — check-in, parking, Wi-Fi, house rules, checkout.",
    builtins: ALL_BUILTINS,
    flavour: "guest",
    emoji: "🛎️",
  },
  {
    kind: "cleaner",
    label: "Cleaner guide",
    blurb: "Turnaround steps, linen, bins. Built from your own sections and videos.",
    builtins: [],
    flavour: "staff",
    emoji: "🧹",
  },
  {
    kind: "staff",
    label: "Staff guide",
    blurb: "For a VA or anyone on the team. Training videos and step-by-step sections.",
    builtins: [],
    flavour: "staff",
    emoji: "👥",
  },
  {
    kind: "custom",
    label: "Blank guide",
    blurb: "Start from nothing and name it whatever you like.",
    builtins: [],
    flavour: "staff",
    emoji: "📄",
  },
];

const BLANK = GUIDE_PRESETS[GUIDE_PRESETS.length - 1];

/**
 * Look up a preset by slug. Falls back to the blank preset so a hand-authored
 * or retired `kind` still renders instead of throwing.
 */
export function guidePreset(kind: string): GuidePreset {
  return GUIDE_PRESETS.find((p) => p.kind === kind) ?? BLANK;
}

/** Which home screen a guide's magic link should render. */
export function guideFlavour(kind: string): GuideFlavour {
  return guidePreset(kind).flavour;
}

/** True for the full guest experience; false for the plain staff index. */
export function isGuestFlavour(kind: string): boolean {
  return guideFlavour(kind) === "guest";
}
