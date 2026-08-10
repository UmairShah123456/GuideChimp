import { GuestHeader } from "@/components/guest/GuestHeader";
import { Card, Placeholder, SectionLabel } from "@/components/guest/primitives";
import { MapCard } from "@/components/guest/MapCard";
import { Linkify } from "@/components/guest/Linkify";
import { EmptyHint } from "./CheckInSection";
import { videoEmbedUrl } from "@/lib/video";
import { customBlocks, type CustomBlock, type CustomSectionRow } from "@/lib/guide/types";

/**
 * Guest render of a host-authored custom section: the title becomes the page
 * heading (no eyebrow), followed by the section's content blocks rendered in
 * the order the host arranged them. Shared by the guest route and the editor's
 * live preview, so `section` may be a partial draft.
 */
export function CustomSection({
  token,
  section,
}: {
  token?: string;
  section: Pick<CustomSectionRow, "title" | "blocks" | "body">;
}) {
  const blocks = customBlocks(section);

  return (
    <>
      <GuestHeader
        backHref={token ? `/g/${token}` : undefined}
        title={section.title.trim() || "Untitled section"}
      />

      <div className="flex flex-col gap-4 px-4.5 pb-8 pt-4.5">
        {blocks.length > 0 ? (
          blocks.map((block) => <BlockView key={block.id} block={block} />)
        ) : (
          <EmptyHint>Add some details for this section.</EmptyHint>
        )}
      </div>
    </>
  );
}

/** Renders a single custom-section block for the guest. */
function BlockView({ block }: { block: CustomBlock }) {
  switch (block.type) {
    case "text": {
      const body = block.body?.trim();
      if (!body) return null;
      return (
        <p className="whitespace-pre-line break-words text-[15px] leading-relaxed text-body">
          <Linkify>{body}</Linkify>
        </p>
      );
    }

    case "map":
      return block.address?.trim() ? <MapCard address={block.address} /> : null;

    case "video": {
      if (!block.url?.trim()) return null;
      const embedUrl = videoEmbedUrl(block.url);
      return (
        <Card className="overflow-hidden">
          {embedUrl ? (
            <div className="relative aspect-video">
              <iframe
                src={embedUrl}
                title="Video"
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <video
              src={block.url}
              controls
              playsInline
              className="aspect-video w-full bg-black object-cover"
            />
          )}
        </Card>
      );
    }

    case "photo": {
      const caption = block.caption?.trim();
      if (!block.url?.trim()) {
        return caption ? (
          <Placeholder caption={caption} className="h-40 rounded-[var(--radius-card)]" />
        ) : null;
      }
      return (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.url}
            alt={caption || ""}
            className="w-full rounded-[var(--radius-card)] border-[1.5px] border-border object-cover"
          />
          {caption && <figcaption className="mt-1.5 text-[11px] text-muted">{caption}</figcaption>}
        </figure>
      );
    }

    case "steps": {
      const steps = block.steps.filter((s) => s.title?.trim() || s.body?.trim() || s.photoUrl);
      if (steps.length === 0) return null;
      return (
        <div className="flex flex-col gap-3">
          <SectionLabel>Steps</SectionLabel>
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
                      <figcaption className="mt-1.5 text-[11px] text-muted">
                        {step.photoCaption}
                      </figcaption>
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
      );
    }
  }
}
