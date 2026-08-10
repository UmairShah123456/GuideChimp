import { GuestHeader } from "@/components/guest/GuestHeader";
import { CheckoutChecklist } from "@/components/guest/CheckoutChecklist";
import { Card, InfoNote, SectionLabel } from "@/components/guest/primitives";
import { Linkify } from "@/components/guest/Linkify";
import { videoEmbedUrl } from "@/lib/video";
import { EmptyHint } from "./CheckInSection";
import type { CheckOutContent } from "@/lib/guide/types";

/** Guest "Checkout" screen — optional video, departure checklist + note. */
export function CheckOutSection({
  token,
  heading = "Checkout",
  checkout,
}: {
  token?: string;
  heading?: string;
  checkout: CheckOutContent | null;
}) {
  const items = checkout?.items ?? [];
  const embedUrl = videoEmbedUrl(checkout?.videoUrl);

  return (
    <>
      <GuestHeader
        backHref={token ? `/g/${token}` : undefined}
        title={heading}
      />

      <div className="flex flex-col gap-3 px-4.5 pb-8 pt-4.5">
        {checkout?.videoUrl && (
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
                  src={checkout.videoUrl}
                  controls
                  playsInline
                  className="aspect-video w-full bg-black object-cover"
                />
              )}
            </Card>
          </div>
        )}

        {items.length > 0 ? (
          <div className="flex flex-col gap-2">
            <SectionLabel>Checkout instructions</SectionLabel>
            <CheckoutChecklist items={items} />
          </div>
        ) : (
          !checkout?.videoUrl && (
            <EmptyHint>Add a short checkout checklist for departing guests.</EmptyHint>
          )
        )}
        {checkout?.note && <InfoNote><Linkify>{checkout.note}</Linkify></InfoNote>}
      </div>
    </>
  );
}
