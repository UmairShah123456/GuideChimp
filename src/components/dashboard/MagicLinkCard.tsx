"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { CopyButton } from "@/components/guest/CopyButton";
import { guideBasePath } from "@/lib/dashboard/paths";

/**
 * Shows a guide's magic link with a copyable URL, a client-generated QR code
 * (downloadable), and its view count. Each guide on a property has its own
 * link, so the label names the audience rather than always saying "guest".
 */
export function MagicLinkCard({
  propertyId,
  guideId,
  guideName,
  token,
  appUrl,
  viewCount,
  expiresAt,
  hasPin,
}: {
  propertyId: string | null;
  guideId: string;
  guideName: string;
  token: string | null;
  appUrl: string;
  viewCount: number;
  expiresAt: string | null;
  hasPin: boolean;
}) {
  const url = token ? `${appUrl}/g/${token}` : "";
  const [qr, setQr] = useState<string>("");

  useEffect(() => {
    if (!url) return;
    QRCode.toDataURL(url, { margin: 1, width: 320, errorCorrectionLevel: "M" })
      .then(setQr)
      .catch(() => setQr(""));
  }, [url]);

  const expired = expiresAt ? new Date(expiresAt).getTime() < Date.now() : false;

  if (!token) {
    return (
      <div className="rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface p-5 text-sm text-body">
        No magic link yet.{" "}
        <Link href={`${guideBasePath(propertyId, guideId)}/link-settings`} className="font-semibold text-accent">
          Create one
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted">
            {guideName} link
          </div>
          <div className="mt-2 flex items-center gap-2 rounded-[var(--radius-sm)] border-[1.5px] border-border bg-page px-3 py-2">
            <span className="min-w-0 flex-1 truncate font-mono text-[13px] text-ink">{url}</span>
            <CopyButton value={url} label="Copy" />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-[var(--radius-pill)] bg-accent-subtle px-2.5 py-1 font-semibold text-accent">
              {viewCount} views
            </span>
            {expired ? (
              <span className="rounded-[var(--radius-pill)] bg-danger-subtle px-2.5 py-1 font-semibold text-danger">
                Expired
              </span>
            ) : expiresAt ? (
              <span className="rounded-[var(--radius-pill)] bg-page px-2.5 py-1 font-semibold text-body">
                Expires {new Date(expiresAt).toLocaleDateString()}
              </span>
            ) : (
              <span className="rounded-[var(--radius-pill)] bg-page px-2.5 py-1 font-semibold text-body">
                No expiry
              </span>
            )}
            {hasPin && (
              <span className="rounded-[var(--radius-pill)] bg-page px-2.5 py-1 font-semibold text-body">
                PIN on
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/g/${token}`}
              target="_blank"
              className="rounded-[var(--radius-pill)] bg-accent px-4 py-2 text-[13px] font-bold text-white"
            >
              Preview guide
            </Link>
            <Link
              href={`${guideBasePath(propertyId, guideId)}/link-settings`}
              className="rounded-[var(--radius-pill)] border-[1.5px] border-border px-4 py-2 text-[13px] font-bold text-ink"
            >
              Link settings
            </Link>
          </div>
        </div>

        <div className="flex flex-none flex-col items-center gap-2">
          <div className="rounded-[var(--radius-sm)] border-[1.5px] border-border bg-white p-2">
            {qr ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qr} alt="Magic link QR code" className="h-28 w-28" />
            ) : (
              <div className="h-28 w-28 animate-pulse rounded bg-page" />
            )}
          </div>
          {qr && (
            <a
              href={qr}
              download={`guidechimp-${token}.png`}
              className="text-xs font-semibold text-accent"
            >
              Download QR
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
