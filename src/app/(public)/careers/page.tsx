import { BRAND, WHATSAPP_URL } from "@/lib/constants";
import {
  Briefcase,
  Clock,
  Heart,
  MapPin,
  Plane,
  GraduationCap,
  Coffee,
  Building2,
} from "lucide-react";
import type { Metadata } from "next";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionCTA } from "@/components/ui/SectionCTA";
import { getPageSeo } from "@/lib/sanity/client";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("careers").catch(() => null);
  return {
    title: seo?.title || "Careers — Join Our Dubai Team",
    description: seo?.description || `Join Visati's team in Dubai. We are hiring visa consultants, customer support specialists, and operations staff.`,
  };
}

const PERKS = [
  { Icon: Heart, label: "Health insurance" },
  { Icon: Plane, label: "Annual flight allowance" },
  { Icon: GraduationCap, label: "Training & development" },
  { Icon: Coffee, label: "Team outings" },
  { Icon: Building2, label: "Central Dubai office" },
  { Icon: Clock, label: "Flexible hours" },
];

const OPENINGS = [
  {
    title: "Visa Consultant",
    department: "Operations",
    location: "Dubai, UAE",
    type: "Full-time",
    description:
      "Review and process UAE visa applications. You will check documents, verify eligibility, liaise with immigration authorities, and ensure applications are submitted correctly.",
    requirements: [
      "2+ years experience in UAE immigration or visa processing",
      "Knowledge of UAE visa categories and entry permit requirements",
      "Attention to detail and strong organizational skills",
      "Fluent in English; Arabic or Urdu is a plus",
    ],
  },
  {
    title: "Customer Support Specialist",
    department: "Support",
    location: "Dubai, UAE",
    type: "Full-time",
    description:
      "Handle client inquiries via WhatsApp, email, and phone. Guide applicants through the visa process, resolve issues, and keep clients updated on their application status.",
    requirements: [
      "1+ years in customer support or client-facing roles",
      "Excellent written and verbal communication",
      "Available to work flexible hours including weekends",
      "Experience with CRM tools is a plus",
    ],
  },
  {
    title: "Operations Coordinator",
    department: "Operations",
    location: "Dubai, UAE",
    type: "Full-time",
    description:
      "Coordinate daily operations: manage application queues, track deadlines, support the consulting team, and maintain internal records.",
    requirements: [
      "1+ years in operations or administrative roles",
      "Strong multitasking and time management skills",
      "Proficient with spreadsheets and internal tools",
      "Comfortable working in a fast-paced environment",
    ],
  },
  {
    title: "Marketing Coordinator",
    department: "Marketing",
    location: "Dubai, UAE",
    type: "Full-time",
    description:
      "Manage social media content, run email campaigns, track analytics, and support brand initiatives to grow Visati's online presence.",
    requirements: [
      "1+ years in digital marketing or social media management",
      "Experience with Instagram, Facebook, and Google Ads",
      "Basic design skills (Canva or similar tools)",
      "Understanding of SEO and content strategy is a plus",
    ],
  },
];

export default function CareersPage() {
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
              We&apos;re hiring
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Build your career in Dubai
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/60 max-w-2xl mx-auto">
              Join {BRAND.clientCount} travellers already served by our team. We are growing and looking for talented people.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Perks */}
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <FadeIn>
            <p className="text-center text-xs font-sans font-semibold uppercase tracking-widest text-ink/40 mb-8">
              What we offer
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {PERKS.map(({ Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-ink/8 hover:border-gold/30 transition-colors"
                >
                  <div className="h-10 w-10 rounded-xl bg-gold/15 grid place-items-center">
                    <Icon className="h-5 w-5 text-gold" />
                  </div>
                  <span className="text-sm text-ink/70 text-center font-medium">{label}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Openings */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <FadeIn>
          <p className="text-xs font-sans font-semibold uppercase tracking-widest text-ink/40 mb-2">
            Open positions
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink mb-10">
            Find your role
          </h2>
        </FadeIn>

        <div className="space-y-4">
          {OPENINGS.map((job, i) => (
            <FadeIn key={job.title} delay={i * 80}>
              <div className="group border border-ink/10 rounded-2xl p-6 lg:p-8 hover:border-gold/25 hover:shadow-md transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-display text-lg font-semibold text-ink group-hover:text-gold transition-colors">
                        {job.title}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-gold/10 text-gold text-xs font-medium">
                        {job.type}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-ink/40 mb-3">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.location}
                      </span>
                    </div>
                    <p className="text-sm text-ink/55 leading-relaxed max-w-2xl mb-4">
                      {job.description}
                    </p>
                    <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
                      {job.requirements.map((r) => (
                        <li key={r} className="flex items-start gap-2 text-sm text-ink/50">
                           <span className="h-1.5 w-1.5 rounded-full bg-gold/40 mt-1.5 flex-shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-shrink-0 lg:mt-1">
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-whatsapp hover:bg-whatsapp-hover text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap"
                    >
                      Apply via WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA */}
      {OPENINGS.length > 0 && (
        <SectionCTA
          tag="Don't see a role?"
          title="Send us your CV."
          subtitle="We keep applications on file for future openings."
          buttons={[
            {
              label: "Send Your CV",
              href: WHATSAPP_URL,
              external: true,
              variant: "whatsapp",
            },
          ]}
        />
      )}
    </div>
  );
}
