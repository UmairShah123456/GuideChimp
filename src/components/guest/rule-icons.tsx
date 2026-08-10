import type { SVGProps } from "react";
import {
  BedIcon,
  CarIcon,
  ClockIcon,
  DropIcon,
  FlameIcon,
  GuestsIcon,
  KeyIcon,
  LockIcon,
  NoCameraIcon,
  NoNoiseIcon,
  NoPartyIcon,
  NoSmokingIcon,
  PawIcon,
  RulesIcon,
  ShieldIcon,
  ShoesIcon,
  SparkleIcon,
  TrashIcon,
  WifiIcon,
} from "./icons";

type Glyph = (p: SVGProps<SVGSVGElement>) => React.ReactNode;

/**
 * The icons a host can put on a house rule, in the order they're offered — the
 * common prohibitions first, since those are most rules.
 *
 * The `slug` is what's stored (on the rule's JSON and on a saved template), so
 * these strings are a data format: rename one and existing rules fall back to
 * the generic mark. Adding to the end is always safe.
 */
export const RULE_ICONS: { slug: string; label: string; Icon: Glyph }[] = [
  { slug: "no-smoking", label: "No smoking", Icon: NoSmokingIcon },
  { slug: "no-noise", label: "Quiet / no noise", Icon: NoNoiseIcon },
  { slug: "no-parties", label: "No parties", Icon: NoPartyIcon },
  { slug: "no-pets", label: "Pets", Icon: PawIcon },
  { slug: "no-photos", label: "No filming", Icon: NoCameraIcon },
  { slug: "legal", label: "Nothing illegal", Icon: ShieldIcon },
  { slug: "guests", label: "Guests", Icon: GuestsIcon },
  { slug: "shoes", label: "Shoes off", Icon: ShoesIcon },
  { slug: "bins", label: "Bins / rubbish", Icon: TrashIcon },
  { slug: "keys", label: "Keys", Icon: KeyIcon },
  { slug: "lock-up", label: "Locking up", Icon: LockIcon },
  { slug: "fire", label: "Candles / BBQ", Icon: FlameIcon },
  { slug: "hours", label: "Times", Icon: ClockIcon },
  { slug: "bedrooms", label: "Bedrooms / linen", Icon: BedIcon },
  { slug: "parking", label: "Parking", Icon: CarIcon },
  { slug: "tidy", label: "Keep it tidy", Icon: SparkleIcon },
  { slug: "water", label: "Water / plumbing", Icon: DropIcon },
  { slug: "wifi", label: "Wi-Fi", Icon: WifiIcon },
  { slug: "other", label: "Other", Icon: RulesIcon },
];

const BY_SLUG = new Map(RULE_ICONS.map((i) => [i.slug, i.Icon]));

/**
 * Keyword guesses, tried against a rule's title when it has no icon of its own.
 * Rules written before icons existed — and anything pasted in from elsewhere —
 * get a sensible glyph without the host touching them.
 *
 * Order matters: the first match wins, so the more specific phrases come first
 * ("no smoking" before "smoke alarm" would both hit `smok`, but a rule about
 * the alarm is rare enough that the prohibition is the better default).
 */
const KEYWORDS: [RegExp, string][] = [
  [/smok|vap|cigar/, "no-smoking"],
  [/noise|quiet|loud|music|shout|disturb/, "no-noise"],
  [/part(y|ies)|gathering|event|celebrat/, "no-parties"],
  [/pet|dog|cat|animal/, "no-pets"],
  [/illegal|drug|law|police|weapon/, "legal"],
  [/film|photo|camera|record|shoot/, "no-photos"],
  [/guest|visitor|unregistered|occupan|sleep|people/, "guests"],
  [/shoe|boot|barefoot/, "shoes"],
  [/bin|rubbish|trash|waste|recycl/, "bins"],
  [/key|fob/, "keys"],
  [/lock|door|window|secur|alarm/, "lock-up"],
  [/candle|bbq|barbec|fire|flame|incense/, "fire"],
  [/pm|am|hour|time|late|curfew|check.?out/, "hours"],
  [/bed|linen|sheet|towel|mattress/, "bedrooms"],
  [/park|car|vehicle|drive/, "parking"],
  [/tidy|clean|mess|dish|wash/, "tidy"],
  [/water|shower|drain|toilet|flush|plumb/, "water"],
  [/wifi|wi-fi|internet|broadband/, "wifi"],
];

/** Best-guess icon slug for a rule with none set. Null when nothing matches. */
export function suggestRuleIcon(title: string): string | null {
  const t = title.toLowerCase();
  for (const [pattern, slug] of KEYWORDS) if (pattern.test(t)) return slug;
  return null;
}

/**
 * The mark for one rule: the host's choice if they made one, otherwise a guess
 * from the wording, otherwise the generic rules mark.
 */
export function RuleIcon({
  icon,
  title = "",
  ...props
}: { icon?: string | null; title?: string } & SVGProps<SVGSVGElement>) {
  const slug = icon || suggestRuleIcon(title) || "other";
  const Glyph = BY_SLUG.get(slug) ?? RulesIcon;
  return <Glyph {...props} />;
}
