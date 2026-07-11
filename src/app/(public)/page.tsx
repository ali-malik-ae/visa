import { FooterCTA } from "@/components/home/FooterCTA";
import { GlobalReach } from "@/components/home/GlobalReach";
import { Hero } from "@/components/home/Hero";
import { HomeFAQ } from "@/components/home/HomeFAQ";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { QuickApplyWidget } from "@/components/home/QuickApplyWidget";
import { Testimonials } from "@/components/home/Testimonials";
import { VisaShowcase } from "@/components/home/VisaShowcase";
import { WhyChoose } from "@/components/home/WhyChoose";
import { FadeIn } from "@/components/ui/FadeIn";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import { getDisplayVisaTypes } from "@/lib/visa-data";
import { getPageSeo } from "@/lib/sanity/client";
import { getShowUsdSetting } from "@/lib/site-settings";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("home").catch(() => null);
  return {
    title: seo?.title || "Visati — UAE Visa Online | Fast Processing, 99% Approval",
    description: seo?.description || "Apply for UAE tourist, transit, and long-stay visas online. Fast processing, 99% approval rate, trusted by 1,000+ travellers.",
  };
}

export default async function HomePage() {
  const [visaTypes, showUsd] = await Promise.all([
    getDisplayVisaTypes(),
    getShowUsdSetting().catch(() => false),
  ]);

  return (
    <>
      {/* 1 — Hero with Quick Apply + stats bar */}
      <Hero>
        <QuickApplyWidget visaTypes={visaTypes} />
      </Hero>

      {/* 2 — Visa types */}
      <FadeIn delay={100}>
        {visaTypes.length > 0 && (
          <CurrencyProvider showUsd={showUsd}>
            <VisaShowcase visaTypes={visaTypes} />
          </CurrencyProvider>
        )}
      </FadeIn>

      {/* 3 — Global reach + stats */}
      <FadeIn delay={100}>
        <GlobalReach />
      </FadeIn>

      {/* 4 — Process */}
      <FadeIn delay={100}>
        <ProcessSteps />
      </FadeIn>

      {/* 5 — Why Choose */}
      <FadeIn delay={100}>
        <WhyChoose />
      </FadeIn>

      {/* 7 — Testimonials */}
      <FadeIn delay={100}>
        <Testimonials />
      </FadeIn>

      {/* 8 — FAQ */}
      <FadeIn delay={100}>
        <HomeFAQ />
      </FadeIn>

      {/* 9 — CTA before footer */}
      <FooterCTA />
    </>
  );
}
