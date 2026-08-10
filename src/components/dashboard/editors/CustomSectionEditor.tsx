"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { guideBasePath, storagePrefix } from "@/lib/dashboard/paths";
import { EditorShell, EditorGroup } from "./EditorShell";
import { EditorField, TextInput, TextArea, RepeatItem, AddButton } from "./ui";
import { VideoSourceField } from "./VideoSourceField";
import { MediaUploader } from "@/components/dashboard/MediaUploader";
import { CustomSection } from "@/components/guest/sections/CustomSection";
import { saveCustomSection, deleteCustomSection } from "@/lib/dashboard/custom-section-actions";
import type { CustomBlock, CustomBlockType, CustomStep } from "@/lib/guide/types";
import type { Branding } from "@/lib/branding/vars";

const BLOCK_MENU: { type: CustomBlockType; label: string; hint: string }[] = [
  { type: "text", label: "Text", hint: "A paragraph of details" },
  { type: "steps", label: "Steps", hint: "A numbered walkthrough" },
  { type: "photo", label: "Photo", hint: "A single image with a caption" },
  { type: "video", label: "Video", hint: "A YouTube link or uploaded clip" },
  { type: "map", label: "Map location", hint: "An address with directions" },
];

const BLOCK_LABEL: Record<CustomBlockType, string> = {
  text: "Text",
  steps: "Steps",
  photo: "Photo",
  video: "Video",
  map: "Map location",
};

