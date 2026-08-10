"use server";

import { createClient } from "@/lib/supabase/server";
import { getActiveAccount } from "@/lib/auth/session";
import type { HouseRule, HouseRuleTemplateRow } from "@/lib/guide/types";

/**
 * Every action returns the whole library on success so the editor can re-render
 * its picker from one round trip. The library is a handful of short rows — a
 * full re-read is cheaper than reconciling a patch on the client, and it means
 * a host with two tabs open never sees a stale list after saving.
 */
export type RuleLibraryResult =
  | { error: string }
  | { ok: true; templates: HouseRuleTemplateRow[] };

const norm = (s: string) => s.trim().toLowerCase();

async function readLibrary(accountId: string): Promise<HouseRuleTemplateRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("house_rule_templates")
    .select("id, title, reason, icon")
    .eq("account_id", accountId)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true })
    .returns<HouseRuleTemplateRow[]>();
  return data ?? [];
}

/**
 * Add rules to the account's library so they can be dropped into any other
 * guide. Rules whose title already exists are skipped rather than duplicated,
 * so pressing "save to my rules" twice is harmless.
 */
export async function saveHouseRuleTemplates(rules: HouseRule[]): Promise<RuleLibraryResult> {
  const account = await getActiveAccount();
  if (!account) return { error: "No account found." };

  const existing = await readLibrary(account.id);
  const seen = new Set(existing.map((t) => norm(t.title)));

  const fresh: { title: string; reason: string | null; icon: string | null }[] = [];
  for (const r of rules) {
    const title = r.title.trim();
    if (!title || seen.has(norm(title))) continue;
    seen.add(norm(title));
    // Only an explicit choice is stored. A rule relying on the automatic guess
    // keeps relying on it, so improving the keyword list later improves the
    // saved rules too instead of leaving today's guess baked in.
    fresh.push({ title, reason: r.reason?.trim() || null, icon: r.icon || null });
  }
  if (fresh.length === 0) return { ok: true, templates: existing };

  const supabase = await createClient();
  const base = existing.length;
  const { error } = await supabase.from("house_rule_templates").insert(
    fresh.map((r, i) => ({ ...r, account_id: account.id, position: base + i })),
  );
  // 23505 = the unique title index fired, i.e. another tab saved the same rule
  // between our read and this insert. The rule is in the library either way.
  if (error && error.code !== "23505") return { error: error.message };

  return { ok: true, templates: await readLibrary(account.id) };
}

/**
 * Remove a rule from the library. Guides that already used it keep their copy —
 * templates are copied in, never referenced.
 */
export async function deleteHouseRuleTemplate(id: string): Promise<RuleLibraryResult> {
  const account = await getActiveAccount();
  if (!account) return { error: "No account found." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("house_rule_templates")
    .delete()
    .eq("id", id)
    .eq("account_id", account.id);
  if (error) return { error: error.message };

  return { ok: true, templates: await readLibrary(account.id) };
}
