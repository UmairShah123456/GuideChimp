import { GuestHeader } from "@/components/guest/GuestHeader";
import { Card, CodeTicket, InfoNote, Placeholder, SectionLabel } from "@/components/guest/primitives";
import { MapCard } from "@/components/guest/MapCard";
import { Linkify } from "@/components/guest/Linkify";
import { youTubeEmbedUrl } from "@/lib/youtube";
import type { CheckInContent } from "@/lib/guide/types";

/**
 * Guest "Getting in" screen body — video guide + numbered check-in steps.
 * Shared by the live guest route and the host editor preview.
 */
export function CheckInSection({
  token,
  heading = "Getting in",
  checkIn,
}: {
  token?: string;
  heading?: string;
  checkIn: CheckInContent | null;
}) {
  const embedUrl = youTubeEmbedUrl(checkIn?.videoUrl);

  return (
    <>
      <GuestHeader
        backHref={token ? `/g/${token}` : undefined}
        title={heading}
      />

      <div className="flex flex-col gap-3 px-4.5 pb-8 pt-4.5">
        {checkIn?.address && (
          <div className="flex flex-col gap-2">
            <SectionLabel>Property address</SectionLabel>
            <MapCard address={checkIn.address} />
          </div>
        )}

        {checkIn?.videoUrl && (
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
                  src={checkIn.videoUrl}
                  controls
                  playsInline
                  className="aspect-video w-full bg-black object-cover"
                />
              )}
            </Card>
          </div>
        )}

        {checkIn?.steps && checkIn.steps.length > 0 && (
          <div className="flex flex-col gap-3">
            <SectionLabel>Arrival steps</SectionLabel>
            {checkIn.steps.map((step, i) => (
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
                  {step.code?.value && (
                    <div className="mt-2.5">
                      <CodeTicket label={step.code.label || "CODE"} value={step.code.value} />
                    </div>
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

        {(!checkIn?.steps || checkIn.steps.length === 0) && (
          <EmptyHint>Add arrival steps to build this screen.</EmptyHint>
        )}

        {checkIn?.note && <InfoNote><Linkify>{checkIn.note}</Linkify></InfoNote>}
      </div>
    </>
  );
}

export function EmptyHint({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius-card)] border-[1.5px] border-dashed border-border bg-surface px-4 py-6 text-center text-[13px] text-muted">
      {children}
    </div>
  );
}
