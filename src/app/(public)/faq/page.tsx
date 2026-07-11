import { getFaqs, getPageSeo } from "@/lib/sanity/client";
import type { Metadata } from "next";
import { FAQClient } from "./FAQClient";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("faq").catch(() => null);
  return {
    title: seo?.title || "Frequently Asked Questions — UAE Visa",
    description: seo?.description || "Find answers to common questions about UAE visa applications, documents, processing times, fees, and payments.",
  };
}

export default async function FAQPage() {
  const faqs = await getFaqs().catch(() => []);
  return <FAQClient faqs={faqs} />;
}
