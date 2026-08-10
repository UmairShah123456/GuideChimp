import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronLeft } from "./icons";

/**
 * The warm-editorial accent header. Home uses the large hero variant (no back);
 * section screens use an eyebrow + back chevron above a slightly smaller title.
 * Titles honour embedded newlines.
 */
export function GuestHeader({
  eyebrow,
  title,
  subtitle,
  backHref,
  size = "section",
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  backHref?: string;
  size?: "hero" | "section";
  children?: ReactNode;
}) {
  return (
    <header className="rounded-b-[var(--radius-header)] bg-brand px-[22px] pb-6 pt-4 text-brand-contrast">
      {(backHref || eyebrow) && (
        <div className="mb-3 flex items-center gap-2.5">
          {backHref && (
            <Link
              href={backHref}
              aria-label="Back to guide home"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-contrast/15"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
          )}
          {eyebrow && (
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-brand-soft">
              {eyebrow}
            </span>
          )}
        </div>
      )}
      <h1
        className={`whitespace-pre-line font-display font-extrabold leading-[1.1] ${
          size === "hero" ? "text-[34px] leading-[1.08]" : "text-[28px]"
        }`}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2.5 text-sm text-brand-soft">{subtitle}</p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </header>
  );
}

/** Pill chip used in the header (e.g. check-in / checkout times). */
export function HeaderChip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-[var(--radius-pill)] bg-brand-contrast/15 px-3.5 py-2 text-[12.5px] font-bold">
      {children}
    </span>
  );
}
