"use client";

import { useState } from "react";
import { EditorShell, EditorGroup } from "./EditorShell";
import { EditorField, TextInput, TextArea, RepeatItem, AddButton } from "./ui";
import { VideoSourceField } from "./VideoSourceField";
import {
  WifiAmenitiesSection,
  type PreviewVideo,
} from "@/components/guest/sections/WifiAmenitiesSection";
import { saveAmenities, type VideoInput } from "@/lib/dashboard/section-actions";
import type { AmenitiesContent } from "@/lib/guide/types";

interface VideoRow {
  title: string;
  subtitle: string;
  url: string;
  notes: string;
}

export function AmenitiesEditor({
  propertyId,
  guideId,
  hue,
  heading,
  initial,
  initialVideos,
}: {
  propertyId: string;
  guideId: string;
  hue: number;
  heading: string;
  initial: AmenitiesContent;
  initialVideos: VideoRow[];
}) {
  const [c, setC] = useState<AmenitiesContent>(initial);
  const [videos, setVideos] = useState<VideoRow[]>(initialVideos);
  const set = (patch: Partial<AmenitiesContent>) => setC((p) => ({ ...p, ...patch }));
  const setVid = (i: number, patch: Partial<VideoRow>) =>
    setVideos((prev) => prev.map((v, j) => (j === i ? { ...v, ...patch } : v)));

  const previewVideos: PreviewVideo[] = videos.map((v) => ({
    title: v.title,
    subtitle: v.subtitle,
    url: v.url || undefined,
  }));

  const payload: VideoInput[] = videos.map((v) => ({
    caption: v.title,
    subtitle: v.subtitle,
    url: v.url,
    notes: v.notes,
  }));

  return (
    <EditorShell
      propertyId={propertyId}
      guideId={guideId}
      title={heading}
      hue={hue}
      onSave={() => saveAmenities(propertyId, guideId, c, payload)}
      preview={<WifiAmenitiesSection heading={heading} amenities={c} videos={previewVideos} />}
      form={
        <>
          <EditorGroup title="Ask the host">
            <div className="grid grid-cols-2 gap-2.5">
              <EditorField label="Ask prompt">
                <TextInput value={c.askNote ?? ""} onChange={(v) => set({ askNote: v })} placeholder="Something not covered here?" />
              </EditorField>
              <EditorField label="Ask link label">
                <TextInput value={c.askLabel ?? ""} onChange={(v) => set({ askLabel: v })} placeholder="Ask the host" />
              </EditorField>
            </div>
          </EditorGroup>

          <EditorGroup title="Video guides">
            {videos.map((v, i) => (
              <RepeatItem key={i} index={i} onRemove={() => setVideos(videos.filter((_, j) => j !== i))}>
                <TextInput value={v.title} onChange={(val) => setVid(i, { title: val })} placeholder="Title (e.g. Heating & hot water)" />
                <TextInput value={v.subtitle} onChange={(val) => setVid(i, { subtitle: val })} placeholder="Subtitle (e.g. Thermostat by the door)" />
                <div>
                  <div className="mb-1 text-xs font-semibold text-muted">Video</div>
                  <VideoSourceField
                    propertyId={propertyId}
                    value={v.url}
                    onChange={(url) => setVid(i, { url })}
                  />
                </div>
                <div>
                  <div className="mb-1 text-xs font-semibold text-muted">
                    Notes <span className="font-normal">(shown on the video&apos;s page)</span>
                  </div>
                  <TextArea
                    value={v.notes}
                    onChange={(val) => setVid(i, { notes: val })}
                    placeholder="Any extra tips for this one — settings, gotchas, where things are…"
                  />
                </div>
              </RepeatItem>
            ))}
            <AddButton
              onClick={() => setVideos([...videos, { title: "", subtitle: "", url: "", notes: "" }])}
            >
              Add video guide
            </AddButton>
          </EditorGroup>
        </>
      }
    />
  );
}
