import "server-only";
import { createClient } from "@/lib/supabase/server";
import type {
  CustomSectionRow,
  GuideRow,
  GuideSectionRow,
  HouseRuleTemplateRow,
  LocalGuideEntryRow,
  MagicLinkRow,
  MediaItemRow,
  PropertyRow,
} from "@/lib/guide/types";

export interface PropertyListItem extends PropertyRow {
  guides: { id: string }[];
}

/**
 * All properties for the signed-in user's account (RLS-scoped).
 *
 * Throws on a query error rather than returning []. An empty array here renders
 * as "No properties yet", so swallowing the error would tell a host their data
 * is gone when the real cause is a failed query — a pending migration, say.
 */
export async function listProperties(): Promise<PropertyListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("id, account_id, name, address, hero_image_url, guides(id)")
    .order("created_at", { ascending: false })
    .returns<PropertyListItem[]>();
  if (error) throw new Error(`Could not load properties: ${error.message}`);
  return data ?? [];
}

export interface GuideListItem extends GuideRow {
  guide_sections: { id: string }[];
  custom_sections: { id: string }[];
  magic_links: { token: string; view_count: number }[];
}

/** Every guide on a property, for the property's guide list. Throws on error so
 *  a failed query can't render as "no guides yet" — see {@link listProperties}. */
export async function listGuides(propertyId: string): Promise<GuideListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("guides")
    .select(
      "id, account_id, property_id, name, kind, section_titles, position, guide_sections(id), custom_sections(id), magic_links(token, view_count)",
    )
    .eq("property_id", propertyId)
    .order("position", { ascending: true })
    .returns<GuideListItem[]>();
  if (error) throw new Error(`Could not load guides: ${error.message}`);
  return data ?? [];
}

/** One property on its own, for the guide list header and settings page. */
export async function getProperty(id: string): Promise<PropertyRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("properties")
    .select("id, account_id, name, address, hero_image_url, section_titles")
    .eq("id", id)
    .maybeSingle<PropertyRow>();
  return data ?? null;
}

export interface HostGuide {
  /** Null for an account-level guide. */
  property: PropertyRow | null;
  guide: GuideRow;
  sections: GuideSectionRow[];
  media: MediaItemRow[];
  localEntries: LocalGuideEntryRow[];
  customSections: CustomSectionRow[];
  link: MagicLinkRow | null;
}

/**
 * Full bundle for one guide, for its overview and editors. Mirrors the guest
 * resolver's scoping so the dashboard and the guest portal can never disagree
 * about what a guide contains.
 */
export async function getHostGuide(guideId: string): Promise<HostGuide | null> {
  const supabase = await createClient();

  const { data: guide } = await supabase
    .from("guides")
    .select("id, account_id, property_id, name, kind, section_titles, position")
    .eq("id", guideId)
    .maybeSingle<GuideRow>();
  if (!guide) return null;

  let property: PropertyRow | null = null;
  if (guide.property_id) {
    const { data } = await supabase
      .from("properties")
      .select("id, account_id, name, address, hero_image_url, section_titles")
      .eq("id", guide.property_id)
      .maybeSingle<PropertyRow>();
    if (!data) return null;
    property = data;
  }

  const [{ data: sections }, { data: media }, { data: link }, { data: customSections }] =
    await Promise.all([
      supabase
        .from("guide_sections")
        .select("id, property_id, guide_id, type, content, position")
        .eq("guide_id", guideId)
        .order("position", { ascending: true })
        .returns<GuideSectionRow[]>(),
      supabase
        .from("media_items")
        .select("id, property_id, guide_id, guide_section_id, type, url, poster_url, caption, position, metadata")
        .eq("guide_id", guideId)
        .order("position", { ascending: true })
        .returns<MediaItemRow[]>(),
      supabase
        .from("magic_links")
        .select("id, property_id, guide_id, token, pin, expires_at, view_count")
        .eq("guide_id", guideId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle<MagicLinkRow>(),
      supabase
        .from("custom_sections")
        .select("id, property_id, guide_id, title, subtitle, body, blocks, position, enabled")
        .eq("guide_id", guideId)
        .order("position", { ascending: true })
        .returns<CustomSectionRow[]>(),
    ]);

  const sectionList = sections ?? [];
  const localSection = sectionList.find((s) => s.type === "local_guide");

  let localEntries: LocalGuideEntryRow[] = [];
  if (localSection) {
    const { data } = await supabase
      .from("local_guide_entries")
      .select("id, guide_section_id, category, name, description, price, hours, lat, lng, url, position")
      .eq("guide_section_id", localSection.id)
      .order("position", { ascending: true })
      .returns<LocalGuideEntryRow[]>();
    localEntries = data ?? [];
  }

  return {
    property,
    guide,
    sections: sectionList,
    media: media ?? [],
    localEntries,
    customSections: customSections ?? [],
    link: link ?? null,
  };
}

/** Guides that belong to the account rather than any property. */
export async function listAccountGuides(accountId: string): Promise<GuideListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("guides")
    .select(
      "id, account_id, property_id, name, kind, section_titles, position, guide_sections(id), custom_sections(id), magic_links(token, view_count)",
    )
    .eq("account_id", accountId)
    .is("property_id", null)
    .order("position", { ascending: true })
    .returns<GuideListItem[]>();
  if (error) throw new Error(`Could not load company guides: ${error.message}`);
  return data ?? [];
}

/**
 * The account's saved house rules, for the picker in the house-rules editor.
 *
 * Returns the error alongside the rows rather than throwing or swallowing.
 * Throwing would take down the page a host came here to edit; swallowing is
 * worse — it renders a failed lookup as "nothing saved yet", which is how a
 * missing column once read as an empty library. The caller shows the reason.
 */
export async function listHouseRuleTemplates(
  accountId: string,
): Promise<{ templates: HouseRuleTemplateRow[]; error?: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("house_rule_templates")
    .select("id, title, reason, icon")
    .eq("account_id", accountId)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true })
    .returns<HouseRuleTemplateRow[]>();
  if (error) return { templates: [], error: error.message };
  return { templates: data ?? [] };
}
