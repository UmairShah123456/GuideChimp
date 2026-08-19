"use client";

import { useState } from "react";
import { EditorShell, EditorGroup } from "./EditorShell";
import { EditorField, TextInput, RepeatItem, AddButton, InlineDialCodeSelect, findDialCode } from "./ui";
import { MediaUploader } from "@/components/dashboard/MediaUploader";
import { ContactSection } from "@/components/guest/sections/ContactSection";
import { saveSectionContent } from "@/lib/dashboard/section-actions";
import { DEFAULT_DIAL_CODE, PHONE_KINDS, dialCodeField, dialValue, hostDialCode } from "@/lib/phone";
import type { PhoneKind } from "@/lib/phone";
import type { EmergencyContent, EmergencyService, HostContact } from "@/lib/guide/types";
import type { Branding } from "@/lib/branding/vars";

/** One phone field: its own country picker as a prefix, then the local number. */
function PhoneNumberInput({
  host,
  kind,
  label,
  onChange,
}: {
  host: HostContact;
  kind: PhoneKind;
  label: string;
  onChange: (patch: Partial<HostContact>) => void;
}) {
  const dialCode = hostDialCode(host, kind) || DEFAULT_DIAL_CODE;
  return (
    <div className="flex items-center rounded-[var(--radius-sm)] border-[1.5px] border-border bg-surface transition-colors focus-within:border-accent">
      <InlineDialCodeSelect
        value={dialCode}
        label={label}
        onChange={(v) => onChange({ [dialCodeField(kind)]: v })}
      />
      <input
        type="tel"
        value={host[kind] ?? ""}
        onChange={(e) => onChange({ [kind]: e.target.value.replace(/^0+/, "") })}
        placeholder="7949 325413"
        className="w-full min-w-0 rounded-[var(--radius-sm)] bg-transparent py-2 pl-2 pr-3 text-sm text-ink outline-none placeholder:text-muted"
      />
    </div>
  );
}

/** The shared avatar/name/number fields for a host (primary or alternative). */
function HostFields({
  propertyId,
  host,
  onChange,
}: {
  propertyId: string;
  host: HostContact;
  onChange: (patch: Partial<HostContact>) => void;
}) {
  return (
    <>
      <EditorField label="Avatar photo">
        <MediaUploader
          pathPrefix={`${propertyId}/host`}
          value={host.avatarUrl ?? ""}
          onUploaded={(url) => onChange({ avatarUrl: url })}
          label="Upload photo"
        />
      </EditorField>
      <EditorField label="Name">
        <TextInput value={host.name ?? ""} onChange={(v) => onChange({ name: v })} placeholder="Umair" />
      </EditorField>
      <div className="grid gap-2.5 sm:grid-cols-3">
        {PHONE_KINDS.map(({ kind, label }) => (
          <EditorField
            key={kind}
            label={label}
            hint={kind === "whatsapp" ? "Pick each number's country — they don't have to match." : undefined}
          >
            <PhoneNumberInput host={host} kind={kind} label={label} onChange={onChange} />
          </EditorField>
        ))}
      </div>
    </>
  );
}

/** Ensure a host carries an explicit default dial code, upgrading legacy bare codes. */
function withDialCode(host: HostContact): HostContact {
  const match = findDialCode(host.dialCode);
  return { ...host, dialCode: match ? dialValue(match) : DEFAULT_DIAL_CODE };
}

