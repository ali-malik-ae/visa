import { VisaTypesClient } from "@/components/VisaTypesClient";
import { getVisaTypes, getPageSeo } from "@/lib/sanity/client";
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
  const visaTypes = await loadVisaTypes();
  return <VisaTypesClient visaTypes={visaTypes} />;
}
