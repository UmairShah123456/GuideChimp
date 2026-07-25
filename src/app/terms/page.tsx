import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/marketing/LegalPage";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of service" updated="25 July 2026">
      <p className="rounded-[var(--radius-card)] border-[1.5px] border-accent-ring bg-accent-tint px-4 py-3 text-[14px] font-semibold text-accent">
        Draft. Have this reviewed by a solicitor before you rely on it.
      </p>

      <LegalSection heading="The agreement">
        <p>
          By creating a GuideChimp account you agree to these terms. If you are
          signing up on behalf of a business, you confirm you can agree on its
          behalf.
        </p>
      </LegalSection>

      <LegalSection heading="Your account">
        <p>
          Keep your login details secure — you are responsible for what happens under
          your account. Tell us promptly if you think someone else has access.
        </p>
      </LegalSection>

      <LegalSection heading="Your content">
        <p>
          You own the text, photos and videos you upload. You give us the permission
          needed to store that content and display it to guests who open your guide
          links. You confirm you have the right to use everything you upload.
        </p>
      </LegalSection>

      <LegalSection heading="Acceptable use">
        <p>
          Do not use GuideChimp to publish unlawful content, infringe someone
          else&rsquo;s rights, or share material you have no permission to
          distribute. We may suspend accounts that do.
        </p>
      </LegalSection>

      <LegalSection heading="Availability">
        <p>
          We work to keep the service running but cannot promise it will be
          uninterrupted or error-free. We may change or withdraw features, and will
          give reasonable notice of significant changes.
        </p>
      </LegalSection>

      <LegalSection heading="Liability">
        <p>
          GuideChimp displays the information you enter. You remain responsible for
          its accuracy — including access codes, safety information and anything a
          guest relies on. To the extent the law allows, we are not liable for
          indirect or consequential loss.
        </p>
      </LegalSection>

      <LegalSection heading="Ending the agreement">
        <p>
          You can stop using the service and delete your account at any time. We may
          end the agreement if these terms are broken. Deleting a property removes
          its guide, media and links.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions about these terms:{" "}
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
