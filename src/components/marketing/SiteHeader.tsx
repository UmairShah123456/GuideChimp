"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";

const NAV = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#stories", label: "Stories" },
  { href: "#faq", label: "FAQ" },
];

/**
 * Marketing header. Transparent over the hero, then gains a blurred surface and
 * hairline border once the page scrolls — so it never competes with the hero
 * but stays legible over content.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Don't let the page scroll behind the open mobile sheet.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-border/80 bg-page/85 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" aria-label="GuideChimp home" className="flex-none">
          <Logo className="h-7 w-auto" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-[var(--radius-pill)] px-3.5 py-2 text-[14px] font-semibold text-body-strong transition-colors hover:bg-accent-tint hover:text-accent"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/login"
            className="rounded-[var(--radius-pill)] px-4 py-2 text-[14px] font-semibold text-ink transition-colors hover:text-accent"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-[var(--radius-pill)] bg-ink px-4.5 py-2.5 text-[14px] font-bold text-white shadow-[0_6px_20px_-8px_rgba(28,40,48,0.8)] transition-all duration-200 hover:-translate-y-px hover:bg-accent hover:shadow-[0_10px_26px_-8px_oklch(0.5_0.12_var(--h)/0.65)] active:translate-y-0"
          >
            Start free
          </Link>
        </div>

        {/* Mobile trigger */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-[var(--radius-sm)] border-[1.5px] border-border bg-surface md:hidden"
        >
          <span
            className={`h-[1.5px] w-4 bg-ink transition-transform duration-200 ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
          />
          <span
            className={`h-[1.5px] w-4 bg-ink transition-transform duration-200 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {open && (
        <div id="mobile-nav" className="border-t border-border bg-page md:hidden">
          <nav aria-label="Mobile" className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-[var(--radius-sm)] px-3 py-3 text-[15px] font-semibold text-ink hover:bg-accent-tint"
              >
                {n.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-[var(--radius-pill)] border-[1.5px] border-border bg-surface px-4 py-3 text-center text-[15px] font-bold text-ink"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="rounded-[var(--radius-pill)] bg-accent px-4 py-3 text-center text-[15px] font-bold text-white"
              >
                Start free
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
