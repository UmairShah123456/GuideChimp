"use client";

import { useActionState, useState } from "react";
import { createPropertyAction } from "@/lib/dashboard/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Field } from "@/components/ui/Field";
import { MediaUploader } from "./MediaUploader";

export function NewPropertyButton({ subtle = false }: { subtle?: boolean }) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(createPropertyAction, {});
  // The property's id is chosen here, before it exists, so an uploaded photo can
  // be filed under `{propertyId}/` like every other file the property owns —
  // deleting the property later sweeps that folder. Regenerated each time the
  // dialog opens so two properties never share one.
  const [propertyId, setPropertyId] = useState(() => crypto.randomUUID());
  const [heroUrl, setHeroUrl] = useState("");

  function openDialog() {
    setPropertyId(crypto.randomUUID());
    setHeroUrl("");
    setOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
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
              We&apos;ll set up an empty guide and a magic link you can fill in. The address
              and everything else comes later, in the property&apos;s settings.
            </p>
            {/* Name, and a photo if they have one to hand. The address isn't
                asked for here — it's nullable in the database and editable on the
                settings page, so it was only a field between the host and their
                guide. */}
            <form action={action} className="mt-4 flex flex-col gap-1">
              <input type="hidden" name="id" value={propertyId} />
              <input type="hidden" name="hero_image_url" value={heroUrl} />

              <Field label="Property name" name="name" placeholder="e.g. Aspects Court" required />

              <div className="mt-3">
                <span className="text-[13px] font-semibold text-ink">
                  Photo <span className="font-medium text-muted">(optional)</span>
                </span>
                <div className="mt-1.5">
                  <MediaUploader
                    pathPrefix={propertyId}
                    value={heroUrl}
                    onUploaded={setHeroUrl}
                    label="Add photo"
                  />
                </div>
              </div>
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
