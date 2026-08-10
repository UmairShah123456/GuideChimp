"use client";

import { useActionState } from "react";
import { updateLinkSettingsAction, regenerateLinkAction } from "@/lib/dashboard/link-actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Field } from "@/components/ui/Field";

export function LinkSettingsForm({
  propertyId,
  guideId,
  audience,
  expiresAt,
  pin,
}: {
  propertyId: string | null;
  guideId: string;
  audience: string;
  expiresAt: string | null;
  pin: string | null;
}) {
  const [state, action] = useActionState(updateLinkSettingsAction, {});
  const [regenState, regen] = useActionState(regenerateLinkAction, {});
  const dateValue = expiresAt ? new Date(expiresAt).toISOString().slice(0, 10) : "";

  return (
    <div className="flex flex-col gap-6">
      <form
        action={action}
        className="rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface p-5"
      >
        <h2 className="text-sm font-extrabold text-ink">Expiry & PIN</h2>
        <p className="mt-1 text-[13px] text-body">
          Set when the link stops working, and optionally require a PIN.
        </p>
        <input type="hidden" name="propertyId" value={propertyId ?? ""} />
        <input type="hidden" name="guideId" value={guideId} />
        <Field
          label="Expiry date"
          name="expires_at"
          type="date"
          defaultValue={dateValue}
          hint={`Leave blank for no expiry. ${audience.charAt(0).toUpperCase() + audience.slice(1)} see a friendly expired screen after this date.`}
        />
        <Field
          label="Access PIN"
          name="pin"
          defaultValue={pin ?? ""}
          placeholder="e.g. 1954"
          hint="Optional. Shown as an extra check before the guide."
        />
        <div className="mt-4 flex items-center gap-3">
          <SubmitButton pendingLabel="Saving…">Save settings</SubmitButton>
          {state.ok && <span className="text-[13px] font-semibold text-success">{state.message}</span>}
          {state.error && <span className="text-[13px] font-semibold text-danger">{state.error}</span>}
        </div>
      </form>

      <form
        action={regen}
        className="rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface p-5"
      >
        <h2 className="text-sm font-extrabold text-ink">Regenerate link</h2>
        <p className="mt-1 text-[13px] text-body">
          Issues a brand-new URL and QR code. The current link stops working
          immediately — use this if a link was shared by mistake.
        </p>
        <input type="hidden" name="propertyId" value={propertyId ?? ""} />
        <input type="hidden" name="guideId" value={guideId} />
        <div className="mt-4 flex items-center gap-3">
          <button
            type="submit"
            className="rounded-[var(--radius-pill)] border-[1.5px] border-danger-ring px-5 py-2.5 text-sm font-bold text-danger"
          >
            Regenerate link
          </button>
          {regenState.ok && (
            <span className="text-[13px] font-semibold text-success">{regenState.message}</span>
          )}
          {regenState.error && (
            <span className="text-[13px] font-semibold text-danger">{regenState.error}</span>
          )}
        </div>
      </form>
    </div>
  );
}
