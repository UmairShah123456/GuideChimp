import type { SVGProps } from "react";

/** Marketing line-icon set. Matches the guest set: 24×24, 1.75 stroke, currentColor. */
type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/** A team — cleaners, VAs, co-hosts. */
export const UsersIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M15.5 20v-1.5a3.5 3.5 0 0 0-3.5-3.5H6.5A3.5 3.5 0 0 0 3 18.5V20" />
    <circle cx="9.25" cy="8" r="3.25" />
    <path d="M17 15.2a3.5 3.5 0 0 1 4 3.3V20M16.2 5.2a3.25 3.25 0 0 1 0 5.6" />
  </Base>
);

/** A library of guides — the one place everything lives. */
export const LibraryIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H8v16H5.5A1.5 1.5 0 0 1 4 18.5z" />
    <path d="M10.5 4H13v16h-2.5z" />
    <path d="m16.2 4.9 2.4-.6a1.5 1.5 0 0 1 1.83 1.08l2.5 11.3" />
  </Base>
);

/** Scattered, unfindable information — the problem this replaces. */
export const ScatterIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="4" width="7" height="5.5" rx="1.5" />
    <rect x="14" y="7.5" width="7" height="5.5" rx="1.5" />
    <rect x="6.5" y="14.5" width="7" height="5.5" rx="1.5" />
  </Base>
);

/** One link per property. */
export const LinkIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M10 13.5a4 4 0 0 0 5.66 0l3-3A4 4 0 0 0 13 4.84l-1.7 1.7" />
    <path d="M14 10.5a4 4 0 0 0-5.66 0l-3 3A4 4 0 0 0 11 19.16l1.7-1.7" />
  </Base>
);

/** QR / scan. */
export const ScanIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
    <rect x="8.5" y="8.5" width="7" height="7" rx="1.5" />
  </Base>
);

/** Short video how-tos. */
export const FilmIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="M10 9.5v5l4.5-2.5z" />
  </Base>
);

/** Modular blocks — the custom section builder. */
export const BlocksIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
    <rect x="13.5" y="3" width="7.5" height="4.5" rx="2" />
    <rect x="13.5" y="10.5" width="7.5" height="10.5" rx="2" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
  </Base>
);

/** Brand / colour control. */
export const DropletIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3.2c3.2 3.5 5.5 6.3 5.5 9.1A5.5 5.5 0 0 1 6.5 12.3c0-2.8 2.3-5.6 5.5-9.1Z" />
    <path d="M9.5 13.4a2.6 2.6 0 0 0 2.5 2.4" />
  </Base>
);

/** Local recommendations on a map. */
export const PinIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 21s7-5.1 7-10.4A7 7 0 0 0 5 10.6C5 15.9 12 21 12 21Z" />
    <circle cx="12" cy="10.4" r="2.6" />
  </Base>
);

/** Fewer messages / questions answered. */
export const ChatIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M20 14.5a2.5 2.5 0 0 1-2.5 2.5H9l-4 3v-3H6.5A2.5 2.5 0 0 1 4 14.5v-8A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5Z" />
    <path d="M9 9.5h6M9 12.5h3.5" />
  </Base>
);

/** Hours back in the week. */
export const ClockIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 1.8" />
  </Base>
);

/** Better reviews. */
export const StarIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="m12 4 2.35 4.9 5.15.7-3.75 3.7.92 5.2L12 16.05 7.33 18.5l.92-5.2L4.5 9.6l5.15-.7z" />
  </Base>
);

/** Works on any phone, no install. */
export const DeviceIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
    <path d="M10.75 5.5h2.5" />
  </Base>
);

/** Live preview / eye. */
export const EyeIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="2.75" />
  </Base>
);

/** Toggle a section on or off. */
export const ToggleIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="2.5" y="7" width="19" height="10" rx="5" />
    <circle cx="16.5" cy="12" r="2.75" />
  </Base>
);

/** Small confirmation tick used in lists. */
export const TickIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Base>
);

/** Directional arrow for links. */
export const ArrowIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Base>
);
