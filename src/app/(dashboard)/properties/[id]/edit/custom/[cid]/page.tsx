import { notFound } from "next/navigation";
import { requireAccount } from "@/lib/auth/session";
import { getHostProperty } from "@/lib/dashboard/queries";
import { CustomSectionEditor } from "@/components/dashboard/editors/CustomSectionEditor";
import { customBlocks } from "@/lib/guide/types";

export default async function EditCustomSectionPage({
  params,
}: {
  params: Promise<{ id: string; cid: string }>;
}) {
  const account = await requireAccount();
  const { id, cid } = await params;

  const data = await getHostProperty(id);
  if (!data) notFound();

  const section = data.customSections.find((s) => s.id === cid);
  if (!section) notFound();

  return (
    <CustomSectionEditor
      propertyId={id}
      sectionId={cid}
      name={section.title}
      hue={account.accent_hue}
      initial={customBlocks(section)}
    />
  );
}
