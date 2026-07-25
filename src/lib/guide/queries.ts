import "server-only";
import { createServiceClient } from "@/lib/supabase/service";
import type {
  AccountRow,
  CustomSectionRow,
  GuestGuide,
  GuideSectionRow,
  LocalGuideEntryRow,
  MagicLinkRow,
  MediaItemRow,
  PropertyRow,
} from "./types";

export type GuideResult =
  | { status: "ok"; guide: GuestGuide }
  | { status: "expired" }
  | { status: "not_found" };

/**
 * Resolves a magic-link token to a fully-populated guide. Runs with the service
 * role because guests have no session — the token itself is the credential.
 * Returns a discriminated result so the route can render the right state.
 */
export async function getGuestGuide(token: string): Promise<GuideResult> {
  const supabase = createServiceClient();

  const { data: link } = await supabase
    .from("magic_links")
    .select("id, property_id, token, pin, expires_at, view_count")
    .eq("token", token)
    .maybeSingle<MagicLinkRow>();

  if (!link) return { status: "not_found" };
  if (link.expires_at && new Date(link.expires_at).getTime() < Date.now()) {
    return { status: "expired" };
  }

  const { data: property } = await supabase
    .from("properties")
    .select("id, account_id, name, address, hero_image_url, section_titles")
    .eq("id", link.property_id)
    .maybeSingle<PropertyRow>();

  if (!property) return { status: "not_found" };

  const [{ data: account }, { data: sections }, { data: media }, { data: customSections }] =
    await Promise.all([
      supabase
        .from("accounts")
        .select("id, name, logo_url, accent_hue")
        .eq("id", property.account_id)
        .maybeSingle<AccountRow>(),
      supabase
        .from("guide_sections")
        .select("id, property_id, type, content, position")
        .eq("property_id", property.id)
        .order("position", { ascending: true })
        .returns<GuideSectionRow[]>(),
      supabase
        .from("media_items")
        .select("id, property_id, guide_section_id, type, url, poster_url, caption, position, metadata")
        .eq("property_id", property.id)
        .order("position", { ascending: true })
        .returns<MediaItemRow[]>(),
      supabase
        .from("custom_sections")
        .select("id, property_id, title, subtitle, body, blocks, position, enabled")
        .eq("property_id", property.id)
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

  if (!account) return { status: "not_found" };

  return {
    status: "ok",
    guide: {
      account,
      property,
      link,
      sections: sectionList,
      media: media ?? [],
      localEntries,
      customSections: customSections ?? [],
    },
  };
}

/** Fire-and-forget view counter — must not block or fail the guest render. */
export async function registerGuestView(token: string): Promise<void> {
  try {
    const supabase = createServiceClient();
    await supabase.rpc("increment_link_view", { p_token: token });
  } catch {
    // Analytics only — never surface to the guest.
  }
}
