import Link from "next/link";
import {
  ContactIcon,
  GuidesIcon,
  HomeIcon,
  LocalIcon,
  RulesIcon,
} from "./icons";
import { sectionVisible } from "@/lib/guide/defaults";
import type { GuestGuide, GuideSectionType } from "@/lib/guide/types";

export type GuestTab = "home" | "guides" | "local" | "rules" | "contact";

const TABS: {
  key: GuestTab;
  label: string;
  path: string;
  Icon: typeof HomeIcon;
  section?: GuideSectionType; // tab is hidden when this section is missing or off
}[] = [
  { key: "home", label: "Home", path: "", Icon: HomeIcon },
  { key: "guides", label: "Guides", path: "/wifi-amenities", Icon: GuidesIcon, section: "amenities" },
  { key: "local", label: "Local", path: "/local-guide", Icon: LocalIcon, section: "local_guide" },
  { key: "rules", label: "Rules", path: "/house-rules", Icon: RulesIcon, section: "house_rules" },
  { key: "contact", label: "Contact", path: "/contact", Icon: ContactIcon, section: "emergency_contacts" },
];

/**
 * Persistent bottom tab bar. Home is always shown; every other tab requires its
 * section to exist on this guide *and* be toggled on. A staff guide built purely
 * from custom sections therefore shows Home alone, rather than tabs that would
 * open empty screens.
 */
export function GuestNav({
  token,
  active,
  guide,
}: {
  token: string;
  active: GuestTab;
  guide: GuestGuide;
}) {
  const tabs = TABS.filter((t) => !t.section || sectionVisible(guide, t.section));

  // A lone Home tab is just a dead bar — drop it entirely.
  if (tabs.length <= 1) return null;

  return (
    <nav className="sticky bottom-0 z-20 mt-auto flex justify-around border-t border-border bg-surface/95 px-2 pb-6 pt-3 backdrop-blur">
      {tabs.map(({ key, label, path, Icon }) => {
        const isActive = key === active;
        return (
          <Link
            key={key}
            href={`/g/${token}${path}`}
            aria-current={isActive ? "page" : undefined}
            className="flex min-w-14 flex-col items-center gap-1"
          >
            <Icon
              className={`h-[22px] w-[22px] ${isActive ? "text-accent" : "text-muted"}`}
            />
            <span
              className={`text-[10.5px] ${
                isActive ? "font-bold text-accent" : "font-semibold text-muted"
              }`}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
