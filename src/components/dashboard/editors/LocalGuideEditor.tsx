"use client";

import { useState } from "react";
import { EditorShell, EditorGroup } from "./EditorShell";
import { TextInput, TextArea, RepeatItem, AddButton } from "./ui";
import { CategorySelect } from "./CategorySelect";
import { LocalGuideSection } from "@/components/guest/sections/LocalGuideSection";
import { saveLocalGuide, type LocalEntryInput } from "@/lib/dashboard/section-actions";
import type { LocalGuideContent, LocalGuideEntryRow } from "@/lib/guide/types";
import type { Branding } from "@/lib/branding/vars";

export function LocalGuideEditor({
  propertyId,
  guideId,
  branding,
  heading,
  initial,
  initialEntries,
}: {
  propertyId: string;
  guideId: string;
  branding: Branding;
  heading: string;
  initial: LocalGuideContent;
  initialEntries: LocalEntryInput[];
}) {
  const [entries, setEntries] = useState<LocalEntryInput[]>(initialEntries);
  const setEntry = (i: number, patch: Partial<LocalEntryInput>) =>
    setEntries((prev) => prev.map((e, j) => (j === i ? { ...e, ...patch } : e)));

  const previewEntries: LocalGuideEntryRow[] = entries
    .filter((e) => e.name.trim())
    .map((e, i) => ({
      id: String(i),
      guide_section_id: "",
      category: e.category || "Other",
      name: e.name,
      description: e.description ?? null,
      price: e.price ?? null,
      hours: e.hours ?? null,
      lat: null,
      lng: null,
      url: e.url ?? null,
      position: i,
    }));

  return (
    <EditorShell
      propertyId={propertyId}
      guideId={guideId}
      title={heading}
      branding={branding}
      onSave={() => saveLocalGuide(propertyId, guideId, initial, entries)}
      preview={<LocalGuideSection heading={heading} entries={previewEntries} />}
      form={
        <>
          <EditorGroup title="Places">
            {entries.map((e, i) => (
              <RepeatItem key={i} index={i} onRemove={() => setEntries(entries.filter((_, j) => j !== i))}>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  <TextInput value={e.name} onChange={(v) => setEntry(i, { name: v })} placeholder="Name" />
                  <CategorySelect
                    value={e.category}
                    onChange={(v) => setEntry(i, { category: v })}
                  />
                </div>
                <TextArea value={e.description ?? ""} onChange={(v) => setEntry(i, { description: v })} placeholder="Your recommendation…" />
              </RepeatItem>
            ))}
            <AddButton
              onClick={() =>
                setEntries([...entries, { category: "Food and drink", name: "", description: "" }])
              }
            >
              Add place
            </AddButton>
          </EditorGroup>
        </>
      }
    />
  );
}
