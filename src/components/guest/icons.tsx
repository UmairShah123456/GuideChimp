import type { SVGProps } from "react";

/** Lightweight line-icon set (24×24, currentColor stroke). */
type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const KeyIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="8" cy="8" r="4" />
    <path d="m11 11 8 8" />
    <path d="m16 16 2-2M18.5 18.5 21 16" />
  </Base>
);

export const SunIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Base>
);

export const ExitIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8" />
    <path d="M10 12h11m0 0-3-3m3 3-3 3" />
  </Base>
);

export const HomeIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
    <path d="M9.5 21v-6h5v6" />
  </Base>
);

export const GuidesIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="m10 8.5 5 3.5-5 3.5z" fill="currentColor" stroke="none" />
  </Base>
);

export const LocalIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </Base>
);

export const RulesIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M9 5h9M9 12h9M9 19h9" />
    <path d="m3.5 4.5 1.2 1.2L7 3.5M3.5 11.5l1.2 1.2L7 10.5M3.5 18.5l1.2 1.2L7 17.5" />
  </Base>
);

export const ContactIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-4 3.5V17H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
  </Base>
);

export const PersonIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20a7 7 0 0 1 14 0" />
  </Base>
);

export const ChevronLeft = (p: IconProps) => (
  <Base {...p}>
    <path d="m14 6-6 6 6 6" />
  </Base>
);

export const ChevronRight = (p: IconProps) => (
  <Base {...p}>
    <path d="m9 6 6 6-6 6" />
  </Base>
);

export const CopyIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h8" />
  </Base>
);

export const CheckIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="m5 12 5 5L20 6" />
  </Base>
);

export const PhoneIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 4h3l1.5 4.5-2 1.5a11 11 0 0 0 5 5l1.5-2 4.5 1.5V19a2 2 0 0 1-2 2A16 16 0 0 1 4 6a2 2 0 0 1 1-2Z" />
  </Base>
);

export const WhatsAppIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 20l1.4-4A8 8 0 1 1 9 19.6L4 20Z" />
    <path d="M9 9.5c.4 1.2 1.3 2.1 2.5 2.5l1-1 1.6.7v1.4c-2.4.6-4.8-1.8-4.2-4.2H11L9 9.5Z" fill="currentColor" stroke="none" />
  </Base>
);

export const DirectionsIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="m12 2 10 10-10 10L2 12 12 2Z" />
    <path d="M9 14v-2.5A1.5 1.5 0 0 1 10.5 10H15" />
    <path d="m13 8 2 2-2 2" />
  </Base>
);

export const PlusIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 5v14M5 12h14" />
  </Base>
);

/* --- House-rule marks. The "no ..." rules carry their own slash so they read
   correctly at 20px, where a separate overlay turns to mush. --- */

export const NoSmokingIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="12.5" width="13" height="4" rx="1.5" />
    <path d="M12 12.5v4" />
    <path d="M19 12.5v4" />
    <path d="M16 9c1.2-1 1.2-2.5 0-3.5" />
    <path d="m4 4 16 16" />
  </Base>
);

export const NoNoiseIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 10v4h3l4 3V7l-4 3H4Z" />
    <path d="M15 10c.9.9.9 3.1 0 4" />
    <path d="m4 4 16 16" />
  </Base>
);

export const NoPartyIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M5.5 5h11l-5.5 6.5L5.5 5Z" />
    <path d="M11 11.5V19M7.5 19h7" />
    <path d="m4 4 16 16" />
  </Base>
);

/**
 * A paw, with no prohibition slash — unlike the cigarette or speaker, a paw is
 * five separate shapes and adding a diagonal through it turns to mush at the
 * 20px the guest actually sees. The rule's own wording carries the "no".
 */
export const PawIcon = (p: IconProps) => (
  <Base {...p}>
    <ellipse cx="12" cy="16" rx="4" ry="3.1" />
    <circle cx="6.4" cy="11" r="1.7" />
    <circle cx="10.2" cy="8" r="1.7" />
    <circle cx="13.8" cy="8" r="1.7" />
    <circle cx="17.6" cy="11" r="1.7" />
  </Base>
);

export const ShieldIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </Base>
);

export const GuestsIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1" />
    <path d="M16 5.5a3 3 0 0 1 0 5" />
    <path d="M17 14a5 5 0 0 1 4 5v1" />
  </Base>
);

export const ShoesIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 16v-5l4 1 3 2h7a4 4 0 0 1 4 4v1H3v-3Z" />
    <path d="M7 12v3M11 14v2" />
  </Base>
);

export const NoCameraIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 8h4l2-2h6l2 2h4v11H3V8Z" />
    <circle cx="12" cy="13" r="3" />
    <path d="m4 4 16 16" />
  </Base>
);

/** Two nested flames, not one outline — a single one is a teardrop at 20px and
 *  collides with DropIcon in the same picker. */
export const FlameIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 21a6 6 0 0 0 6-6c0-4.5-4-6.5-6-13-2 6.5-6 8.5-6 13a6 6 0 0 0 6 6Z" />
    <path d="M12 21a2.6 2.6 0 0 0 2.6-2.6c0-1.9-1.8-2.8-2.6-5.4-.8 2.6-2.6 3.5-2.6 5.4A2.6 2.6 0 0 0 12 21Z" />
  </Base>
);

export const ClockIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </Base>
);

export const BedIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 18v-8M3 13h18v5M21 18v-4a3 3 0 0 0-3-3H3" />
    <circle cx="7.5" cy="8.5" r="2" />
  </Base>
);

export const CarIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 16v-3l2-5h12l2 5v3" />
    <path d="M4 16h16v2h-2.5M4 18v-2M6.5 18H4" />
    <circle cx="7.5" cy="18" r="1.5" />
    <circle cx="16.5" cy="18" r="1.5" />
  </Base>
);

export const SparkleIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3Z" />
    <path d="M18 16.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1Z" />
  </Base>
);

export const LockIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="4" y="10" width="16" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    <path d="M12 14v3" />
  </Base>
);

export const DropIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3s6 6.5 6 10.5a6 6 0 0 1-12 0C6 9.5 12 3 12 3Z" />
  </Base>
);

export const TrashIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 7h16" />
    <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
    <path d="M10 11v6M14 11v6" />
  </Base>
);

export const PlayIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M8 5v14l11-7L8 5Z" fill="currentColor" />
  </Base>
);

export const WifiIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M2 8.5a15 15 0 0 1 20 0" />
    <path d="M5 12a10 10 0 0 1 14 0" />
    <path d="M8.5 15.5a5 5 0 0 1 7 0" />
    <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
  </Base>
);

/* Local-guide category marks — see components/guest/categories.tsx. */

export const ForkKnifeIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 2v7a2.5 2.5 0 0 0 5 0V2" />
    <path d="M8.5 9v13" />
    <path d="M17.5 22V2c-2 1-3 3.2-3 6.5s1 4.5 3 4.5" />
  </Base>
);

export const TicketIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 8.5V6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2.5a2.5 2.5 0 0 0 0 7V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2.5a2.5 2.5 0 0 0 0-7Z" />
    <path d="M14 5v3M14 11v2M14 16v3" />
  </Base>
);

export const PinIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 22s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
    <circle cx="12" cy="11" r="2.5" />
  </Base>
);

export const LandmarkIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="m12 3 8 4.5H4L12 3Z" />
    <path d="M6.5 10v7M11 10v7M15.5 10v7" />
    <path d="M3.5 21h17" />
  </Base>
);

export const StarIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8L12 3.5Z" />
  </Base>
);
