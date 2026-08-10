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
      "Onboarding used to be me on the phone for two weeks. Now a new cleaner gets three links on day one and I hear from them when something is actually wrong.",
    name: "Priya Raman",
    role: "9 properties · Bristol",
    photo: PORTRAIT.priya,
    featured: true,
  },
  {
    quote:
      "Our process lived in a WhatsApp group nobody could scroll back through. Having one place to point at ended most of the arguing.",
    name: "Marcus Ellery",
    role: "Co-host · Cotswolds",
    photo: PORTRAIT.marcus,
  },
  {
    quote:
      "I filmed the boiler and the washer on my phone in ten minutes. That clip has now trained four different cleaners.",
    name: "Hannah Whitcombe",
    role: "6 properties · Leeds",
    photo: PORTRAIT.hannah,
  },
  {
    quote:
      "My VA has the company guides, my cleaners have the turnaround, guests get the pretty one. Same tool, three different doors.",
    name: "Tomás Vieira",
    role: "Serviced apartments · Lisbon",
    photo: PORTRAIT.tomas,
  },
  {
    quote:
      "Guests keep mentioning the local recommendations in reviews. It reads like it came from a person, because it did.",
    name: "Aisha Bello",
    role: "Coastal lets · Norfolk",
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
              One place to point at.
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
