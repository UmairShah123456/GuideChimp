import { GuestHeader } from "@/components/guest/GuestHeader";
import { RuleIcon } from "@/components/guest/rule-icons";
import { EmptyHint } from "./CheckInSection";
import type { HouseRulesContent } from "@/lib/guide/types";

/** Guest "House rules" screen — one card per rule, each with its own mark. */
export function HouseRulesSection({
  token,
  heading = "House rules",
  rules,
}: {
  token?: string;
  heading?: string;
  rules: HouseRulesContent | null;
}) {
  return (
    <>
      <GuestHeader
        backHref={token ? `/g/${token}` : undefined}
        title={heading}
      />

      <div className="flex flex-col gap-2.5 px-4.5 pb-8 pt-4.5">
        {rules?.rules?.length ? (
          rules.rules.map((rule, i) => (
            <div
              key={i}
              className="flex items-center gap-3.5 rounded-[var(--radius-card)] border-[1.5px] border-border bg-surface px-4.5 py-4"
            >
              <div className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-[var(--radius-code)] bg-accent-subtle text-accent">
                <RuleIcon icon={rule.icon} title={rule.title} className="h-[22px] w-[22px]" />
              </div>
              <div>
                <div className="text-[15px] font-bold text-ink">{rule.title}</div>
                {rule.reason && (
                  <div className="mt-0.5 text-[12.5px] text-muted">{rule.reason}</div>
                )}
              </div>
            </div>
          ))
        ) : (
          <EmptyHint>Add a few house rules — five friendly ones works well.</EmptyHint>
        )}
      </div>
    </>
  );
}
