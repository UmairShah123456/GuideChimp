"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/lib/auth/actions";
import { Logo } from "@/components/Logo";
import { PersonIcon } from "@/components/guest/icons";

/**
 * The two kinds of guide, plus branding — it applies to every guide at once, so
 * it belongs beside them rather than buried in account settings. Profile and
 * billing are reached by the identity block at the foot of the sidebar, and
 * Team is hidden until it does something.
 */
const NAV = [
  { label: "Property guides", href: "/dashboard", match: ["/dashboard", "/properties"] },
  { label: "Company guides", href: "/guides", match: ["/guides"] },
  { label: "Branding", href: "/branding", match: ["/branding"] },
];

export function Sidebar({
  accountName,
  userEmail,
}: {
  accountName: string;
  userEmail?: string;
}) {
  const pathname = usePathname();

  const isActive = (item: (typeof NAV)[number]) =>
    item.match.some((m) => pathname === m || pathname.startsWith(m + "/"));

  return (
    <aside className="sticky top-0 flex h-dvh w-60 flex-none flex-col border-r border-border bg-surface px-4 py-6">
      <Link href="/dashboard" className="px-2">
        <Logo className="h-7 w-auto" />
      </Link>

      <nav className="mt-8 flex flex-col gap-1">
        {NAV.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? "bg-accent-subtle text-accent"
                  : "text-body hover:bg-page hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-border pt-4">
        {/* The account identity doubles as the way into account settings —
            it's where people look for it. */}
        <Link
          href="/account"
          className="flex items-center gap-2.5 rounded-[var(--radius-sm)] px-2 py-1.5 transition-colors hover:bg-page"
        >
          <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-accent-subtle text-accent">
            <PersonIcon className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-bold text-ink">{accountName}</span>
            {userEmail && (
              <span className="block truncate text-xs text-muted">{userEmail}</span>
            )}
          </span>
        </Link>
        <form action={signOutAction} className="mt-3">
          <button
            type="submit"
            className="w-full rounded-[var(--radius-sm)] px-3 py-2 text-left text-[13px] font-semibold text-body transition-colors hover:bg-page hover:text-ink"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
