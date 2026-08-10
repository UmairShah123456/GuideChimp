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
