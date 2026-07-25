"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ChevronRight } from "@/components/guest/icons";
import {
  createCustomSection,
  renameSection,
  renameCustomSection,
  setSectionEnabled,
  setCustomSectionEnabled,
} from "@/lib/dashboard/custom-section-actions";
import type { GuideSectionType } from "@/lib/guide/types";

export interface SectionRow {
  type: GuideSectionType;
  slug: string;
  title: string; // resolved (override or default)
  blurb: string; // resolved (override or default)
  defaultTitle: string;
  defaultBlurb: string;
  overrideTitle: string;
  overrideSubtitle: string;
  enabled: boolean; // whether the section shows to guests
}

export interface CustomRow {
  id: string;
  title: string;
  enabled: boolean;
}

export function SectionList({
  propertyId,
  rows,
  custom,
}: {
  propertyId: string;
  rows: SectionRow[];
  custom: CustomRow[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<GuideSectionType | null>(null);
  const [adding, setAdding] = useState(false);
  const [renamingCustom, setRenamingCustom] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <section>
      <h2 className="text-sm font-extrabold uppercase tracking-[0.08em] text-muted">
        Guide sections
      </h2>
      <div className="mt-3 divide-y divide-border overflow-hidden rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface">
        {rows.map((s) =>
          editing === s.type ? (
            <RenamePanel
              key={s.type}
              row={s}
              pending={pending}
              onCancel={() => setEditing(null)}
              onSave={(title, subtitle) =>
                startTransition(async () => {
                  await renameSection(propertyId, s.type, title, subtitle);
                  setEditing(null);
                  router.refresh();
                })
              }
            />
          ) : (
            <div
              key={s.type}
              onClick={() => router.push(`/properties/${propertyId}/edit/${s.slug}`)}
              className="flex cursor-pointer items-center gap-3 px-4 py-3.5 hover:bg-page"
            >
              <Toggle
                on={s.enabled}
                disabled={pending}
                label={`Show ${s.title} to guests`}
                onToggle={() =>
                  startTransition(async () => {
                    await setSectionEnabled(propertyId, s.type, !s.enabled);
                    router.refresh();
                  })
                }
              />
              <div className={`min-w-0 flex-1 ${s.enabled ? "" : "opacity-45"}`}>
                <div className="text-[15px] font-bold text-ink">{s.title}</div>
                <div className="text-[12.5px] text-muted">{s.blurb}</div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditing(s.type);
                }}
                className="text-[12px] font-semibold text-muted hover:text-ink"
              >
                Rename
              </button>
              <ChevronRight className="h-4 w-4 flex-none text-muted" />
            </div>
          ),
        )}
      </div>

      {/* Custom sections */}
      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-sm font-extrabold uppercase tracking-[0.08em] text-muted">
          Custom sections
        </h2>
        <button
          type="button"
          disabled={pending || adding}
          onClick={() => setAdding(true)}
          className="rounded-[var(--radius-pill)] bg-accent px-3.5 py-1.5 text-[12.5px] font-bold text-white disabled:opacity-60"
        >
          + Add section
        </button>
      </div>
      <p className="mt-1.5 text-[12.5px] text-muted">
        Your own sections. Each shows as a tile on the guest home screen.
      </p>

      {adding && (
        <div className="mt-3 overflow-hidden rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface">
          <NamePanel
            heading="Name your section"
            placeholder="e.g. Pool access"
            confirmLabel="Create"
            pending={pending}
            onCancel={() => setAdding(false)}
            onSave={(name) =>
              startTransition(async () => {
                const res = await createCustomSection(propertyId, name);
                if (res.id) router.push(`/properties/${propertyId}/edit/custom/${res.id}`);
                else setAdding(false);
              })
            }
          />
        </div>
      )}

      {custom.length > 0 && (
        <div className="mt-3 divide-y divide-border overflow-hidden rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface">
          {custom.map((c) =>
            renamingCustom === c.id ? (
              <NamePanel
                key={c.id}
                heading="Rename section"
                placeholder="Section name"
                confirmLabel="Save"
                initial={c.title}
                pending={pending}
                onCancel={() => setRenamingCustom(null)}
                onSave={(name) =>
                  startTransition(async () => {
                    await renameCustomSection(propertyId, c.id, name);
                    setRenamingCustom(null);
                    router.refresh();
                  })
                }
              />
            ) : (
              <div
                key={c.id}
                onClick={() => router.push(`/properties/${propertyId}/edit/custom/${c.id}`)}
                className="flex cursor-pointer items-center gap-3 px-4 py-3.5 hover:bg-page"
              >
                <Toggle
                  on={c.enabled}
                  disabled={pending}
                  label={`Show ${c.title || "this section"} to guests`}
                  onToggle={() =>
                    startTransition(async () => {
                      await setCustomSectionEnabled(propertyId, c.id, !c.enabled);
                      router.refresh();
                    })
                  }
                />
                <div className={`min-w-0 flex-1 ${c.enabled ? "" : "opacity-45"}`}>
                  <div className="text-[15px] font-bold text-ink">
                    {c.title || "Untitled section"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setRenamingCustom(c.id);
                  }}
                  className="text-[12px] font-semibold text-muted hover:text-ink"
                >
                  Rename
                </button>
                <ChevronRight className="h-4 w-4 flex-none text-muted" />
              </div>
            ),
          )}
        </div>
      )}
    </section>
  );
}

