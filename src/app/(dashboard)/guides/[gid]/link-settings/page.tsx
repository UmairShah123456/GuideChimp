import { notFound } from "next/navigation";
import { requireAccount } from "@/lib/auth/session";
import { getHostGuide } from "@/lib/dashboard/queries";
import { env } from "@/lib/env";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { MagicLinkCard } from "@/components/dashboard/MagicLinkCard";
import { LinkSettingsForm } from "@/components/dashboard/LinkSettingsForm";

export default async function CompanyLinkSettings({
  params,
}: {
  params: Promise<{ gid: string }>;
}) {
  const account = await requireAccount();
  const { gid } = await params;
  const data = await getHostGuide(gid);
  if (!data || data.guide.property_id || data.guide.account_id !== account.id) {
    notFound();
  }

  const { guide, link } = data;

  return (
    <>
      <PageHeader
        title="Link settings"
        description={guide.name}
        backHref={`/guides/${gid}`}
        backLabel="Back to guide"
      />
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-8 py-8">
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
        <LinkSettingsForm
          propertyId={null}
          guideId={gid}
          audience="your team"
          expiresAt={link?.expires_at ?? null}
          pin={link?.pin ?? null}
        />
      </div>
    </>
  );
}
