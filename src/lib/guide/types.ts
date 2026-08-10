/**
 * Structured content shapes for each guide section `type`. These describe the
 * JSONB stored in guide_sections.content and are the contract shared by the
 * guest portal (render) and the host editor (write).
 */

export type GuideSectionType =
  | "parking"
  | "check_in"
  | "check_out"
  | "amenities"
  | "local_guide"
  | "wifi"
  | "house_rules"
  | "emergency_contacts";

export interface CopyableCode {
  label: string;
  value: string;
}

export interface CheckInStep {
  title: string;
  body: string;
  code?: CopyableCode;
  photoUrl?: string; // optional uploaded photo for this step
  photoCaption?: string;
}

/** Overrides for how a section appears as a tile on the guest home screen. */
export interface HomeTileFields {
  navTitle?: string;
  navSubtitle?: string;
}

/** A host-renamed section name. Drives both the dashboard list and guest tile. */
export interface SectionTitleOverride {
  title?: string;
  subtitle?: string;
  /**
   * Explicit show/hide toggle for the section's home tile. When unset, the tile
   * falls back to being shown only if the section has content.
   */
  enabled?: boolean;
}

/** Per-guide overrides for built-in section names, keyed by section type. */
export type SectionTitles = Partial<Record<GuideSectionType, SectionTitleOverride>>;

export interface CheckInContent extends HomeTileFields {
  address?: string; // shown on a map with a directions button
  checkInTime?: string;
  checkoutTime?: string;
  videoUrl?: string; // optional YouTube/Loom/Drive link or uploaded file for a "how to get in" clip
  steps?: CheckInStep[];
  note?: string;
}

export interface ParkingStep {
  title: string;
  body?: string;
  photoUrl?: string; // optional uploaded photo for this step
  photoCaption?: string;
}

export interface ParkingContent {
  lotName?: string;
  lotDetail?: string;
  cost?: "free" | "paid"; // shown as a chip at the top of the guest screen
  location?: "on_site" | "off_site";
  directionsUrl?: string;
  photoUrl?: string; // optional main photo of the parking area
  photoCaption?: string;
  steps?: ParkingStep[];
  videoUrl?: string; // optional YouTube/Loom/Drive link or uploaded file walking through parking
}

export interface WifiContent {
  network?: string;
  password?: string;
}

export interface AmenitiesContent extends HomeTileFields {
  askNote?: string;
  askLabel?: string;
}

export type LocalGuideContent = HomeTileFields;

export interface HouseRule {
  title: string;
  reason?: string;
  /**
   * Slug from `RULE_ICONS` in src/components/guest/rule-icons.tsx. Optional:
   * rules written before icons existed, and any the host doesn't choose one
   * for, fall back to a guess from the wording.
   */
  icon?: string;
}

export interface HouseRulesContent extends HomeTileFields {
  rules?: HouseRule[];
}

export interface CheckOutContent extends HomeTileFields {
  items?: string[];
  videoUrl?: string; // optional YouTube/Loom/Drive link or uploaded checkout walkthrough
  note?: string;
}

export interface HostContact {
  name?: string;
  avatarUrl?: string;
  dialCode?: string; // e.g. "+44" — combined with each local number for links
  whatsapp?: string;
  phone?: string;
  sms?: string;
}

export interface EmergencyService {
  code: string;
  name: string;
  detail?: string;
  phone: string;
  tone?: "danger" | "normal";
}

export interface EmergencyContent {
  host?: HostContact;
  additionalHosts?: HostContact[];
  services?: EmergencyService[];
  goodToKnow?: { label: string; value: string }[];
}

export type SectionContentMap = {
  parking: ParkingContent;
  check_in: CheckInContent;
  check_out: CheckOutContent;
  amenities: AmenitiesContent;
  local_guide: LocalGuideContent;
  wifi: WifiContent;
  house_rules: HouseRulesContent;
  emergency_contacts: EmergencyContent;
};

// ---------------------------------------------------------------------------
// Database row shapes (subset of columns we read)
// ---------------------------------------------------------------------------

export interface AccountRow {
  id: string;
  name: string;
  logo_url: string | null;
  /** Brand colour as `#rrggbb` — every accent in the guest portal derives from it. */
  brand_color: string;
  /** Curated look slug; unknown values fall back to the default theme. */
  theme_preset: string;
  /** Heading typeface slug; unknown values fall back to the default font. */
  font_heading: string;
  /** Body typeface slug; unknown values fall back to the default font. */
  font_body: string;
  /** How the logo sits on coloured headers: 'soft' plate or 'none'. */
  logo_backdrop: string;
}

/**
 * A house rule saved to the account's library so it can be dropped into any
 * guide instead of retyped. Adding one to a guide copies it into that section's
 * content — the template and the guide's copy are independent from then on.
 */
