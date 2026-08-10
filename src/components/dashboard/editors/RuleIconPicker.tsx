"use client";

import { useEffect, useRef, useState } from "react";
import { RULE_ICONS, RuleIcon } from "@/components/guest/rule-icons";
import { ChevronRight } from "@/components/guest/icons";

/**
 * Icon picker for one house rule. A grid rather than the listbox used for local
 * -guide categories: at nineteen options a single column is all scrolling, and
 * the glyph is the thing being chosen, so the labels can be secondary.
 *
 * The trigger is icon-only and sits beside the rule's title — the name of the
 * mark adds nothing next to the mark itself, and it costs a line of the form.
 * It always renders what the guest will see, which for a rule with no explicit
 * choice is the guess made from its wording.
 */
export function RuleIconPicker({
  value,
  title,
  onChange,
}: {
  value?: string;
  /** The rule's title, used to show what the automatic guess would be. */
  title: string;
  onChange: (slug: string | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function choose(slug: string) {
    // Picking the icon already showing clears the choice, handing the rule back
    // to the automatic guess instead of freezing today's guess in place.
    onChange(slug === value ? undefined : slug);
    setOpen(false);
    trigger.current?.focus();
  }

  const chosen = RULE_ICONS.find((i) => i.slug === value);
  // Names the current mark for screen readers and as a hover tooltip, without
  // spending a line of the form on a label the glyph already carries.
  const label = chosen ? `Icon: ${chosen.label}` : "Choose an icon";

  return (
    <div ref={wrap} className="relative">
      <button
        ref={trigger}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={label}
        title={label}
        onClick={() => setOpen((o) => !o)}
        className={`flex h-[42px] w-[52px] flex-none items-center justify-center gap-0.5 rounded-[var(--radius-sm)] border-[1.5px] transition-colors ${
          open ? "border-accent" : "border-border"
        } ${value ? "bg-accent-subtle text-accent" : "bg-surface text-muted hover:text-ink"}`}
      >
        <RuleIcon icon={value} title={title} className="h-5 w-5 flex-none" />
        <ChevronRight className="h-3 w-3 flex-none rotate-90" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Choose an icon"
          className="absolute left-0 top-[calc(100%+4px)] z-20 w-[248px] rounded-[var(--radius-sm)] border-[1.5px] border-border bg-surface p-2 shadow-lg"
        >
          <div className="grid grid-cols-5 gap-1 sm:grid-cols-6">
            {RULE_ICONS.map(({ slug, label: iconLabel, Icon }) => (
              <button
                key={slug}
                type="button"
                title={iconLabel}
                aria-label={iconLabel}
                aria-pressed={slug === value}
                onClick={() => choose(slug)}
                className={`flex aspect-square items-center justify-center rounded-[var(--radius-sm)] border-[1.5px] transition-colors ${
                  slug === value
                    ? "border-accent bg-accent-subtle text-accent"
                    : "border-transparent text-body hover:border-border hover:bg-page"
                }`}
              >
                <Icon className="h-5 w-5" />
              </button>
            ))}
          </div>
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange(undefined);
                setOpen(false);
              }}
              className="mt-1 w-full rounded-[var(--radius-sm)] px-2 py-1.5 text-[12.5px] font-semibold text-muted hover:text-ink"
            >
              Clear — choose from the rule&apos;s wording
            </button>
          )}
        </div>
      )}
    </div>
  );
}
