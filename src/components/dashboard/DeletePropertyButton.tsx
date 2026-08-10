"use client";

import { useState } from "react";
import { deletePropertyAction } from "@/lib/dashboard/actions";

export function DeletePropertyButton({
  propertyId,
  propertyName,
}: {
  propertyId: string;
  propertyName: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-[var(--radius-pill)] border-[1.5px] border-border px-4 py-2 text-[13px] font-bold text-body hover:border-danger-ring hover:text-danger"
      >
        Delete
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/40 p-4 sm:px-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-full w-full max-w-sm overflow-y-auto rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface p-5 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-extrabold text-ink">Delete this property?</h2>
            <p className="mt-1.5 text-[13px] text-body">
              <strong className="text-ink">{propertyName}</strong> and its guide, media
              and magic link will be permanently removed. This can&apos;t be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-[var(--radius-pill)] px-4 py-2.5 text-sm font-bold text-body"
              >
                Cancel
              </button>
              <form action={deletePropertyAction}>
                <input type="hidden" name="id" value={propertyId} />
                <button
                  type="submit"
                  className="rounded-[var(--radius-pill)] bg-danger px-4 py-2.5 text-sm font-bold text-white"
                >
                  Delete property
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
