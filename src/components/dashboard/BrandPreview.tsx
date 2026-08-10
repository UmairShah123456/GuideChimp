"use client";

import { ThemeScope } from "@/components/guest/ThemeScope";
import { BrandLogo } from "@/components/guest/BrandLogo";
import type { LogoBackdrop } from "@/components/guest/BrandLogo";
import type { Branding } from "@/lib/branding/vars";

/**
 * A miniature guest screen rendered with the branding currently selected in the
 * account form. It is deliberately built from the same tokens as the real
 * portal (`bg-brand`, `text-brand-contrast`, `bg-accent-subtle`, `--radius-*`,
 * `font-display`) rather than hand-picked colours, so what a host sees here is
 * what their guests get — including the contrast decisions we make for them.
 */
export function BrandPreview({
  branding,
  accountName,
  logoUrl,
  logoBackdrop = "soft",
  className = "",
}: {
  branding: Branding;
  accountName: string;
  logoUrl: string | null;
  logoBackdrop?: LogoBackdrop;
  className?: string;
}) {
  return (
    <ThemeScope
      branding={branding}
      className={`overflow-hidden rounded-[26px] border-[6px] border-ink bg-page ${className}`}
    >
      <header className="rounded-b-[var(--radius-header)] bg-brand px-5 pb-6 pt-5 text-brand-contrast">
        {logoUrl ? (
          <BrandLogo
            url={logoUrl}
            name={accountName}
            backdrop={logoBackdrop}
            height="h-7"
            className={"mb-3"}
          />
        ) : (
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-brand-soft">
            {accountName}
          </div>
        )}
        <h2 className="font-display text-[26px] font-extrabold leading-[1.1]">
          {"Hiya!\nYou're in the right place."}
        </h2>
        <p className="mt-2 text-[13px] text-brand-soft">Aspects Court · Slough SL1 2EZ</p>
        <div className="mt-3.5 flex flex-wrap gap-2">
          {["Check-in from 3pm", "Checkout 10am"].map((chip) => (
            <span
              key={chip}
              className="rounded-[var(--radius-pill)] bg-brand-contrast/15 px-3 py-1.5 text-[11.5px] font-bold"
            >
              {chip}
            </span>
          ))}
        </div>
      </header>

      <div className="flex flex-col gap-2.5 px-4 pb-5 pt-4">
        <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-label">
          Getting in
        </div>

        <div className="flex items-center justify-between rounded-[var(--radius-card)] border-[1.5px] border-border bg-surface px-4 py-3.5">
          <div>
            <div className="text-[14px] font-bold text-ink">Wi-Fi</div>
            <div className="mt-0.5 text-[12px] text-muted">Network and password</div>
          </div>
          <span className="rounded-[var(--radius-pill)] bg-accent-subtle px-3 py-1.5 text-[11.5px] font-bold text-accent">
            Copy
          </span>
        </div>

        <div className="rounded-[var(--radius-card)] border-[1.5px] border-accent-ring bg-accent-tint px-4 py-3.5">
          <div className="text-[12.5px] font-bold text-accent">Directions →</div>
          <div className="mt-1 text-[12px] text-body">Tinted panels follow your colour too.</div>
        </div>

        <div className="mt-1 flex items-center gap-2.5">
          <span className="rounded-[var(--radius-pill)] bg-brand px-4 py-2.5 text-[12.5px] font-bold text-brand-contrast">
            Primary action
          </span>
          <span className="rounded-[var(--radius-pill)] border-[1.5px] border-border px-4 py-2.5 text-[12.5px] font-bold text-ink">
            Secondary
          </span>
        </div>
      </div>
    </ThemeScope>
  );
}
