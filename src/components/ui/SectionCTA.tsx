"use client";

import { WHATSAPP_URL } from "@/lib/constants";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";
import type { ReactNode } from "react";

interface CTAButton {
  label: string;
  href?: string;
  external?: boolean;
  variant?: "primary" | "whatsapp" | "outline";
  icon?: ReactNode;
}

interface SectionCTAProps {
  tag?: string;
  title: string;
  subtitle?: string;
  buttons: CTAButton[];
}

const variantStyles = {
  primary:
    "bg-blue text-white hover:bg-blue-hover",
  whatsapp:
    "bg-whatsapp text-white hover:bg-whatsapp-hover",
  outline:
    "border border-white/20 text-white hover:bg-white/10",
};

export function SectionCTA({
  tag,
  title,
  subtitle,
  buttons,
}: SectionCTAProps) {
  return (
    <section className="bg-navy py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up" delay={0}>
          <div className="rounded-2xl bg-[#0a1a3a]/60 backdrop-blur-sm p-8 lg:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="min-w-0">
              {tag && (
                <p className="text-gold text-xs font-sans font-semibold uppercase tracking-widest mb-2">
                  {tag}
                </p>
              )}
              <h2 className="font-display font-bold text-2xl lg:text-3xl text-white mb-2">
                {title}
              </h2>
              {subtitle && (
                <p className="text-white/60 font-sans text-sm">
                  {subtitle}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {buttons.map((btn) => {
                const styles = variantStyles[btn.variant ?? "primary"];
                const icon = btn.icon ?? (btn.variant === "whatsapp" ? <FaWhatsapp className="h-4 w-4" /> : null);

                if (btn.external) {
                  return (
                    <a
                      key={btn.label}
                      href={btn.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 h-11 px-6 rounded-xl font-sans font-semibold text-sm transition-colors ${styles}`}
                    >
                      {icon}
                      {btn.label}
                    </a>
                  );
                }

                return (
                  <Link
                    key={btn.label}
                    href={btn.href ?? "#"}
                    className={`inline-flex items-center gap-2 h-11 px-6 rounded-xl font-sans font-semibold text-sm transition-colors ${styles}`}
                  >
                    {icon}
                    {btn.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
