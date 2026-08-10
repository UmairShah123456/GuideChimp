import { notFound } from "next/navigation";
import { getGuide } from "@/lib/guide/resolve";
import { sectionContent } from "@/lib/guide/types";
import { sectionDisplayName, sectionPresent } from "@/lib/guide/defaults";
import { GuestScreen } from "@/components/guest/GuestScreen";
import { GuestFallback } from "@/components/guest/GuestFallback";
import { ContactSection } from "@/components/guest/sections/ContactSection";

export const dynamic = "force-dynamic";

export default async function ContactScreen({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const res = await getGuide(token);
  if (res.status !== "ok") return <GuestFallback status={res.status} />;

  const { guide } = res;
  if (!sectionPresent(guide, "emergency_contacts")) notFound();

  return (
    <GuestScreen token={token} guide={guide} active="contact">
      <ContactSection
        token={token}
        heading={sectionDisplayName("emergency_contacts", guide.guide.section_titles)}
        contact={sectionContent(guide, "emergency_contacts")}
      />
    </GuestScreen>
  );
}
