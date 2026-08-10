"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { BrandLogo, type LogoBackdrop } from "@/components/guest/BrandLogo";
import { KeyIcon, ExitIcon, LocalIcon, CopyIcon, CheckIcon } from "@/components/guest/icons";

const formatTime = (t?: string) =>
  t && /^\d{1,2}:\d{2}$/.test(t) ? t : t || "";

/**
 * First-open greeting shown over the guest home screen — the property photo as
 * a full-screen backdrop with a teal-tinted overlay, the address and
 * check-in/out times, and a warm message. Tapping "Enter" reveals the home
 * screen; while it's up the guide's sub-pages are prefetched so navigation is
 * instant. Shows once per browser session (per token).
 */
export function WelcomeGate({
  token,
  propertyName,
  address,
  checkInTime,
  checkoutTime,
  heroImageUrl,
  logoUrl,
  logoBackdrop,
  accountName,
  prefetchHrefs,
}: {
  token: string;
  propertyName: string;
  address?: string;
  checkInTime?: string;
  checkoutTime?: string;
  heroImageUrl?: string | null;
  logoUrl?: string | null;
  logoBackdrop?: LogoBackdrop;
  accountName: string;
  prefetchHrefs: string[];
}) {
  const router = useRouter();
  const [show, setShow] = useState(true);
  const [copied, setCopied] = useState(false);
  const storageKey = `gc-welcomed:${token}`;

  useEffect(() => {
    try {
      if (sessionStorage.getItem(storageKey)) {
        setShow(false);
        return;
      }
    } catch {
      /* sessionStorage unavailable — just show the greeting */
    }
    for (const href of prefetchHrefs) router.prefetch(href);
  }, [prefetchHrefs, router, storageKey]);

  if (!show) return null;

  const enter = () => {
    try {
      sessionStorage.setItem(storageKey, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  const copyAddress = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — no-op */
    }
  };

  const checkIn = formatTime(checkInTime);
  const checkout = formatTime(checkoutTime);
  const hasTimes = Boolean(checkIn || checkout);
  const hasCard = Boolean(address || hasTimes);

  return (
    <div className="fixed inset-0 z-50 mx-auto flex w-full max-w-[480px] flex-col overflow-hidden bg-brand-deep text-white">
      {/* Property photo backdrop */}
      {heroImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={heroImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
      )}
      {/* Teal tint + legibility darkening toward the bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-scrim/85 via-scrim/35 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/75 via-brand-deep/15 to-transparent" />

      <div className="relative flex w-full flex-1 flex-col px-6 pb-8 pt-11">
        <div className="flex justify-center">
          {logoUrl ? (
            <BrandLogo url={logoUrl} name={accountName} backdrop={logoBackdrop} />
          ) : (
            <Logo className="h-6 w-auto brightness-0 invert" />
          )}
        </div>

        <div className="mt-auto flex flex-col gap-5">
          <div>
            <div className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-white/75">
              Welcome
            </div>
            <h1 className="mt-2 font-display text-[34px] font-extrabold leading-[1.06]">
              {propertyName || "You're in the right place"}
            </h1>
            <p className="mt-3 max-w-[22rem] text-[14.5px] leading-relaxed text-white/85">
              Everything you need is a tap away. Take a look whenever you&apos;re ready.
            </p>
          </div>

          {hasCard && (
            <div className="rounded-[var(--radius-lg)] border border-white/15 bg-white/[0.08] p-4 backdrop-blur-md">
              {address && (
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <IconBubble>
                      <LocalIcon className="h-4 w-4 text-white" />
                    </IconBubble>
                    <div className="min-w-0">
                      <FieldLabel>Address</FieldLabel>
                      <div className="text-[14px] font-semibold leading-snug text-white">{address}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={copyAddress}
                    className="flex flex-none items-center gap-1 text-xs font-bold text-white/80 hover:text-white"
                  >
                    {copied ? <CheckIcon className="h-3.5 w-3.5" /> : <CopyIcon className="h-3.5 w-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              )}

              {address && hasTimes && <div className="my-3.5 h-px bg-white/12" />}

              {hasTimes && (
                <div className="grid grid-cols-2 gap-3">
                  {checkIn && (
                    <div className="flex items-start gap-3">
                      <IconBubble>
                        <KeyIcon className="h-4 w-4 text-white" />
                      </IconBubble>
                      <div>
                        <FieldLabel>Check-in</FieldLabel>
                        <div className="text-[14px] font-semibold text-white">from {checkIn}</div>
                      </div>
                    </div>
                  )}
                  {checkout && (
                    <div className="flex items-start gap-3">
                      <IconBubble>
                        <ExitIcon className="h-4 w-4 text-white" />
                      </IconBubble>
                      <div>
                        <FieldLabel>Checkout</FieldLabel>
                        <div className="text-[14px] font-semibold text-white">{checkout}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={enter}
            className="w-full rounded-[var(--radius-pill)] bg-white py-4 text-center text-[15px] font-extrabold text-brand-deep transition-transform active:scale-[0.99]"
          >
            Enter your guide
          </button>
        </div>
      </div>
    </div>
  );
}

function IconBubble({ children }: { children: React.ReactNode }) {
  return (
    <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white/15">
      {children}
    </span>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/60">{children}</div>
  );
}
