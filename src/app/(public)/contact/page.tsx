import { getPageSeo } from "@/lib/sanity/client";
import type { Metadata } from "next";
import { ContactClient } from "./ContactClient";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("contact").catch(() => null);
  return {
    title: seo?.title || "Contact Us — UAE Visa Support",
    description: seo?.description || "Get in touch with Visati for UAE visa inquiries, applications, and support. WhatsApp, email, or call us — average response under 2 minutes.",
  };
}

export default function ContactPage() {
  return <ContactClient />;
}
