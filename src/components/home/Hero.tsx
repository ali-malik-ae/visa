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

/* Hallmark · component: hero-entrance · genre: modern-minimal · theme: existing-navy
 * states: load (staggered CSS @keyframes, no JS required)
 * contrast: pass · prefers-reduced-motion: collapse to 0.2s opacity
 */

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
      <section className="relative overflow-x-clip bg-navy">
        {/* Background — slow zoom-in */}
        <div
          className="absolute inset-0 hero-bg"
          style={{ animationDelay: "0ms" }}
          aria-hidden="true"
        >
          {/* Base radial gradient */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse at 70% 30%, #0057FF22 0%, transparent 70%)",
            }}
          />
          {/* Blurred glow orbs — kept below the top edge */}
          <div
            className="absolute top-24 -right-24 w-[580px] h-[580px] rounded-full bg-blue opacity-[0.18]"
            style={{ filter: "blur(130px)" }}
          />
          <div
            className="absolute top-1/4 left-[60%] w-[300px] h-[300px] rounded-full bg-gold opacity-[0.06]"
            style={{ filter: "blur(100px)" }}
          />
          <div
            className="absolute -bottom-24 -left-24 w-[440px] h-[440px] rounded-full bg-blue opacity-[0.09]"
            style={{ filter: "blur(110px)" }}
          />
          <div
            className="absolute top-1/3 left-1/4 w-[320px] h-[200px] rounded-full bg-white opacity-[0.04]"
            style={{ filter: "blur(90px)" }}
          />
          {/* Top-edge mask — fades to solid navy so header and hero blend seamlessly */}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-navy via-navy/80 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 lg:pt-32 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left column */}
            <div className="lg:col-span-7">
              {/* Eyebrow badges */}
              <div
                className="flex items-center gap-2 mb-6 flex-wrap hero-enter"
                style={{ animationDelay: "0ms" }}
              >
                {TRUST_BADGES.map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-sans font-medium text-white/80"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    {label}
                  </span>
                ))}
              </div>

              {/* Headline — each line staggered */}
              <h1 className="font-display font-bold text-white leading-[0.95]">
                <span
                  className="block text-5xl sm:text-6xl lg:text-7xl hero-enter"
                  style={{ animationDelay: "80ms" }}
                >
                  Dubai Visa
                </span>
                <span
                  className="block text-5xl sm:text-6xl lg:text-7xl hero-enter"
                  style={{ animationDelay: "200ms" }}
                >
                  Made{" "}
                  <span className="bg-gradient-to-r from-gold to-[#F0C864] bg-clip-text text-transparent">
                    Simple
                  </span>
                  <span className="text-[#F0C864]">.</span>
                </span>
              </h1>

              {/* Subheading */}
              <p
                className="mt-6 text-lg text-white/70 font-sans max-w-lg leading-relaxed hero-enter"
                style={{ animationDelay: "340ms" }}
              >
                Visa processing for residents worldwide. Dubai based, trusted
                internationally.
              </p>

              {/* CTA buttons */}
              <div
                className="mt-8 flex items-center gap-3 flex-wrap hero-enter"
                style={{ animationDelay: "460ms" }}
              >
                <Link
                  href="/apply"
                  className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-gradient-to-r from-gold to-[#F0C864] text-navy text-sm font-semibold font-sans hover:opacity-90 transition-opacity whitespace-nowrap"
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
              <div
                className="mt-7 flex items-center gap-4 flex-wrap hero-appear"
                style={{ animationDelay: "580ms" }}
              >
                <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/google-logo.png"
                    alt="Google"
                    className="h-4 w-auto"
                  />
                  <span className="text-xs font-sans text-white/80 whitespace-nowrap">
                    <span className="font-semibold text-white">
                      {BRAND.rating}/5
                    </span>
                  </span>
                </div>
                <span className="text-sm font-sans text-white/60 whitespace-nowrap">
                  {BRAND.clientCount} clients served
                </span>
              </div>

              {/* Trust icons row — staggered per icon */}
              <div
                className="mt-8 flex items-center gap-x-6 gap-y-3 flex-wrap hero-appear"
                style={{ animationDelay: "680ms" }}
              >
                {TRUST_ICONS.map(({ icon: Icon, label }, i) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 text-xs font-sans text-white/80 whitespace-nowrap hero-appear"
                    style={{ animationDelay: `${680 + i * 60}ms` }}
                  >
                    <Icon className="h-4 w-4 text-white/60 flex-shrink-0" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right column — Quick Apply widget slides in from right */}
            {children && (
              <div
                className="lg:col-span-5 w-full hero-slide"
                style={{ animationDelay: "220ms" }}
              >
                {children}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-navy-2 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8">
            {HERO_STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="px-2 lg:px-6 text-center hero-appear"
                style={{ animationDelay: `${900 + i * 80}ms` }}
              >
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
