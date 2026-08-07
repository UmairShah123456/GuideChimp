"use client";

import { useState } from "react";
import { EditorShell, EditorGroup } from "./EditorShell";
import { EditorField, TextInput, TextArea, RepeatItem, AddButton, Select } from "./ui";
import { VideoSourceField } from "./VideoSourceField";
import { MediaUploader } from "@/components/dashboard/MediaUploader";
import { CheckInSection } from "@/components/guest/sections/CheckInSection";
import { saveSectionContent } from "@/lib/dashboard/section-actions";
import { timeChip, TIME_OPTIONS } from "@/lib/time";
import type { CheckInContent, CheckInStep } from "@/lib/guide/types";

export function CheckInEditor({
  propertyId,
  guideId,
  hue,
  heading,
  initial,
}: {
  propertyId: string;
  guideId: string;
  hue: number;
  heading: string;
  initial: CheckInContent;
}) {
  const [c, setC] = useState<CheckInContent>({ steps: [], ...initial });
  const steps = c.steps ?? [];
  const checkInHint = timeChip(c.checkInTime, "Guests see: Check-in from") ?? "Shown on the home screen";
  const checkoutHint = timeChip(c.checkoutTime, "Guests see: Checkout") ?? "Shown on the home screen";

  const set = (patch: Partial<CheckInContent>) => setC((p) => ({ ...p, ...patch }));
  const setStep = (i: number, patch: Partial<CheckInStep>) =>
    set({ steps: steps.map((s, j) => (j === i ? { ...s, ...patch } : s)) });

  return (
    <EditorShell
      propertyId={propertyId}
      guideId={guideId}
      title={heading}
      hue={hue}
      onSave={() => saveSectionContent(propertyId, guideId, "check_in", c)}
      preview={<CheckInSection heading={heading} checkIn={c} />}
      form={
        <>
          <EditorGroup title="Address">
            <EditorField label="Property address" hint="Shown on a map with a directions button for guests.">
              <TextInput
                value={c.address ?? ""}
                onChange={(v) => set({ address: v })}
                placeholder="12 Hencroft St, Slough SL1 1PP"
              />
            </EditorField>
          </EditorGroup>

          <EditorGroup title="Check-in & checkout times">
            <div className="grid grid-cols-2 gap-2.5">
              <EditorField label="Checkout time" hint={checkoutHint}>
                <Select
                  value={c.checkoutTime ?? ""}
                  onChange={(v) => set({ checkoutTime: v })}
                  options={TIME_OPTIONS}
                />
              </EditorField>
              <EditorField label="Check-in time" hint={checkInHint}>
                <Select
                  value={c.checkInTime ?? ""}
                  onChange={(v) => set({ checkInTime: v })}
                  options={TIME_OPTIONS}
                />
              </EditorField>
            </div>
          </EditorGroup>

          <EditorGroup title="Video guide (optional)">
            <p className="text-[13px] text-body">
              A short walkthrough of getting in, shown at the top of the screen.
            </p>
            <VideoSourceField
              propertyId={propertyId}
              value={c.videoUrl ?? ""}
              onChange={(url) => set({ videoUrl: url })}
              pathPrefix={`${propertyId}/checkin`}
            />
          </EditorGroup>

          <EditorGroup title="Arrival steps">
            {steps.map((s, i) => (
              <RepeatItem key={i} index={i} onRemove={() => set({ steps: steps.filter((_, j) => j !== i) })}>
                <TextInput value={s.title} onChange={(v) => setStep(i, { title: v })} placeholder="Step title" />
                <TextArea value={s.body} onChange={(v) => setStep(i, { body: v })} placeholder="What the guest does" />
                {s.code ? (
                  <div className="flex flex-col gap-2.5 rounded-[var(--radius-sm)] border-[1.5px] border-border bg-surface p-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
                        Code / key info
                      </span>
                      <button
                        type="button"
                        onClick={() => setStep(i, { code: undefined })}
                        className="text-xs font-semibold text-muted hover:text-danger"
                      >
                        Remove
                      </button>
                    </div>
                    <TextInput
                      value={s.code.value ?? ""}
                      onChange={(v) => setStep(i, { code: { label: s.code?.label ?? "", value: v } })}
                      placeholder="Code (e.g. 4821#)"
                    />
                  </div>
                ) : (
                  <AddButton onClick={() => setStep(i, { code: { label: "", value: "" } })}>
                    Add code / key info
                  </AddButton>
                )}
                <EditorField label="Photo" hint="Optional — shown under the step.">
                  <MediaUploader
                    pathPrefix={`${propertyId}/checkin`}
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
            <AddButton onClick={() => set({ steps: [...steps, { title: "", body: "" }] })}>
              Add step
            </AddButton>
          </EditorGroup>

          <EditorGroup title="Note">
            <EditorField label="Info note" hint="Shown as a soft callout at the bottom.">
              <TextArea value={c.note ?? ""} onChange={(v) => set({ note: v })} placeholder="Arriving early? Message me…" />
            </EditorField>
          </EditorGroup>
        </>
      }
    />
  );
}
