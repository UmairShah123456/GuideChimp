"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Logo } from "@/components/Logo";

/**
 * Dashboard chrome. The sidebar is permanent from `lg` up; below that it becomes
 * a drawer behind a top bar, so the whole dashboard is usable on a phone.
 */
export function DashboardChrome({
  accountName,
  userEmail,
  children,
}: {
  accountName: string;
  userEmail?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Navigating is the drawer's whole purpose, so a route change closes it.
  useEffect(() => setOpen(false), [pathname]);

  // While the drawer is up the page behind it must not scroll — on iOS a
  // scrolling backdrop is what makes an overlay feel broken.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="flex min-h-dvh bg-page">
      <Sidebar
        accountName={accountName}
        userEmail={userEmail}
        className="sticky top-0 hidden h-dvh w-60 flex-none border-r border-border lg:flex"
      />

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/40"
          />
          <Sidebar
            accountName={accountName}
            userEmail={userEmail}
            onNavigate={() => setOpen(false)}
            className="relative flex h-dvh w-[17rem] max-w-[85vw] border-r border-border shadow-[0_0_40px_rgba(23,36,46,0.25)]"
          />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Sits above the editor's own sticky bar, which offsets itself by this
            bar's height on small screens. */}
        <header className="sticky top-0 z-40 flex h-14 flex-none items-center gap-2 border-b border-border bg-surface px-2 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="flex h-10 w-10 flex-none items-center justify-center rounded-[var(--radius-sm)] text-ink hover:bg-page"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
          <Link href="/dashboard" className="flex min-w-0 items-center">
            <Logo className="h-6 w-auto" />
          </Link>
        </header>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

function MenuIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
