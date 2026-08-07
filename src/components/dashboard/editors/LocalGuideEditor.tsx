"use client";

import { useState } from "react";
import { EditorShell, EditorGroup } from "./EditorShell";
import { TextInput, TextArea, RepeatItem, AddButton, Select } from "./ui";
import { LocalGuideSection } from "@/components/guest/sections/LocalGuideSection";
import { saveLocalGuide, type LocalEntryInput } from "@/lib/dashboard/section-actions";
import type { LocalGuideContent, LocalGuideEntryRow } from "@/lib/guide/types";

const CATEGORY_OPTIONS = ["Food and drink", "Attraction", "Point of interest", "Other"];

export function LocalGuideEditor({
  propertyId,
  guideId,
  hue,
  heading,
  initial,
  initialEntries,
}: {
  propertyId: string;
  guideId: string;
  hue: number;
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
      hue={hue}
      onSave={() => saveLocalGuide(propertyId, guideId, initial, entries)}
      preview={<LocalGuideSection heading={heading} entries={previewEntries} />}
      form={
        <>
          <EditorGroup title="Places">
            {entries.map((e, i) => (
              <RepeatItem key={i} index={i} onRemove={() => setEntries(entries.filter((_, j) => j !== i))}>
                <div className="grid grid-cols-2 gap-2.5">
                  <TextInput value={e.name} onChange={(v) => setEntry(i, { name: v })} placeholder="Name" />
                  <Select
                    value={e.category}
                    onChange={(v) => setEntry(i, { category: v })}
                    options={CATEGORY_OPTIONS}
                    placeholder="Category"
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
