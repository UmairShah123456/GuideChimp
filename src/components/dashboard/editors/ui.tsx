"use client";

import type { ReactNode } from "react";
import { DIAL_CODES } from "@/lib/phone";

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

/** Country dial-code picker (e.g. "United Kingdom +44"). Stores the code ("+44"). */
export function CountrySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={inputBase}>
      {DIAL_CODES.map((d) => (
        <option key={d.code} value={d.code}>
          {d.country} ({d.code})
        </option>
      ))}
    </select>
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
