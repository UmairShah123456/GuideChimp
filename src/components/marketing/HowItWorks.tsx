import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";
import { ArrowIcon } from "./icons";
import { UNSPLASH } from "./images";

const STEPS = [
  {
    n: "01",
    title: "Add the property",
    body: "Name, address and your accent colour. That's the whole setup — about a minute.",
    image: UNSPLASH.exterior,
    alt: "Exterior of a townhouse listed as a short-let",
  },
  {
    n: "02",
    title: "Fill in what guests ask about",
    body: "Work down the sections: getting in, parking, Wi-Fi, house rules, checkout, contact. Add your own for anything unusual.",
    image: UNSPLASH.loungeBlue,
    alt: "Living room of a rental with a blue sofa and television",
  },
  {
    n: "03",
    title: "Send one link",
    body: "Copy the link into your Airbnb welcome message, or print the QR code for the kitchen counter. Update it whenever — the link never changes.",
    image: UNSPLASH.apartment,
    alt: "Bright apartment living and dining area ready for guests",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <Reveal>
              <p className="text-[12.5px] font-bold uppercase tracking-[0.14em] text-accent">
                How it works
              </p>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="mt-4 text-[34px] font-medium leading-[1.08] tracking-[-0.025em] text-ink [text-wrap:balance] md:text-[44px]">
                Live before your next check-in.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={110}>
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 text-[15px] font-bold text-accent"
            >
              Start building
              <ArrowIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3 md:gap-6">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 100}>
              <article className="flex h-full flex-col">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border-[1.5px] border-border shadow-[0_24px_50px_-30px_rgba(28,40,48,0.5)]">
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 20rem"
                    className="object-cover"
                  />
                  <span className="tnum absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-page/95 text-[13px] font-extrabold text-accent backdrop-blur">
                    {s.n}
                  </span>
                </div>
                <h3 className="mt-5 text-[20px] font-medium tracking-[-0.01em] text-ink">
                  {s.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-body [text-wrap:pretty]">
                  {s.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
