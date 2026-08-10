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
        actions={
          <DeletePropertyButton propertyId={property.id} propertyName={property.name} />
        }
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
      </div>
    </>
  );
}
