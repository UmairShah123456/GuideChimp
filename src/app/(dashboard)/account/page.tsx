import { requireAccount } from "@/lib/auth/session";
import { listProperties } from "@/lib/dashboard/queries";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { AccountForm } from "@/components/dashboard/AccountForm";
import { BillingCard } from "@/components/dashboard/BillingCard";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-sm font-extrabold uppercase tracking-[0.08em] text-muted">
      {children}
    </h2>
  );
}

export default async function AccountPage() {
  const [account, properties] = await Promise.all([requireAccount(), listProperties()]);

  return (
    <>
      <PageHeader
        title="Account"
        description="Your profile, guest-portal branding and plan."
      />
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-8 py-8">
        <section>
          <SectionHeading>Profile &amp; branding</SectionHeading>
          <AccountForm account={account} />
        </section>

        <section id="billing">
          <SectionHeading>Billing</SectionHeading>
          <BillingCard propertyCount={properties.length} />
        </section>
      </div>
    </>
  );
}
