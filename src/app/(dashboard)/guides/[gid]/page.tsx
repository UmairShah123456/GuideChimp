import { notFound } from "next/navigation";
import { requireAccount } from "@/lib/auth/session";
import { getHostGuide } from "@/lib/dashboard/queries";
import { guidePreset } from "@/lib/guide/presets";
import { env } from "@/lib/env";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { MagicLinkCard } from "@/components/dashboard/MagicLinkCard";
import { DeleteGuideButton } from "@/components/dashboard/DeleteGuideButton";
import { SectionList } from "@/components/dashboard/SectionList";

/** One company guide. Account-level, so it has no property and no built-ins. */
export default async function CompanyGuideOverview({
  params,
}: {
  params: Promise<{ gid: string }>;
}) {
  const account = await requireAccount();
  const { gid } = await params;
  const data = await getHostGuide(gid);
  // Must exist, be account-level, and belong to this account.
  if (!data || data.guide.property_id || data.guide.account_id !== account.id) {
    notFound();
  }

  const { guide, customSections, link } = data;
  const preset = guidePreset(guide.kind);

  return (
    <>
      <PageHeader
        title={guide.name}
        description={`${preset.label} · applies to all properties`}
        backHref="/guides"
        backLabel="All company guides"
        actions={<DeleteGuideButton propertyId={null} guideId={gid} guideName={guide.name} />}
      />

      <div className="mx-auto grid max-w-5xl gap-6 px-8 py-8 lg:grid-cols-[1fr_360px]">
        <SectionList
          propertyId={null}
          guideId={gid}
          rows={[]}
          custom={customSections.map((c) => ({ id: c.id, title: c.title, enabled: c.enabled }))}
          audience="your team"
        />

        <aside className="flex flex-col gap-6">
          <MagicLinkCard
            propertyId={null}
            guideId={gid}
            guideName={guide.name}
            token={link?.token ?? null}
            appUrl={env.appUrl}
            viewCount={link?.view_count ?? 0}
            expiresAt={link?.expires_at ?? null}
            hasPin={Boolean(link?.pin)}
          />
        </aside>
      </div>
    </>
  );
}
