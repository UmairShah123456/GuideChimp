import { notFound } from "next/navigation";
import { requireAccount } from "@/lib/auth/session";
import { getHostProperty } from "@/lib/dashboard/queries";
import { SECTION_META, sectionEnabled } from "@/lib/guide/defaults";
import { env } from "@/lib/env";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { MagicLinkCard } from "@/components/dashboard/MagicLinkCard";
import { PropertyDetailsForm } from "@/components/dashboard/PropertyDetailsForm";
import { DeletePropertyButton } from "@/components/dashboard/DeletePropertyButton";
import { SectionList, type SectionRow } from "@/components/dashboard/SectionList";

export default async function PropertyOverview({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAccount();
  const { id } = await params;
  const data = await getHostProperty(id);
  if (!data) notFound();

  const { property, customSections, link } = data;
  const overrides = property.section_titles ?? {};

  const sectionRows: SectionRow[] = SECTION_META.map((s) => {
    const ov = overrides[s.type] ?? {};
    return {
      type: s.type,
      slug: s.type.replace("_", "-"),
      title: ov.title?.trim() || s.label,
      blurb: ov.subtitle?.trim() || s.blurb,
      defaultTitle: s.label,
      defaultBlurb: s.blurb,
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
        title={property.name}
        description={property.address ?? undefined}
        backHref="/dashboard"
        backLabel="All properties"
        actions={<DeletePropertyButton propertyId={property.id} propertyName={property.name} />}
      />

      <div className="mx-auto grid max-w-5xl gap-6 px-8 py-8 lg:grid-cols-[1fr_360px]">
        <SectionList propertyId={property.id} rows={sectionRows} custom={customRows} />

        {/* Right rail: link + details */}
        <aside className="flex flex-col gap-6">
          <MagicLinkCard
            propertyId={property.id}
            token={link?.token ?? null}
            appUrl={env.appUrl}
            viewCount={link?.view_count ?? 0}
            expiresAt={link?.expires_at ?? null}
            hasPin={Boolean(link?.pin)}
          />
          <div className="rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface p-5">
            <h2 className="mb-4 text-sm font-extrabold uppercase tracking-[0.08em] text-muted">
              Property details
            </h2>
            <PropertyDetailsForm property={property} />
          </div>
        </aside>
      </div>
    </>
  );
}
