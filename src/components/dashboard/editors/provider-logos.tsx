/**
 * Brand marks for the video source picker, plus a neutral glyph for uploads.
 * Paths are the single-colour Simple Icons marks (CC0) on a 24×24 viewBox, so
 * each one fills with `currentColor` unless a brand colour is passed in.
 */

type LogoProps = { className?: string; color?: string };

/** Official brand colours, used only when a tab is selected. */
export const PROVIDER_BRAND_COLOR: Record<string, string> = {
  youtube: "#FF0000",
  loom: "#625DF5",
  drive: "#4285F4",
};

export function YouTubeLogo({ className, color }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill={color ?? "currentColor"}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function LoomLogo({ className, color }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill={color ?? "currentColor"}>
      <path d="M24 10.665h-7.018l6.078-3.509-1.335-2.312-6.078 3.509 3.508-6.077L16.843.94l-3.508 6.077V0h-2.67v7.018L7.156.94 4.844 2.275l3.509 6.077-6.078-3.508L.94 7.156l6.078 3.509H0v2.67h7.017L.94 16.844l1.335 2.313 6.077-3.508-3.509 6.077 2.312 1.335 3.509-6.078V24h2.67v-7.017l3.508 6.077 2.312-1.335-3.509-6.078 6.078 3.509 1.335-2.313-6.077-3.508h7.017v-2.67H24zm-12 4.966a3.645 3.645 0 1 1 0-7.29 3.645 3.645 0 0 1 0 7.29z" />
    </svg>
  );
}

export function DriveLogo({ className, color }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill={color ?? "currentColor"}>
      <path d="M12.01 1.485c-2.082 0-3.754.02-3.743.047.01.02 1.708 3.001 3.774 6.62l3.76 6.574h3.76c2.081 0 3.753-.02 3.742-.047-.005-.02-1.708-3.001-3.775-6.62l-3.76-6.574zm-4.76 1.73a789.828 789.861 0 0 0-3.63 6.319L0 15.868l1.89 3.298 1.885 3.297 3.62-6.335 3.618-6.33-1.88-3.287C8.1 4.704 7.255 3.22 7.25 3.214zm2.259 12.653-.203.348c-.114.198-.96 1.672-1.88 3.287a423.93 423.948 0 0 1-1.698 2.97c-.01.026 3.24.042 7.222.042h7.244l1.796-3.157c.992-1.734 1.85-3.23 1.906-3.323l.104-.167h-7.249z" />
    </svg>
  );
}

/** Neutral upload glyph so the fourth tab reads as part of the same row. */
export function UploadLogo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" />
      <path d="M3.5 15v3.5A2.5 2.5 0 0 0 6 21h12a2.5 2.5 0 0 0 2.5-2.5V15" />
    </svg>
  );
}
