"use client";

import { useState } from "react";
import { EditorShell, EditorGroup } from "./EditorShell";
import { EditorField, TextInput, TextArea, AddButton } from "./ui";
import { VideoSourceField } from "./VideoSourceField";
import { CheckOutSection } from "@/components/guest/sections/CheckOutSection";
import { saveSectionContent } from "@/lib/dashboard/section-actions";
import type { CheckOutContent } from "@/lib/guide/types";
import type { Branding } from "@/lib/branding/vars";

export function CheckOutEditor({
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
  initial: CheckOutContent;
}) {
  const [c, setC] = useState<CheckOutContent>({ items: [], ...initial });
  const items = c.items ?? [];
  const set = (patch: Partial<CheckOutContent>) => setC((p) => ({ ...p, ...patch }));
  const setItem = (i: number, v: string) =>
    set({ items: items.map((it, j) => (j === i ? v : it)) });

  return (
    <EditorShell
      propertyId={propertyId}
      guideId={guideId}
      title={heading}
      branding={branding}
      onSave={() => saveSectionContent(propertyId, guideId, "check_out", c)}
      preview={<CheckOutSection heading={heading} checkout={c} />}
      form={
        <>
          <EditorGroup title="Checklist">
            {items.map((it, i) => (
              <div key={i} className="flex gap-2">
                <TextInput value={it} onChange={(v) => setItem(i, v)} placeholder="Checklist item" />
                <button
                  type="button"
                  onClick={() => set({ items: items.filter((_, j) => j !== i) })}
                  className="rounded-[var(--radius-sm)] border-[1.5px] border-border px-3 text-xs font-semibold text-muted hover:text-danger"
                >
                  ✕
                </button>
              </div>
            ))}
            <AddButton onClick={() => set({ items: [...items, ""] })}>Add checklist item</AddButton>
          </EditorGroup>

          <EditorGroup title="Video guide (optional)">
            <p className="text-[13px] text-body">
              A short clip for departing guests, shown at the top of the screen.
            </p>
            <VideoSourceField
              propertyId={propertyId}
              value={c.videoUrl ?? ""}
              onChange={(url) => set({ videoUrl: url })}
              pathPrefix={`${propertyId}/checkout`}
            />
          </EditorGroup>

          <EditorGroup title="Note">
            <EditorField label="Info note" hint="Optional soft callout below the checklist.">
              <TextArea value={c.note ?? ""} onChange={(v) => set({ note: v })} placeholder="Late checkout? Message me…" />
            </EditorField>
          </EditorGroup>
        </>
      }
    />
  );
}
