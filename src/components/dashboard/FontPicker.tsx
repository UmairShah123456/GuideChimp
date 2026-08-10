"use client";

import { useState } from "react";
import { FONTS, type FontFace } from "@/lib/branding/fonts";

/**
 * Picks one typeface from the full list, previewed in the face itself — the
 * only way to judge a font is to see it set. Sans and serif are grouped because
 * that is the first cut anyone makes when pairing.
 */
export function FontPicker({
  label,
  value,
  sample,
  onChange,
}: {
  label: string;
  value: string;
  sample: string;
  onChange: (slug: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = FONTS.find((f) => f.slug === value) ?? FONTS[0];

  const group = (category: FontFace["category"], title: string) => (
    <div>
      <div className="px-1 pb-1.5 pt-2 text-[10.5px] font-bold uppercase tracking-[0.1em] text-label">
        {title}
      </div>
      {FONTS.filter((f) => f.category === category).map((f) => (
        <button
          key={f.slug}
          type="button"
          onClick={() => {
            onChange(f.slug);
            setOpen(false);
          }}
          className={`flex w-full items-baseline justify-between gap-3 rounded-[var(--radius-sm)] px-2.5 py-2 text-left transition-colors ${
            f.slug === value ? "bg-accent-subtle" : "hover:bg-page"
          }`}
        >
          <span className="text-[17px] text-ink" style={{ fontFamily: f.stack }}>
            {sample}
          </span>
          <span className="flex-none text-[11px] font-semibold text-muted">{f.name}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex-1">
      <span className="text-xs font-semibold text-muted">{label}</span>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="mt-1.5 flex w-full items-center justify-between gap-2 rounded-[var(--radius-sm)] border-[1.5px] border-border bg-surface px-3 py-2.5 text-left"
      >
        <span className="truncate text-[15px] text-ink" style={{ fontFamily: selected.stack }}>
          {selected.name}
        </span>
        <span className="flex-none text-[10px] text-muted">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="mt-1.5 max-h-72 overflow-y-auto rounded-[var(--radius-sm)] border-[1.5px] border-border bg-surface p-1.5 shadow-[0_10px_30px_rgba(23,36,46,0.10)]">
          {group("sans", "Sans-serif")}
          {group("serif", "Serif")}
        </div>
      )}
    </div>
  );
}
