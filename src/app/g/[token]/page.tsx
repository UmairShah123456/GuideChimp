import Link from "next/link";
import Image from "next/image";
import { getGuide } from "@/lib/guide/resolve";
import { registerGuestView } from "@/lib/guide/queries";
import { sectionContent } from "@/lib/guide/types";
import { HOME_TILES, sectionVisible } from "@/lib/guide/defaults";
import { timeChip } from "@/lib/time";
import { isGuestFlavour } from "@/lib/guide/presets";
import { GuestScreen } from "@/components/guest/GuestScreen";
import { GuestFallback } from "@/components/guest/GuestFallback";
import { StaffHome } from "@/components/guest/StaffHome";
import { HeaderChip } from "@/components/guest/GuestHeader";
import { SectionLabel } from "@/components/guest/primitives";
import { WifiCard } from "@/components/guest/WifiCard";
import { WelcomeGate } from "@/components/guest/WelcomeGate";
import { PlusIcon, KeyIcon, SunIcon, ExitIcon } from "@/components/guest/icons";

export const dynamic = "force-dynamic";

function NavRow({
  href,
  title,
  subtitle,
}: {
  href: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-[var(--radius-card)] border-[1.5px] border-border bg-surface px-4.5 py-4"
    >
      <div>
        <div className="text-base font-bold text-ink">{title}</div>
        {subtitle && <div className="mt-0.5 text-[12.5px] text-muted">{subtitle}</div>}
      </div>
      <PlusIcon className="h-5 w-5 flex-none text-accent" />
    </Link>
  );
}

export default async function GuestHome({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const res = await getGuide(token);
  if (res.status !== "ok") return <GuestFallback status={res.status} />;

  const { guide } = res;
  await registerGuestView(token);

  // Cleaner/staff guides get a plain index instead of the welcome experience.
  if (!isGuestFlavour(guide.guide.kind)) {
    return <StaffHome token={token} guide={guide} />;
  }

  const checkIn = sectionContent(guide, "check_in");
  const wifi = sectionContent(guide, "wifi");
  const subtitle = [guide.property.name, guide.property.address]
    .filter(Boolean)
    .join(" · ");
  const checkInChip = timeChip(checkIn?.checkInTime, "Check-in from");
  const checkoutChip = timeChip(checkIn?.checkoutTime, "Checkout");

  const overrides = guide.guide.section_titles ?? {};
  const tile = (t: (typeof HOME_TILES)[number]) => {
    const ov = overrides[t.type] ?? {};
    return {
      href: `/g/${token}${t.path}`,
      title: ov.title?.trim() || t.title,
      subtitle: ov.subtitle?.trim() || t.subtitle,
    };
  };
  const firstTiles = HOME_TILES.filter(
    (t) => t.group === "first" && sectionVisible(guide, t.type),
  ).map(tile);
  const duringTiles = [
    ...HOME_TILES.filter(
      (t) => t.group === "during" && sectionVisible(guide, t.type),
    ).map(tile),
    ...guide.customSections
      .filter((cs) => cs.enabled)
      .map((cs) => ({
        href: `/g/${token}/s/${cs.id}`,
        title: cs.title.trim() || "Untitled section",
        subtitle: cs.subtitle?.trim() || "",
      })),
  ];
  const checkoutTiles = HOME_TILES.filter(
    (t) => t.group === "checkout" && sectionVisible(guide, t.type),
  ).map(tile);

  const prefetchHrefs = [
    ...firstTiles,
    ...duringTiles,
    ...checkoutTiles,
    { href: `/g/${token}/contact` },
  ].map((t) => t.href);

  return (
    <GuestScreen token={token} guide={guide} active="home">
      <WelcomeGate
        token={token}
        propertyName={guide.property.name}
        address={checkIn?.address || guide.property.address || undefined}
        checkInTime={checkIn?.checkInTime}
        checkoutTime={checkIn?.checkoutTime}
        heroImageUrl={guide.property.hero_image_url}
        prefetchHrefs={prefetchHrefs}
      />
      {/* Hero: property photo as the background, darkened for legibility */}
      <header className="relative overflow-hidden rounded-b-[var(--radius-header)] text-white">
        {guide.property.hero_image_url ? (
          <Image
            src={guide.property.hero_image_url}
            alt={guide.property.name}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-accent" />
        )}
        {/* darkening overlay */}
        <div className="absolute inset-0 bg-ink/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/45 to-ink/40" />

        <div className="relative px-[22px] pb-6 pt-9">
          <h1 className="whitespace-pre-line text-[34px] font-extrabold leading-[1.08]">
            {"Hiya!\nYou're in the right place."}
          </h1>
          {subtitle && <p className="mt-2.5 text-sm text-white/75">{subtitle}</p>}
          {(checkoutChip || checkInChip) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {checkoutChip && <HeaderChip>{checkoutChip}</HeaderChip>}
              {checkInChip && <HeaderChip>{checkInChip}</HeaderChip>}
            </div>
          )}
        </div>
      </header>

      {/* Wi-Fi surfaced right on the home screen */}
      {wifi?.network && sectionVisible(guide, "wifi") && (
        <div className="px-4.5 pt-4">
          <WifiCard wifi={wifi} />
        </div>
      )}

      <div className="flex flex-col gap-2.5 px-4.5 pb-8 pt-5">
        {firstTiles.length > 0 && (
          <>
            <SectionLabel>
              <span className="inline-flex items-center gap-1.5">
                <KeyIcon className="h-4 w-4" />
                Checking In
              </span>
            </SectionLabel>
            {firstTiles.map((t) => (
              <NavRow key={t.href} href={t.href} title={t.title} subtitle={t.subtitle} />
            ))}
          </>
        )}

        {duringTiles.length > 0 && (
          <>
            <div className={firstTiles.length > 0 ? "mt-3" : undefined}>
              <SectionLabel>
                <span className="inline-flex items-center gap-1.5">
                  <SunIcon className="h-4 w-4" />
                  During your stay
                </span>
              </SectionLabel>
            </div>
            {duringTiles.map((t) => (
              <NavRow key={t.href} href={t.href} title={t.title} subtitle={t.subtitle} />
            ))}
          </>
        )}

        {checkoutTiles.length > 0 && (
          <>
            <div className={firstTiles.length > 0 || duringTiles.length > 0 ? "mt-3" : undefined}>
              <SectionLabel>
                <span className="inline-flex items-center gap-1.5">
                  <ExitIcon className="h-4 w-4" />
                  Checking out
                </span>
              </SectionLabel>
            </div>
            {checkoutTiles.map((t) => (
              <NavRow key={t.href} href={t.href} title={t.title} subtitle={t.subtitle} />
            ))}
          </>
        )}
      </div>
    </GuestScreen>
  );
}
