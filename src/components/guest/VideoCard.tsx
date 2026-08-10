import Link from "next/link";
import { PlayIcon } from "./icons";
import { videoThumbnailUrl } from "@/lib/video";

/**
 * Amenity video guide thumbnail. On the guest side it links to the video's own
 * page (video + notes) via `href`; in the editor preview (no href) it's static.
 * The thumbnail is derived — the provider's own image (YouTube, Loom) painted
 * over a tile from the title, so a missing poster still reads as a video.
 */
export function VideoCard({
  title,
  subtitle,
  url,
  href,
}: {
  title: string;
  subtitle?: string;
  url?: string;
  href?: string;
}) {
  const poster = videoThumbnailUrl(url);

  const inner = (
    <>
      <div className="relative h-[88px]">
        <span className="absolute inset-0 flex items-center justify-center bg-accent-subtle px-3 text-center text-[12px] font-bold leading-tight text-accent">
          {title || "Video"}
        </span>
        {poster && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-ink/85 text-white">
            <PlayIcon className="ml-0.5 h-3.5 w-3.5" />
          </span>
        </span>
      </div>
      <div className="px-3 py-2.5">
        <div className="text-[13.5px] font-bold text-ink">{title}</div>
        {subtitle && <div className="mt-0.5 text-[11px] text-muted">{subtitle}</div>}
      </div>
    </>
  );

  const className =
    "block overflow-hidden rounded-[var(--radius-card)] border-[1.5px] border-border bg-surface";

  return href ? (
    <Link href={href} className={className}>
      {inner}
    </Link>
  ) : (
    <div className={className}>{inner}</div>
  );
}
