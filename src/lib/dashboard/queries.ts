import "server-only";
import { createClient } from "@/lib/supabase/server";
import type {
  CustomSectionRow,
  GuideSectionRow,
  LocalGuideEntryRow,
  MagicLinkRow,
  MediaItemRow,
  PropertyRow,
} from "@/lib/guide/types";

export interface PropertyListItem extends PropertyRow {
  magic_links: { token: string; view_count: number }[];
  guide_sections: { id: string }[];
}

/** All properties for the signed-in user's account (RLS-scoped). */
export async function listProperties(): Promise<PropertyListItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("properties")
    .select(
      "id, account_id, name, address, hero_image_url, magic_links(token, view_count), guide_sections(id)",
    )
    .order("created_at", { ascending: false })
    .returns<PropertyListItem[]>();
  return data ?? [];
}

export interface HostProperty {
  property: PropertyRow;
  sections: GuideSectionRow[];
  media: MediaItemRow[];
  localEntries: LocalGuideEntryRow[];
  customSections: CustomSectionRow[];
  link: MagicLinkRow | null;
}

/** Full guide bundle for one property, for the overview and editors. */
export async function getHostProperty(id: string): Promise<HostProperty | null> {
  const supabase = await createClient();

  const { data: property } = await supabase
    .from("properties")
    .select("id, account_id, name, address, hero_image_url, section_titles")
    .eq("id", id)
    .maybeSingle<PropertyRow>();
  if (!property) return null;

  const [{ data: sections }, { data: media }, { data: link }, { data: customSections }] =
    await Promise.all([
    supabase
      .from("guide_sections")
      .select("id, property_id, type, content, position")
      .eq("property_id", id)
      .order("position", { ascending: true })
      .returns<GuideSectionRow[]>(),
    supabase
      .from("media_items")
      .select("id, property_id, guide_section_id, type, url, poster_url, caption, position, metadata")
      .eq("property_id", id)
      .order("position", { ascending: true })
      .returns<MediaItemRow[]>(),
    supabase
      .from("magic_links")
      .select("id, property_id, token, pin, expires_at, view_count")
      .eq("property_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle<MagicLinkRow>(),
    supabase
      .from("custom_sections")
      .select("id, property_id, title, subtitle, body, blocks, position, enabled")
      .eq("property_id", id)
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
    sections: sectionList,
    media: media ?? [],
    localEntries,
    customSections: customSections ?? [],
    link: link ?? null,
  };
}
