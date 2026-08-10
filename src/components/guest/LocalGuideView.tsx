"use client";

import { useMemo, useState } from "react";
import type { LocalGuideEntryRow } from "@/lib/guide/types";

/**
 * Local guide with category filter chips and host-commentary cards.
 */
export function LocalGuideView({
  entries,
}: {
  entries: LocalGuideEntryRow[];
}) {
  const categories = useMemo(() => {
    const seen: string[] = [];
    for (const e of entries) if (!seen.includes(e.category)) seen.push(e.category);
    return seen;
  }, [entries]);

  const [active, setActive] = useState<string | null>(null);
  const visible = active ? entries.filter((e) => e.category === active) : entries;

  return (
    <div className="flex flex-col gap-2.5">
      {/* Filter chips */}
      <div className="no-scrollbar -mx-4.5 flex gap-2 overflow-x-auto px-4.5 pb-1">
        <Chip active={active === null} onClick={() => setActive(null)}>
          All {entries.length}
        </Chip>
        {categories.map((c) => (
          <Chip key={c} active={active === c} onClick={() => setActive(c)}>
            {c}
          </Chip>
        ))}
      </div>

      {/* Entries */}
      {visible.map((e) => (
        <div
          key={e.id}
          className="rounded-[var(--radius-card)] border-[1.5px] border-border bg-surface px-4 py-3.5"
        >
          <div className="text-[15px] font-bold text-ink">{e.name}</div>
          <div className="mt-0.5 text-[11px] font-bold uppercase tracking-wide text-accent">
            {e.category}
          </div>
          {e.description && (
            <p className="mt-1.5 text-[12.5px] italic leading-relaxed text-body">
              {e.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-none rounded-[var(--radius-pill)] px-3.5 py-2 text-[12.5px] font-bold transition-colors ${
        active ? "bg-brand text-brand-contrast" : "bg-accent-subtle text-accent"
      }`}
    >
      {children}
    </button>
  );
}
