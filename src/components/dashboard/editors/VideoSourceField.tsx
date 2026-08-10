"use client";

import { TextInput } from "./ui";
import { MediaUploader } from "@/components/dashboard/MediaUploader";
import { youTubeId } from "@/lib/youtube";

/**
 * A single video source that accepts EITHER a YouTube link or an uploaded video
 * file — both write the same `value` (the last one set wins). Includes the
 * host-facing note on what's supported.
 */
export function VideoSourceField({
  propertyId,
  value,
  onChange,
  pathPrefix,
}: {
  propertyId?: string | null;
  value: string;
  onChange: (url: string) => void;
  pathPrefix?: string;
}) {
  const isYouTube = youTubeId(value) != null;

  return (
    <div className="flex flex-col gap-2">
      <TextInput
        value={value}
        onChange={onChange}
        placeholder="Paste a YouTube link (https://youtu.be/…)"
      />
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
        or upload a file
      </div>
      <MediaUploader
        pathPrefix={pathPrefix ?? `${propertyId ?? "misc"}/videos`}
        accept="video/*"
        kind="video"
        value={isYouTube ? "" : value}
        onUploaded={onChange}
        label="Upload video"
      />
      <p className="text-xs text-muted">
        Add a video as a <strong className="text-body">YouTube link</strong> or an{" "}
        <strong className="text-body">uploaded video file</strong> (e.g. MP4). Those
        are the only two options for now — other embeds aren&apos;t supported yet.
      </p>
    </div>
  );
}
