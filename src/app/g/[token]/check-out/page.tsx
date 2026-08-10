import { notFound } from "next/navigation";
import { getGuide } from "@/lib/guide/resolve";
import { sectionContent } from "@/lib/guide/types";
import { sectionDisplayName, sectionPresent } from "@/lib/guide/defaults";
import { GuestScreen } from "@/components/guest/GuestScreen";
import { GuestFallback } from "@/components/guest/GuestFallback";
import { CheckOutSection } from "@/components/guest/sections/CheckOutSection";

export const dynamic = "force-dynamic";

export default async function CheckOutScreen({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const res = await getGuide(token);
  if (res.status !== "ok") return <GuestFallback status={res.status} />;

  const { guide } = res;
  if (!sectionPresent(guide, "check_out")) notFound();

  return (
    <GuestScreen token={token} guide={guide} active="rules">
      <CheckOutSection
        token={token}
        heading={sectionDisplayName("check_out", guide.guide.section_titles)}
        checkout={sectionContent(guide, "check_out")}
      />
    </GuestScreen>
  );
}
