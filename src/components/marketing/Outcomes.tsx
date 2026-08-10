import Image from "next/image";
import { Reveal } from "./Reveal";
import { LibraryIcon, StarIcon, UsersIcon } from "./icons";
import { UNSPLASH } from "./images";

const OUTCOMES = [
  {
    icon: UsersIcon,
    title: "Onboard someone in an afternoon, not a fortnight",
    body: "A new cleaner or VA gets a link instead of a fortnight of you explaining things twice. Everything they need is written down, in order, with the videos that show it — so training happens without you in the room.",
  },
  {
    icon: LibraryIcon,
    title: "One version of the truth",
    body: "No more wondering whether the doc, the group chat or the printed folder is current. You change it in one place and everyone who opens the link sees the change — including whoever is standing in the flat right now.",
  },
  {
    icon: StarIcon,
    title: "A check-in experience that looks like you",
    body: "Guests get your logo, your colour and your words rather than a platform's template. It answers the arrival questions before they're asked, which is where most small complaints come from.",
  },
];

export function Outcomes() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-20">
        {/* Sticky heading column — deliberately off-balance against the list */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <p className="text-[12.5px] font-bold uppercase tracking-[0.14em] text-accent">
              What it changes
            </p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-4 text-[34px] font-medium leading-[1.08] tracking-[-0.025em] text-ink [text-wrap:balance] md:text-[42px]">
              Stop being the search function for your own business.
            </h2>
          </Reveal>
          <Reveal delay={110}>
            <p className="mt-5 text-[16px] leading-relaxed text-body [text-wrap:pretty]">
              Almost every question you answer twice is a question that should have
              been written down once. Guests, cleaners and staff all get somewhere
              to look that isn&rsquo;t you.
            </p>
          </Reveal>

          <Reveal delay={160} direction="scale">
            <div className="relative mt-8 hidden aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border-[1.5px] border-border shadow-[0_28px_60px_-30px_rgba(28,40,48,0.45)] lg:block">
              <Image
                src={UNSPLASH.livingRoom}
                alt="Tidy living room prepared for arriving guests"
                fill
                sizes="(max-width: 1024px) 100vw, 24rem"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>

        {/* Numbered list — variable rhythm, no equal-height card row */}
        <ol className="flex flex-col">
          {OUTCOMES.map((o, i) => (
            <Reveal as="li" key={o.title} delay={i * 80} direction="left">
              <div className="flex gap-5 border-t border-border py-9 first:border-t-0 first:pt-0 md:gap-7">
                <div className="flex flex-none flex-col items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-card)] bg-accent-subtle text-accent">
                    <o.icon className="h-5.5 w-5.5" />
                  </span>
                  <span className="tnum text-[12px] font-bold text-label">0{i + 1}</span>
                </div>
                <div className="min-w-0 pt-1">
                  <h3 className="text-[20px] font-medium tracking-[-0.01em] text-ink md:text-[23px]">
                    {o.title}
                  </h3>
                  <p className="mt-2.5 max-w-xl text-[15.5px] leading-relaxed text-body [text-wrap:pretty]">
                    {o.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
