import { notFound } from "next/navigation";
import { getGuide } from "@/lib/guide/resolve";
import { sectionDisplayName, sectionPresent } from "@/lib/guide/defaults";
import { GuestScreen } from "@/components/guest/GuestScreen";
import { GuestFallback } from "@/components/guest/GuestFallback";
import { LocalGuideSection } from "@/components/guest/sections/LocalGuideSection";

export const dynamic = "force-dynamic";

export default async function LocalGuideScreen({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const res = await getGuide(token);
  if (res.status !== "ok") return <GuestFallback status={res.status} />;

  const { guide } = res;
  if (!sectionPresent(guide, "local_guide")) notFound();

  return (
    <GuestScreen token={token} guide={guide} active="local">
      <LocalGuideSection
        token={token}
        heading={sectionDisplayName("local_guide", guide.guide.section_titles)}
        entries={guide.localEntries}
      />
    </GuestScreen>
  );
}
