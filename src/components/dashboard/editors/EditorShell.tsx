"use client";

import Link from "next/link";
import { useState, useTransition, type ReactNode } from "react";
import type { FormState } from "@/lib/forms";
import { ChevronLeft } from "@/components/guest/icons";
import { PhonePreview } from "@/components/dashboard/PhonePreview";
import { guideBasePath } from "@/lib/dashboard/paths";
import type { Branding } from "@/lib/branding/vars";

/**
 * Two-pane guide editor: a scrollable form on the left, a sticky live phone
 * preview on the right, and a save bar wired to a server action.
 *
 * Below `lg` there is no room for two panes, so the form takes the full width
 * and the preview collapses behind a toggle — a phone frame rendered on a phone
 * is mostly wasted space while you're typing, but still worth a look before you
 * save.
 */
export function EditorShell({
  propertyId,
  guideId,
  title,
  branding,
  onSave,
  form,
  preview,
}: {
  propertyId: string | null;
  guideId: string;
  title: string;
  branding: Branding;
  onSave: () => Promise<FormState>;
  form: ReactNode;
  preview: ReactNode;
}) {
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState<FormState>({});
  const [showPreview, setShowPreview] = useState(false);

  function save() {
    startTransition(async () => setState(await onSave()));
  }

  return (
    <>
      {/* Offset by the mobile top bar's height so both stay visible when stuck. */}
      <div className="sticky top-14 z-30 border-b border-border bg-surface lg:top-0 lg:z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8 lg:py-4">
          <div className="min-w-0">
            <Link
              href={guideBasePath(propertyId, guideId)}
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-muted hover:text-ink"
            >
              <ChevronLeft className="h-4 w-4 flex-none" />
              Back to guide
            </Link>
            <h1 className="mt-0.5 truncate text-base font-extrabold text-ink lg:text-lg">
              {title}
            </h1>
          </div>
          <div className="flex flex-none items-center gap-3">
            {state.ok && <span className="text-[13px] font-semibold text-success">Saved ✓</span>}
            {state.error && (
              <span className="hidden max-w-xs truncate text-[13px] font-semibold text-danger sm:inline">
                {state.error}
              </span>
            )}
            <button
              type="button"
              onClick={save}
              disabled={pending}
              className="rounded-[var(--radius-pill)] bg-brand px-4 py-2.5 text-sm font-bold text-brand-contrast disabled:opacity-60 lg:px-5"
            >
              {pending ? "Saving…" : "Save"}
              <span className="hidden lg:inline"> changes</span>
            </button>
          </div>
        </div>
        {/* On a phone the error has nowhere to sit beside the button. */}
        {state.error && (
          <p className="border-t border-border px-4 py-2 text-[13px] font-semibold text-danger sm:hidden">
            {state.error}
          </p>
        )}
      </div>

      {/* Flex below `lg`: a single grid column is floored at its content's
          min-content width, which lets a long unbreakable string (a link, a
          filename) push the whole page sideways. */}
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-8 lg:px-8 lg:py-8">
        <div className="flex flex-col gap-5">
          {form}

          <button
            type="button"
            onClick={() => setShowPreview((s) => !s)}
            aria-expanded={showPreview}
            className="rounded-[var(--radius-pill)] border-[1.5px] border-border bg-surface px-4 py-2.5 text-[13px] font-bold text-ink lg:hidden"
          >
            {showPreview ? "Hide preview" : "Show live preview"}
          </button>
        </div>
        <div
          className={`lg:sticky lg:top-24 lg:block lg:self-start ${
            showPreview ? "" : "hidden"
          }`}
        >
          <PhonePreview branding={branding}>{preview}</PhonePreview>
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
    <section className="rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface p-4 sm:p-5">
      <h2 className="mb-3 text-sm font-extrabold text-ink">{title}</h2>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}
