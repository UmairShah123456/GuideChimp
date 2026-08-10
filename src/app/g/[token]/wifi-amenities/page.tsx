import { notFound } from "next/navigation";
import { getGuide } from "@/lib/guide/resolve";
import { findSection, sectionContent } from "@/lib/guide/types";
import { sectionDisplayName, sectionPresent } from "@/lib/guide/defaults";
import { GuestScreen } from "@/components/guest/GuestScreen";
import { GuestFallback } from "@/components/guest/GuestFallback";
import {
  WifiAmenitiesSection,
  type PreviewVideo,
} from "@/components/guest/sections/WifiAmenitiesSection";

export const dynamic = "force-dynamic";

export default async function WifiAmenitiesScreen({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const res = await getGuide(token);
  if (res.status !== "ok") return <GuestFallback status={res.status} />;

  const { guide } = res;
  if (!sectionPresent(guide, "amenities")) notFound();

  const amenitiesSection = findSection(guide, "amenities");
  const videos: PreviewVideo[] = guide.media
    .filter((m) => m.type === "video" && m.guide_section_id === amenitiesSection?.id)
    .map((m) => ({
      id: m.id,
      title: m.caption ?? "Guide",
      subtitle: (m.metadata.subtitle as string) ?? undefined,
      url: m.url || undefined,
    }));

  return (
    <GuestScreen token={token} guide={guide} active="guides">
      <WifiAmenitiesSection
        token={token}
        heading={sectionDisplayName("amenities", guide.guide.section_titles)}
        amenities={sectionContent(guide, "amenities")}
        videos={videos}
      />
    </GuestScreen>
  );
}
