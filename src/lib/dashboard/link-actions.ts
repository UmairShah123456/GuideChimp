"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { revalidateGuideById } from "./revalidate";
import { generateToken } from "./token";
import type { FormState } from "@/lib/forms";

async function latestLinkId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  guideId: string,
): Promise<string | null> {
  const { data } = await supabase
    .from("magic_links")
    .select("id")
    .eq("guide_id", guideId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<{ id: string }>();
  return data?.id ?? null;
}

function paths(propertyId: string, guideId: string): void {
  revalidatePath(`/properties/${propertyId}/guides/${guideId}/link-settings`);
  revalidatePath(`/properties/${propertyId}/guides/${guideId}`);
  revalidatePath(`/properties/${propertyId}`);
}

/** Issue a fresh token (invalidates the old URL) or create the first link. */
export async function regenerateLinkAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const propertyId = String(formData.get("propertyId") ?? "");
  const guideId = String(formData.get("guideId") ?? "");
  if (!propertyId || !guideId) return { error: "Missing guide." };

  const supabase = await createClient();
  const id = await latestLinkId(supabase, guideId);
  const token = generateToken();

  // Bust the old token's cache before it stops resolving.
  await revalidateGuideById(guideId);

  const { error } = id
    ? await supabase.from("magic_links").update({ token, view_count: 0 }).eq("id", id)
    : await supabase
        .from("magic_links")
        .insert({ property_id: propertyId, guide_id: guideId, token });
  if (error) return { error: error.message };

  await revalidateGuideById(guideId);
  paths(propertyId, guideId);
  return { ok: true, message: "New link generated. The old URL no longer works." };
}

/** Update expiry + optional PIN on the current link. */
export async function updateLinkSettingsAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const propertyId = String(formData.get("propertyId") ?? "");
  const guideId = String(formData.get("guideId") ?? "");
  const expiry = String(formData.get("expires_at") ?? "").trim();
  const pin = String(formData.get("pin") ?? "").trim();
  if (!propertyId || !guideId) return { error: "Missing guide." };

  const supabase = await createClient();
  const id = await latestLinkId(supabase, guideId);
  if (!id) return { error: "No link to update. Generate one first." };

  const { error } = await supabase
    .from("magic_links")
    .update({
      expires_at: expiry ? new Date(`${expiry}T23:59:59`).toISOString() : null,
      pin: pin || null,
    })
    .eq("id", id);
  if (error) return { error: error.message };

  await revalidateGuideById(guideId);
  paths(propertyId, guideId);
  return { ok: true, message: "Link settings saved." };
}