export interface HouseRuleTemplateRow {
  id: string;
  title: string;
  reason: string | null;
  icon: string | null;
}

export interface PropertyRow {
  id: string;
  account_id: string;
  name: string;
  address: string | null;
  hero_image_url: string | null;
  /**
   * Legacy per-property overrides. Superseded by `GuideRow.section_titles` in
   * migration 0011 and left in place so the pre-guides data is never lost;
   * nothing reads it any more.
   */
  section_titles?: SectionTitles;
}

/**
 * One audience's guide — guests, cleaners, a VA, anything the host names. Owns
 * its own sections, custom sections and magic link, so two guides never share
 * content.
 *
 * A guide always belongs to an account. `property_id` is set when it documents
 * a specific place, and null when it documents a company-wide process that
 * applies across every property.
 *
 * `kind` is a free-form preset slug rather than an enum: see
 * `src/lib/guide/presets.ts`. Unknown values fall back to the blank preset.
 */
export interface GuideRow {
  id: string;
  account_id: string;
  /** Null for an account-level guide — a company process that isn't about any
   *  one property (running a background check, how a VA handles the inbox). */
  property_id: string | null;
  name: string;
  kind: string;
  section_titles: SectionTitles;
  position: number;
}

/**
 * One content block inside a custom section. Blocks are stored as an ordered
 * array and rendered to the guest in that order. Each carries a stable `id` so
 * the editor can reorder/remove without React key churn.
 */
export type CustomBlock =
  | { id: string; type: "text"; body: string }
  | { id: string; type: "video"; url: string }
  | { id: string; type: "photo"; url: string; caption?: string }
  | { id: string; type: "map"; address: string }
  | { id: string; type: "steps"; steps: CustomStep[] };

export interface CustomStep {
  title: string;
  body?: string;
  photoUrl?: string;
  photoCaption?: string;
}

export type CustomBlockType = CustomBlock["type"];

/**
 * A free-form, host-authored section shown only on the guest home screen. The
 * `title` is the section name (tile + page heading); `blocks` is the ordered
 * content. `subtitle`/`body` are legacy columns kept for backwards compat —
 * `body` is surfaced as an implicit text block when `blocks` is empty.
 */
export interface CustomSectionRow {
  id: string;
  property_id: string | null;
  guide_id: string;
  title: string;
  subtitle: string | null;
  body: string | null;
  blocks: CustomBlock[];
  position: number;
  enabled: boolean;
}

/**
 * Normalise a row's blocks for rendering: prefer the block array, falling back
 * to a single text block built from the legacy `body` for pre-migration rows.
 */
export function customBlocks(
  section: Pick<CustomSectionRow, "blocks" | "body">,
): CustomBlock[] {
  if (section.blocks && section.blocks.length > 0) return section.blocks;
  const body = section.body?.trim();
  return body ? [{ id: "legacy-body", type: "text", body }] : [];
}

export interface GuideSectionRow {
  id: string;
  property_id: string | null;
  guide_id: string;
  type: GuideSectionType;
  content: Record<string, unknown>;
  position: number;
}

export interface MediaItemRow {
  id: string;
  property_id: string | null;
  guide_id: string;
  guide_section_id: string | null;
  type: "image" | "video";
  url: string;
  poster_url: string | null;
  caption: string | null;
  position: number;
  metadata: Record<string, unknown>;
}

export interface LocalGuideEntryRow {
  id: string;
  guide_section_id: string;
  category: string;
  name: string;
  description: string | null;
  price: string | null;
  hours: string | null;
  lat: number | null;
  lng: number | null;
  url: string | null;
  position: number;
}

export interface MagicLinkRow {
  id: string;
  property_id: string | null;
  guide_id: string;
  token: string;
  pin: string | null;
  expires_at: string | null;
  view_count: number;
}

/** Fully-resolved guide the guest portal renders from. */
export interface GuestGuide {
  account: AccountRow;
  /** Null when the guide is account-level rather than about a property. */
  property: PropertyRow | null;
  guide: GuideRow;
  link: MagicLinkRow;
  sections: GuideSectionRow[];
  media: MediaItemRow[];
  localEntries: LocalGuideEntryRow[];
  customSections: CustomSectionRow[];
}

/** Typed lookup of a section's content by type. */
export function sectionContent<T extends GuideSectionType>(
  guide: GuestGuide,
  type: T,
): SectionContentMap[T] | null {
  const section = guide.sections.find((s) => s.type === type);
  return section ? (section.content as SectionContentMap[T]) : null;
}

export function findSection(
  guide: GuestGuide,
  type: GuideSectionType,
): GuideSectionRow | null {
  return guide.sections.find((s) => s.type === type) ?? null;
}
