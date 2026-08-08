"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { revalidateGuideById } from "./revalidate";
import { guideBasePath, guideListPath } from "./paths";
import type { FormState } from "@/lib/forms";
import type { GuideSectionType } from "@/lib/guide/types";

/** Revalidate the guide's own page and its property's guide list. */
async function afterSave(propertyId: string | null, guideId: string): Promise<void> {
  await revalidateGuideById(guideId);
  revalidatePath(guideBasePath(propertyId, guideId));
  revalidatePath(guideListPath(propertyId));
}

/** Update a single section's JSONB content. */
export async function saveSectionContent(
  propertyId: string | null,
  guideId: string,
  type: GuideSectionType,
  content: unknown,
): Promise<FormState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("guide_sections")
    .update({ content })
    .eq("guide_id", guideId)
    .eq("type", type);
  if (error) return { error: error.message };

  await afterSave(propertyId, guideId);
  return { ok: true };
}

export interface LocalEntryInput {
  category: string;
  name: string;
  description?: string;
  price?: string;
  hours?: string;
  url?: string;
}

/** Save the local-guide header + replace its list of places. */
export async function saveLocalGuide(
  propertyId: string | null,
  guideId: string,
  content: unknown,
  entries: LocalEntryInput[],
): Promise<FormState> {
  const supabase = await createClient();

  const { data: section, error: secErr } = await supabase
    .from("guide_sections")
    .update({ content })
    .eq("guide_id", guideId)
    .eq("type", "local_guide")
    .select("id")
    .single();
  if (secErr || !section) return { error: secErr?.message ?? "Section not found." };

  await supabase.from("local_guide_entries").delete().eq("guide_section_id", section.id);

  const clean = entries.filter((e) => e.name.trim());
  if (clean.length > 0) {
    const { error } = await supabase.from("local_guide_entries").insert(
      clean.map((e, i) => ({
        guide_section_id: section.id,
        category: e.category.trim() || "Place",
        name: e.name.trim(),
        description: e.description?.trim() || null,
        price: e.price?.trim() || null,
        hours: e.hours?.trim() || null,
        url: e.url?.trim() || null,
        position: i,
      })),
    );
    if (error) return { error: error.message };
  }

  await afterSave(propertyId, guideId);
  return { ok: true };
}

export interface VideoInput {
  url?: string;
  caption?: string;
  subtitle?: string;
  notes?: string;
}

/** Save the amenities header + replace its list of video guides. */
export async function saveAmenities(
  propertyId: string | null,
  guideId: string,
  content: unknown,
  videos: VideoInput[],
): Promise<FormState> {
  const supabase = await createClient();

  const { data: section, error: secErr } = await supabase
    .from("guide_sections")
    .update({ content })
    .eq("guide_id", guideId)
    .eq("type", "amenities")
    .select("id")
    .single();
  if (secErr || !section) return { error: secErr?.message ?? "Section not found." };

  await supabase
    .from("media_items")
    .delete()
    .eq("guide_section_id", section.id)
    .eq("type", "video");

  const clean = videos.filter((v) => (v.caption ?? "").trim() || (v.url ?? "").trim());
  if (clean.length > 0) {
    const { error } = await supabase.from("media_items").insert(
      clean.map((v, i) => ({
        property_id: propertyId,
        guide_id: guideId,
        guide_section_id: section.id,
        type: "video" as const,
        url: v.url?.trim() || "",
        caption: v.caption?.trim() || "Guide",
        position: i,
        metadata: {
          subtitle: v.subtitle?.trim() || "",
          notes: v.notes?.trim() || "",
        },
      })),
    );
    if (error) return { error: error.message };
  }

  await afterSave(propertyId, guideId);
  return { ok: true };
}
