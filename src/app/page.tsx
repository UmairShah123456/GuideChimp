import { SiteHeader } from "@/components/marketing/SiteHeader";
import { Hero } from "@/components/marketing/Hero";
import { ScatterBand } from "@/components/marketing/ScatterBand";
import { TwoKinds } from "@/components/marketing/TwoKinds";
import { Outcomes } from "@/components/marketing/Outcomes";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
import { SectionsBand } from "@/components/marketing/SectionsBand";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Testimonials } from "@/components/marketing/Testimonials";
import { Faq } from "@/components/marketing/Faq";
import { FinalCta } from "@/components/marketing/FinalCta";
import { SiteFooter } from "@/components/marketing/SiteFooter";

export default function LandingPage() {
  return (
    <div className="grain min-h-dvh bg-page">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-[var(--radius-pill)] focus:bg-brand focus:px-4 focus:py-2.5 focus:text-sm focus:font-bold focus:text-brand-contrast"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="main">
        <Hero />
        {/* Problem, then the structural answer, then what it changes for you. */}
        <ScatterBand />
        <TwoKinds />
        <Outcomes />
        <FeatureGrid />
        <SectionsBand />
        <HowItWorks />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>

      <SiteFooter />
    </div>
  );
}
