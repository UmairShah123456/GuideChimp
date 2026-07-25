import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/marketing/LegalPage";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy policy" updated="25 July 2026">
      <p className="rounded-[var(--radius-card)] border-[1.5px] border-accent-ring bg-accent-tint px-4 py-3 text-[14px] font-semibold text-accent">
        Draft. Have this reviewed by a solicitor before you rely on it.
      </p>

      <LegalSection heading="Who we are">
        <p>
          GuideChimp provides digital guidebooks for short-let and serviced
          accommodation hosts. In this policy, &ldquo;we&rdquo; means GuideChimp and
          &ldquo;you&rdquo; means the host holding an account with us.
        </p>
      </LegalSection>

      <LegalSection heading="What we collect">
        <p>
          <strong className="text-ink">Account data.</strong> Your email address and
          password, the name of your business, and the properties and guide content
          you create.
        </p>
        <p>
          <strong className="text-ink">Guide content.</strong> Anything you enter into
          a guide — addresses, access codes, photos and videos you upload, and your
          local recommendations.
        </p>
        <p>
          <strong className="text-ink">Guest usage.</strong> When someone opens a
          guide link we record a view count. We do not ask guests to create an
          account and we do not collect their names or contact details.
        </p>
      </LegalSection>

      <LegalSection heading="How we use it">
        <p>
          To run the service: storing your guides, rendering them for your guests,
          keeping your account secure, and contacting you about the service. We do
          not sell your data and we do not use guide content for advertising.
        </p>
      </LegalSection>

      <LegalSection heading="Access codes and sensitive details">
        <p>
          Guides often contain door codes and key-safe combinations. Anyone holding
          a guide link can see that content, so treat the link as sensitive. You can
          add a PIN, set an expiry date, or change any code at any time.
        </p>
      </LegalSection>

      <LegalSection heading="Where your data is held">
        <p>
          Guide content, uploads and account records are stored with our hosting and
          database providers. Data may be processed outside your country under
          appropriate safeguards.
        </p>
      </LegalSection>

      <LegalSection heading="Your rights">
        <p>
          You can access, correct, export or delete your data. Deleting a property
          removes its guide, media and links. To close your account entirely, email
          us and we will action it.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions about this policy:{" "}
          <a
            href="mailto:hello@guidechimp.app"
            className="font-semibold text-accent underline decoration-accent-ring underline-offset-4"
          >
            hello@guidechimp.app
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
