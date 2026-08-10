"use client";

import { useState } from "react";
import { CheckIcon } from "@/components/guest/icons";
import { RuleIcon } from "@/components/guest/rule-icons";
import { normRule, type RuleLibrary } from "./useRuleLibrary";
import type { HouseRule, HouseRuleTemplateRow } from "@/lib/guide/types";

/** A saved template as a rule ready to drop into the guide. */
const toRule = (t: HouseRuleTemplateRow): HouseRule => ({
  title: t.title,
  reason: t.reason ?? "",
  ...(t.icon ? { icon: t.icon } : {}),
});

/**
 * The account's reusable house rules, above the rule list in the editor.
 *
 * Every row is a tick: ticked means the rule is on this guide, unticked means
 * it isn't. Nothing here deletes anything — the previous version had a "Forget"
 * button beside each rule that permanently dropped it from the library, which
 * read like a dismissal and cost a host rules they wanted. Permanent deletion
 * now lives behind the explicit "Edit saved rules" mode below, labelled for
 * what it does.
 *
 * Unticking removes the rule from the guide by title, not by position, so it
 * finds the copy even after the host has reworded its reason.
 */
export function SavedRules({
  library,
  rules,
  onAdd,
  onRemove,
}: {
  library: RuleLibrary;
  /** The rules currently on this guide — decides which rows show as ticked. */
  rules: HouseRule[];
  onAdd: (rules: HouseRule[]) => void;
  onRemove: (titles: string[]) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const { templates, error, pending } = library;

  const used = new Set(rules.map((r) => normRule(r.title)).filter(Boolean));
  const unused = templates.filter((t) => !used.has(normRule(t.title)));

  return (
    <section className="rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface p-4 sm:p-5">
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-extrabold text-ink">Your saved rules</h2>
        {templates.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setEditing((e) => !e);
              setConfirmId(null);
            }}
            className="text-[13px] font-bold text-muted hover:text-ink"
          >
            {editing ? "Done" : "Edit saved rules"}
          </button>
        )}
      </div>
      <p className="mb-3 text-xs text-muted">
        {editing
          ? "Deleting removes a rule from your library for good. It stays on any guide already using it."
          : "Tick the ones this guide should use. Unticking only removes it from this guide."}
      </p>

      {templates.length === 0 ? (
        error ? (
          <p className="text-[13px] font-semibold text-danger">
            Couldn&apos;t load your saved rules: {error}
          </p>
        ) : (
          <p className="text-[13px] text-muted">
            Nothing saved yet. Add a rule below, then use its &ldquo;Save to my rules&rdquo;
            button to reuse it on your other properties.
          </p>
        )
      ) : (
        <ul className="flex flex-col gap-2">
          {templates.map((t) => {
            const on = used.has(normRule(t.title));
            return (
              <li key={t.id} className="flex items-center gap-2">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={on}
                  onClick={() => (on ? onRemove([t.title]) : onAdd([toRule(t)]))}
                  className={`flex min-w-0 flex-1 items-center gap-2.5 rounded-[var(--radius-sm)] border-[1.5px] p-2.5 text-left transition-colors ${
                    on
                      ? "border-accent bg-accent-subtle"
                      : "border-border bg-page hover:border-accent"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 flex-none items-center justify-center rounded-[6px] border-[1.5px] ${
                      on ? "border-accent bg-accent text-white" : "border-border bg-surface"
                    }`}
                  >
                    {on && <CheckIcon className="h-3 w-3" />}
                  </span>
                  <RuleIcon
                    icon={t.icon}
                    title={t.title}
                    className="h-4.5 w-4.5 flex-none text-accent"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-semibold text-ink">
                      {t.title}
                    </span>
                    {t.reason && (
                      <span className="block truncate text-xs text-muted">{t.reason}</span>
                    )}
                  </span>
                </button>
                {editing &&
                  (confirmId === t.id ? (
                    // Confirmation is inline rather than a modal: the rule being
                    // deleted stays on screen next to the choice.
                    <span className="flex flex-none items-center gap-1.5">
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => {
                          library.remove(t.id);
                          setConfirmId(null);
                        }}
                        className="rounded-[var(--radius-pill)] bg-danger px-3 py-2 text-xs font-bold text-white disabled:opacity-60"
                      >
                        {pending ? "Deleting…" : "Delete for good"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmId(null)}
                        className="px-1.5 py-2 text-xs font-bold text-body"
                      >
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmId(t.id)}
                      className="flex-none rounded-[var(--radius-pill)] border-[1.5px] border-danger-ring bg-danger-subtle px-3 py-2 text-xs font-bold text-danger"
                    >
                      Delete
                    </button>
                  ))}
              </li>
            );
          })}
        </ul>
      )}

      {unused.length > 1 && !editing && (
        <button
          type="button"
          onClick={() => onAdd(unused.map(toRule))}
          className="mt-3 text-[13px] font-bold text-accent"
        >
          Tick all {unused.length} remaining
        </button>
      )}

      {error && templates.length > 0 && (
        <p className="mt-3 text-[13px] font-semibold text-danger">{error}</p>
      )}
    </section>
  );
}
