import type { GuestGuide, GuideSectionType, SectionContentMap, SectionTitles } from "./types";

/**
 * The home-screen tiles and their default labels. Each maps to a section; the
 * host can override navTitle/navSubtitle per section, falling back to these.
 */
export interface HomeTile {
  type: GuideSectionType;
  path: string;
  title: string;
  subtitle: string;
  group: "first" | "during" | "checkout";
}

export const HOME_TILES: HomeTile[] = [
  { type: "check_in", path: "/check-in", title: "Getting in", subtitle: "Door codes and keys", group: "first" },
  { type: "parking", path: "/parking", title: "Parking", subtitle: "Where and how to park", group: "first" },
  { type: "amenities", path: "/wifi-amenities", title: "How stuff works", subtitle: "Short video guides, no manuals", group: "during" },
  { type: "local_guide", path: "/local-guide", title: "Our favourite spots", subtitle: "Where we actually eat, drink and get coffee", group: "during" },
  { type: "house_rules", path: "/house-rules", title: "House rules", subtitle: "Just the short version, promise", group: "during" },
  { type: "check_out", path: "/check-out", title: "Checkout", subtitle: "What to do before you leave", group: "checkout" },
];

export function homeTileDefault(type: GuideSectionType): HomeTile | undefined {
  return HOME_TILES.find((t) => t.type === type);
}

/**
 * The single canonical display name for a section, used everywhere it appears:
 * the host dashboard list, the guest home tile, and the section's own page
 * heading. A host rename wins; otherwise the home-tile default, else the
 * dashboard label.
 */
export function sectionDisplayName(
  type: GuideSectionType,
  overrides?: SectionTitles,
): string {
  const override = overrides?.[type]?.title?.trim();
  if (override) return override;
  return (
    homeTileDefault(type)?.title ??
    SECTION_META.find((s) => s.type === type)?.label ??
    ""
  );
}

/**
 * Whether a built-in section is turned on. Controlled by an explicit host toggle
 * stored on the guide (`section_titles[type].enabled`); defaults to on so a
 * host opts sections out rather than in.
 */
export function sectionEnabled(
  type: GuideSectionType,
  overrides: SectionTitles | undefined,
): boolean {
  return overrides?.[type]?.enabled ?? true;
}

/** Whether the guide actually has this section at all. Staff guides are seeded
 *  with none, so existence — not just the toggle — decides what renders. */
export function sectionPresent(guide: GuestGuide, type: GuideSectionType): boolean {
  return guide.sections.some((s) => s.type === type);
}

/** A section renders only if the guide has it and it is toggled on. */
export function sectionVisible(guide: GuestGuide, type: GuideSectionType): boolean {
  return sectionPresent(guide, type) && sectionEnabled(type, guide.guide.section_titles);
}

/** Human labels + ordering for the seven guide sections. */
export const SECTION_META: {
  type: GuideSectionType;
  label: string;
  blurb: string;
  position: number;
}[] = [
  { type: "check_in", label: "Check-in", blurb: "Arrival steps, codes & keys", position: 0 },
  { type: "parking", label: "Parking", blurb: "Where and how to park", position: 1 },
  { type: "wifi", label: "Wi-Fi", blurb: "Network name & password", position: 2 },
  { type: "amenities", label: "Amenities", blurb: "Video how-to guides", position: 3 },
  { type: "local_guide", label: "Local guide", blurb: "Your favourite nearby spots", position: 4 },
  { type: "house_rules", label: "House rules", blurb: "The short, friendly version", position: 5 },
  { type: "check_out", label: "Checkout", blurb: "Departure checklist", position: 6 },
  { type: "emergency_contacts", label: "Contact & emergency", blurb: "How guests reach you", position: 7 },
];

/** Sensible starter content so a brand-new guide still renders nicely. */
export const DEFAULT_CONTENT: {
  [K in GuideSectionType]: SectionContentMap[K];
} = {
  check_in: {
    steps: [],
  },
  parking: {},
  wifi: {},
  amenities: {
    askLabel: "Ask the host",
    askNote: "Something not covered here?",
  },
  local_guide: {},
  house_rules: {
    rules: [],
  },
  check_out: {
    items: [],
  },
  emergency_contacts: {
    host: {},
    services: [
      { code: "999", name: "Emergency services", detail: "Fire, police, ambulance", phone: "999", tone: "danger" },
    ],
    goodToKnow: [],
  },
};
