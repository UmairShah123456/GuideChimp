"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/lib/account/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Field } from "@/components/ui/Field";
import type { AccountRow } from "@/lib/guide/types";

/** Account profile. Branding moved out to its own page in the sidebar. */
export function ProfileForm({ account }: { account: AccountRow }) {
  const [state, action] = useActionState(updateProfileAction, {});

  return (
    <form
      action={action}
      className="rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface p-5 sm:p-6"
    >
      <Field
        label="Account name"
        name="name"
        defaultValue={account.name}
        required
        hint="Shown to guests on staff guides and anywhere your logo isn't set."
      />

      <div className="mt-5 flex items-center gap-3">
        <SubmitButton pendingLabel="Saving…">Save</SubmitButton>
        {state.ok && <span className="text-[13px] font-semibold text-success">{state.message}</span>}
        {state.error && <span className="text-[13px] font-semibold text-danger">{state.error}</span>}
      </div>
    </form>
  );
}
