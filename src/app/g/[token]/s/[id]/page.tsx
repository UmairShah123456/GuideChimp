import { notFound } from "next/navigation";
import { getGuide } from "@/lib/guide/resolve";
import { GuestScreen } from "@/components/guest/GuestScreen";
import { GuestFallback } from "@/components/guest/GuestFallback";
import { CustomSection } from "@/components/guest/sections/CustomSection";

export const dynamic = "force-dynamic";

export default async function CustomSectionScreen({
  params,
}: {
  params: Promise<{ token: string; id: string }>;
}) {
  const { token, id } = await params;
  const res = await getGuide(token);
  if (res.status !== "ok") return <GuestFallback status={res.status} />;

  const { guide } = res;
  const section = guide.customSections.find((s) => s.id === id);
  if (!section) notFound();

  return (
    <GuestScreen token={token} guide={guide} active="home">
      <CustomSection token={token} section={section} />
    </GuestScreen>
  );
}
