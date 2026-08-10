"use client";

import { useActionState, useState } from "react";
import { createPropertyAction } from "@/lib/dashboard/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Field } from "@/components/ui/Field";

export function NewPropertyButton({ subtle = false }: { subtle?: boolean }) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(createPropertyAction, {});

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
        New property
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/40 p-4 sm:px-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-full w-full max-w-md overflow-y-auto rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface p-5 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-extrabold text-ink">New property</h2>
            <p className="mt-1 text-[13px] text-body">
              We&apos;ll set up an empty guide and a magic link you can fill in.
            </p>
            <form action={action} className="mt-4 flex flex-col gap-1">
              <Field label="Property name" name="name" placeholder="e.g. Aspects Court" required />
              <Field
                label="Address"
                name="address"
                placeholder="e.g. 1-bed apartment · Slough SL1 2EZ"
              />
              {state.error && (
                <p className="mt-2 rounded-[var(--radius-sm)] border-[1.5px] border-danger-ring bg-danger-subtle px-3.5 py-2.5 text-[13px] text-danger">
                  {state.error}
                </p>
              )}
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-[var(--radius-pill)] px-4 py-2.5 text-sm font-bold text-body"
                >
                  Cancel
                </button>
                <SubmitButton pendingLabel="Creating…">Create property</SubmitButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
