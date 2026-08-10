import { notFound } from "next/navigation";
import { requireAccount } from "@/lib/auth/session";
import { getHostGuide } from "@/lib/dashboard/queries";
import { guidePreset } from "@/lib/guide/presets";
import { env } from "@/lib/env";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { MagicLinkCard } from "@/components/dashboard/MagicLinkCard";
import { LinkSettingsForm } from "@/components/dashboard/LinkSettingsForm";

export default async function LinkSettingsPage({
  params,
}: {
  params: Promise<{ id: string; gid: string }>;
}) {
  await requireAccount();
  const { id, gid } = await params;
  const data = await getHostGuide(gid);
  if (!data || data.property?.id !== id) notFound();

  const { property, guide, link } = data;
  const audience = guidePreset(guide.kind).kind === "guest" ? "guests" : "your team";

  return (
    <>
      <PageHeader
        title="Link settings"
        description={`${guide.name} · ${property.name}`}
        backHref={`/properties/${id}/guides/${gid}`}
        backLabel="Back to guide"
      />
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-8 py-8">
        <MagicLinkCard
          propertyId={id}
          guideId={gid}
          guideName={guide.name}
          token={link?.token ?? null}
          appUrl={env.appUrl}
          viewCount={link?.view_count ?? 0}
          expiresAt={link?.expires_at ?? null}
          hasPin={Boolean(link?.pin)}
        />
        <LinkSettingsForm
          propertyId={id}
          guideId={gid}
          audience={audience}
          expiresAt={link?.expires_at ?? null}
          pin={link?.pin ?? null}
        />
      </div>
    </>
  );
}
