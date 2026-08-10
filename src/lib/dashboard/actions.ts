"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { revalidateProperty } from "./revalidate";
import { deleteStorageFolder } from "./storage";
import { getActiveAccount } from "@/lib/auth/session";
import { SECTION_META, DEFAULT_CONTENT } from "@/lib/guide/defaults";
import { STARTER_RULE_TEMPLATES } from "@/lib/guide/rule-templates";
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
  /**
   * Optional id chosen by the caller. The New property dialog generates one so a
   * photo can be uploaded to the property's own storage folder before the row
   * exists — which keeps every file for a property under `{propertyId}/`, the
   * invariant `deletePropertyAction` relies on to sweep them.
   */
  options: { id?: string; heroImageUrl?: string } = {},
): Promise<{ propertyId: string; guideId: string }> {
  const { data: property, error } = await supabase
    .from("properties")
    .insert({
      ...(options.id ? { id: options.id } : {}),
      account_id: accountId,
      name,
      address: address || null,
      hero_image_url: options.heroImageUrl || null,
    })
    .select("id")
    .single();
  if (error || !property) throw new Error(error?.message ?? "Could not create property.");

  const { data: guide, error: guideErr } = await supabase
    .from("guides")
    .insert({
      account_id: accountId,
      property_id: property.id,
      name: "Guest guide",
      kind: "guest",
      position: 0,
    })
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

  // Give the new account the starter rule library so the house-rules editor has
  // something to offer on the very first property. Best-effort: a host with an
  // account and a property but no starter rules is a much better outcome than
  // failing onboarding over a convenience list they can rebuild by hand.
  await supabase.from("house_rule_templates").insert(
    STARTER_RULE_TEMPLATES.map((r, i) => ({
      account_id: account.id,
      title: r.title,
      reason: r.reason ?? null,
      position: i,
    })),
  );

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

  // Both optional. The dialog asks only for a name; a photo is offered, and the
  // id comes with it so the upload could be filed under the property up front.
  const id = String(formData.get("id") ?? "").trim();
  const heroImageUrl = String(formData.get("hero_image_url") ?? "").trim();
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  const supabase = await createClient();
  let created: { propertyId: string; guideId: string };
  try {
    created = await createPropertyWithDefaults(supabase, account.id, name, address, {
      // A malformed id is dropped rather than rejected: the photo still lands
      // (its URL is absolute) and the database picks the id, which beats failing
      // a creation over a field the host never filled in.
      id: isUuid ? id : undefined,
      heroImageUrl,
    });
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

/**
 * Set or clear a property's photo on its own, without the rest of the details
 * form. Saves as soon as it's chosen: this is used on the guide page, where
 * there's no Save button to press and an upload that needed one would look
 * finished while quietly not being stored.
 */
export async function setPropertyHeroImage(
  propertyId: string,
  url: string | null,
): Promise<FormState> {
  if (!propertyId) return { error: "Missing property." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("properties")
    .update({ hero_image_url: url || null })
    .eq("id", propertyId);
  if (error) return { error: error.message };

  // The photo is the guest guide's hero, so every guide on the property changes.
  await revalidateProperty(propertyId);
  revalidatePath(`/properties/${propertyId}`, "layout");
  revalidatePath("/dashboard");
  return { ok: true };
}

/**
 * Delete a property and everything belonging to it: every guide on it, their
 * sections, custom sections, media rows, local-guide entries and magic links
 * (all by database cascade), plus the uploaded files themselves.
 *
 * Account-level guides are not touched — they have no property_id, so they
 * aren't about this building and outlive it.
 *
 * Ordering matters here:
 *  1. Bust the cached guest pages FIRST, while the magic-link tokens still
 *     exist to look up. After the cascade there is nothing left to find them
 *     by, and a deleted property's guide would keep serving from cache.
 *  2. Delete the row, and stop if that fails.
 *  3. Only then sweep storage. Files are public and permanent, so leaving them
 *     behind contradicts what the confirmation promises — but doing it last
 *     means a storage failure can't strand a live property with dead images.
 */
export async function deletePropertyAction(id: string): Promise<FormState> {
  if (!id) return { error: "Missing property." };

  const supabase = await createClient();

  // Confirms the caller is a member of this property's account before the
  // service role touches its files — RLS makes anyone else's property invisible.
  const { data: property, error: readError } = await supabase
    .from("properties")
    .select("id")
    .eq("id", id)
    .maybeSingle();
  if (readError) return { error: readError.message };
  if (!property) return { error: "That property no longer exists." };

  await revalidateProperty(id);

  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) return { error: error.message };

  const { error: storageError } = await deleteStorageFolder("media", id);

  revalidatePath("/dashboard");
  revalidatePath("/guides");
  // The property is gone either way, so this is a warning, not a failure.
  if (storageError) {
    return { ok: true, message: `Property deleted, but some uploaded files remain: ${storageError}` };
  }
  return { ok: true };
}
