"use client";

import { useFormStatus } from "react-dom";

/** Primary submit button that shows a pending state while its form posts. */
export function SubmitButton({
  children,
  pendingLabel,
  className = "",
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center rounded-[var(--radius-pill)] bg-brand px-5 py-3 text-sm font-bold text-brand-contrast transition-opacity disabled:opacity-60 ${className}`}
    >
      {pending ? (pendingLabel ?? "Working…") : children}
    </button>
  );
}
