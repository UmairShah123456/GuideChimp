import { notFound } from "next/navigation";
import { requireAccount } from "@/lib/auth/session";
import { getProperty } from "@/lib/dashboard/queries";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { PropertyDetailsForm } from "@/components/dashboard/PropertyDetailsForm";
import { DeletePropertyButton } from "@/components/dashboard/DeletePropertyButton";

/**
 * Property-level details — name, address, hero image. These are facts about the
 * building, shared by every guide on it, which is why they live here rather
 * than on any one guide.
 */
export default async function PropertySettings({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAccount();
  const { id } = await params;
  const property = await getProperty(id);
  if (!property) notFound();

  return (
    <>
      <PageHeader
        title="Property settings"
        description={property.name}
        backHref={`/properties/${id}`}
        backLabel="Back to guides"
      />

      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface p-4 sm:p-5">
          <h2 className="mb-1 text-sm font-extrabold uppercase tracking-[0.08em] text-muted">
            Property details
          </h2>
          <p className="mb-4 text-[12.5px] text-muted">
            Shared by every guide on this property.
          </p>
          <PropertyDetailsForm property={property} />
        </div>

        {/* Sits below the details form, in its own red-edged card and labelled
            for what it is. As a quiet outline button in the page header it read
            as just another action, and it's the one control here that can't be
            undone. */}
        <div className="rounded-[var(--radius-lg)] border-[1.5px] border-danger-ring bg-surface p-4 sm:p-5">
          <h2 className="mb-1 text-sm font-extrabold uppercase tracking-[0.08em] text-danger">
            Danger zone
          </h2>
          <p className="mb-4 text-[12.5px] text-muted">
            Deleting <strong className="text-ink">{property.name}</strong> removes every
            guide on it, their photos and videos, and their magic links. Guest links stop
            working immediately. This can&apos;t be undone.
          </p>
          <DeletePropertyButton propertyId={property.id} propertyName={property.name} />
        </div>
      </div>
    </>
  );
}
