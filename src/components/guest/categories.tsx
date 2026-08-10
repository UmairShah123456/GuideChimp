import type { SVGProps } from "react";
import {
  ForkKnifeIcon,
  LandmarkIcon,
  PinIcon,
  StarIcon,
  TicketIcon,
} from "./icons";

/**
 * The local-guide categories a host can pick, in the order they're offered.
 * Categories are stored as plain text on the entry, so this list is the single
 * source for both the editor's picker and the guest-side icons.
 */
export const LOCAL_CATEGORIES = [
  "Food and drink",
  "Attraction",
  "Famous location",
  "Point of interest",
  "Other",
] as const;

export type LocalCategory = (typeof LOCAL_CATEGORIES)[number];

const ICONS: Record<string, (p: SVGProps<SVGSVGElement>) => React.ReactNode> = {
  "food and drink": ForkKnifeIcon,
  attraction: TicketIcon,
  "famous location": LandmarkIcon,
  "point of interest": PinIcon,
  other: StarIcon,
};

/**
 * Icon for a category. Falls back to the "Other" mark so entries saved before a
 * category existed — or with free text from an older build — still get a glyph.
 */
export function CategoryIcon({
  category,
  ...props
}: { category: string } & SVGProps<SVGSVGElement>) {
  const Icon = ICONS[category.trim().toLowerCase()] ?? StarIcon;
  return <Icon {...props} />;
}
