import { Reveal } from "./Reveal";
import { TickIcon } from "./icons";

/** The built-in sections every new property starts with. */
const SECTIONS = [
  { name: "Getting in", detail: "Map, times, steps, door codes" },
  { name: "Parking", detail: "Free or paid, on or off site" },
  { name: "Wi-Fi", detail: "Tap-to-copy password" },
  { name: "Appliances", detail: "Video how-tos" },
  { name: "Local guide", detail: "Your pinned recommendations" },
  { name: "House rules", detail: "Each with the reason why" },
  { name: "Checkout", detail: "A short leaving checklist" },
  { name: "Contact", detail: "WhatsApp, call, emergency numbers" },
];

export function SectionsBand() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-accent via-accent-hover to-ink text-white">
      {/* Soft geometry echoing the auth panel, so the brand device recurs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/[0.06]" />
        <div className="absolute -bottom-40 left-1/4 h-[26rem] w-[26rem] rounded-full border-[48px] border-white/[0.05]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-28">
        <div className="max-w-2xl">
          <Reveal>
            <p className="text-[12.5px] font-bold uppercase tracking-[0.14em] text-white/60">
              Included from day one
            </p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-4 text-[32px] font-medium leading-[1.08] tracking-[-0.025em] [text-wrap:balance] md:text-[42px]">
              Eight sections, already written into the structure.
            </h2>
          </Reveal>
          <Reveal delay={110}>
            <p className="mt-5 text-[16.5px] leading-relaxed text-white/70 [text-wrap:pretty]">
              You&rsquo;re filling in blanks, not staring at an empty page. Rename any
              of them, hide the ones you don&rsquo;t need, and add your own on top.
            </p>
          </Reveal>
        </div>

        <ul className="mt-12 grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-4">
          {SECTIONS.map((s, i) => (
            <Reveal as="li" key={s.name} delay={i * 45}>
              <div className="flex items-start gap-3 border-t border-white/15 py-4">
                <TickIcon className="mt-0.5 h-4 w-4 flex-none text-accent-gold" />
                <div className="min-w-0">
                  <div className="text-[15px] font-bold">{s.name}</div>
                  <div className="text-[13px] leading-snug text-white/60">{s.detail}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
