import { GuestHeader } from "@/components/guest/GuestHeader";
import { SectionLabel } from "@/components/guest/primitives";
import { EmptyHint } from "./CheckInSection";
import { fullPhone, phoneDigits } from "@/lib/phone";
import type { EmergencyContent, HostContact } from "@/lib/guide/types";

/** One host contact card — avatar, name, and WhatsApp/Call/Text buttons. */
function HostCard({ host }: { host: HostContact }) {
  const whatsapp = fullPhone(host.dialCode, host.whatsapp);
  const call = fullPhone(host.dialCode, host.phone);
  const sms = fullPhone(host.dialCode, host.sms);

  return (
    <div className="flex flex-col items-center rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface p-5 text-center">
      <div
        className="h-[72px] w-[72px] rounded-full border-[3px] border-accent-subtle bg-cover bg-center"
        style={
          host.avatarUrl
            ? { backgroundImage: `url(${host.avatarUrl})` }
            : { backgroundImage: "radial-gradient(circle at 35% 35%, #f0f3f5, #aeb9c2)" }
        }
      />
      <div className="mt-2.5 text-lg font-extrabold text-ink">{host.name}</div>
      <div className="mt-4 flex w-full gap-2">
        {whatsapp && (
          <a
            href={`https://wa.me/${phoneDigits(whatsapp)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-[var(--radius-code)] bg-brand py-3 text-center text-[13.5px] font-bold text-brand-contrast"
          >
            WhatsApp
          </a>
        )}
        {call && (
          <a
            href={`tel:${call}`}
            className="flex-1 rounded-[var(--radius-code)] bg-accent-subtle py-3 text-center text-[13.5px] font-bold text-accent"
          >
            Call
          </a>
        )}
        {sms && (
          <a
            href={`sms:${sms}`}
            className="flex-1 rounded-[var(--radius-code)] bg-accent-subtle py-3 text-center text-[13.5px] font-bold text-accent"
          >
            Text
          </a>
        )}
      </div>
    </div>
  );
}

/** Guest "Contact & emergency" screen — host card(s) + emergency services. */
export function ContactSection({
  token,
  heading = "Contact & emergency",
  contact,
}: {
  token?: string;
  heading?: string;
  contact: EmergencyContent | null;
}) {
  const hosts = [contact?.host, ...(contact?.additionalHosts ?? [])].filter(
    (h): h is HostContact => !!h?.name,
  );

  return (
    <>
      <GuestHeader
        backHref={token ? `/g/${token}` : undefined}
        title={heading}
      />

      <div className="flex flex-col gap-3 px-4.5 pb-8 pt-4.5">
        {hosts.length > 0 ? (
          <div className="flex flex-col gap-2">
            <SectionLabel>{hosts.length > 1 ? "Your hosts" : "Your host"}</SectionLabel>
            {hosts.map((h, i) => (
              <HostCard key={i} host={h} />
            ))}
          </div>
        ) : (
          <EmptyHint>Add your host contact details so guests can reach you.</EmptyHint>
        )}

        {contact?.services && contact.services.length > 0 && (
          <div className="flex flex-col gap-2">
            <SectionLabel>If it can&apos;t wait</SectionLabel>
            {contact.services.map((s, i) => {
              const danger = s.tone === "danger";
              return (
                <a
                  key={i}
                  href={`tel:${s.phone}`}
                  className={`flex items-center gap-3.5 rounded-[var(--radius-card)] border-[1.5px] bg-surface px-4.5 py-4 ${
                    danger ? "border-danger-ring" : "border-border"
                  }`}
                >
                  <div
                    className={`flex h-[42px] w-[42px] flex-none items-center justify-center rounded-[var(--radius-code)] text-sm font-extrabold ${
                      danger ? "bg-danger-subtle text-danger" : "bg-accent-subtle text-accent"
                    }`}
                  >
                    {s.code}
                  </div>
                  <div className="flex-1">
                    <div className="text-[15px] font-bold text-ink">{s.name}</div>
                    {s.detail && <div className="mt-0.5 text-[12.5px] text-muted">{s.detail}</div>}
                  </div>
                  <span className={`text-[12.5px] font-bold ${danger ? "text-danger" : "text-accent"}`}>
                    Call
                  </span>
                </a>
              );
            })}
          </div>
        )}

        {contact?.goodToKnow && contact.goodToKnow.length > 0 && (
          <div className="flex flex-col gap-2">
            <SectionLabel>Good to know</SectionLabel>
            <div className="rounded-[var(--radius-card)] border-[1.5px] border-border bg-surface px-4.5 py-4">
              <div className="flex flex-col gap-2 text-[12.5px] leading-relaxed text-body">
                {contact.goodToKnow.map((g, i) => (
                  <div key={i}>
                    <strong className="text-ink">{g.label}:</strong> {g.value}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
