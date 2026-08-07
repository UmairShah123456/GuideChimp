"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteGuide } from "@/lib/dashboard/guide-actions";

/**
 * Deletes one guide and everything under it. Other guides on the same property
 * are untouched, which the copy says explicitly — the whole point of the guide
 * layer is that these are independent.
 */
export function DeleteGuideButton({
  propertyId,
  guideId,
  guideName,
}: {
  propertyId: string;
  guideId: string;
  guideName: string;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-[var(--radius-pill)] border-[1.5px] border-border px-4 py-2 text-[13px] font-bold text-body hover:border-danger-ring hover:text-danger"
      >
        Delete guide
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-extrabold text-ink">Delete this guide?</h2>
            <p className="mt-1.5 text-[13px] text-body">
              <strong className="text-ink">{guideName}</strong>, its sections and its
              magic link will be permanently removed. Other guides on this property
              are not affected. This can&apos;t be undone.
            </p>
            {error && (
              <p className="mt-3 rounded-[var(--radius-sm)] border-[1.5px] border-danger-ring bg-danger-subtle px-3.5 py-2.5 text-[13px] text-danger">
                {error}
              </p>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-[var(--radius-pill)] px-4 py-2.5 text-sm font-bold text-body"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    const res = await deleteGuide(propertyId, guideId);
                    if (res.error) {
                      setError(res.error);
                      return;
                    }
                    router.push(`/properties/${propertyId}`);
                  })
                }
                className="rounded-[var(--radius-pill)] bg-danger px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
              >
                {pending ? "Deleting…" : "Delete guide"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
