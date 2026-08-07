import Link from "next/link";
import Image from "next/image";
import { requireAccount } from "@/lib/auth/session";
import { listProperties } from "@/lib/dashboard/queries";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { NewPropertyButton } from "@/components/dashboard/NewPropertyButton";

export default async function DashboardPage() {
  await requireAccount();
  const properties = await listProperties();

  return (
    <>
      <PageHeader
        title="Properties"
        description="Each property can have guides for guests, cleaners and staff."
        actions={properties.length > 0 ? <NewPropertyButton /> : undefined}
      />

      <div className="mx-auto max-w-5xl px-8 py-8">
        {properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border-[1.5px] border-dashed border-border bg-surface px-8 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-[var(--radius-lg)] bg-accent-subtle text-2xl">
              🏠
            </div>
            <h2 className="mt-4 text-lg font-extrabold text-ink">No properties yet</h2>
            <p className="mt-1 max-w-xs text-sm text-body">
              Add your first property to start building its guest guide.
            </p>
            <div className="mt-5">
              <NewPropertyButton />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => {
              // A property has many guides now, so the card counts guides
              // rather than showing one link's views.
              const count = p.guides.length;
              return (
                <Link
                  key={p.id}
                  href={`/properties/${p.id}`}
                  className="group overflow-hidden rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface transition-shadow hover:shadow-[0_6px_20px_rgba(23,36,46,0.08)]"
                >
                  <div className="relative h-36">
                    {p.hero_image_url ? (
                      <Image src={p.hero_image_url} alt={p.name} fill className="object-cover" />
                    ) : (
                      <div className="placeholder-tile h-full w-full" />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="font-bold text-ink">{p.name}</div>
                    {p.address && (
                      <div className="mt-0.5 line-clamp-1 text-[13px] text-muted">{p.address}</div>
                    )}
                    <div className="mt-3 flex items-center justify-between text-xs text-muted">
                      <span>
                        {count === 0
                          ? "No guides"
                          : `${count} ${count === 1 ? "guide" : "guides"}`}
                      </span>
                      <span className="font-semibold text-accent">Open →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
