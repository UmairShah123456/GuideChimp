"use client";

import { useState } from "react";
import { EditorShell, EditorGroup } from "./EditorShell";
import { TextInput, RepeatItem, AddButton } from "./ui";
import { HouseRulesSection } from "@/components/guest/sections/HouseRulesSection";
import { SavedRules } from "./SavedRules";
import { SaveToLibraryButton } from "./SaveToLibraryButton";
import { RuleIconPicker } from "./RuleIconPicker";
import { normRule, useRuleLibrary } from "./useRuleLibrary";
import { saveSectionContent } from "@/lib/dashboard/section-actions";
import type { HouseRule, HouseRulesContent, HouseRuleTemplateRow } from "@/lib/guide/types";
import type { Branding } from "@/lib/branding/vars";

export function HouseRulesEditor({
  propertyId,
  guideId,
  branding,
  heading,
  initial,
  templates,
  templatesError,
}: {
  propertyId: string;
  guideId: string;
  branding: Branding;
  heading: string;
  initial: HouseRulesContent;
  /** The account's reusable rules, offered above the list. */
  templates: HouseRuleTemplateRow[];
  /** Why the library couldn't be read, if it couldn't. */
  templatesError?: string;
}) {
  const [c, setC] = useState<HouseRulesContent>({ rules: [], ...initial });
  const rules = c.rules ?? [];

  const set = (patch: Partial<HouseRulesContent>) => setC((p) => ({ ...p, ...patch }));
  const setRule = (i: number, patch: Partial<HouseRule>) =>
    set({ rules: rules.map((r, j) => (j === i ? { ...r, ...patch } : r)) });

  const library = useRuleLibrary(templates, templatesError);

  const isBlank = (r: HouseRule) => !r.title.trim() && !(r.reason ?? "").trim();

  /**
   * Append rules copied out of the library. Empty rows at the end are dropped
   * first — an untouched "Add rule" row would otherwise be left stranded in the
   * middle of the list, and it saves as nothing anyway.
   */
  const addRules = (incoming: HouseRule[]) => {
    if (incoming.length === 0) return;
    const kept = [...rules];
    while (kept.length > 0 && isBlank(kept[kept.length - 1])) kept.pop();
    set({ rules: [...kept, ...incoming] });
  };

  /**
   * Drop rules from this guide by title — how unticking a saved rule works.
   * Matched on title rather than index so it still finds the rule after the host
   * has reworded its reason or moved it up the list.
   */
  const removeByTitle = (titles: string[]) => {
    const drop = new Set(titles.map(normRule));
    set({ rules: rules.filter((r) => !drop.has(normRule(r.title))) });
  };

  return (
    <EditorShell
      propertyId={propertyId}
      guideId={guideId}
      title={heading}
      branding={branding}
      onSave={() => saveSectionContent(propertyId, guideId, "house_rules", c)}
      preview={<HouseRulesSection heading={heading} rules={c} />}
      form={
        <>
          <SavedRules
            library={library}
            rules={rules}
            onAdd={addRules}
            onRemove={removeByTitle}
          />
          <EditorGroup title="Rules">
            {rules.map((r, i) => (
              <RepeatItem key={i} index={i} onRemove={() => set({ rules: rules.filter((_, j) => j !== i) })}>
                {/* Icon beside the title, mirroring the guest card's layout. */}
                <div className="flex items-start gap-2">
                  <RuleIconPicker
                    value={r.icon}
                    title={r.title}
                    onChange={(icon) => setRule(i, { icon })}
                  />
                  <div className="min-w-0 flex-1">
                    <TextInput value={r.title} onChange={(v) => setRule(i, { title: v })} placeholder="Rule (e.g. No smoking inside)" />
                  </div>
                </div>
                <TextInput value={r.reason ?? ""} onChange={(v) => setRule(i, { reason: v })} placeholder="Friendly reason (optional)" />
                {/* Saving to the library is per rule, right where it's written —
                    the panel's bulk button meant writing a rule then scrolling
                    back up to keep it. */}
                <SaveToLibraryButton rule={r} library={library} />
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
