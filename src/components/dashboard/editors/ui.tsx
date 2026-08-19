"use client";

import type { ReactNode } from "react";
import { DIAL_CODES, dialCodeLabel, dialCodeOf, dialValue, flagEmoji } from "@/lib/phone";

/* 16px on small screens keeps iOS Safari from zooming in on focus. */
export const inputBase =
  "w-full rounded-[var(--radius-sm)] border-[1.5px] border-border bg-surface px-3 py-2 text-base text-ink outline-none transition-colors focus:border-accent placeholder:text-muted sm:text-sm";

export function EditorField({
  label,
  hint,
  children,
}: {
  label?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && <span className="text-[13px] font-semibold text-ink">{label}</span>}
      {children}
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={inputBase}
    />
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 2,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      className={inputBase}
    />
  );
}

export function Select({
  value,
  onChange,
  options,
  placeholder = "—",
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={inputBase}>
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

/** Resolve a stored dial value ("GB|+44" or a legacy bare "+44") to its country. */
export function findDialCode(value: string | undefined) {
  return (
    DIAL_CODES.find((d) => dialValue(d) === value) ??
    DIAL_CODES.find((d) => d.code === dialCodeOf(value))
  );
}

/**
 * Compact dial-code picker that sits inside a phone field: the closed control
 * shows just "🇬🇧 +44" while the dropdown lists full country names. A native
 * <select> is stretched invisibly over the label so mobile still gets its own
 * picker UI and keyboard focus behaves normally.
 */
export function InlineDialCodeSelect({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  const selected = findDialCode(value);

  return (
    <span className="relative flex items-center whitespace-nowrap border-r-[1.5px] border-border pl-3 pr-2 text-sm font-semibold text-muted">
      {selected ? `${flagEmoji(selected.iso)} ${selected.code}` : dialCodeOf(value) || "+"}
      <span aria-hidden className="pl-1 text-[10px]">▾</span>
      <select
        aria-label={`Country code for ${label}`}
        value={selected ? dialValue(selected) : ""}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        {DIAL_CODES.map((d) => (
          <option key={dialValue(d)} value={dialValue(d)}>
            {dialCodeLabel(d)}
          </option>
        ))}
      </select>
    </span>
  );
}

/** A bordered block wrapping one item in a repeatable list, with a remove control. */
export function RepeatItem({
  index,
  onRemove,
  children,
}: {
  index: number;
  onRemove: () => void;
  children: ReactNode;
}) {
  return (
    <div className="relative rounded-[var(--radius-card)] border-[1.5px] border-border bg-page p-3.5">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
          #{index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs font-semibold text-muted hover:text-danger"
        >
          Remove
        </button>
      </div>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

export function AddButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-[var(--radius-sm)] border-[1.5px] border-dashed border-border px-3 py-2.5 text-[13px] font-bold text-accent hover:bg-accent-subtle"
    >
      + {children}
    </button>
  );
}
