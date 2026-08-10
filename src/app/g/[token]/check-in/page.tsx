import { notFound } from "next/navigation";
import { getGuide } from "@/lib/guide/resolve";
import { sectionContent } from "@/lib/guide/types";
import { sectionDisplayName, sectionPresent } from "@/lib/guide/defaults";
import { GuestScreen } from "@/components/guest/GuestScreen";
import { GuestFallback } from "@/components/guest/GuestFallback";
import { CheckInSection } from "@/components/guest/sections/CheckInSection";

export const dynamic = "force-dynamic";

export default async function CheckInScreen({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const res = await getGuide(token);
  if (res.status !== "ok") return <GuestFallback status={res.status} />;

  const { guide } = res;
  if (!sectionPresent(guide, "check_in")) notFound();

  return (
    <GuestScreen token={token} guide={guide} active="home">
      <CheckInSection
        token={token}
        heading={sectionDisplayName("check_in", guide.guide.section_titles)}
        checkIn={sectionContent(guide, "check_in")}
      />
    </GuestScreen>
  );
}
