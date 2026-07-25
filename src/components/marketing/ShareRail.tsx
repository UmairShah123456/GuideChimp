import { Reveal } from "./Reveal";

const PLACES = [
  "Airbnb message",
  "Booking.com",
  "Vrbo",
  "WhatsApp",
  "A QR code on the fridge",
  "Your welcome email",
  "SMS",
  "Direct bookings",
  "The back of the door",
];

/**
 * A quiet marquee making the "it's just a link" point concrete. Duplicated once
 * and translated -50% so the loop is seamless.
 */
export function ShareRail() {
  return (
    <section className="border-y border-border bg-surface/60 py-7">
      <Reveal>
        <p className="px-6 text-center text-[12.5px] font-bold uppercase tracking-[0.14em] text-label">
          It&rsquo;s one link — share it wherever your guests already are
        </p>
      </Reveal>

      <div
        className="relative mt-5 overflow-hidden"
        style={{
          maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
        }}
      >
        <ul className="flex w-max animate-marquee items-center gap-3" aria-label="Places to share your guide">
          {[...PLACES, ...PLACES].map((p, i) => (
            <li
              key={`${p}-${i}`}
              aria-hidden={i >= PLACES.length}
              className="whitespace-nowrap rounded-[var(--radius-pill)] border-[1.5px] border-border bg-page px-4 py-2 text-[13.5px] font-semibold text-body-strong"
            >
              {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
