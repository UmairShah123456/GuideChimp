"use client";

import { CheckIcon, PlusIcon } from "@/components/guest/icons";
import type { RuleLibrary } from "./useRuleLibrary";
import type { HouseRule } from "@/lib/guide/types";

/**
 * "Save to my rules" for one rule, shown under the rule as it's written.
 *
 * Saves the wording as it stands right now. Editing the rule afterwards changes
 * this guide only — the saved copy is independent, which is the same rule the
 * rest of the feature follows, so nothing here silently rewrites a template the
 * host's other properties are using.
 */
export function SaveToLibraryButton({
  rule,
  library,
}: {
  rule: HouseRule;
  library: RuleLibrary;
}) {
  const empty = !rule.title.trim();
  const saved = library.isSaved(rule);

  // Nothing to offer until the rule has a title — an untitled rule can't be
  // found in the library again, and the action would reject it anyway.
  if (empty) return null;

  if (saved) {
    return (
      <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-muted">
        <CheckIcon className="h-3.5 w-3.5 flex-none text-accent" />
        In your saved rules
      </p>
    );
  }

  return (
    <button
      type="button"
      disabled={library.pending}
      onClick={() => library.save([rule])}
      className="flex items-center gap-1.5 self-start rounded-[var(--radius-pill)] border-[1.5px] border-border px-3 py-1.5 text-[12.5px] font-bold text-accent hover:bg-accent-subtle disabled:opacity-60"
    >
      <PlusIcon className="h-3.5 w-3.5 flex-none" />
      Save to my rules
    </button>
  );
}
