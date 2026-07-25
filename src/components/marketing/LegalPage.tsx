import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/Logo";
import { SiteFooter } from "./SiteFooter";
import { ChevronLeft } from "@/components/guest/icons";

/**
 * Shared shell for the plain-text legal pages. Deliberately quiet — narrow
 * measure, generous leading, no marketing furniture.
 */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-page">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" aria-label="GuideChimp home">
            <Logo className="h-7 w-auto" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-[13.5px] font-semibold text-muted transition-colors hover:text-accent"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-[38px] font-medium leading-[1.06] tracking-[-0.03em] text-ink">
          {title}
        </h1>
        <p className="mt-3 text-[13.5px] text-muted">Last updated {updated}</p>

        <div className="mt-10 flex flex-col gap-7">{children}</div>
      </main>

      <SiteFooter />
    </div>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-[19px] font-medium tracking-[-0.01em] text-ink">{heading}</h2>
      <div className="mt-2.5 flex flex-col gap-3 text-[15.5px] leading-relaxed text-body [text-wrap:pretty]">
        {children}
      </div>
    </section>
  );
}
