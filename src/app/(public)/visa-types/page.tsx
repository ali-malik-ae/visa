import { VisaTypesClient } from "@/components/VisaTypesClient";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import { getVisaTypes, getPageSeo } from "@/lib/sanity/client";
import { getShowUsdSetting } from "@/lib/site-settings";
import { sanityToVisaType, type VisaTypeData } from "@/types/visa";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("visa-types").catch(() => null);
  return {
    title: seo?.title || "UAE Visa Types & Prices",
    description: seo?.description || "Browse all UAE visa types — tourist, transit, multi-entry, and GCC visas. Compare prices and apply online in minutes.",
  };
}

async function loadVisaTypes(): Promise<VisaTypeData[]> {
  try {
    const sanityVisas = await getVisaTypes();
    return sanityVisas.map(sanityToVisaType);
  } catch {
    return [];
  }
}

export default async function VisaTypesPage() {
  const [visaTypes, showUsd] = await Promise.all([
    loadVisaTypes(),
    getShowUsdSetting().catch(() => false),
  ]);
  return (
    <CurrencyProvider showUsd={showUsd}>
      <VisaTypesClient visaTypes={visaTypes} />
    </CurrencyProvider>
  );
}
