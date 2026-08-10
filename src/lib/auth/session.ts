import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { AccountRow } from "@/lib/guide/types";

/** Current authenticated user, or null. Memoised per request. */
export const getUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/** Require a session, else bounce to login. */
export async function requireUser() {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}

/**
 * The signed-in user's account. RLS guarantees only accounts they belong to are
 * returned, so a plain select is safe. Returns null when they have none yet
 * (first login → onboarding).
 */
export const getActiveAccount = cache(async (): Promise<AccountRow | null> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("accounts")
    .select("id, name, logo_url, logo_backdrop, brand_color, theme_preset, font_heading, font_body")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle<AccountRow>();
  return data ?? null;
});

/** Require both a session and a bootstrapped account (→ onboarding if none). */
export async function requireAccount(): Promise<AccountRow> {
  await requireUser();
  const account = await getActiveAccount();
  if (!account) redirect("/dashboard/onboarding");
  return account;
}
