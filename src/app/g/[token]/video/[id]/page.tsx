import { getGuide } from "@/lib/guide/resolve";
import { GuestScreen } from "@/components/guest/GuestScreen";
import { GuestFallback } from "@/components/guest/GuestFallback";
import { GuestHeader } from "@/components/guest/GuestHeader";
import { Card } from "@/components/guest/primitives";
import { EmptyHint } from "@/components/guest/sections/CheckInSection";
import { videoEmbedUrl } from "@/lib/video";

export const dynamic = "force-dynamic";

export default async function VideoDetailScreen({
  params,
}: {
  params: Promise<{ token: string; id: string }>;
}) {
  const { token, id } = await params;
  const res = await getGuide(token);
  if (res.status !== "ok") return <GuestFallback status={res.status} />;

  const { guide } = res;
  const video = guide.media.find((m) => m.id === id && m.type === "video");
  const embedUrl = videoEmbedUrl(video?.url, { autoplay: true });
  const subtitle = (video?.metadata.subtitle as string) ?? "";
  const notes = (video?.metadata.notes as string) ?? "";

  return (
    <GuestScreen token={token} guide={guide} active="guides">
      <GuestHeader
        backHref={`/g/${token}/wifi-amenities`}
        eyebrow="Video guide"
        title={video?.caption || "Video"}
      />

      <div className="flex flex-col gap-3 px-4.5 pb-8 pt-4.5">
        {!video ? (
          <EmptyHint>This video guide isn&apos;t available.</EmptyHint>
        ) : (
          <>
            {subtitle && <p className="text-[13px] text-body">{subtitle}</p>}

            {video.url ? (
              <Card className="overflow-hidden">
                {embedUrl ? (
                  <div className="relative aspect-video">
                    <iframe
                      src={embedUrl}
                      title={video.caption ?? "Video"}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <video
                    src={video.url}
                    controls
                    autoPlay
                    playsInline
                    className="aspect-video w-full bg-black object-cover"
                  />
                )}
              </Card>
            ) : (
              <EmptyHint>No video has been added to this guide yet.</EmptyHint>
            )}

            {notes && (
              <Card className="px-4.5 py-4">
                <div className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-label">
                  Notes
                </div>
                <p className="mt-2 whitespace-pre-line text-[13.5px] leading-relaxed text-body">
                  {notes}
                </p>
              </Card>
            )}
          </>
        )}
      </div>
    </GuestScreen>
  );
}
