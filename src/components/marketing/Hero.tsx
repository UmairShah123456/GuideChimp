import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";
import { GuidePhone } from "./GuidePhone";
import { ArrowIcon, ChatIcon, ScanIcon, TickIcon } from "./icons";
import { UNSPLASH } from "./images";

const BULLETS = ["No app for guests", "Live in an afternoon", "Free to start"];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient wash — radial, not a flat 45° fade, so it reads as light not gradient. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(80rem 44rem at 78% -12%, oklch(0.5 0.12 var(--h) / 0.13), transparent 62%), radial-gradient(52rem 32rem at 8% 8%, oklch(0.78 0.09 var(--h) / 0.10), transparent 60%)",
        }}
      />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 pb-20 pt-14 md:pb-28 md:pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-10">
        {/* Copy — z-10 keeps it above the decorative photo behind the phone */}
        <div className="relative z-10 max-w-xl">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border-[1.5px] border-accent-ring bg-accent-tint px-3 py-1.5 text-[12.5px] font-bold text-accent">
              <ScanIcon className="h-3.5 w-3.5" />
              One link. Every question answered.
            </span>
          </Reveal>

          <Reveal delay={70}>
            <h1 className="mt-6 text-[42px] font-medium leading-[1.03] tracking-[-0.03em] text-ink [text-wrap:balance] sm:text-[54px] lg:text-[62px]">
              Stop answering the same five questions every stay.
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-body [text-wrap:pretty]">
              GuideChimp turns your check-in steps, Wi-Fi code, parking, appliance
              how-tos and local picks into one branded guide. Send a link, and your
              guests find the answer before they think to message you.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-brand px-6 py-3.5 text-[15px] font-bold text-brand-contrast shadow-[0_14px_34px_-12px_oklch(0.5_0.12_var(--h)/0.85)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-[0_20px_44px_-14px_oklch(0.5_0.12_var(--h)/0.95)] active:translate-y-0"
              >
                Build your first guide
                <ArrowIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/g/demo-wharf-loft"
                className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] border-[1.5px] border-border bg-surface px-6 py-3.5 text-[15px] font-bold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-ring hover:text-accent"
              >
                See a live guide
              </Link>
            </div>
          </Reveal>

          <Reveal delay={260}>
            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
              {BULLETS.map((b) => (
                <li key={b} className="flex items-center gap-1.5 text-[13.5px] font-semibold text-body-strong">
                  <TickIcon className="h-3.5 w-3.5 text-accent" />
                  {b}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Product shot */}
        <Reveal direction="scale" delay={180} className="relative mx-auto lg:mx-0">
          {/* Property photo, tucked behind and offset for depth */}
          <div className="absolute -left-10 -top-8 hidden h-60 w-48 overflow-hidden rounded-[var(--radius-lg)] border-[1.5px] border-border shadow-[0_24px_50px_-24px_rgba(28,40,48,0.4)] sm:block lg:-left-14">
            <Image
              src={UNSPLASH.heroInterior}
              alt="Sunlit open-plan living room of a short-let apartment"
              fill
              sizes="192px"
              className="object-cover"
            />
          </div>

          <div className="relative animate-float">
            <GuidePhone />
          </div>

          {/* Floating proof card */}
          <div className="absolute -bottom-10 -left-6 flex items-center gap-2.5 rounded-[var(--radius-card)] border-[1.5px] border-border bg-surface/95 px-3.5 py-3 shadow-[0_18px_40px_-18px_rgba(28,40,48,0.45)] backdrop-blur sm:-left-14">
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[var(--radius-sm)] bg-accent-subtle text-accent">
              <ChatIcon className="h-4.5 w-4.5" />
            </span>
            <span>
              <span className="block text-[13px] font-extrabold leading-tight text-ink">
                &ldquo;Where do I park?&rdquo;
              </span>
              <span className="block text-[11.5px] text-muted">Answered before it&rsquo;s asked</span>
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
