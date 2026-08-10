"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { revalidateProperty } from "./revalidate";
import { getActiveAccount } from "@/lib/auth/session";
import { SECTION_META, DEFAULT_CONTENT } from "@/lib/guide/defaults";
import { generateToken } from "./token";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { FormState } from "@/lib/forms";

/**
 * Creates a property and its guest guide — the eight (empty) guide sections and
 * an initial magic link — as the atomic unit a host starts from. Further guides
 * (cleaner, staff) are added later from the property's guide list.
 * Returns the new property id and the guest guide's id.
 */
async function createPropertyWithDefaults(
  supabase: SupabaseClient,
  accountId: string,
  name: string,
  address: string,
): Promise<{ propertyId: string; guideId: string }> {
  const { data: property, error } = await supabase
    .from("properties")
    .insert({ account_id: accountId, name, address: address || null })
    .select("id")
    .single();
  if (error || !property) throw new Error(error?.message ?? "Could not create property.");

  const { data: guide, error: guideErr } = await supabase
    .from("guides")
    .insert({ property_id: property.id, name: "Guest guide", kind: "guest", position: 0 })
    .select("id")
    .single();
  if (guideErr || !guide) throw new Error(guideErr?.message ?? "Could not create the guest guide.");

  await supabase.from("guide_sections").insert(
    SECTION_META.map((s) => ({
      property_id: property.id,
      guide_id: guide.id,
      type: s.type,
      position: s.position,
      content: DEFAULT_CONTENT[s.type],
    })),
  );

  await supabase
    .from("magic_links")
    .insert({ property_id: property.id, guide_id: guide.id, token: generateToken() });

  return { propertyId: property.id as string, guideId: guide.id as string };
}

/** First-run: create the account (as owner) and the first property together. */
export async function onboardingAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const accountName = String(formData.get("accountName") ?? "").trim();
  const propertyName = String(formData.get("propertyName") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();

  if (!accountName) return { error: "Give your business or account a name." };
  if (!propertyName) return { error: "Name your first property." };

  const supabase = await createClient();
  const { data: account, error } = await supabase.rpc("create_account_with_owner", {
    p_name: accountName,
  });
  if (error || !account) return { error: error?.message ?? "Could not create your account." };

  let created: { propertyId: string; guideId: string };
  try {
    created = await createPropertyWithDefaults(supabase, account.id, propertyName, address);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not create your property." };
  }

  revalidatePath("/dashboard");
  // Straight into the guest guide — onboarding shouldn't stop at a list of one.
  redirect(`/properties/${created.propertyId}/guides/${created.guideId}`);
}

/** Add another property to the existing account. */
export async function createPropertyAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const account = await getActiveAccount();
  if (!account) redirect("/dashboard/onboarding");

  const name = String(formData.get("name") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  if (!name) return { error: "Give the property a name." };

  const supabase = await createClient();
  let created: { propertyId: string; guideId: string };
  try {
    created = await createPropertyWithDefaults(supabase, account.id, name, address);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not create your property." };
  }

  revalidatePath("/dashboard");
  redirect(`/properties/${created.propertyId}`);
}

/** Update a property's core details (name, address, hero image). */
export async function updatePropertyAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const heroImageUrl = String(formData.get("hero_image_url") ?? "").trim();
  if (!id) return { error: "Missing property." };
  if (!name) return { error: "Name can't be empty." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("properties")
    .update({ name, address: address || null, hero_image_url: heroImageUrl || null })
    .eq("id", id);
  if (error) return { error: error.message };

  // Name/address/hero are property-level, so every guide on it is affected.
  await revalidateProperty(id);
  revalidatePath(`/properties/${id}`, "layout");
  revalidatePath("/dashboard");
  return { ok: true };
}

/** Delete a property (cascades to sections, media, links, entries). */
export async function deletePropertyAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("properties").delete().eq("id", id);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
