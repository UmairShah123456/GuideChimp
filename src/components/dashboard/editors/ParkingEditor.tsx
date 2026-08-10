"use client";

import { useState } from "react";
import { EditorShell, EditorGroup } from "./EditorShell";
import { EditorField, TextInput, TextArea, RepeatItem, AddButton } from "./ui";
import { VideoSourceField } from "./VideoSourceField";
import { MediaUploader } from "@/components/dashboard/MediaUploader";
import { ParkingSection } from "@/components/guest/sections/ParkingSection";
import { saveSectionContent } from "@/lib/dashboard/section-actions";
import type { ParkingContent, ParkingStep } from "@/lib/guide/types";
import type { Branding } from "@/lib/branding/vars";

/** Two-option pill selector. Clicking the active option again clears it. */
function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T | undefined;
  options: { value: T; label: string }[];
  onChange: (v: T | undefined) => void;
}) {
  return (
    <div className="flex gap-2">
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(active ? undefined : o.value)}
            className={`flex-1 rounded-[var(--radius-pill)] border-[1.5px] px-3 py-2 text-[13px] font-bold transition-colors ${
              active ? "border-accent bg-accent-subtle text-accent" : "border-border text-body hover:bg-page"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function ParkingEditor({
  propertyId,
  guideId,
  branding,
  heading,
  initial,
}: {
  propertyId: string;
  guideId: string;
  branding: Branding;
  heading: string;
  initial: ParkingContent;
}) {
  const [c, setC] = useState<ParkingContent>({ steps: [], ...initial });
  const steps = c.steps ?? [];

  const set = (patch: Partial<ParkingContent>) => setC((p) => ({ ...p, ...patch }));
  const setStep = (i: number, patch: Partial<ParkingStep>) =>
    set({ steps: steps.map((s, j) => (j === i ? { ...s, ...patch } : s)) });

  return (
    <EditorShell
      propertyId={propertyId}
      guideId={guideId}
      title={heading}
      branding={branding}
      onSave={() => saveSectionContent(propertyId, guideId, "parking", c)}
      preview={<ParkingSection heading={heading} parking={c} />}
      form={
        <>
          <EditorGroup title="Parking type">
            <p className="text-[13px] text-body">
              Shown as quick tags at the top of the parking screen. Tap a selected
              option again to clear it.
            </p>
            <EditorField label="Cost">
              <Segmented
                value={c.cost}
                onChange={(v) => set({ cost: v })}
                options={[
                  { value: "free", label: "Free parking" },
                  { value: "paid", label: "Paid parking" },
                ]}
              />
            </EditorField>
            <EditorField label="Location">
              <Segmented
                value={c.location}
                onChange={(v) => set({ location: v })}
                options={[
                  { value: "on_site", label: "On-site" },
                  { value: "off_site", label: "Off-site" },
                ]}
              />
            </EditorField>
          </EditorGroup>

          <EditorGroup title="Parking">
            <EditorField label="Car park name">
              <TextInput value={c.lotName ?? ""} onChange={(v) => set({ lotName: v })} placeholder="Underground car park" />
            </EditorField>
            <EditorField label="Detail">
              <TextInput value={c.lotDetail ?? ""} onChange={(v) => set({ lotDetail: v })} placeholder="Entrance on Hencroft St · 2.1m height limit" />
            </EditorField>
            <EditorField label="Directions URL" hint="Google/Apple Maps link for the 'Directions' button.">
              <TextInput value={c.directionsUrl ?? ""} onChange={(v) => set({ directionsUrl: v })} placeholder="https://maps.google.com/…" />
            </EditorField>
          </EditorGroup>

          <EditorGroup title="Photo (optional)">
            <EditorField label="Parking photo" hint="A main photo of the parking area, shown at the top.">
              <MediaUploader
                pathPrefix={`${propertyId}/parking`}
                accept="image/*"
                kind="image"
                value={c.photoUrl ?? ""}
                onUploaded={(url) => set({ photoUrl: url })}
                label="Upload photo"
              />
            </EditorField>
            <TextInput
              value={c.photoCaption ?? ""}
              onChange={(v) => set({ photoCaption: v })}
              placeholder="Photo caption (optional)"
            />
          </EditorGroup>

          <EditorGroup title="Parking steps">
            <p className="text-[13px] text-body">
              Walk guests through parking, step by step. Add a photo to any step to
              make it obvious.
            </p>
            {steps.map((s, i) => (
              <RepeatItem key={i} index={i} onRemove={() => set({ steps: steps.filter((_, j) => j !== i) })}>
                <TextInput value={s.title} onChange={(v) => setStep(i, { title: v })} placeholder="Step title (e.g. Pull into bay 12)" />
                <TextArea value={s.body ?? ""} onChange={(v) => setStep(i, { body: v })} placeholder="What the guest does" />
                <EditorField label="Photo" hint="Optional — shown under the step.">
                  <MediaUploader
                    pathPrefix={`${propertyId}/parking`}
                    accept="image/*"
                    kind="image"
                    value={s.photoUrl ?? ""}
                    onUploaded={(url) => setStep(i, { photoUrl: url })}
                    label="Upload photo"
                  />
                </EditorField>
                <TextInput
                  value={s.photoCaption ?? ""}
                  onChange={(v) => setStep(i, { photoCaption: v })}
                  placeholder="Photo caption (optional)"
                />
              </RepeatItem>
            ))}
            <AddButton onClick={() => set({ steps: [...steps, { title: "" }] })}>
              Add step
            </AddButton>
          </EditorGroup>

          <EditorGroup title="Video guide (optional)">
            <p className="text-[13px] text-body">
              A short clip of the drive in or where to park, shown at the top of the screen.
            </p>
            <VideoSourceField
              propertyId={propertyId}
              value={c.videoUrl ?? ""}
              onChange={(url) => set({ videoUrl: url })}
              pathPrefix={`${propertyId}/parking`}
            />
          </EditorGroup>
        </>
      }
    />
  );
}
