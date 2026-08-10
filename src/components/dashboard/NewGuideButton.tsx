"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createGuide } from "@/lib/dashboard/guide-actions";
import { GUIDE_PRESETS, BLANK_KIND } from "@/lib/guide/presets";
import { guideBasePath } from "@/lib/dashboard/paths";

/**
 * Creates a guide.
 *
 * For a property, the host picks a preset — that decides the starting sections
 * (guest guides get the eight built-ins; the rest start blank).
 *
 * For a company guide there is nothing to pick: the presets describe audiences
 * for a place, and "Guest guide" is meaningless without one. Those always start
 * blank, so the dialog asks for a name and nothing else.
 */
export function NewGuideButton({
  accountId,
  propertyId = null,
  subtle = false,
}: {
  accountId: string;
  /** Null creates an account-level guide — a company process, not tied to a place. */
  propertyId?: string | null;
  subtle?: boolean;
}) {
  const isCompanyGuide = !propertyId;
  const [open, setOpen] = useState(false);
  // Company guides always start blank; property guides default to Cleaner,
  // since the guest guide already exists by the time you add a second.
  const [kind, setKind] = useState(
    isCompanyGuide ? BLANK_KIND : GUIDE_PRESETS[1].kind,
  );
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const preset = GUIDE_PRESETS.find((p) => p.kind === kind) ?? GUIDE_PRESETS[0];
  // A company guide has no preset label to fall back on, so it needs a name.
  const canSubmit = !pending && (!isCompanyGuide || name.trim().length > 0);

  function close() {
    setOpen(false);
    setError("");
  }

  function submit() {
    startTransition(async () => {
      setError("");
      const res = await createGuide(accountId, propertyId, name, kind);
      if (res.error || !res.id) {
        setError(res.error ?? "Could not create the guide.");
        return;
      }
      router.push(guideBasePath(propertyId, res.id));
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          subtle
            ? "rounded-[var(--radius-pill)] border-[1.5px] border-border bg-surface px-4 py-2.5 text-sm font-bold text-ink"
            : "rounded-[var(--radius-pill)] bg-brand px-4 py-2.5 text-sm font-bold text-brand-contrast"
        }
      >
        New guide
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-6"
          onClick={close}
        >
          <div
            className="w-full max-w-md rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-extrabold text-ink">
              {isCompanyGuide ? "New company guide" : "New guide"}
            </h2>
            <p className="mt-1 text-[13px] text-body">
              {isCompanyGuide
                ? "Name the process. You'll build it from your own sections and videos, and it gets its own shareable link."
                : "Each guide gets its own sections and its own shareable link."}
            </p>

            {!isCompanyGuide && (
            <div className="mt-4 flex flex-col gap-2">
              {GUIDE_PRESETS.map((p) => (
                <button
                  key={p.kind}
                  type="button"
                  onClick={() => setKind(p.kind)}
                  className={`flex items-start gap-3 rounded-[var(--radius-sm)] border-[1.5px] px-3.5 py-3 text-left ${
                    kind === p.kind
                      ? "border-accent bg-accent-subtle"
                      : "border-border bg-surface hover:bg-page"
                  }`}
                >
                  <span className="text-lg leading-none">{p.emoji}</span>
                  <span className="min-w-0">
                    <span className="block text-[14px] font-bold text-ink">{p.label}</span>
                    <span className="block text-[12.5px] text-muted">{p.blurb}</span>
                  </span>
                </button>
              ))}
            </div>
            )}

            <label className="mt-4 block">
              <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-muted">
                Name
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus={isCompanyGuide}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && canSubmit) submit();
                }}
                placeholder={
                  isCompanyGuide
                    ? "Example: How to check the cleaning schedule"
                    : preset.label
                }
                className="mt-1.5 w-full rounded-[var(--radius-sm)] border-[1.5px] border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent placeholder:text-muted"
              />
            </label>

            {error && (
              <p className="mt-3 rounded-[var(--radius-sm)] border-[1.5px] border-danger-ring bg-danger-subtle px-3.5 py-2.5 text-[13px] text-danger">
                {error}
              </p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={close}
                className="rounded-[var(--radius-pill)] px-4 py-2.5 text-sm font-bold text-body"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!canSubmit}
                onClick={submit}
                className="rounded-[var(--radius-pill)] bg-brand px-4 py-2.5 text-sm font-bold text-brand-contrast disabled:opacity-60"
              >
                {pending ? "Creating…" : "Create guide"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
