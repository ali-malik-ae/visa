"use client";

import { AE, AU, CA, CN, EU, GB, IN, JP, KR, SA, SG, US } from "country-flag-icons/react/3x2";
import { FadeIn } from "@/components/ui/FadeIn";

const COUNTRIES = [
  { Flag: AE, name: "UAE" },
  { Flag: GB, name: "United Kingdom" },
  { Flag: US, name: "United States" },
  { Flag: EU, name: "Schengen Area" },
  { Flag: IN, name: "India" },
  { Flag: CA, name: "Canada" },
  { Flag: AU, name: "Australia" },
  { Flag: CN, name: "China" },
  { Flag: SG, name: "Singapore" },
  { Flag: JP, name: "Japan" },
  { Flag: KR, name: "South Korea" },
  { Flag: SA, name: "Saudi Arabia" },
];

export function CountriesServed() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-10">
          <div className="min-w-0">
            <FadeIn direction="up" delay={0}>
              <p className="text-xs font-semibold uppercase tracking-widest text-gold font-sans mb-3">
                Countries
              </p>
            </FadeIn>
            <FadeIn direction="up" delay={100}>
              <h2 className="font-display font-bold text-3xl lg:text-5xl text-navy">
                184 nationalities served.
              </h2>
            </FadeIn>
          </div>
          <FadeIn direction="up" delay={200}>
            <p className="text-sm text-muted font-sans max-w-sm lg:text-right">
              We process UAE visas for nearly every passport on earth, from
              Mumbai to Manchester and beyond.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {COUNTRIES.map(({ Flag, name }, i) => (
            <FadeIn key={name} direction="up" delay={100 + i * 50}>
              <div
                className="flex items-center gap-3 rounded-lg border border-line bg-white px-4 py-3 hover:border-gold/30 transition-colors"
              >
                <Flag
                  className="h-4 w-6 rounded-[2px] flex-shrink-0 ring-1 ring-line"
                  title={name}
                />
                <span className="text-sm font-sans font-medium text-ink truncate">
                  {name}
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
