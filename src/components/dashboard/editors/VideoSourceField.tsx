"use client";

import { useState, type ReactNode } from "react";
import { TextInput } from "./ui";
import { MediaUploader } from "@/components/dashboard/MediaUploader";
import { VIDEO_PROVIDERS, videoProvider, type VideoProvider } from "@/lib/video";
import {
  DriveLogo,
  LoomLogo,
  PROVIDER_BRAND_COLOR,
  UploadLogo,
  YouTubeLogo,
} from "./provider-logos";

type Source = VideoProvider | "upload";

const LOGOS: Record<Source, (p: { className?: string; color?: string }) => ReactNode> = {
  youtube: YouTubeLogo,
  loom: LoomLogo,
  drive: DriveLogo,
  upload: UploadLogo,
};

const TABS: { id: Source; label: string }[] = [
  ...VIDEO_PROVIDERS.map((p) => ({ id: p.id as Source, label: p.short })),
  { id: "upload", label: "Upload" },
];

/** Whether the text is complete enough to warn about, vs. still being typed. */
function looksLikeUrl(v: string) {
  const t = v.trim();
  if (!t) return false;
  try {
    return new URL(t.startsWith("http") ? t : `https://${t}`).hostname.includes(".");
  } catch {
    return false;
  }
}

/**
 * A single video source. The host picks where the video lives — YouTube, Loom,
 * Google Drive or an uploaded file — and each choice writes the same `value`.
 * A recognised link always wins over the picked tab, so pasting a Loom link
 * into the YouTube tab simply moves the selection rather than erroring.
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
  const detected = videoProvider(value);
  // An existing value we can't parse as a link is an uploaded file.
  const [picked, setPicked] = useState<Source>(
    detected ?? (value.trim() ? "upload" : "youtube"),
  );
  const active: Source = detected ?? picked;
  const provider = VIDEO_PROVIDERS.find((p) => p.id === active);

  function selectTab(next: Source) {
    setPicked(next);
    // Only drop the current value when it belongs to a different source —
    // switching tabs shouldn't silently keep a link the new tab can't show.
    if (value.trim() && (detected ?? "upload") !== next) onChange("");
  }

  const unrecognised = provider != null && detected == null && looksLikeUrl(value);

  return (
    <div className="flex flex-col gap-2">
      <div
        role="tablist"
        aria-label="Video source"
        className="flex flex-wrap gap-1 rounded-[var(--radius-sm)] border-[1.5px] border-border bg-page p-1"
      >
        {TABS.map((t) => {
          const on = t.id === active;
          const Logo = LOGOS[t.id];
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => selectTab(t.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-[calc(var(--radius-sm)-3px)] px-2 py-1.5 text-[12px] font-bold transition-colors ${
                on ? "bg-accent-subtle text-accent" : "text-muted hover:text-ink"
              }`}
            >
              {/* The brand colour only appears on the selected tab — a row of four
                  full-colour logos would compete with the guide's own accent. */}
              <Logo
                className="h-3.5 w-3.5 shrink-0"
                color={on ? PROVIDER_BRAND_COLOR[t.id] : undefined}
              />
              {t.label}
            </button>
          );
        })}
      </div>

      {provider ? (
        <>
          <TextInput
            value={value}
            onChange={onChange}
            placeholder={provider.placeholder}
          />
          {unrecognised ? (
            <p className="text-xs text-danger">
              That doesn&apos;t look like a {provider.label} video link. Check the
              link, or pick the source it came from above.
            </p>
          ) : (
            <p className="text-xs text-muted">{provider.help}</p>
          )}
        </>
      ) : (
        <>
          <MediaUploader
            pathPrefix={pathPrefix ?? `${propertyId ?? "misc"}/videos`}
            accept="video/*"
            kind="video"
            value={value}
            onUploaded={onChange}
            label="Upload video"
          />
          <p className="text-xs text-muted">
            Upload a video file (e.g. MP4) to host it in the guide itself.
          </p>
        </>
      )}
    </div>
  );
}
