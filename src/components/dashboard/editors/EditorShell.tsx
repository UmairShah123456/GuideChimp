"use client";

import Link from "next/link";
import { useState, useTransition, type ReactNode } from "react";
import type { FormState } from "@/lib/forms";
import { ChevronLeft } from "@/components/guest/icons";
import { PhonePreview } from "@/components/dashboard/PhonePreview";
import { guideBasePath } from "@/lib/dashboard/paths";

/**
 * Two-pane guide editor: a scrollable form on the left, a sticky live phone
 * preview on the right, and a save bar wired to a server action.
 */
export function EditorShell({
  propertyId,
  guideId,
  title,
  hue,
  onSave,
  form,
  preview,
}: {
  propertyId: string | null;
  guideId: string;
  title: string;
  hue: number;
  onSave: () => Promise<FormState>;
  form: ReactNode;
  preview: ReactNode;
}) {
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState<FormState>({});

  function save() {
    startTransition(async () => setState(await onSave()));
  }

  return (
    <>
      <div className="sticky top-0 z-10 border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-8 py-4">
          <div className="min-w-0">
            <Link
              href={guideBasePath(propertyId, guideId)}
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-muted hover:text-ink"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to guide
            </Link>
            <h1 className="mt-0.5 text-lg font-extrabold text-ink">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            {state.ok && <span className="text-[13px] font-semibold text-success">Saved ✓</span>}
            {state.error && (
              <span className="max-w-xs truncate text-[13px] font-semibold text-danger">
                {state.error}
              </span>
            )}
            <button
              type="button"
              onClick={save}
              disabled={pending}
              className="rounded-[var(--radius-pill)] bg-accent px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-8 py-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="flex flex-col gap-5">{form}</div>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <PhonePreview hue={hue}>{preview}</PhonePreview>
        </div>
      </div>
    </>
  );
}

/** Groups related fields under a small heading in the form pane. */
export function EditorGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface p-5">
      <h2 className="mb-3 text-sm font-extrabold text-ink">{title}</h2>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}
