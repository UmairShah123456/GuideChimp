import { Reveal } from "./Reveal";

/**
 * Names the problem in the reader's own vocabulary before the page sells
 * anything. These are the places rental knowledge actually lives today, and
 * seeing them scroll past is more persuasive than a paragraph claiming it.
 */
const PLACES = [
  "The WhatsApp group",
  "A Google Doc from 2023",
  "That PDF you email cleaners",
  "A voice note",
  "Screenshots in your camera roll",
  "Notion, briefly",
  "Airbnb saved messages",
  "A printed folder in the flat",
  "Your head",
];

export function ScatterBand() {
  return (
    <section className="border-y border-border bg-surface/60 py-7">
      <Reveal>
        <p className="px-6 text-center text-[12.5px] font-bold uppercase tracking-[0.14em] text-label">
          Where your instructions live right now
        </p>
      </Reveal>

      <div
        className="relative mt-5 overflow-hidden"
        style={{
          maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
        }}
      >
        <ul
          className="flex w-max animate-marquee items-center gap-3"
          aria-label="Places short-let instructions usually end up"
        >
          {[...PLACES, ...PLACES].map((p, i) => (
            <li
              key={`${p}-${i}`}
              aria-hidden={i >= PLACES.length}
              className="whitespace-nowrap rounded-[var(--radius-pill)] border-[1.5px] border-dashed border-border bg-page px-4 py-2 text-[13.5px] font-semibold text-muted"
            >
              {p}
            </li>
          ))}
        </ul>
      </div>

      <Reveal delay={80}>
        <p className="mt-6 px-6 text-center text-[15.5px] font-semibold text-ink">
          Pick one home instead.
        </p>
      </Reveal>
    </section>
  );
}
