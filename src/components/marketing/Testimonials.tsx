import Image from "next/image";
import { Reveal } from "./Reveal";
import { PORTRAIT } from "./images";

/**
 * PLACEHOLDER SOCIAL PROOF — replace every quote, name and photo with real,
 * permissioned customer feedback before this page goes live.
 */
const QUOTES = [
  {
    quote:
      "The arrival messages were the worst part of my week. I built the guide over a Sunday afternoon and the check-in questions basically stopped.",
    name: "Priya Raman",
    role: "2 flats · Bristol",
    photo: PORTRAIT.priya,
    featured: true,
  },
  {
    quote:
      "I filmed the oven and the washer on my phone in about ten minutes. Nobody has asked me how to work either since.",
    name: "Marcus Ellery",
    role: "Cotswolds cottage",
    photo: PORTRAIT.marcus,
  },
  {
    quote:
      "Our cleaners use it too. The bin day section alone saved a very awkward conversation with the neighbours.",
    name: "Hannah Whitcombe",
    role: "6 properties · Leeds",
    photo: PORTRAIT.hannah,
  },
  {
    quote:
      "Guests keep mentioning the local recommendations in reviews. It reads like it came from a person, because it did.",
    name: "Tomás Vieira",
    role: "Lisbon apartment",
    photo: PORTRAIT.tomas,
  },
  {
    quote:
      "Being able to hide a section without deleting it sounds small. It isn't — I turn parking off in winter and back on in summer.",
    name: "Aisha Bello",
    role: "Coastal let · Norfolk",
    photo: PORTRAIT.aisha,
  },
];

export function Testimonials() {
  const [featured, ...rest] = QUOTES;

  return (
    <section id="stories" className="scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="max-w-xl">
          <Reveal>
            <p className="text-[12.5px] font-bold uppercase tracking-[0.14em] text-accent">
              From hosts
            </p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-4 text-[34px] font-medium leading-[1.08] tracking-[-0.025em] text-ink [text-wrap:balance] md:text-[44px]">
              Quieter phones, better stays.
            </h2>
          </Reveal>
        </div>

        {/* Masonry-ish wall: one lead quote, the rest flowing in columns */}
        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <figure className="flex h-full flex-col justify-between rounded-[var(--radius-lg)] border-[1.5px] border-accent-ring bg-accent-tint p-7">
              <blockquote className="text-[22px] leading-[1.4] tracking-[-0.015em] text-ink [text-wrap:pretty] md:text-[26px]">
                &ldquo;{featured.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-3">
                <Image
                  src={featured.photo}
                  alt=""
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-[16px] object-cover"
                />
                <span>
                  <span className="block text-[14.5px] font-extrabold text-ink">{featured.name}</span>
                  <span className="block text-[13px] text-muted">{featured.role}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7 lg:content-start">
            {rest.map((q, i) => (
              <Reveal key={q.name} delay={(i + 1) * 70}>
                <figure className="flex h-full flex-col justify-between rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface p-6">
                  <blockquote className="text-[15px] leading-relaxed text-body-strong [text-wrap:pretty]">
                    &ldquo;{q.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <Image
                      src={q.photo}
                      alt=""
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-[13px] object-cover"
                    />
                    <span>
                      <span className="block text-[13.5px] font-extrabold text-ink">{q.name}</span>
                      <span className="block text-[12px] text-muted">{q.role}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
