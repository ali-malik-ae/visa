import { BRAND, WHATSAPP_URL, ABOUT_STATS } from "@/lib/constants";
import { CountUp } from "@/components/ui/CountUp";
import {
  ArrowRight,
  CheckCircle,
  Globe,
  Shield,
  Star,
  Zap,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import type { Metadata } from "next";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { HomeFAQ } from "@/components/home/HomeFAQ";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionCTA } from "@/components/ui/SectionCTA";

export const metadata: Metadata = {
  title: `About Us — ${BRAND.tagline}`,
  description: `Learn about Visati, Dubai's trusted UAE visa consultancy. ${BRAND.clientCount} clients served with a ${BRAND.approvalRate} approval rate across ${BRAND.countriesServed} countries.`,
};

const VALUES = [
  {
    Icon: Zap,
    title: "Speed without shortcuts",
    body: "Most applications are reviewed and submitted within hours. Fast does not mean careless: we check every file before it goes in.",
  },
  {
    Icon: Shield,
    title: "Accuracy on every file",
    body: "A missed document or wrong entry type can take days to fix. A licensed consultant reviews every application before submission.",
  },
  {
    Icon: Globe,
    title: "Based in Dubai",
    body: "We know UAE immigration requirements the way locals do, including the current rules and when something changed last week.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero (centered) ───────────────────────────────────── */}
      <section className="bg-navy relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full border border-white/10" />
          <div className="absolute top-8 -right-16 w-72 h-72 rounded-full border border-white/10" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full border border-white/10" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-28 lg:pt-32 pb-20 lg:pb-28 text-center">
          <FadeIn direction="up" delay={0}>
            <p className="text-gold text-xs font-sans font-semibold uppercase tracking-widest mb-4">
              About Visati
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={100}>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6">
              UAE visas shouldn&apos;t be this complicated.
            </h1>
          </FadeIn>
          <FadeIn direction="up" delay={200}>
            <p className="text-white/60 font-sans text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
              Too many portals, contradictory instructions, emails that go
              nowhere. We built Visati to fix that: one clean process, a
              licensed consultant on every file, and WhatsApp for anything in
              between.
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={300}>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/apply"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-gold text-navy font-sans font-semibold text-sm hover:bg-gold/90 transition-colors"
              >
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-xl border border-white/20 text-white font-sans font-semibold text-sm hover:bg-white/10 transition-colors"
              >
                <FaWhatsapp className="h-[18px] w-[18px]" />
                Chat with Us
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Stats strip ───────────────────────────────────────── */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up" delay={100}>
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-line">
              {ABOUT_STATS.map((stat) => (
                <div key={stat.label} className="px-6 py-10 text-center">
                  <p className="font-display font-bold text-3xl sm:text-4xl text-navy mb-1.5">
                    {stat.type === "static" ? (
                      stat.value
                    ) : (
                      <CountUp
                        end={stat.end}
                        suffix={stat.suffix}
                        locale={stat.locale}
                        decimals={stat.decimals}
                      />
                    )}
                  </p>
                  <p className="text-muted font-sans text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Mission ───────────────────────────────────────────── */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left: copy */}
            <FadeIn direction="left" delay={0}>
              <div>
                <p className="text-gold text-xs font-sans font-semibold uppercase tracking-widest mb-3">
                  Our Mission
                </p>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-ink mb-6 leading-tight">
                  Visa approvals should be the easy part of your trip.
                </h2>
                <p className="text-muted font-sans text-sm leading-relaxed mb-4">
                  UAE immigration requirements change without much warning, and
                  the margin for error is zero. A missed document or wrong photo
                  dimension can mean delays or costly amendments.
                </p>
                <p className="text-muted font-sans text-sm leading-relaxed mb-8">
                  We handle the details. Our consultants stay with you from
                  picking the right visa category all the way to final approval.
                </p>
                <ul className="space-y-3">
                  {[
                    "Licensed UAE immigration consultants",
                    "Document review before every submission",
                    "Status updates via WhatsApp",
                    "No hidden fees",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-ink font-sans">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            {/* Right: Dubai photo + trust card stacked */}
            <FadeIn direction="right" delay={200}>
              <div className="flex flex-col gap-4">
                {/* Stock photo — Dubai skyline */}
                <div className="rounded-2xl overflow-hidden h-52 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80"
                    alt="Dubai skyline — Visati's home city"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-navy/30" />
                  <div className="absolute bottom-4 left-5">
                    <p className="text-white font-sans text-xs font-semibold uppercase tracking-wider opacity-80">
                      Downtown Dubai, UAE
                    </p>
                  </div>
                </div>

                {/* Trust card */}
                <div className="relative rounded-2xl bg-navy p-7">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-gold fill-gold" />
                      ))}
                    </div>
                    <span className="text-white/50 font-sans text-xs">
                      {BRAND.rating} / 5.0 average rating
                    </span>
                  </div>
                  <blockquote className="text-white font-sans text-sm leading-relaxed mb-5">
                    &ldquo;Applied on Monday, visa in my inbox by Wednesday afternoon.
                    The team updated me via WhatsApp at every stage — never felt
                    in the dark for a moment.&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-3 pt-5 border-t border-white/10">
                    <div className="h-9 w-9 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-display font-bold text-xs">
                        SR
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-sans text-sm font-semibold">
                        S. Rahman
                      </p>
                      <p className="text-white/50 font-sans text-xs">
                        Tourist 60-day Visa · Verified client
                      </p>
                    </div>
                  </div>
                  {/* Accent badge */}
                  <div className="absolute -bottom-4 -right-4 hidden lg:flex h-[68px] w-[68px] rounded-2xl bg-gold items-center justify-center flex-col shadow-lg">
                    <p className="font-display font-bold text-white text-lg leading-none">
                      {BRAND.approvalRate}
                    </p>
                    <p className="text-white/75 font-sans text-[9px] mt-0.5 text-center leading-tight">
                      approval
                      <br />
                      rate
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────────── */}
      <section className="py-16 lg:py-20 bg-mist border-y border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up" delay={0}>
            <div className="text-center mb-12">
              <p className="text-gold text-xs font-sans font-semibold uppercase tracking-widest mb-3">
                Why Visati
              </p>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-ink">
                What sets us apart.
              </h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map(({ Icon, title, body }, i) => (
              <FadeIn key={title} direction="up" delay={100 + i * 100}>
                <div className="rounded-2xl bg-white border border-line p-7">
                  <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center mb-5">
                    <Icon className="h-5 w-5 text-gold" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-ink mb-3">
                    {title}
                  </h3>
                  <p className="text-muted font-sans text-sm leading-relaxed">
                    {body}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process (shared homepage component) ───────────────── */}
      <ProcessSteps />

      {/* ── FAQ (shared homepage component) ───────────────────── */}
      <HomeFAQ />

      {/* ── CTA ─────────────────────────────────────────── */}
      <SectionCTA
        tag="Ready to start?"
        title="Your UAE visa, handled by people who know it."
        subtitle={`${BRAND.clientCount} travellers have already applied through Visati.`}
        buttons={[
          {
            label: "Start Application",
            href: "/apply",
            variant: "primary",
          },
          {
            label: "Browse Visa Types",
            href: "/visa-types",
            variant: "outline",
          },
        ]}
      />

    </div>
  );
}
