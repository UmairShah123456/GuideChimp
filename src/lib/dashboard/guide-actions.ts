"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { revalidateGuideById } from "./revalidate";
import { generateToken } from "./token";
import { guidePreset } from "@/lib/guide/presets";
import { DEFAULT_CONTENT } from "@/lib/guide/defaults";
import type { FormState } from "@/lib/forms";
import { guideBasePath, guideListPath } from "./paths";
import type { GuideRow } from "@/lib/guide/types";

/**
 * Create a guide with its preset's built-in sections and a magic link, in one
 * round trip. Guest guides get all eight built-ins; cleaner and staff guides
 * start empty and are built from custom sections.
 *
 * The DB function does the whole thing in a single statement so a half-created
 * guide (no link, or sections without a link) can never be left behind.
 */
export async function createGuide(
  accountId: string,
  propertyId: string | null,
  name: string,
  kind: string,
): Promise<{ id?: string; error?: string }> {
  const preset = guidePreset(kind);
  const title = name.trim() || preset.label;

  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("create_guide", {
      p_account_id: accountId,
      p_property_id: propertyId,
      p_name: title,
      p_kind: preset.kind,
      p_types: preset.builtins,
      p_contents: Object.fromEntries(
        preset.builtins.map((t) => [t, DEFAULT_CONTENT[t]]),
      ),
      p_token: generateToken(),
    })
    .single<GuideRow>();
  if (error || !data) return { error: error?.message ?? "Could not create the guide." };

  revalidatePath(guideListPath(propertyId));
  return { id: data.id };
}

/** Rename a guide. This is the name hosts see in the list and staff see on the
 *  guide's home screen, so it is the one label that matters. */
export async function renameGuide(
  propertyId: string | null,
  guideId: string,
  name: string,
): Promise<FormState> {
  const title = name.trim();
  if (!title) return { error: "Please name the guide." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("guides")
    .update({ name: title })
    .eq("id", guideId);
  if (error) return { error: error.message };

  await revalidateGuideById(guideId);
  revalidatePath(guideListPath(propertyId));
  revalidatePath(guideBasePath(propertyId, guideId));
  return { ok: true };
}

/**
 * Delete a guide and everything under it. The DB cascades to its sections,
 * custom sections, media and magic link — other guides on the same property are
 * untouched.
 */
export async function deleteGuide(
  propertyId: string | null,
  guideId: string,
): Promise<FormState> {
  const supabase = await createClient();

  // Bust the cached guest guide before the tokens disappear with the row.
  await revalidateGuideById(guideId);

  const { error } = await supabase.from("guides").delete().eq("id", guideId);
  if (error) return { error: error.message };

  revalidatePath(guideListPath(propertyId));
  return { ok: true };
}

/** Persist a new guide ordering for the property's list. */
export async function reorderGuides(
  propertyId: string | null,
  guideIds: string[],
): Promise<FormState> {
  const supabase = await createClient();
  for (const [position, id] of guideIds.entries()) {
    const { error } = await supabase.from("guides").update({ position }).eq("id", id);
    if (error) return { error: error.message };
  }
  revalidatePath(guideListPath(propertyId));
  return { ok: true };
}
