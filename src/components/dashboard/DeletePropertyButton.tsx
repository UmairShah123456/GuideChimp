"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deletePropertyAction } from "@/lib/dashboard/actions";
import { TrashIcon } from "@/components/guest/icons";

/**
 * Deletes a property and everything on it. Typing the name is deliberate
 * friction: unlike a guide, this takes every guide on the property with it, and
 * there is no undo.
 */
export function DeletePropertyButton({
  propertyId,
  propertyName,
}: {
  propertyId: string;
  propertyName: string;
}) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const confirmed = confirmText.trim().toLowerCase() === propertyName.trim().toLowerCase();

  function close() {
    setOpen(false);
    setConfirmText("");
    setError("");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border-[1.5px] border-danger-ring bg-danger-subtle px-4 py-2.5 text-[13px] font-bold text-danger transition-colors hover:bg-danger hover:text-white"
      >
        <TrashIcon className="h-4 w-4 flex-none" />
        Delete property
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/40 p-4 sm:px-6"
          onClick={close}
        >
          <div
            className="max-h-full w-full max-w-sm overflow-y-auto rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface p-5 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-extrabold text-ink">Delete this property?</h2>
            <p className="mt-1.5 text-[13px] text-body">
              <strong className="text-ink">{propertyName}</strong> will be permanently
              removed, along with every guide on it, their sections, uploaded photos and
              videos, and their magic links — any link you&apos;ve already shared with a
              guest will stop working. This can&apos;t be undone.
            </p>
            <label className="mt-4 flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-ink">
                Type <strong>{propertyName}</strong> to confirm
              </span>
              <input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                autoFocus
                className="w-full rounded-[var(--radius-sm)] border-[1.5px] border-border bg-surface px-3 py-2 text-base text-ink outline-none transition-colors focus:border-danger-ring placeholder:text-muted sm:text-sm"
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
                disabled={pending || !confirmed}
                onClick={() =>
                  startTransition(async () => {
                    const res = await deletePropertyAction(propertyId);
                    if (res.error) {
                      setError(res.error);
                      return;
                    }
                    router.push("/dashboard");
                  })
                }
                className="rounded-[var(--radius-pill)] bg-danger px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
              >
                {pending ? "Deleting…" : "Delete property"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
