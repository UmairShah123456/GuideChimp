"use client";

import { useState } from "react";
import { EditorShell, EditorGroup } from "./EditorShell";
import { EditorField, TextInput } from "./ui";
import { WifiCard } from "@/components/guest/WifiCard";
import { saveSectionContent } from "@/lib/dashboard/section-actions";
import type { WifiContent } from "@/lib/guide/types";
import type { Branding } from "@/lib/branding/vars";

export function WifiEditor({
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
  initial: WifiContent;
}) {
  const [c, setC] = useState<WifiContent>(initial);
  const set = (patch: Partial<WifiContent>) => setC((p) => ({ ...p, ...patch }));

  return (
    <EditorShell
      propertyId={propertyId}
      guideId={guideId}
      title={heading}
      branding={branding}
      onSave={() => saveSectionContent(propertyId, guideId, "wifi", c)}
      preview={
        <>
          <div className="placeholder-tile h-[180px] rounded-b-[var(--radius-header)]" />
          <div className="px-4.5 pt-4 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
            On the home screen, under the hero
          </div>
          <div className="px-4.5 pb-8 pt-2">
            <WifiCard wifi={c} />
          </div>
        </>
      }
      form={
        <EditorGroup title="Wi-Fi details">
          <EditorField label="Network name">
            <TextInput value={c.network ?? ""} onChange={(v) => set({ network: v })} placeholder="AspectsCourt_5G" />
          </EditorField>
          <EditorField label="Password">
            <TextInput value={c.password ?? ""} onChange={(v) => set({ password: v })} placeholder="sunnyslough24" />
          </EditorField>
        </EditorGroup>
      }
    />
  );
}
