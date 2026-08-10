import Link from "next/link";
import { requireAccount } from "@/lib/auth/session";
import { listAccountGuides } from "@/lib/dashboard/queries";
import { guidePreset } from "@/lib/guide/presets";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { NewGuideButton } from "@/components/dashboard/NewGuideButton";
import { ChevronRight } from "@/components/guest/icons";

/**
 * Company guides: processes that belong to the business rather than any one
 * property — running a background check, how a VA handles the inbox, what to do
 * about a chargeback. They apply across every property, so they live here.
 */
export default async function CompanyGuides() {
  const account = await requireAccount();
  const guides = await listAccountGuides(account.id);

  return (
    <>
      <PageHeader
        title="Company guides"
        description="Processes that apply across every property, not just one."
        actions={
          guides.length > 0 ? <NewGuideButton accountId={account.id} /> : undefined
        }
      />

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {guides.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border-[1.5px] border-dashed border-border bg-surface px-5 py-12 text-center sm:px-8 sm:py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-[var(--radius-lg)] bg-accent-subtle text-2xl">
              🗂️
            </div>
            <h2 className="mt-4 text-lg font-extrabold text-ink">No company guides yet</h2>
            <p className="mt-1 max-w-sm text-sm text-body">
              For anything that isn&apos;t about one property — how to run a guest
              background check, how your VA handles the inbox, what to do about a
              chargeback.
            </p>
            <div className="mt-5">
              <NewGuideButton accountId={account.id} />
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border overflow-hidden rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface">
            {guides.map((g) => {
              const preset = guidePreset(g.kind);
              const link = g.magic_links[0];
              const count = g.guide_sections.length + g.custom_sections.length;
              const meta = [
                `${count} ${count === 1 ? "section" : "sections"}`,
                link ? `${link.view_count} views` : "No link",
              ].join(" · ");

              return (
                <Link
                  key={g.id}
                  href={`/guides/${g.id}`}
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
