"use client";

import { useState } from "react";
import { EditorShell, EditorGroup } from "./EditorShell";
import { TextInput, RepeatItem, AddButton } from "./ui";
import { HouseRulesSection } from "@/components/guest/sections/HouseRulesSection";
import { saveSectionContent } from "@/lib/dashboard/section-actions";
import type { HouseRule, HouseRulesContent } from "@/lib/guide/types";

export function HouseRulesEditor({
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
  initial: HouseRulesContent;
}) {
  const [c, setC] = useState<HouseRulesContent>({ rules: [], ...initial });
  const rules = c.rules ?? [];

  const set = (patch: Partial<HouseRulesContent>) => setC((p) => ({ ...p, ...patch }));
  const setRule = (i: number, patch: Partial<HouseRule>) =>
    set({ rules: rules.map((r, j) => (j === i ? { ...r, ...patch } : r)) });

  return (
    <EditorShell
      propertyId={propertyId}
      guideId={guideId}
      title={heading}
      hue={hue}
      onSave={() => saveSectionContent(propertyId, guideId, "house_rules", c)}
      preview={<HouseRulesSection heading={heading} rules={c} />}
      form={
        <>
          <EditorGroup title="Rules">
            {rules.map((r, i) => (
              <RepeatItem key={i} index={i} onRemove={() => set({ rules: rules.filter((_, j) => j !== i) })}>
                <TextInput value={r.title} onChange={(v) => setRule(i, { title: v })} placeholder="Rule (e.g. No smoking inside)" />
                <TextInput value={r.reason ?? ""} onChange={(v) => setRule(i, { reason: v })} placeholder="Friendly reason (optional)" />
              </RepeatItem>
            ))}
            <AddButton onClick={() => set({ rules: [...rules, { title: "", reason: "" }] })}>
              Add rule
            </AddButton>
          </EditorGroup>
        </>
      }
    />
  );
}
