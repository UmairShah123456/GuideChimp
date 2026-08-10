import type { ReactNode } from "react";
import { CopyButton } from "./CopyButton";

/** Uppercase muted section heading ("First things first"). */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-label">
      {children}
    </div>
  );
}

/** Standard white content card with the warm 1.5px border. */
export function Card({
  children,
  className = "",
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  return (
    <As
      className={`rounded-[var(--radius-card)] border-[1.5px] border-border bg-surface ${className}`}
    >
      {children}
    </As>
  );
}

/** Dashed "ticket" block holding a copyable code (door code, lockbox). */
export function CodeTicket({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-[var(--radius-code)] border-[1.5px] border-dashed border-code-ring bg-code-surface px-3.5 py-3">
      <div>
        <div className="text-[10.5px] font-bold tracking-[0.08em] text-muted">
          {label}
        </div>
        <div className="text-[22px] font-extrabold tracking-[0.14em] text-ink">
          {value}
        </div>
      </div>
      <CopyButton value={value} />
    </div>
  );
}

/** Soft accent callout with an "i" bubble. */
export function InfoNote({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 rounded-[var(--radius-card)] border-[1.5px] border-accent-ring bg-accent-tint px-4 py-3.5">
      <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand text-xs font-extrabold text-brand-contrast">
        i
      </span>
      <p className="text-[12.5px] leading-relaxed text-body-strong">{children}</p>
    </div>
  );
}

/** Placeholder swatch for a real photo/map tile, with a mono caption chip. */
export function Placeholder({
  caption,
  className = "",
}: {
  caption: string;
  className?: string;
}) {
  return (
    <div
      className={`placeholder-tile flex items-center justify-center ${className}`}
    >
      <span className="rounded-[var(--radius-code)] border border-border bg-surface px-2.5 py-1 font-mono text-[11px] text-muted">
        {caption}
      </span>
    </div>
  );
}
