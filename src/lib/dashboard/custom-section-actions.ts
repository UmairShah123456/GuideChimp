"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { revalidateGuideById } from "./revalidate";
import type { FormState } from "@/lib/forms";
import type { CustomBlock, GuideSectionType, SectionTitles } from "@/lib/guide/types";

/** Revalidate the guide's own page and its property's guide list. */
async function afterSave(propertyId: string, guideId: string): Promise<void> {
  await revalidateGuideById(guideId);
  revalidatePath(`/properties/${propertyId}/guides/${guideId}`);
  revalidatePath(`/properties/${propertyId}`);
}

/**
 * Read-modify-write a guide's section_titles map. Overrides live on the guide
 * rather than the property so a cleaner guide can name a section differently
 * from the guest guide on the same property.
 */
async function updateSectionTitles(
  propertyId: string,
  guideId: string,
  type: GuideSectionType,
  mutate: (current: SectionTitles[GuideSectionType]) => SectionTitles[GuideSectionType],
): Promise<FormState> {
  const supabase = await createClient();

  const { data: guide, error: readErr } = await supabase
    .from("guides")
    .select("section_titles")
    .eq("id", guideId)
    .single<{ section_titles: SectionTitles | null }>();
  if (readErr) return { error: readErr.message };

  const titles: SectionTitles = { ...(guide?.section_titles ?? {}) };
  const next = mutate({ ...(titles[type] ?? {}) });
  if (!next || Object.keys(next).length === 0) delete titles[type];
  else titles[type] = next;

  const { error } = await supabase
    .from("guides")
    .update({ section_titles: titles })
    .eq("id", guideId);
  if (error) return { error: error.message };

  await afterSave(propertyId, guideId);
  return { ok: true };
}

/**
 * Rename a built-in section. The override drives both the host dashboard list
 * and the guest home tile, so there is a single name per section. Blank values
 * clear the override (falling back to defaults).
 */
export async function renameSection(
  propertyId: string,
  guideId: string,
  type: GuideSectionType,
  title: string,
  subtitle: string,
): Promise<FormState> {
  const t = title.trim();
  const s = subtitle.trim();
  return updateSectionTitles(propertyId, guideId, type, (next) => {
    // Preserve any other keys on this section (e.g. the `enabled` toggle).
    const out = { ...next };
    if (t) out.title = t;
    else delete out.title;
    if (s) out.subtitle = s;
    else delete out.subtitle;
    return out;
  });
}

/** Turn a built-in section's home tile on or off. Stored on the guide. */
export async function setSectionEnabled(
  propertyId: string,
  guideId: string,
  type: GuideSectionType,
  enabled: boolean,
): Promise<FormState> {
  return updateSectionTitles(propertyId, guideId, type, (next) => ({ ...next, enabled }));
}

/**
 * Create a custom section with the given name and return its id so the caller
 * can open it. The name is what readers see on the home tile and page heading.
 */
export async function createCustomSection(
  propertyId: string,
  guideId: string,
  name: string,
): Promise<{ id?: string; error?: string }> {
  const title = name.trim();
  if (!title) return { error: "Please name the section." };

  const supabase = await createClient();

  const { data: last } = await supabase
    .from("custom_sections")
    .select("position")
    .eq("guide_id", guideId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle<{ position: number }>();

  const { data, error } = await supabase
    .from("custom_sections")
    .insert({
      property_id: propertyId,
      guide_id: guideId,
      title,
      position: (last?.position ?? -1) + 1,
    })
    .select("id")
    .single<{ id: string }>();
  if (error || !data) return { error: error?.message ?? "Could not create section." };

  await afterSave(propertyId, guideId);
  return { id: data.id };
}

/** Rename a custom section. The name drives the dashboard, tile, and heading. */
export async function renameCustomSection(
  propertyId: string,
  guideId: string,
  id: string,
  name: string,
): Promise<FormState> {
  const title = name.trim();
  if (!title) return { error: "Please name the section." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("custom_sections")
    .update({ title })
    .eq("id", id)
    .eq("guide_id", guideId);
  if (error) return { error: error.message };

  await afterSave(propertyId, guideId);
  return { ok: true };
}

/** Turn a custom section's home tile on or off. */
export async function setCustomSectionEnabled(
  propertyId: string,
  guideId: string,
  id: string,
  enabled: boolean,
): Promise<FormState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("custom_sections")
    .update({ enabled })
    .eq("id", id)
    .eq("guide_id", guideId);
  if (error) return { error: error.message };

  await afterSave(propertyId, guideId);
  return { ok: true };
}

/** Save a custom section's ordered content blocks. */
export async function saveCustomSection(
  propertyId: string,
  guideId: string,
  id: string,
  blocks: CustomBlock[],
): Promise<FormState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("custom_sections")
    .update({
      blocks,
      // Retire the legacy free-text body now that content lives in blocks.
      body: null,
    })
    .eq("id", id)
    .eq("guide_id", guideId);
  if (error) return { error: error.message };

  await afterSave(propertyId, guideId);
  return { ok: true };
}

/** Delete a custom section. */
export async function deleteCustomSection(
  propertyId: string,
  guideId: string,
  id: string,
): Promise<FormState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("custom_sections")
    .delete()
    .eq("id", id)
    .eq("guide_id", guideId);
  if (error) return { error: error.message };

  await afterSave(propertyId, guideId);
  return { ok: true };
}
