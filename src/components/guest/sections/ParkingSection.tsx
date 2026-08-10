import { GuestHeader } from "@/components/guest/GuestHeader";
import { Card, Placeholder, SectionLabel } from "@/components/guest/primitives";
import { DirectionsIcon } from "@/components/guest/icons";
import { Linkify } from "@/components/guest/Linkify";
import { videoEmbedUrl } from "@/lib/video";
import { EmptyHint } from "./CheckInSection";
import type { ParkingContent } from "@/lib/guide/types";

/** Guest "Parking" screen — video guide, name/directions card, and step-by-step photos. */
export function ParkingSection({
  token,
  heading = "Parking",
  parking,
}: {
  token?: string;
  heading?: string;
  parking: ParkingContent | null;
}) {
  const steps = parking?.steps ?? [];
  const embedUrl = videoEmbedUrl(parking?.videoUrl);
  const hasLot = parking && (parking.lotName || parking.lotDetail || parking.directionsUrl);
  const tags = [
    parking?.cost === "free" ? "Free parking" : parking?.cost === "paid" ? "Paid parking" : null,
    parking?.location === "on_site" ? "On-site" : parking?.location === "off_site" ? "Off-site" : null,
  ].filter(Boolean) as string[];
  const hasContent =
    hasLot || steps.length > 0 || parking?.videoUrl || parking?.photoUrl || tags.length > 0;

  return (
    <>
      <GuestHeader
        backHref={token ? `/g/${token}` : undefined}
        title={heading}
      />

      <div className="flex flex-col gap-3 px-4.5 pb-8 pt-4.5">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="rounded-[var(--radius-pill)] bg-accent-subtle px-3.5 py-1.5 text-xs font-bold text-accent"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {hasLot && (
          <Card className="flex items-center justify-between px-4 py-3.5">
            <div>
              <div className="text-[15px] font-bold text-ink">
                {parking!.lotName || "Parking"}
              </div>
              {parking!.lotDetail && (
                <div className="mt-0.5 text-xs text-muted">{parking!.lotDetail}</div>
              )}
            </div>
            {parking!.directionsUrl && (
              <a
                href={parking!.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-none items-center gap-1.5 rounded-[var(--radius-pill)] bg-accent-subtle px-3.5 py-2 text-xs font-bold text-accent"
              >
                <DirectionsIcon className="h-3.5 w-3.5" />
                Directions
              </a>
            )}
          </Card>
        )}

        {parking?.photoUrl && (
          <figure className="flex flex-col gap-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={parking.photoUrl}
              alt={parking.photoCaption || "Parking area"}
              className="w-full rounded-[var(--radius-card)] border-[1.5px] border-border object-cover"
            />
            {parking.photoCaption && (
              <figcaption className="text-[11px] text-muted">{parking.photoCaption}</figcaption>
            )}
          </figure>
        )}

        {steps.length > 0 && (
          <div className="flex flex-col gap-3">
            <SectionLabel>Step by step</SectionLabel>
            {steps.map((step, i) => (
              <Card key={i} className="flex gap-3.5 p-4">
                <div className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand text-[13px] font-extrabold text-brand-contrast">
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="break-words text-[15px] font-bold text-ink">{step.title}</div>
                  {step.body && (
                    <p className="mt-0.5 break-words text-[12.5px] leading-relaxed text-body">
                      <Linkify>{step.body}</Linkify>
                    </p>
                  )}
                  {step.photoUrl ? (
                    <figure className="mt-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={step.photoUrl}
                        alt={step.photoCaption || step.title}
                        className="w-full rounded-[var(--radius-code)] border-[1.5px] border-border object-cover"
                      />
                      {step.photoCaption && (
                        <figcaption className="mt-1.5 text-[11px] text-muted">{step.photoCaption}</figcaption>
                      )}
                    </figure>
                  ) : (
                    step.photoCaption && (
                      <Placeholder
                        caption={step.photoCaption}
                        className="mt-2.5 h-24 rounded-[var(--radius-code)]"
                      />
                    )
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {parking?.videoUrl && (
          <div className="flex flex-col gap-2">
            <SectionLabel>Video guide</SectionLabel>
            <Card className="overflow-hidden">
              {embedUrl ? (
                <div className="relative aspect-video">
                  <iframe
                    src={embedUrl}
                    title="Video guide"
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <video
                  src={parking.videoUrl}
                  controls
                  playsInline
                  className="aspect-video w-full bg-black object-cover"
                />
              )}
            </Card>
          </div>
        )}

        {!hasContent && (
          <EmptyHint>Add parking details for guests arriving by car.</EmptyHint>
        )}
      </div>
    </>
  );
}
