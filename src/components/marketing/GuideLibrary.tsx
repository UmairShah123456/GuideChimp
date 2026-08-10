import { ChevronRight } from "@/components/guest/icons";

/**
 * The hero's product shot: a host's guide library, showing the two tiers that
 * make GuideChimp a single home rather than another guest guidebook — company
 * guides that apply everywhere, and property guides split by audience.
 *
 * Deliberately mirrors the real dashboard list (emoji tile, name, section and
 * view counts) so the page shows the product rather than an illustration of it.
 */

const COMPANY = [
  { emoji: "🗂️", name: "Guest background checks", meta: "6 sections · 3 videos" },
  { emoji: "👥", name: "Inbox rules for the VA", meta: "4 sections · 2 videos" },
  { emoji: "📄", name: "Chargebacks & disputes", meta: "3 sections" },
];

const PROPERTY = [
  { emoji: "🛎️", name: "Guest guide", meta: "8 sections · 412 views", tone: "guest" as const },
  { emoji: "🧹", name: "Cleaner guide", meta: "5 sections · 34 views", tone: "team" as const },
  { emoji: "👥", name: "Staff guide", meta: "7 sections · 11 views", tone: "team" as const },
];

function Row({
  emoji,
  name,
  meta,
  tone = "team",
}: {
  emoji: string;
  name: string;
  meta: string;
  tone?: "guest" | "team";
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span
        aria-hidden
        className={`flex h-9 w-9 flex-none items-center justify-center rounded-[var(--radius-sm)] text-[15px] ${
          tone === "guest" ? "bg-accent-subtle" : "bg-page"
        }`}
      >
        {emoji}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13.5px] font-bold text-ink">{name}</span>
        <span className="tnum block truncate text-[11.5px] text-muted">{meta}</span>
      </span>
      <ChevronRight className="h-4 w-4 flex-none text-nav-idle" />
    </div>
  );
}

function GroupLabel({ title, note }: { title: string; note: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 bg-page/70 px-4 py-2.5">
      <span className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-label">
        {title}
      </span>
      <span className="truncate text-[10.5px] text-muted">{note}</span>
    </div>
  );
}

export function GuideLibrary({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-full max-w-[26rem] overflow-hidden rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface shadow-[0_40px_80px_-32px_rgba(28,40,48,0.45)] ${className}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3.5">
        <span className="text-[13px] font-extrabold text-ink">Riverside Stays</span>
        <span className="rounded-[var(--radius-pill)] bg-accent-subtle px-2.5 py-1 text-[10.5px] font-bold text-accent">
          6 guides live
        </span>
      </div>

      <GroupLabel title="Company guides" note="every property" />
      <div className="divide-y divide-border">
        {COMPANY.map((g) => (
          <Row key={g.name} {...g} />
        ))}
      </div>

      <GroupLabel title="Property guides" note="The Wharf Loft" />
      <div className="divide-y divide-border">
        {PROPERTY.map((g) => (
          <Row key={g.name} {...g} />
        ))}
      </div>
    </div>
  );
}
