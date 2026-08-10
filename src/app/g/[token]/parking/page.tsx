import { notFound } from "next/navigation";
import { getGuide } from "@/lib/guide/resolve";
import { sectionContent } from "@/lib/guide/types";
import { sectionDisplayName, sectionPresent } from "@/lib/guide/defaults";
import { GuestScreen } from "@/components/guest/GuestScreen";
import { GuestFallback } from "@/components/guest/GuestFallback";
import { ParkingSection } from "@/components/guest/sections/ParkingSection";

export const dynamic = "force-dynamic";

export default async function ParkingScreen({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const res = await getGuide(token);
  if (res.status !== "ok") return <GuestFallback status={res.status} />;

  const { guide } = res;
  if (!sectionPresent(guide, "parking")) notFound();

  return (
    <GuestScreen token={token} guide={guide} active="home">
      <ParkingSection
        token={token}
        heading={sectionDisplayName("parking", guide.guide.section_titles)}
        parking={sectionContent(guide, "parking")}
      />
    </GuestScreen>
  );
}
