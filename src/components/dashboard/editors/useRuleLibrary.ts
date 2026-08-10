"use client";

import { useState, useTransition } from "react";
import {
  deleteHouseRuleTemplate,
  saveHouseRuleTemplates,
  type RuleLibraryResult,
} from "@/lib/dashboard/rule-library-actions";
import type { HouseRule, HouseRuleTemplateRow } from "@/lib/guide/types";

export const normRule = (s: string) => s.trim().toLowerCase();

/**
 * The account's saved-rule library, shared by the picker panel and the per-rule
 * "save this" buttons — they both read whether a rule is saved and both write to
 * it, so one owner keeps them from disagreeing.
 *
 * Library writes hit the database immediately. That's deliberate: the library is
 * account-level, not part of this guide's unsaved draft, and a host who saves a
 * rule then navigates away without pressing Save on the guide should still find
 * it in their library.
 */
export function useRuleLibrary(initial: HouseRuleTemplateRow[], loadError?: string) {
  const [templates, setTemplates] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const savedTitles = new Set(templates.map((t) => normRule(t.title)));

  /** Is this rule already in the library, by title? */
  const isSaved = (rule: HouseRule) => {
    const t = normRule(rule.title);
    return t.length > 0 && savedTitles.has(t);
  };

  function run(action: () => Promise<RuleLibraryResult>) {
    startTransition(async () => {
      const res = await action();
      if ("error" in res) setError(res.error);
      else {
        setError(null);
        setTemplates(res.templates);
      }
    });
  }

  return {
    templates,
    /** A failed initial read, or the last failed write. */
    error: error ?? loadError ?? null,
    pending,
    isSaved,
    save: (rules: HouseRule[]) => run(() => saveHouseRuleTemplates(rules)),
    remove: (id: string) => run(() => deleteHouseRuleTemplate(id)),
  };
}

export type RuleLibrary = ReturnType<typeof useRuleLibrary>;
