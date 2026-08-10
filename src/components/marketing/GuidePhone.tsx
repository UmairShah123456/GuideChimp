import {
  ChevronRight,
  ContactIcon,
  GuidesIcon,
  HomeIcon,
  KeyIcon,
  LocalIcon,
  RulesIcon,
  WifiIcon,
} from "@/components/guest/icons";

const ROWS = [
  { icon: KeyIcon, title: "Getting in", sub: "Door code, key safe, 3 steps" },
  { icon: GuidesIcon, title: "Appliances", sub: "5 short how-to videos" },
  { icon: WifiIcon, title: "Wi-Fi", sub: "Tap to copy the password" },
  { icon: LocalIcon, title: "Local guide", sub: "Priya's 5 favourite spots" },
];

const TABS = [
  { icon: HomeIcon, label: "Home", active: true },
  { icon: GuidesIcon, label: "Guides", active: false },
  { icon: LocalIcon, label: "Local", active: false },
  { icon: RulesIcon, label: "Rules", active: false },
  { icon: ContactIcon, label: "Contact", active: false },
];

/**
 * A static replica of the guest home screen inside a phone frame — the hero's
 * product shot. Deliberately mirrors the real guest render (accent header,
 * nav rows, bottom tab bar) so the marketing page shows the actual product.
 */
export function GuidePhone({
  width = "w-[300px]",
  className = "",
}: {
  /** Width class. A separate prop because two competing `w-*` utilities in one
   *  class list resolve by stylesheet order, not by which was passed last. */
  width?: string;
  className?: string;
}) {
  return (
    <div
      className={`${width} overflow-hidden rounded-[40px] border-[10px] border-ink bg-page shadow-[0_40px_80px_-24px_rgba(28,40,48,0.45)] ${className}`}
    >
      {/* Accent header */}
      <div className="relative bg-brand px-5 pb-7 pt-5 text-brand-contrast">
        <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-white/30" />
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">
          Riverside Stays
        </p>
        <h3 className="mt-1.5 text-[26px] font-extrabold leading-tight">The Wharf Loft</h3>
        <p className="mt-1 text-[12px] text-white/75">12 Wapping Wharf, Bristol</p>

        <div className="mt-4 flex gap-2">
          <span className="rounded-[var(--radius-pill)] bg-white/15 px-2.5 py-1 text-[10.5px] font-bold">
            Check-in 3:00 PM
          </span>
          <span className="rounded-[var(--radius-pill)] bg-white/15 px-2.5 py-1 text-[10.5px] font-bold">
            Checkout 10:00 AM
          </span>
        </div>
      </div>

      {/* Nav rows */}
      <div className="flex flex-col gap-2 px-3.5 py-4">
        {ROWS.map((r) => (
          <div
            key={r.title}
            className="flex items-center gap-3 rounded-[var(--radius-card)] border-[1.5px] border-border bg-surface px-3.5 py-3"
          >
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-[var(--radius-sm)] bg-accent-subtle text-accent">
              <r.icon className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13.5px] font-bold text-ink">{r.title}</span>
              <span className="block text-[11px] text-muted">{r.sub}</span>
            </span>
            <ChevronRight className="h-4 w-4 flex-none text-nav-idle" />
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="flex justify-around border-t border-border bg-surface px-2 py-2.5">
        {TABS.map((t) => (
          <span
            key={t.label}
            className={`flex flex-col items-center gap-1 ${t.active ? "text-accent" : "text-nav-idle"}`}
          >
            <t.icon className="h-4 w-4" />
            <span className="text-[9px] font-bold">{t.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
