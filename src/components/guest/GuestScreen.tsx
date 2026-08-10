import type { ReactNode } from "react";
import { ThemeScope } from "./ThemeScope";
import { GuestNav, type GuestTab } from "./GuestNav";
import type { GuestGuide } from "@/lib/guide/types";

/**
 * Mobile-first guest portal chrome: a centred phone-width column, per-account
 * theming, and the persistent bottom tab bar. Built and tuned at 375px first.
 *
 * Takes the whole resolved guide because the tab bar needs both which sections
 * exist on it and how they are named — a staff guide with no built-ins gets
 * Home only rather than four tabs that lead nowhere.
 */
export function GuestScreen({
  token,
  guide,
  active,
  children,
}: {
  token: string;
  guide: GuestGuide;
  active: GuestTab;
  children: ReactNode;
}) {
  return (
    <ThemeScope branding={guide.account}>
      <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-page">
        <main className="flex flex-1 flex-col">{children}</main>
        <GuestNav token={token} active={active} guide={guide} />
      </div>
    </ThemeScope>
  );
}
