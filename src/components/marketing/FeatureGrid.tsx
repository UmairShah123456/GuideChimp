import Image from "next/image";
import { Reveal } from "./Reveal";
import {
  BlocksIcon,
  DeviceIcon,
  DropletIcon,
  EyeIcon,
  FilmIcon,
  LinkIcon,
  PinIcon,
  ToggleIcon,
} from "./icons";
import { UNSPLASH } from "./images";

/** Mirrors a real custom section, in the order a host would stack the blocks. */
const BLOCK_STACK = [
  { type: "Text", detail: "Strip the bed before you touch anything else" },
  { type: "Steps", detail: "6 steps · the turnaround, in order" },
  { type: "Photo", detail: "How the linen cupboard should look" },
  { type: "Video", detail: "Resetting the boiler" },
  { type: "Map", detail: "Where the bins go" },
];

/** Shared shell so every tile lines up while backgrounds still vary. */
function Tile({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] p-6 transition-transform duration-300 hover:-translate-y-1 md:p-7 ${className}`}
    >
      {children}
    </div>
  );
}

function TileIcon({ children, tone = "light" }: { children: React.ReactNode; tone?: "light" | "dark" }) {
  return (
    <span
      className={`mb-4 flex h-11 w-11 items-center justify-center rounded-[var(--radius-card)] ${
        tone === "dark" ? "bg-white/10 text-white" : "bg-accent-subtle text-accent"
      }`}
    >
      {children}
    </span>
  );
}

export function FeatureGrid() {
  return (
    <section id="features" className="scroll-mt-24 border-t border-border bg-surface/50">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <Reveal>
            <p className="text-[12.5px] font-bold uppercase tracking-[0.14em] text-accent">
              What&rsquo;s inside
            </p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-4 text-[34px] font-medium leading-[1.08] tracking-[-0.025em] text-ink [text-wrap:balance] md:text-[44px]">
              One builder for every kind of guide.
            </h2>
          </Reveal>
          <Reveal delay={110}>
            <p className="mt-5 text-[16.5px] leading-relaxed text-body [text-wrap:pretty]">
              A guest welcome and a cleaner&rsquo;s turnaround are the same job:
              explain something clearly, with pictures, in the right order. The same
              blocks build both.
            </p>
          </Reveal>
        </div>

        {/* The single column is floored at 0 rather than min-content: an
            unbreakable string in any tile (a guide URL) would otherwise widen
            every tile in the grid and push the page sideways. */}
        <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-12">
          {/* Modular builder — the headline feature */}
          <Reveal delay={0} className="lg:col-span-7">
            <Tile className="h-full border-[1.5px] border-accent-ring bg-accent-tint">
              <TileIcon>
                <BlocksIcon className="h-5 w-5" />
              </TileIcon>
              <h3 className="text-[21px] font-medium tracking-[-0.01em] text-ink">
                Build any process from blocks
              </h3>
              <p className="mt-2.5 max-w-md text-[15px] leading-relaxed text-body [text-wrap:pretty]">
                A turnaround, a roof terrace, how to handle a chargeback — add a
                section for anything. Stack text, numbered steps, photos, video and
                a map in whatever order it needs, and reorder them any time.
              </p>
              {/* Ordered stack — shows the feature rather than describing it */}
              <ul className="mt-6 flex flex-1 flex-col justify-end gap-2">
                {BLOCK_STACK.map((b, i) => (
                  <li
                    key={b.type}
                    className="flex items-center gap-3 rounded-[var(--radius-sm)] border-[1.5px] border-accent-ring bg-surface px-3 py-2.5"
                  >
                    <span aria-hidden className="text-[13px] leading-none tracking-[-2px] text-nav-idle">
                      ⠿
                    </span>
                    <span className="tnum w-4 flex-none text-[11.5px] font-bold text-label">
                      {i + 1}
                    </span>
                    <span className="w-14 flex-none text-[12.5px] font-bold text-accent">{b.type}</span>
                    <span className="min-w-0 flex-1 truncate text-[12.5px] text-muted">
                      {b.detail}
                    </span>
                  </li>
                ))}
              </ul>
            </Tile>
          </Reveal>

          {/* Video how-tos with a real photo */}
          <Reveal delay={70} className="lg:col-span-5">
            <Tile className="h-full border-[1.5px] border-border bg-surface">
              <TileIcon>
                <FilmIcon className="h-5 w-5" />
              </TileIcon>
              <h3 className="text-[21px] font-medium tracking-[-0.01em] text-ink">
                Show it once, on video
              </h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-body [text-wrap:pretty]">
                The boiler, the bin store, the way you want beds made. Film it on
                your phone and it trains every hire after this one.
              </p>
              <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] border-[1.5px] border-border">
                <Image
                  src={UNSPLASH.kitchen}
                  alt="Kitchen appliances a guest might need instructions for"
                  fill
                  sizes="(max-width: 1024px) 100vw, 26rem"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 shadow-lg">
                    {/* Optically nudged right — a centred triangle reads left-heavy */}
                    <span className="ml-[3px] h-0 w-0 border-y-[7px] border-l-[11px] border-y-transparent border-l-accent" />
                  </span>
                </span>
              </div>
            </Tile>
          </Reveal>

          {/* Brand */}
          <Reveal delay={0} className="lg:col-span-4">
            <Tile className="h-full border-[1.5px] border-border bg-surface">
              <TileIcon>
                <DropletIcon className="h-5 w-5" />
              </TileIcon>
              <h3 className="text-[19px] font-medium tracking-[-0.01em] text-ink">
                Your brand on every guide
              </h3>
              <p className="mt-2.5 text-[14.5px] leading-relaxed text-body [text-wrap:pretty]">
                Add your logo and pick one colour. Every guide you share retunes to
                it — headers, tiles, buttons and links.
              </p>
              <div className="mt-5 flex gap-2" aria-hidden>
                {[200, 45, 155, 320].map((h) => (
                  <span
                    key={h}
                    style={{ background: `oklch(0.5 0.12 ${h})` }}
                    className="h-8 w-8 rounded-[var(--radius-sm)] ring-1 ring-inset ring-black/5"
                  />
                ))}
              </div>
            </Tile>
          </Reveal>

          {/* Local guide */}
          <Reveal delay={70} className="lg:col-span-4">
            <Tile className="h-full border-[1.5px] border-border bg-surface">
              <TileIcon>
                <PinIcon className="h-5 w-5" />
              </TileIcon>
              <h3 className="text-[19px] font-medium tracking-[-0.01em] text-ink">
                The places you&rsquo;d actually send them
              </h3>
              <p className="mt-2.5 text-[14.5px] leading-relaxed text-body [text-wrap:pretty]">
                Pin your local spots with a line on why each one is worth it, plus
                price and opening hours.
              </p>
            </Tile>
          </Reveal>

          {/* Live preview */}
          <Reveal delay={140} className="lg:col-span-4">
            <Tile className="h-full border-[1.5px] border-border bg-surface">
              <TileIcon>
                <EyeIcon className="h-5 w-5" />
              </TileIcon>
              <h3 className="text-[19px] font-medium tracking-[-0.01em] text-ink">
                See it as your guest will
              </h3>
              <p className="mt-2.5 text-[14.5px] leading-relaxed text-body [text-wrap:pretty]">
                A live phone preview sits beside every editor, so you never publish
                something you haven&rsquo;t seen.
              </p>
            </Tile>
          </Reveal>

          {/* Dark tile — the magic link */}
          <Reveal delay={0} className="lg:col-span-5">
            <Tile className="h-full bg-gradient-to-br from-accent via-accent-hover to-ink text-white">
              <TileIcon tone="dark">
                <LinkIcon className="h-5 w-5" />
              </TileIcon>
              <h3 className="text-[21px] font-medium tracking-[-0.01em]">
                A separate link for every audience
              </h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-white/75 [text-wrap:pretty]">
                Each guide gets its own URL and QR code, its own optional PIN and
                expiry, and its own view count — so you can see the cleaner actually
                opened it. Nobody makes an account.
              </p>
              <ul className="mt-6 flex flex-col gap-2">
                {[
                  { who: "Guests", slug: "wharf-loft" },
                  { who: "Cleaners", slug: "wharf-turnaround" },
                ].map((l) => (
                  <li
                    key={l.slug}
                    className="flex items-center gap-2.5 rounded-[var(--radius-card)] bg-white/10 px-4 py-2.5 ring-1 ring-inset ring-white/15"
                  >
                    <span className="w-16 flex-none text-[11.5px] font-bold uppercase tracking-[0.08em] text-white/55">
                      {l.who}
                    </span>
                    <span className="min-w-0 truncate text-[13px] font-semibold text-white/60">
                      guidechimp.app/g/
                      <span className="font-extrabold text-white">{l.slug}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Tile>
          </Reveal>

          {/* Any phone */}
          <Reveal delay={70} className="lg:col-span-7">
            <Tile className="h-full border-[1.5px] border-border bg-surface">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <TileIcon>
                    <DeviceIcon className="h-5 w-5" />
                  </TileIcon>
                  <h3 className="text-[21px] font-medium tracking-[-0.01em] text-ink">
                    Nothing to install, nothing to log into
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-body [text-wrap:pretty]">
                    It opens in the browser your guest or cleaner already has — no app,
                    no seat to buy for a contractor. Rename or hide any section and the
                    change lands on their phone straight away.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-4">
                    <span className="flex items-center gap-2 text-[13.5px] font-semibold text-body-strong">
                      <ToggleIcon className="h-4 w-4 text-accent" />
                      Show or hide any section
                    </span>
                    <span className="flex items-center gap-2 text-[13.5px] font-semibold text-body-strong">
                      <BlocksIcon className="h-4 w-4 text-accent" />
                      Rename it to your words
                    </span>
                  </div>
                </div>
                <div className="relative aspect-[3/4] w-full flex-none overflow-hidden rounded-[var(--radius-card)] border-[1.5px] border-border sm:w-40">
                  <Image
                    src={UNSPLASH.interiorArt}
                    alt="Styled living area in a holiday let"
                    fill
                    sizes="10rem"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
              </div>
            </Tile>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
