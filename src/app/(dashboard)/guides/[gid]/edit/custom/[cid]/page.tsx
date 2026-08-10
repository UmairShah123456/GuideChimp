import { notFound } from "next/navigation";
import { requireAccount } from "@/lib/auth/session";
import { getHostGuide } from "@/lib/dashboard/queries";
import { CustomSectionEditor } from "@/components/dashboard/editors/CustomSectionEditor";
import { customBlocks } from "@/lib/guide/types";

export default async function EditCompanySection({
  params,
}: {
  params: Promise<{ gid: string; cid: string }>;
}) {
  const account = await requireAccount();
  const { gid, cid } = await params;

  const data = await getHostGuide(gid);
  if (!data || data.guide.property_id || data.guide.account_id !== account.id) {
    notFound();
  }

  const section = data.customSections.find((s) => s.id === cid);
  if (!section) notFound();

  return (
    <CustomSectionEditor
      propertyId={null}
      guideId={gid}
      sectionId={cid}
      name={section.title}
      branding={account}
      initial={customBlocks(section)}
    />
  );
}