/** Inline single-field panel for naming or renaming a custom section. */
function NamePanel({
  heading,
  placeholder,
  confirmLabel,
  initial = "",
  pending,
  onSave,
  onCancel,
}: {
  heading: string;
  placeholder: string;
  confirmLabel: string;
  initial?: string;
  pending: boolean;
  onSave: (name: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial);
  const trimmed = name.trim();
  const submit = () => {
    if (trimmed) onSave(trimmed);
  };

  return (
    <div className="flex flex-col gap-2.5 bg-page px-4 py-3.5">
      <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">{heading}</div>
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") onCancel();
        }}
        placeholder={placeholder}
        className="w-full rounded-[var(--radius-sm)] border-[1.5px] border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent placeholder:text-muted"
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={pending || !trimmed}
          onClick={submit}
          className="rounded-[var(--radius-pill)] bg-accent px-4 py-1.5 text-[12.5px] font-bold text-white disabled:opacity-60"
        >
          {confirmLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-[12.5px] font-semibold text-muted hover:text-ink"
        >
          Cancel
        </button>
        <span className="ml-auto text-[11.5px] text-muted">Guests see this name.</span>
      </div>
    </div>
  );
}

/** A compact on/off switch. Stops propagation so it doesn't open the editor. */
function Toggle({
  on,
  disabled,
  label,
  onToggle,
}: {
  on: boolean;
  disabled: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`relative flex h-5 w-9 flex-none items-center rounded-full transition-colors disabled:opacity-60 ${
        on ? "bg-accent" : "bg-nav-idle"
      }`}
    >
      <span
        className={`absolute h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
          on ? "translate-x-[18px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function RenamePanel({
  row,
  pending,
  onSave,
  onCancel,
}: {
  row: SectionRow;
  pending: boolean;
  onSave: (title: string, subtitle: string) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(row.overrideTitle);
  const [subtitle, setSubtitle] = useState(row.overrideSubtitle);
  const inputCls =
    "w-full rounded-[var(--radius-sm)] border-[1.5px] border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent placeholder:text-muted";

  return (
    <div className="flex flex-col gap-2.5 bg-page px-4 py-3.5">
      <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
        Rename section
      </div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={row.defaultTitle}
        className={inputCls}
      />
      <input
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
        placeholder={row.defaultBlurb}
        className={inputCls}
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => onSave(title, subtitle)}
          className="rounded-[var(--radius-pill)] bg-accent px-4 py-1.5 text-[12.5px] font-bold text-white disabled:opacity-60"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-[12.5px] font-semibold text-muted hover:text-ink"
        >
          Cancel
        </button>
        <span className="ml-auto text-[11.5px] text-muted">
          Guests see this name too. Leave blank for the default.
        </span>
      </div>
    </div>
  );
}
