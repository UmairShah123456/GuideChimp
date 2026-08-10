/**
 * Plan and usage summary. Lives on the account page rather than a route of its
 * own — there is one plan per account, and it's a card's worth of information.
 */
export function BillingCard({ propertyCount }: { propertyCount: number }) {
  return (
    <div className="rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
            Current plan
          </div>
          <div className="mt-1 text-2xl font-extrabold text-ink">Free</div>
        </div>
        <button
          type="button"
          disabled
          className="cursor-not-allowed rounded-[var(--radius-pill)] bg-brand px-5 py-2.5 text-sm font-bold text-brand-contrast opacity-60"
          title="Coming soon"
        >
          Upgrade
        </button>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="rounded-[var(--radius-card)] border-[1.5px] border-border bg-page p-4">
          <div className="text-2xl font-extrabold text-ink">{propertyCount}</div>
          <div className="text-[13px] text-muted">
            {propertyCount === 1 ? "Property" : "Properties"}
          </div>
        </div>
        <div className="rounded-[var(--radius-card)] border-[1.5px] border-border bg-page p-4">
          <div className="text-2xl font-extrabold text-ink">Unlimited</div>
          <div className="text-[13px] text-muted">Guests per link</div>
        </div>
      </div>
      <p className="mt-5 text-[13px] text-body">
        Billing is a stub for now — everything is free while GuideChimp is in
        development. Paid plans and invoicing come later.
      </p>
    </div>
  );
}
