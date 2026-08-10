import { notFound } from "next/navigation";
import { requireAccount } from "@/lib/auth/session";
import { getHostGuide } from "@/lib/dashboard/queries";
import {
  SECTION_META,
  sectionDisplayBlurb,
  sectionDisplayName,
  sectionEnabled,
} from "@/lib/guide/defaults";
import { guidePreset } from "@/lib/guide/presets";
import { env } from "@/lib/env";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { MagicLinkCard } from "@/components/dashboard/MagicLinkCard";
import { PropertyPhotoCard } from "@/components/dashboard/PropertyPhotoCard";
import { DeleteGuideButton } from "@/components/dashboard/DeleteGuideButton";
import { SectionList, type SectionRow } from "@/components/dashboard/SectionList";

export default async function GuideOverview({
  params,
}: {
  params: Promise<{ id: string; gid: string }>;
}) {
  await requireAccount();
  const { id, gid } = await params;
  const data = await getHostGuide(gid);
  // Guard the pairing as well as existence, so a guide id from another property
  // can't be opened under this one's URL.
  if (!data || data.property?.id !== id) notFound();

  const { property, guide, sections, customSections, link } = data;
  const overrides = guide.section_titles ?? {};
  const preset = guidePreset(guide.kind);
  const audience = preset.kind === "guest" ? "guests" : "your team";

  // Only the built-ins this guide actually has — staff guides have none.
  const present = new Set(sections.map((s) => s.type));
  // Names come from the shared resolvers, not from SECTION_META directly, so
  // this list reads exactly as the guest's home screen does. The `default*`
  // fields are the rename fields' placeholders, and are the guest-facing
  // defaults for the same reason: a placeholder showing "Check-in" while guests
  // see "Getting in" tells the host the wrong thing about what clearing it does.
  const sectionRows: SectionRow[] = SECTION_META.filter((s) => present.has(s.type)).map((s) => {
    const ov = overrides[s.type] ?? {};
    return {
      type: s.type,
      slug: s.type.replace("_", "-"),
      title: sectionDisplayName(s.type, overrides),
      blurb: sectionDisplayBlurb(s.type, overrides),
      defaultTitle: sectionDisplayName(s.type),
      defaultBlurb: sectionDisplayBlurb(s.type),
      overrideTitle: ov.title ?? "",
      overrideSubtitle: ov.subtitle ?? "",
      enabled: sectionEnabled(s.type, overrides),
    };
  });
  const customRows = customSections.map((c) => ({
    id: c.id,
    title: c.title,
    enabled: c.enabled,
  }));

  return (
    <>
      <PageHeader
        title={guide.name}
        description={`${preset.label} · ${property.name}`}
        backHref={`/properties/${id}`}
        backLabel={`All guides for ${property.name}`}
        actions={
          <DeleteGuideButton propertyId={id} guideId={gid} guideName={guide.name} />
        }
      />

      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-8">
        <SectionList
          propertyId={id}
          guideId={gid}
          rows={sectionRows}
          custom={customRows}
          audience={audience}
        />

        <aside className="flex flex-col gap-6">
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

          <PropertyPhotoCard
            propertyId={property.id}
            propertyName={property.name}
            initialUrl={property.hero_image_url}
          />
        </aside>
      </div>
    </>
  );
}
