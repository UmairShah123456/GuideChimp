/**
 * Recognises the video links hosts can paste into a guide (YouTube, Loom and
 * Google Drive) and turns them into embed / thumbnail URLs. Anything
 * unrecognised is treated as a direct file URL (an upload) by the callers.
 */

export type VideoProvider = "youtube" | "loom" | "drive";

/**
 * Extracts a YouTube video id from the common URL shapes:
 *   youtube.com/watch?v=ID · youtu.be/ID · youtube.com/embed/ID · /shorts/ID
 * Returns null for anything that isn't a recognisable YouTube link.
 */
export function youTubeId(url?: string | null): string | null {
  const u = (url ?? "").trim();
  if (!u) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?[^#]*\bv=)([A-Za-z0-9_-]{11})/,
    /(?:youtu\.be\/)([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = p.exec(u);
    if (m) return m[1];
  }
  return null;
}

/**
 * Extracts a Loom video id from the shareable URL shapes:
 *   loom.com/share/ID · loom.com/embed/ID (optionally with ?sid=… tracking).
 * Loom ids are long hex-ish strings; folder/space links are not videos.
 */
export function loomId(url?: string | null): string | null {
  const u = (url ?? "").trim();
  if (!u) return null;
  const m = /loom\.com\/(?:share|embed)\/([A-Za-z0-9]{20,})/.exec(u);
  return m ? m[1] : null;
}

/**
 * Extracts a Google Drive file id from the shapes the Drive UI hands out:
 *   drive.google.com/file/d/ID/view · /open?id=ID · /uc?id=ID
 * Folder links (/drive/folders/…) are deliberately not matched.
 */
export function driveId(url?: string | null): string | null {
  const u = (url ?? "").trim();
  if (!u) return null;
  const patterns = [
    /(?:drive|docs)\.google\.com\/file\/d\/([A-Za-z0-9_-]{10,})/,
    /(?:drive|docs)\.google\.com\/(?:open|uc)\?[^#]*\bid=([A-Za-z0-9_-]{10,})/,
  ];
  for (const p of patterns) {
    const m = p.exec(u);
    if (m) return m[1];
  }
  return null;
}

/** Which provider (if any) a pasted link belongs to. */
export function videoProvider(url?: string | null): VideoProvider | null {
  if (youTubeId(url)) return "youtube";
  if (loomId(url)) return "loom";
  if (driveId(url)) return "drive";
  return null;
}

/**
 * Embed URL for a supported video link, or null when the URL isn't a known
 * provider (callers fall back to a plain <video> element for uploads).
 * Uses YouTube's no-cookie host so guests aren't tracked before they press play.
 * Drive's preview player has no autoplay parameter, so the option is ignored there.
 */
export function videoEmbedUrl(
  url?: string | null,
  opts?: { autoplay?: boolean },
): string | null {
  const yt = youTubeId(url);
  if (yt) {
    return `https://www.youtube-nocookie.com/embed/${yt}${opts?.autoplay ? "?autoplay=1" : ""}`;
  }
  const loom = loomId(url);
  if (loom) {
    return `https://www.loom.com/embed/${loom}${opts?.autoplay ? "?autoplay=true" : ""}`;
  }
  const drive = driveId(url);
  if (drive) {
    return `https://drive.google.com/file/d/${drive}/preview`;
  }
  return null;
}

/** Poster image for a supported video link, or null when we can't derive one. */
export function videoThumbnailUrl(url?: string | null): string | null {
  const yt = youTubeId(url);
  if (yt) return `https://img.youtube.com/vi/${yt}/hqdefault.jpg`;
  const loom = loomId(url);
  if (loom) return `https://cdn.loom.com/sessions/thumbnails/${loom}-00001.jpg`;
  const drive = driveId(url);
  if (drive) return `https://drive.google.com/thumbnail?id=${drive}&sz=w640`;
  return null;
}

/**
 * Host-facing copy for each link provider, in the order the editor shows them.
 * Keeps the provider knowledge here rather than in the form component.
 */
export const VIDEO_PROVIDERS: {
  id: VideoProvider;
  label: string;
  /** Compact label for the source tabs, where the logo carries the recognition. */
  short: string;
  placeholder: string;
  help: string;
}[] = [
  {
    id: "youtube",
    label: "YouTube",
    short: "YouTube",
    placeholder: "https://youtu.be/…",
    help: "Paste the link from Share. Unlisted videos work — private ones don't.",
  },
  {
    id: "loom",
    label: "Loom",
    short: "Loom",
    placeholder: "https://www.loom.com/share/…",
    help: "Paste the Share link. The video's access must be set to anyone with the link.",
  },
  {
    id: "drive",
    label: "Google Drive",
    short: "Drive",
    placeholder: "https://drive.google.com/file/d/…/view",
    help: "Paste the Share link. General access must be set to anyone with the link.",
  },
];
