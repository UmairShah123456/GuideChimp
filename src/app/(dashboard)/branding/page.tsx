import { requireAccount } from "@/lib/auth/session";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { BrandingForm } from "@/components/dashboard/BrandingForm";

export default async function BrandingPage() {
  const account = await requireAccount();

  return (
    <>
      <PageHeader
        title="Branding"
        description="Your logo, colour, theme and type — applied to every guide you share."
      />
      <div className="mx-auto max-w-5xl px-8 py-8">
        <BrandingForm account={account} />
      </div>
    </>
  );
}
