import Link from "next/link";
import { Logo } from "@/components/Logo";

const PRODUCT = [
  { href: "#guides", label: "Guide types" },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "/g/demo-wharf-loft", label: "Live demo guide" },
  { href: "#faq", label: "FAQ" },
];

const ACCOUNT = [
  { href: "/signup", label: "Create an account" },
  { href: "/login", label: "Log in" },
  { href: "mailto:hello@guidechimp.app", label: "Contact us" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface/60">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Logo className="h-7 w-auto" />
            <p className="mt-4 text-[14px] leading-relaxed text-body">
              One home for every guide a short-let business runs on — for guests,
              cleaners and the team.
            </p>
          </div>

          <div className="flex gap-14 sm:gap-20">
            <nav aria-label="Product">
              <h2 className="text-[12px] font-medium uppercase tracking-[0.12em] text-label">
                Product
              </h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {PRODUCT.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[14px] font-medium text-body transition-colors hover:text-accent"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Account">
              <h2 className="text-[12px] font-medium uppercase tracking-[0.12em] text-label">
                Account
              </h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {ACCOUNT.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[14px] font-medium text-body transition-colors hover:text-accent"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-muted">
            © {new Date().getFullYear()} GuideChimp. All rights reserved.
          </p>
          <ul className="flex gap-5">
            <li>
              <Link href="/privacy" className="text-[13px] text-muted transition-colors hover:text-accent">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-[13px] text-muted transition-colors hover:text-accent">
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
