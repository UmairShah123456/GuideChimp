"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "./icons";

/**
 * Tap-to-copy control. Ships two presets used across the portal — a compact
 * inline "Copy" and a full-width primary button (Wi-Fi password) — plus a
 * `bare` mode where the caller supplies its own children.
 */
export function CopyButton({
  value,
  variant = "inline",
  label,
  copiedLabel = "Copied",
  className = "",
  children,
}: {
  value: string;
  variant?: "inline" | "primary" | "bare";
  label?: string;
  copiedLabel?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard blocked (e.g. insecure context) — no-op rather than throw.
    }
  }

  if (variant === "bare") {
    return (
      <button type="button" onClick={copy} className={className}>
        {children}
      </button>
    );
  }

  if (variant === "primary") {
    return (
      <button
        type="button"
        onClick={copy}
        className={`flex w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-brand p-3 text-[13.5px] font-bold text-brand-contrast transition-colors ${className}`}
      >
        {copied ? <CheckIcon className="h-4 w-4" /> : null}
        {copied ? copiedLabel : (label ?? "Tap to copy")}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex items-center gap-1.5 text-xs font-bold text-accent ${className}`}
    >
      {copied ? (
        <>
          <CheckIcon className="h-3.5 w-3.5" /> {copiedLabel}
        </>
      ) : (
        <>
          <CopyIcon className="h-3.5 w-3.5" /> {label ?? "Copy"}
        </>
      )}
    </button>
  );
}
