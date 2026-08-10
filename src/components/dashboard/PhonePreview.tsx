"use client";

import type { ReactNode } from "react";
import { ThemeScope } from "@/components/guest/ThemeScope";
import type { Branding } from "@/lib/branding/vars";

/**
 * Renders a guide section inside a phone-shaped frame with the account's full
 * branding — the live preview that mirrors the real guest render as the host edits.
 */
export function PhonePreview({ branding, children }: { branding: Branding; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted">
        Live guest preview
      </div>
      <ThemeScope
        branding={branding}
        className="mt-3 w-full max-w-[390px] overflow-hidden rounded-[32px] border-[6px] border-ink bg-page shadow-[0_12px_40px_rgba(23,36,46,0.18)]"
      >
        {/* On touch screens the frame grows instead of scrolling internally —
            nested scroll areas are miserable to flick through. */}
        <div className="lg:max-h-[720px] lg:overflow-y-auto">{children}</div>
        <div className="flex justify-around border-t border-border bg-surface/95 px-2 py-3 backdrop-blur">
          {["Home", "Guides", "Local", "Rules", "Contact"].map((t) => (
            <span key={t} className="text-[10px] font-semibold text-muted">
              {t}
            </span>
          ))}
        </div>
      </ThemeScope>
    </div>
  );
}
