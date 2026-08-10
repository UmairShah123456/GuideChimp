"use client";

import { useState, useTransition } from "react";
import { MediaUploader } from "./MediaUploader";
import { setPropertyHeroImage } from "@/lib/dashboard/actions";

/**
 * The property's photo, on the guide page beneath the magic link.
 *
 * Saves the moment a photo is chosen or removed, rather than waiting on a Save
 * button. There isn't one on this page, and the uploader shows the image as soon
 * as the file reaches storage — so anything that needed a second confirming step
 * would look done while the property still had no photo.
 *
 * The photo belongs to the property, not this guide, which the copy says: every
 * guide on the property leads with it.
 */
export function PropertyPhotoCard({
  propertyId,
  propertyName,
  initialUrl,
}: {
  propertyId: string;
  propertyName: string;
  initialUrl: string | null;
}) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [state, setState] = useState<"idle" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function persist(next: string) {
    // Optimistic: the file is already in storage and the preview is showing it,
    // so the only thing in flight is the row update.
    setUrl(next);
    setState("idle");
    startTransition(async () => {
      const res = await setPropertyHeroImage(propertyId, next || null);
      if (res.error) {
        setState("error");
        setMessage(res.error);
        return;
      }
      setState("saved");
      setMessage("");
    });
  }

  return (
    <section className="rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface p-4 sm:p-5">
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-extrabold uppercase tracking-[0.08em] text-muted">
          Property photo
        </h2>
        {pending && <span className="text-[12.5px] font-semibold text-muted">Saving…</span>}
        {!pending && state === "saved" && (
          <span className="text-[12.5px] font-semibold text-success">Saved ✓</span>
        )}
      </div>
      <p className="mb-3 text-[12.5px] text-muted">
        Shown to guests when they open any guide for {propertyName}.
      </p>

      <MediaUploader pathPrefix={propertyId} value={url} onUploaded={persist} label="Add photo" />

      {state === "error" && (
        <p className="mt-2 text-[12.5px] font-semibold text-danger">{message}</p>
      )}
    </section>
  );
}
