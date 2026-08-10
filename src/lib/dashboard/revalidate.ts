import "server-only";
import { revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { guideTag } from "@/lib/guide/resolve";

async function bustTokens(tokens: { token: string }[]): Promise<void> {
  for (const row of tokens) revalidateTag(guideTag(row.token));
}

/**
 * Invalidate the cached guest guide for one guide's magic-link tokens, so host
 * edits show up immediately instead of waiting out the Data Cache window. Call
 * after any mutation that changes what that guide shows.
 *
 * Scoped to the single guide on purpose: saving a cleaner guide must not bust
 * the guest guide's cache, which is the common case and the expensive one.
 */
export async function revalidateGuideById(guideId: string): Promise<void> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("magic_links")
    .select("token")
    .eq("guide_id", guideId);
  await bustTokens((data ?? []) as { token: string }[]);
}

/**
 * Invalidate every guide on a property. Used when property-level content the
 * guides share changes (name, address, hero image).
 */
export async function revalidateProperty(propertyId: string): Promise<void> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("magic_links")
    .select("token")
    .eq("property_id", propertyId);
  await bustTokens((data ?? []) as { token: string }[]);
}

/**
 * Invalidate cached guides for every property in an account. Used after
 * account-wide changes (e.g. accent colour) that affect every guide.
 */
export async function revalidateAccountGuides(accountId: string): Promise<void> {
  const supabase = await createClient();
  const { data: props } = await supabase
    .from("properties")
    .select("id")
    .eq("account_id", accountId);
  const ids = ((props ?? []) as { id: string }[]).map((p) => p.id);
  if (ids.length === 0) return;

  const { data: links } = await supabase
    .from("magic_links")
    .select("token")
    .in("property_id", ids);
  await bustTokens((links ?? []) as { token: string }[]);
}
