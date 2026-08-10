"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { AuthState } from "@/lib/forms";
import { SubmitButton } from "@/components/ui/SubmitButton";

/* 16px on small screens keeps iOS Safari from zooming in on focus. */
const inputCls =
  "w-full rounded-[var(--radius-sm)] border-[1.5px] border-border bg-surface px-3.5 py-3 text-base text-ink outline-none transition-colors focus:border-accent placeholder:text-muted sm:text-sm";

type Variant = "login" | "signup" | "forgot";

const COPY: Record<
  Variant,
  { title: string; subtitle: string; cta: string; pending: string }
> = {
  login: {
    title: "Welcome back",
    subtitle: "Log in to manage your properties and guides.",
    cta: "Log in",
    pending: "Logging in…",
  },
  signup: {
    title: "Create your account",
    subtitle: "Start building beautiful guest guides in minutes.",
    cta: "Create account",
    pending: "Creating…",
  },
  forgot: {
    title: "Reset your password",
    subtitle: "We'll email you a link to set a new one.",
    cta: "Send reset link",
    pending: "Sending…",
  },
};

export function AuthForm({
  variant,
  action,
  next,
}: {
  variant: Variant;
  action: (state: AuthState, formData: FormData) => Promise<AuthState>;
  next?: string;
}) {
  const [state, formAction] = useActionState<AuthState, FormData>(action, {});
  const [showPassword, setShowPassword] = useState(false);
  const copy = COPY[variant];

  return (
    <div className="w-full">
      <h1 className="text-2xl font-extrabold text-ink">{copy.title}</h1>
      <p className="mt-1.5 text-sm text-body">{copy.subtitle}</p>

      <form action={formAction} className="mt-6 flex flex-col gap-3.5">
        {next && <input type="hidden" name="next" value={next} />}

        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-ink">Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            className={inputCls}
            placeholder="you@example.com"
          />
        </label>

        {variant !== "forgot" && (
          <label className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-ink">Password</span>
              {variant === "login" && (
                <Link href="/forgot-password" className="text-xs font-semibold text-accent">
                  Forgot?
                </Link>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete={variant === "login" ? "current-password" : "new-password"}
                required
                minLength={variant === "signup" ? 8 : undefined}
                className={`${inputCls} pr-11`}
                placeholder={variant === "signup" ? "At least 8 characters" : "••••••••"}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center px-3.5 text-muted hover:text-ink"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </label>
        )}

        {state.error && (
          <p className="rounded-[var(--radius-sm)] border-[1.5px] border-danger-ring bg-danger-subtle px-3.5 py-2.5 text-[13px] text-danger">
            {state.error}
          </p>
        )}
        {state.message && (
          <p className="rounded-[var(--radius-sm)] border-[1.5px] border-accent-ring bg-accent-tint px-3.5 py-2.5 text-[13px] text-body-strong">
            {state.message}
          </p>
        )}

        <SubmitButton pendingLabel={copy.pending} className="mt-1 w-full">
          {copy.cta}
        </SubmitButton>
      </form>

      <div className="mt-6 text-center text-[13px] text-body">
        {variant === "login" ? (
          <>
            New here?{" "}
            <Link href="/signup" className="font-semibold text-accent">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-accent">
              Log in
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 3l18 18" />
      <path d="M10.6 5.2A9.9 9.9 0 0 1 12 5c6.5 0 10 7 10 7a17.2 17.2 0 0 1-3.3 4.1M6.6 6.6A17.3 17.3 0 0 0 2 12s3.5 7 10 7a9.8 9.8 0 0 0 4.2-.9" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}
