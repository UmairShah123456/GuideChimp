"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/lib/auth/actions";
import { Logo } from "@/components/Logo";

const NAV = [
  // Guides filed under a property, paired with the company-wide ones below.
  { label: "Property guides", href: "/dashboard", match: ["/dashboard", "/properties"] },
  { label: "Company guides", href: "/guides", match: ["/guides"] },
  { label: "Account", href: "/account", match: ["/account"], exact: true },
  { label: "Team", href: "/account/team", match: ["/account/team"] },
  { label: "Billing", href: "/account/billing", match: ["/account/billing"] },
];

export function Sidebar({
  accountName,
  userEmail,
}: {
  accountName: string;
  userEmail?: string;
}) {
  const pathname = usePathname();

  const isActive = (item: (typeof NAV)[number]) => {
    if (item.exact) return pathname === item.href;
    return item.match.some((m) => pathname === m || pathname.startsWith(m + "/"));
  };

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
          className="block rounded-[var(--radius-sm)] px-2 py-1.5 transition-colors hover:bg-page"
        >
          <div className="truncate text-[13px] font-bold text-ink">{accountName}</div>
          {userEmail && (
            <div className="truncate text-xs text-muted">{userEmail}</div>
          )}
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