function newId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `b-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function emptyBlock(type: CustomBlockType): CustomBlock {
  const id = newId();
  switch (type) {
    case "text":
      return { id, type: "text", body: "" };
    case "video":
      return { id, type: "video", url: "" };
    case "photo":
      return { id, type: "photo", url: "", caption: "" };
    case "map":
      return { id, type: "map", address: "" };
    case "steps":
      return { id, type: "steps", steps: [{ title: "" }] };
  }
}

export function CustomSectionEditor({
  propertyId,
  guideId,
  sectionId,
  name,
  branding,
  initial,
}: {
  propertyId: string | null;
  guideId: string;
  sectionId: string;
  name: string;
  branding: Branding;
  initial: CustomBlock[];
}) {
  const [blocks, setBlocks] = useState<CustomBlock[]>(initial);
  const router = useRouter();
  const [deleting, startDelete] = useTransition();

  const update = (id: string, patch: Partial<CustomBlock>) =>
    setBlocks((bs) => bs.map((b) => (b.id === id ? ({ ...b, ...patch } as CustomBlock) : b)));
  const remove = (id: string) => setBlocks((bs) => bs.filter((b) => b.id !== id));
  const add = (type: CustomBlockType) => setBlocks((bs) => [...bs, emptyBlock(type)]);
  const move = (id: string, dir: -1 | 1) =>
    setBlocks((bs) => {
      const i = bs.findIndex((b) => b.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= bs.length) return bs;
      const next = [...bs];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  return (
    <EditorShell
      propertyId={propertyId}
      guideId={guideId}
      title={name || "Custom section"}
      branding={branding}
      onSave={() => saveCustomSection(propertyId, guideId, sectionId, blocks)}
      preview={<CustomSection section={{ title: name, blocks, body: null }} />}
      form={
        <>
          <EditorGroup title={name || "Custom section"}>
            <p className="text-[13px] text-body">
              Build this section from blocks — add text, steps, photos, videos or a map
              in any order. Whoever opens this guide sees them exactly as you arrange
              them here. Rename the section from the guide page.
            </p>
          </EditorGroup>

          {blocks.map((block, i) => (
            <BlockCard
              key={block.id}
              index={i}
              count={blocks.length}
              label={BLOCK_LABEL[block.type]}
              onMoveUp={() => move(block.id, -1)}
              onMoveDown={() => move(block.id, 1)}
              onRemove={() => remove(block.id)}
            >
              <BlockEditor
                prefix={storagePrefix(propertyId, guideId)}
                block={block}
                onChange={(patch) => update(block.id, patch)}
              />
            </BlockCard>
          ))}

          <div className="rounded-[var(--radius-lg)] border-[1.5px] border-dashed border-border bg-surface p-5">
            <h2 className="mb-1 text-sm font-extrabold text-ink">Add a block</h2>
            <p className="mb-3 text-[13px] text-body">
              Pick what to add next. It appears at the bottom — reorder with the arrows.
            </p>
            <div className="flex flex-wrap gap-2">
              {BLOCK_MENU.map((m) => (
                <button
                  key={m.type}
                  type="button"
                  onClick={() => add(m.type)}
                  title={m.hint}
                  className="rounded-[var(--radius-pill)] border-[1.5px] border-border bg-surface px-3.5 py-2 text-[13px] font-bold text-ink hover:border-accent hover:bg-accent-subtle hover:text-accent"
                >
                  + {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[var(--radius-lg)] border-[1.5px] border-danger-ring bg-danger-subtle p-5">
            <div className="mb-1 flex items-center gap-1.5">
              <span aria-hidden className="text-sm">⚠️</span>
              <h2 className="text-sm font-extrabold uppercase tracking-[0.06em] text-danger">
                Danger zone
              </h2>
            </div>
            <h3 className="text-[15px] font-extrabold text-ink">Delete this page</h3>
            <p className="mb-3 mt-0.5 text-[13px] text-body">
              This permanently deletes the whole page and every block on it — text, steps,
              photos, videos and maps. It also disappears from your guests&apos; home screen.
              <strong className="text-ink"> This cannot be undone.</strong>
            </p>
            <button
              type="button"
              disabled={deleting}
              onClick={() => {
                if (
                  !confirm(
                    `Permanently delete "${name || "this section"}" and all of its blocks?\n\nThis cannot be undone.`,
                  )
                )
                  return;
                startDelete(async () => {
                  const res = await deleteCustomSection(propertyId, guideId, sectionId);
                  if (res.error) {
                    alert(res.error);
                    return;
                  }
                  router.push(guideBasePath(propertyId, guideId));
                });
              }}
              className="rounded-[var(--radius-pill)] bg-danger px-4 py-2.5 text-[13px] font-bold text-white disabled:opacity-60"
            >
              {deleting ? "Deleting…" : "Delete this page permanently"}
            </button>
          </div>
        </>
      }
    />
  );
}

/** A framed, reorderable wrapper around one block's editor. */
function BlockCard({
  index,
  count,
  label,
  onMoveUp,
  onMoveDown,
  onRemove,
  children,
}: {
  index: number;
  count: number;
  label: string;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-extrabold text-ink">
          <span className="text-muted">{index + 1}.</span> {label}
        </h2>
        <div className="flex items-center gap-1">
          <IconBtn label="Move up" disabled={index === 0} onClick={onMoveUp}>
            ↑
          </IconBtn>
          <IconBtn label="Move down" disabled={index === count - 1} onClick={onMoveDown}>
            ↓
          </IconBtn>
          <button
            type="button"
            onClick={onRemove}
            className="ml-1 text-xs font-semibold text-muted hover:text-danger"
          >
            Remove
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

function IconBtn({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] border-[1.5px] border-border text-sm font-bold text-body hover:bg-page disabled:opacity-35"
    >
      {children}
    </button>
  );
}

/** Renders the right editor for a block based on its type. */
function BlockEditor({
  prefix,
  block,
  onChange,
}: {
  prefix: string;
  block: CustomBlock;
  onChange: (patch: Partial<CustomBlock>) => void;
}) {
  switch (block.type) {
    case "text":
      return (
        <EditorField label="Body" hint="Line breaks are kept.">
          <TextArea
            value={block.body}
            onChange={(v) => onChange({ body: v })}
            placeholder="Everything the guest needs to know…"
            rows={6}
          />
        </EditorField>
      );

    case "video":
      return (
        <VideoSourceField
          value={block.url}
          onChange={(url) => onChange({ url })}
          pathPrefix={`${prefix}/custom`}
        />
      );

    case "photo":
      return (
        <>
          <EditorField label="Photo">
            <MediaUploader
              pathPrefix={`${prefix}/custom`}
              accept="image/*"
              kind="image"
              value={block.url}
              onUploaded={(url) => onChange({ url })}
              label="Upload photo"
            />
          </EditorField>
          <TextInput
            value={block.caption ?? ""}
            onChange={(v) => onChange({ caption: v })}
            placeholder="Photo caption (optional)"
          />
        </>
      );

    case "map":
      return (
        <EditorField label="Address" hint="Shown on a map with a directions button for guests.">
          <TextInput
            value={block.address}
            onChange={(v) => onChange({ address: v })}
            placeholder="12 Hencroft St, Slough SL1 1PP"
          />
        </EditorField>
      );

    case "steps":
      return <StepsEditor prefix={prefix} steps={block.steps} onChange={(steps) => onChange({ steps })} />;
  }
}

function StepsEditor({
  prefix,
  steps,
  onChange,
}: {
  prefix: string;
  steps: CustomStep[];
  onChange: (steps: CustomStep[]) => void;
}) {
  const setStep = (i: number, patch: Partial<CustomStep>) =>
    onChange(steps.map((s, j) => (j === i ? { ...s, ...patch } : s)));

  return (
    <>
      {steps.map((s, i) => (
        <RepeatItem key={i} index={i} onRemove={() => onChange(steps.filter((_, j) => j !== i))}>
          <TextInput value={s.title} onChange={(v) => setStep(i, { title: v })} placeholder="Step title" />
          <TextArea
            value={s.body ?? ""}
            onChange={(v) => setStep(i, { body: v })}
            placeholder="What the guest does"
          />
          <EditorField label="Photo" hint="Optional — shown under the step.">
            <MediaUploader
              pathPrefix={`${prefix}/custom`}
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
      <AddButton onClick={() => onChange([...steps, { title: "" }])}>Add step</AddButton>
    </>
  );
}
