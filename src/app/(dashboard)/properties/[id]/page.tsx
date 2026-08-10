import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAccount } from "@/lib/auth/session";
import { getProperty, listGuides } from "@/lib/dashboard/queries";
import { guidePreset } from "@/lib/guide/presets";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { NewGuideButton } from "@/components/dashboard/NewGuideButton";
import { ChevronRight } from "@/components/guest/icons";

/**
 * A property's guides. This is the first screen after opening a property: one
 * row per audience (guests, cleaners, staff), each its own guide with its own
 * sections and link.
 */
export default async function PropertyGuides({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const account = await requireAccount();
  const { id } = await params;

  const [property, guides] = await Promise.all([getProperty(id), listGuides(id)]);
  if (!property) notFound();

  return (
    <>
      <PageHeader
        title={property.name}
        description={property.address ?? undefined}
        backHref="/dashboard"
        backLabel="All properties"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/properties/${id}/settings`}
              className="rounded-[var(--radius-pill)] border-[1.5px] border-border px-4 py-2 text-[13px] font-bold text-body hover:text-ink"
            >
              Property settings
            </Link>
            {guides.length > 0 && <NewGuideButton accountId={account.id} propertyId={id} />}
          </div>
        }
      />

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <h2 className="text-sm font-extrabold uppercase tracking-[0.08em] text-muted">
          Guides
        </h2>
        <p className="mt-1.5 text-[12.5px] text-muted">
          One guide per audience. Each has its own sections and its own link, so a
          cleaner never sees the guest guide and vice versa.
        </p>

        {guides.length === 0 ? (
          <div className="mt-4 flex flex-col items-center justify-center rounded-[var(--radius-lg)] border-[1.5px] border-dashed border-border bg-surface px-5 py-12 text-center sm:px-8 sm:py-14">
            <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-lg)] bg-accent-subtle text-2xl">
              📘
            </div>
            <h3 className="mt-4 text-lg font-extrabold text-ink">No guides yet</h3>
            <p className="mt-1 max-w-xs text-sm text-body">
              Create a guest guide, or one for your cleaners or team.
            </p>
            <div className="mt-5">
              <NewGuideButton accountId={account.id} propertyId={id} />
            </div>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-border overflow-hidden rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface">
            {guides.map((g) => {
              const preset = guidePreset(g.kind);
              const link = g.magic_links[0];
              const sectionCount = g.guide_sections.length + g.custom_sections.length;
              const meta = [
                `${sectionCount} ${sectionCount === 1 ? "section" : "sections"}`,
                link ? `${link.view_count} views` : "No link",
              ].join(" · ");

              return (
                <Link
                  key={g.id}
                  href={`/properties/${id}/guides/${g.id}`}
                  className="flex items-center gap-3.5 px-4 py-4 hover:bg-page"
                >
                  <span
                    aria-hidden
                    className="flex h-10 w-10 flex-none items-center justify-center rounded-[var(--radius-sm)] bg-accent-subtle text-lg"
                  >
                    {preset.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[15px] font-bold text-ink">{g.name}</div>
                    <div className="text-[12.5px] text-muted">{meta}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 flex-none text-muted" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
