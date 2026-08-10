import { PlayIcon } from "@/components/guest/icons";
import { Reveal } from "./Reveal";
import { GuidePhone } from "./GuidePhone";
import { TickIcon } from "./icons";

/**
 * The heart of the positioning: a rental business runs on two kinds of guide,
 * and every other tool makes you choose one. Company guides are the process
 * work that applies everywhere; property guides are per-building and split by
 * who opens them. Both live here, which is the whole argument for the product.
 */

const COMPANY_GUIDES = [
  "Running a background check on a guest",
  "How the VA handles the inbox",
  "What to do about a chargeback",
  "Pricing and calendar rules",
  "Onboarding a new cleaner",
];

const PROPERTY_GUIDES = [
  {
    emoji: "🛎️",
    name: "Guest guide",
    body: "The branded check-in experience — arrival steps, Wi-Fi, parking, appliances, your local picks.",
  },
  {
    emoji: "🧹",
    name: "Cleaner guide",
    body: "Turnaround steps, linen counts, where the spare bulbs live, bin day. Filmed once.",
  },
  {
    emoji: "👥",
    name: "Staff guide",
    body: "For a VA or co-host: what this property needs, who to call, how to handle a lockout.",
  },
];

export function TwoKinds() {
  return (
    <section id="guides" className="scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <Reveal>
            <p className="text-[12.5px] font-bold uppercase tracking-[0.14em] text-accent">
              One place, two kinds of guide
            </p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-4 text-[34px] font-medium leading-[1.08] tracking-[-0.025em] text-ink [text-wrap:balance] md:text-[44px]">
              Your business runs on more than a guest guidebook.
            </h2>
          </Reveal>
          <Reveal delay={110}>
            <p className="mt-5 text-[16.5px] leading-relaxed text-body [text-wrap:pretty]">
              Some of what you know belongs to the company and applies to every
              property. The rest belongs to one building, and changes depending on
              who walks in. GuideChimp holds both, so there is one place to look
              and one place to update.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-2">
          {/* Company guides — the half nobody else covers, so it leads. */}
          <Reveal>
            <div className="flex h-full flex-col rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface p-7 md:p-8">
              <span className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-pill)] bg-page px-3 py-1.5 text-[12px] font-bold text-body-strong">
                <span aria-hidden>🗂️</span>
                Company guides
              </span>
              <h3 className="mt-5 text-[24px] font-medium tracking-[-0.015em] text-ink md:text-[27px]">
                The processes that apply everywhere
              </h3>
              <p className="mt-3 text-[15.5px] leading-relaxed text-body [text-wrap:pretty]">
                Written once for the whole business, not copied into every
                property. New team member? Send the link and they read the same
                thing your last hire did.
              </p>

              <ul className="mt-7 flex flex-col gap-2.5">
                {COMPANY_GUIDES.map((g) => (
                  <li
                    key={g}
                    className="flex items-center gap-3 rounded-[var(--radius-sm)] border-[1.5px] border-border bg-page px-3.5 py-2.5"
                  >
                    <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-accent-subtle text-accent">
                      <PlayIcon className="ml-px h-3 w-3" />
                    </span>
                    <span className="min-w-0 flex-1 text-[13.5px] font-semibold text-body-strong">
                      {g}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-[13.5px] leading-relaxed text-muted [text-wrap:pretty]">
                Built from text, numbered steps, photos, video and maps — whatever
                the process actually needs.
              </p>

              {/* Balances the phone crop opposite, and makes "written once"
                  concrete: one guide, every property on the account. */}
              <div className="mt-auto pt-8">
                <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-label">
                  Applies to
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {["The Wharf Loft", "Harbour Flat", "Dockside Studio", "+6 more"].map((n) => (
                    <li
                      key={n}
                      className="rounded-[var(--radius-pill)] border-[1.5px] border-border bg-page px-3 py-1.5 text-[12.5px] font-semibold text-body-strong"
                    >
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          {/* Property guides — one per audience, with the guest one shown. */}
          <Reveal delay={90}>
            <div className="flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border-[1.5px] border-accent-ring bg-accent-tint p-7 md:p-8">
              <span className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-pill)] bg-surface px-3 py-1.5 text-[12px] font-bold text-accent">
                <span aria-hidden>🏠</span>
                Property guides
              </span>
              <h3 className="mt-5 text-[24px] font-medium tracking-[-0.015em] text-ink md:text-[27px]">
                One per audience, per property
              </h3>
              <p className="mt-3 text-[15.5px] leading-relaxed text-body [text-wrap:pretty]">
                Each guide has its own link, so a cleaner never opens the guest
                welcome and a guest never sees your turnaround checklist.
              </p>

              <ul className="mt-7 flex flex-col gap-3">
                {PROPERTY_GUIDES.map((g) => (
                  <li key={g.name} className="flex gap-3.5 rounded-[var(--radius-card)] bg-surface p-3.5">
                    <span
                      aria-hidden
                      className="flex h-9 w-9 flex-none items-center justify-center rounded-[var(--radius-sm)] bg-accent-subtle text-[15px]"
                    >
                      {g.emoji}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[14px] font-bold text-ink">{g.name}</span>
                      <span className="mt-0.5 block text-[13px] leading-snug text-body [text-wrap:pretty]">
                        {g.body}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-6 flex items-center gap-2 text-[13.5px] font-semibold text-body-strong">
                <TickIcon className="h-4 w-4 flex-none text-accent" />
                Separate links, separate PINs, separate view counts
              </p>

              {/* A fixed window onto the guest guide's top, so the card grows by
                  the crop height rather than by the whole phone. Negative margins
                  wouldn't do: a clipped element still contributes its full height. */}
              <div className="relative mt-8 h-44 overflow-hidden md:h-48">
                <div className="absolute left-1/2 top-0 -translate-x-1/2">
                  <GuidePhone
                    width="w-[min(240px,80vw)]"
                    className="shadow-[0_30px_60px_-28px_rgba(28,40,48,0.5)]"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