export function ContactEditor({
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
  initial: EmergencyContent;
}) {
  const [c, setC] = useState<EmergencyContent>(() => {
    const merged: EmergencyContent = {
      host: {},
      services: [],
      goodToKnow: [],
      ...initial,
    };
    // Hosts saved before dial codes existed have no `dialCode`, so the editor
    // showed "+44" while the guest link dialled a number with neither the code
    // nor its trunk 0. Pin the displayed default onto the record up front.
    return {
      ...merged,
      host: withDialCode(merged.host ?? {}),
      additionalHosts: merged.additionalHosts?.map(withDialCode),
    };
  });
  const host = c.host ?? {};
  const additionalHosts = c.additionalHosts ?? [];
  const services = c.services ?? [];
  const goodToKnow = c.goodToKnow ?? [];

  const set = (patch: Partial<EmergencyContent>) => setC((p) => ({ ...p, ...patch }));
  const setHost = (patch: Partial<HostContact>) => set({ host: { ...host, ...patch } });
  const setAdditionalHost = (i: number, patch: Partial<HostContact>) =>
    set({ additionalHosts: additionalHosts.map((h, j) => (j === i ? { ...h, ...patch } : h)) });
  const setService = (i: number, patch: Partial<EmergencyService>) =>
    set({ services: services.map((s, j) => (j === i ? { ...s, ...patch } : s)) });
  const setGtk = (i: number, patch: Partial<{ label: string; value: string }>) =>
    set({ goodToKnow: goodToKnow.map((g, j) => (j === i ? { ...g, ...patch } : g)) });

  return (
    <EditorShell
      propertyId={propertyId}
      guideId={guideId}
      title={heading}
      branding={branding}
      onSave={() => saveSectionContent(propertyId, guideId, "emergency_contacts", c)}
      preview={<ContactSection heading={heading} contact={c} />}
      form={
        <>
          <EditorGroup title="Host">
            <HostFields propertyId={propertyId} host={host} onChange={setHost} />
          </EditorGroup>

          <EditorGroup title="Alternative hosts">
            <p className="text-[13px] text-body">
              Add a co-host or backup contact guests can reach if you&apos;re unavailable.
            </p>
            {additionalHosts.map((h, i) => (
              <RepeatItem
                key={i}
                index={i}
                onRemove={() => set({ additionalHosts: additionalHosts.filter((_, j) => j !== i) })}
              >
                <HostFields
                  propertyId={propertyId}
                  host={h}
                  onChange={(patch) => setAdditionalHost(i, patch)}
                />
              </RepeatItem>
            ))}
            <AddButton
              onClick={() => set({ additionalHosts: [...additionalHosts, withDialCode({})] })}
            >
              Add alternative host
            </AddButton>
          </EditorGroup>

          <EditorGroup title="Emergency services">
            {services.map((s, i) => (
              <RepeatItem key={i} index={i} onRemove={() => set({ services: services.filter((_, j) => j !== i) })}>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  <TextInput value={s.code} onChange={(v) => setService(i, { code: v })} placeholder="999" />
                  <TextInput value={s.phone} onChange={(v) => setService(i, { phone: v })} placeholder="Phone to dial" />
                </div>
                <TextInput value={s.name} onChange={(v) => setService(i, { name: v })} placeholder="Emergency services" />
                <TextInput value={s.detail ?? ""} onChange={(v) => setService(i, { detail: v })} placeholder="Fire, police, ambulance" />
                <label className="flex items-center gap-2 text-[13px] text-body">
                  <input
                    type="checkbox"
                    checked={s.tone === "danger"}
                    onChange={(e) => setService(i, { tone: e.target.checked ? "danger" : "normal" })}
                  />
                  Highlight in red (urgent)
                </label>
              </RepeatItem>
            ))}
            <AddButton onClick={() => set({ services: [...services, { code: "", name: "", detail: "", phone: "", tone: "normal" }] })}>
              Add service
            </AddButton>
          </EditorGroup>

          <EditorGroup title="Good to know">
            {goodToKnow.map((g, i) => (
              <div key={i} className="flex gap-2">
                <TextInput value={g.label} onChange={(v) => setGtk(i, { label: v })} placeholder="Stopcock" />
                <TextInput value={g.value} onChange={(v) => setGtk(i, { value: v })} placeholder="under the kitchen sink" />
                <button
                  type="button"
                  onClick={() => set({ goodToKnow: goodToKnow.filter((_, j) => j !== i) })}
                  className="rounded-[var(--radius-sm)] border-[1.5px] border-border px-3 text-xs font-semibold text-muted hover:text-danger"
                >
                  ✕
                </button>
              </div>
            ))}
            <AddButton onClick={() => set({ goodToKnow: [...goodToKnow, { label: "", value: "" }] })}>
              Add item
            </AddButton>
          </EditorGroup>
        </>
      }
    />
  );
}
