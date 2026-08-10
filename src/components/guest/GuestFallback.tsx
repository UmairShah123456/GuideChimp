/**
 * Friendly dead-end for expired or invalid magic links (design 2f). Never a raw
 * 404 — always calm, with a single reassuring action.
 */
export function GuestFallback({
  status,
}: {
  status: "expired" | "not_found";
}) {
  const expired = status === "expired";
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-page">
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-accent-subtle">
          <div className="h-10 w-10 rotate-12 rounded-[var(--radius-code)] bg-brand" />
        </div>
        <h1 className="mt-6 whitespace-pre-line text-[26px] font-extrabold leading-[1.15] text-ink">
          {expired ? "This link has\nchecked out" : "We couldn't find\nthat guide"}
        </h1>
        <p className="mt-3 max-w-[280px] text-sm leading-relaxed text-body">
          {expired
            ? "Guide links expire after your stay ends. If you think that's a mistake, your host can send a fresh one in seconds."
            : "This link doesn't match any guide. Double-check it, or ask your host to resend it."}
        </p>
        <a
          href="mailto:"
          className="mt-6 rounded-[var(--radius-pill)] bg-brand px-7 py-3.5 text-[14.5px] font-bold text-brand-contrast"
        >
          Message the host
        </a>
        {expired && (
          <p className="mt-3.5 text-[12.5px] text-label">
            Booking again? Your new link arrives before check-in.
          </p>
        )}
      </div>
      <div className="pb-6 text-center text-[11px] font-semibold tracking-[0.06em] text-nav-idle">
        POWERED BY HOMEHAWK
      </div>
    </div>
  );
}
