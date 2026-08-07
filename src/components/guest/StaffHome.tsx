import Link from "next/link";
import { HOME_TILES, sectionVisible } from "@/lib/guide/defaults";
import { GuestScreen } from "./GuestScreen";
import { SectionLabel } from "./primitives";
import { PlusIcon } from "./icons";
import type { GuestGuide } from "@/lib/guide/types";

function NavRow({
  href,
  title,
  subtitle,
}: {
  href: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-[var(--radius-card)] border-[1.5px] border-border bg-surface px-4.5 py-4"
    >
      <div>
        <div className="text-base font-bold text-ink">{title}</div>
        {subtitle && <div className="mt-0.5 text-[12.5px] text-muted">{subtitle}</div>}
      </div>
      <PlusIcon className="h-5 w-5 flex-none text-accent" />
    </Link>
  );
}

/**
 * Home screen for cleaner/staff guides. Same design system as the guest home —
 * identical colours, tiles and spacing — but none of the hospitality framing.
 * Someone arriving to work doesn't want a welcome, check-in times, or their
 * tasks grouped under "During your stay"; they want a plain index of what to do.
 */
export function StaffHome({ token, guide }: { token: string; guide: GuestGuide }) {
  const overrides = guide.guide.section_titles ?? {};

  // Built-ins are rare on staff guides but respected if a host adds one.
  const builtinTiles = HOME_TILES.filter((t) => sectionVisible(guide, t.type)).map((t) => {
    const ov = overrides[t.type] ?? {};
    return {
      href: `/g/${token}${t.path}`,
      title: ov.title?.trim() || t.title,
      subtitle: ov.subtitle?.trim() || t.subtitle,
    };
  });

  const customTiles = guide.customSections
    .filter((cs) => cs.enabled)
    .map((cs) => ({
      href: `/g/${token}/s/${cs.id}`,
      title: cs.title.trim() || "Untitled section",
      subtitle: cs.subtitle?.trim() || "",
    }));

  const tiles = [...builtinTiles, ...customTiles];

  return (
    <GuestScreen token={token} guide={guide} active="home">
      <header className="border-b border-border bg-surface px-[22px] pb-6 pt-9">
        <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
          {guide.account.name}
        </div>
        <h1 className="mt-1.5 text-[26px] font-extrabold leading-[1.15] text-ink">
          {guide.guide.name}
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          {[guide.property.name, guide.property.address].filter(Boolean).join(" · ")}
        </p>
      </header>

      <div className="flex flex-col gap-2.5 px-4.5 pb-8 pt-5">
        {tiles.length === 0 ? (
          <p className="rounded-[var(--radius-card)] border-[1.5px] border-dashed border-border bg-surface px-4.5 py-8 text-center text-sm text-muted">
            Nothing here yet.
          </p>
        ) : (
          <>
            <SectionLabel>Sections</SectionLabel>
            {tiles.map((t) => (
              <NavRow key={t.href} href={t.href} title={t.title} subtitle={t.subtitle} />
            ))}
          </>
        )}
      </div>
    </GuestScreen>
  );
}
