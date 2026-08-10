import { requireAccount } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default async function TeamPage() {
  const account = await requireAccount();
  const supabase = await createClient();
  const { count } = await supabase
    .from("account_members")
    .select("*", { count: "exact", head: true })
    .eq("account_id", account.id);

  return (
    <>
      <PageHeader title="Team" description="Invite collaborators to help manage your guides." />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-extrabold text-ink">Members</div>
              <div className="mt-1 text-[13px] text-body">
                {count ?? 1} {count === 1 ? "person" : "people"} on <strong>{account.name}</strong>.
              </div>
            </div>
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-[var(--radius-pill)] border-[1.5px] border-border px-4 py-2.5 text-sm font-bold text-muted"
              title="Coming soon"
            >
              Invite member
            </button>
          </div>
          <div className="mt-4 rounded-[var(--radius-card)] border-[1.5px] border-dashed border-border bg-page px-4 py-6 text-center text-[13px] text-muted">
            Team invitations are coming soon. The data model already supports
            owners and members — the invite flow lands in a later release.
          </div>
        </div>
      </div>
    </>
  );
}
