import { CountUp } from "@/components/ui/CountUp";
import { BRAND, HERO_STATS } from "@/lib/constants";
import {
  ArrowRight,
  Building2,
  Globe,
  ShieldCheck,
  Star,
  Zap,
} from "lucide-react";
import Link from "next/link";

const TRUST_BADGES = ["Dubai Based", "Trusted Worldwide"];

const TRUST_ICONS = [
  { icon: Building2, label: "UAE Office" },
  { icon: ShieldCheck, label: "Secure Documents" },
  { icon: Zap, label: "Fast Processing" },
  { icon: Globe, label: "Worldwide Applicants" },
];

export function Hero({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <section className="relative overflow-hidden bg-navy">
        {/* Background gradient */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 70% 30%, #0057FF22 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 lg:pt-20 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left column */}
            <div className="lg:col-span-7">
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                {TRUST_BADGES.map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-sans font-medium text-white/80"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-blue" />
                    {label}
                  </span>
                ))}
              </div>

              {/* Headline */}
              <h1 className="font-display font-bold text-white leading-[0.95]">
                <span className="block text-5xl sm:text-6xl lg:text-7xl">
                  Dubai Visa
                </span>
                <span className="block text-5xl sm:text-6xl lg:text-7xl text-blue">
                  Made Simple.
                </span>
              </h1>

              <p className="mt-6 text-lg text-white/70 font-sans max-w-lg leading-relaxed">
                Visa processing for residents worldwide. Dubai based, trusted
                internationally.
              </p>

              {/* CTA buttons */}
              <div className="mt-8 flex items-center gap-3 flex-wrap">
                <Link
                  href="/apply"
                  className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-blue text-white text-sm font-semibold font-sans hover:bg-blue-hover transition-colors whitespace-nowrap"
                >
                  Apply Now
                  <ArrowRight className="h-4 w-4 flex-shrink-0" />
                </Link>
                <Link
                  href="/track"
                  className="inline-flex items-center h-12 px-6 rounded-xl border border-white/20 text-white text-sm font-semibold font-sans hover:bg-white/10 transition-colors whitespace-nowrap"
                >
                  Track Application
                </Link>
              </div>

              {/* Social proof row */}
              <div className="mt-7 flex items-center gap-4 flex-wrap">
                <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-xs font-sans text-white/80 whitespace-nowrap">
                    <span className="font-semibold text-white">
                      {BRAND.rating}/5
                    </span>{" "}
                    on Google
                  </span>
                </div>
                <span className="text-sm font-sans text-white/60 whitespace-nowrap">
                  {BRAND.clientCount} clients served
                </span>
              </div>

              {/* Trust icons row */}
              <div className="mt-8 flex items-center gap-x-6 gap-y-3 flex-wrap">
                {TRUST_ICONS.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 text-xs font-sans text-white/80 whitespace-nowrap"
                  >
                    <Icon className="h-4 w-4 text-white/60 flex-shrink-0" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right column — Quick Apply widget */}
            {children && (
              <div className="lg:col-span-5 w-full">{children}</div>
            )}
          </div>
        </div>
      </section>

      {/* Stats bar — separate background */}
      <section className="bg-navy-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="px-2 lg:px-6 text-center lg:text-left">
                <p className="font-display font-bold text-3xl lg:text-4xl text-white">
                  {stat.type === "static" ? (
                    stat.value
                  ) : (
                    <CountUp
                      end={stat.end}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      locale={stat.locale}
                      decimals={stat.decimals}
                    />
                  )}
                </p>
                <p className="mt-1 text-xs font-sans text-white/50">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
