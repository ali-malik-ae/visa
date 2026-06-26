import { WHATSAPP_URL } from "@/lib/constants";
import {
  FileCheck,
  Globe,
  Headphones,
  Plane,
  Shield,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionCTA } from "@/components/ui/SectionCTA";

export const metadata: Metadata = {
  title: "Services — UAE Visa Solutions",
  description: `Explore Visati's full range of UAE visa services: tourist visas, business visas, multi-entry permits, document assistance, and express processing.`,
};

const SERVICES = [
  {
    Icon: Plane,
    title: "Tourist Visas",
    description:
      "30-day and 60-day single and multi-entry tourist visas for the UAE. Choose the duration that fits your trip.",
    features: ["30-day single entry", "60-day single entry", "30-day multi-entry", "60-day multi-entry"],
  },
  {
    Icon: Zap,
    title: "Express Processing",
    description:
      "Need your visa fast? Express processing gets your application reviewed and submitted within hours, not days.",
    features: ["Priority review", "Same-day submission", "Dedicated consultant"],
  },
  {
    Icon: FileCheck,
    title: "Document Assistance",
    description:
      "Unsure which documents you need? We review your files, catch mistakes, and make sure everything is correct before submission.",
    features: ["Pre-submission review", "Error identification", "Format guidance"],
  },
  {
    Icon: Globe,
    title: "Visa Extensions",
    description:
      "Already in the UAE and need more time? We handle visa extension applications so you can stay longer without leaving.",
    features: ["In-country extension", "Status check", "Deadline tracking"],
  },
  {
    Icon: Shield,
    title: "Business Visas",
    description:
      "Visa options for business travelers and entrepreneurs visiting the UAE for meetings, conferences, or exploring opportunities.",
    features: ["Business visit visa", "Multiple entry options", "Fast processing"],
  },
  {
    Icon: Headphones,
    title: "24/7 Support",
    description:
      "Questions about your application? Our support team is available around the clock via WhatsApp, email, or phone.",
    features: ["WhatsApp support", "Email assistance", "Phone support"],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-navy relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full border border-white/5" />
          <div className="absolute top-8 -right-16 w-72 h-72 rounded-full border border-white/5" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-24 text-center">
          <FadeIn>
            <p className="text-gold text-xs font-sans font-semibold uppercase tracking-widest mb-4">
              What we do
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              UAE visa services
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/60 max-w-2xl mx-auto">
              Everything you need to get your visa — from application to approval.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Services grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {SERVICES.map((service, i) => (
            <FadeIn key={service.title} delay={i * 80}>
              <div className="group border border-ink/10 rounded-2xl p-6 lg:p-8 hover:border-gold/25 hover:shadow-md transition-all duration-300 h-full">
                <div className="h-11 w-11 rounded-xl bg-gold/15 grid place-items-center mb-5">
                  <service.Icon className="h-5 w-5 text-gold" />
                </div>
                <h3 className="font-display text-lg font-semibold text-ink mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-ink/55 leading-relaxed mb-5">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-ink/45">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold/40 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA */}
      <SectionCTA
        tag="Ready to start?"
        title="Apply for your UAE visa."
        subtitle="Average response under 2 minutes. We respond faster on WhatsApp."
        buttons={[
          {
            label: "Apply Now",
            href: "/apply",
            variant: "primary",
          },
          {
            label: "WhatsApp Us",
            href: WHATSAPP_URL,
            external: true,
            variant: "whatsapp",
          },
        ]}
      />
    </div>
  );
}
