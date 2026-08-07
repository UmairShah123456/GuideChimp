import { notFound } from "next/navigation";
import { requireAccount } from "@/lib/auth/session";
import { getHostGuide } from "@/lib/dashboard/queries";
import { CustomSectionEditor } from "@/components/dashboard/editors/CustomSectionEditor";
import { customBlocks } from "@/lib/guide/types";

export default async function EditCustomSectionPage({
  params,
}: {
  params: Promise<{ id: string; gid: string; cid: string }>;
}) {
  const account = await requireAccount();
  const { id, gid, cid } = await params;

  const data = await getHostGuide(gid);
  if (!data || data.property.id !== id) notFound();

  const section = data.customSections.find((s) => s.id === cid);
  if (!section) notFound();

  return (
    <CustomSectionEditor
      propertyId={id}
      guideId={gid}
      sectionId={cid}
      name={section.title}
      hue={account.accent_hue}
      initial={customBlocks(section)}
    />
  );
}
