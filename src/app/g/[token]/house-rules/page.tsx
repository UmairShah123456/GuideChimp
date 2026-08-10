import { notFound } from "next/navigation";
import { getGuide } from "@/lib/guide/resolve";
import { sectionContent } from "@/lib/guide/types";
import { sectionDisplayName, sectionPresent } from "@/lib/guide/defaults";
import { GuestScreen } from "@/components/guest/GuestScreen";
import { GuestFallback } from "@/components/guest/GuestFallback";
import { HouseRulesSection } from "@/components/guest/sections/HouseRulesSection";

export const dynamic = "force-dynamic";

export default async function HouseRulesScreen({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const res = await getGuide(token);
  if (res.status !== "ok") return <GuestFallback status={res.status} />;

  const { guide } = res;
  if (!sectionPresent(guide, "house_rules")) notFound();

  return (
    <GuestScreen token={token} guide={guide} active="rules">
      <HouseRulesSection
        token={token}
        heading={sectionDisplayName("house_rules", guide.guide.section_titles)}
        rules={sectionContent(guide, "house_rules")}
      />
    </GuestScreen>
  );
}
