import Link from "next/link";
import { Reveal } from "./Reveal";
import { ArrowIcon, TickIcon } from "./icons";

const POINTS = ["Free to start", "No card required", "Your first guide in an afternoon"];

export function FinalCta() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <Reveal direction="scale">
          <div className="relative overflow-hidden rounded-[calc(var(--radius-lg)*1.6)] bg-gradient-to-br from-accent via-accent-hover to-ink px-7 py-16 text-center text-white md:px-16 md:py-20">
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/[0.07]" />
              <div className="absolute -bottom-32 -right-16 h-[22rem] w-[22rem] rounded-full border-[44px] border-white/[0.06]" />
            </div>

            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-[34px] font-medium leading-[1.06] tracking-[-0.03em] [text-wrap:balance] md:text-[48px]">
                Your next guest arrives already knowing everything.
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-[16.5px] leading-relaxed text-white/75 [text-wrap:pretty]">
                Build one guide, share one link, and get the evening back.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className="group inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-white px-7 py-4 text-[15px] font-bold text-accent shadow-[0_16px_40px_-14px_rgba(0,0,0,0.5)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Create your guide
                  <ArrowIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/g/demo-wharf-loft"
                  className="inline-flex items-center justify-center rounded-[var(--radius-pill)] border-[1.5px] border-white/30 px-7 py-4 text-[15px] font-bold text-white transition-colors duration-200 hover:bg-white/10"
                >
                  Look at a real one first
                </Link>
              </div>

              <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                {POINTS.map((p) => (
                  <li key={p} className="flex items-center gap-1.5 text-[13.5px] font-semibold text-white/70">
                    <TickIcon className="h-3.5 w-3.5 text-accent-gold" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
