"use client";

import { CountUp } from "@/components/ui/CountUp";
import { Globe, Users, CheckCircle, Star } from "lucide-react";
import Link from "next/link";

const STATS = [
  { icon: Globe, end: 42, suffix: "+", label: "Countries Served" },
  { icon: Users, end: 120000, suffix: "+", locale: "en-IN", label: "Visas Processed" },
  { icon: CheckCircle, end: 98, suffix: "%", label: "Approval Rate" },
  { icon: Star, end: 4.9, decimals: 1, suffix: "/5", label: "Customer Rating" },
];

const PINS = [
  { id: "uae", cx: 62, cy: 23, label: "Dubai, UAE" },
  { id: "uk", cx: 53, cy: 14, label: "United Kingdom" },
  { id: "us", cx: 25, cy: 15, label: "United States" },
  { id: "ca", cx: 18, cy: 9, label: "Canada" },
  { id: "eu", cx: 53, cy: 20, label: "Germany" },
  { id: "in", cx: 72, cy: 24, label: "India" },
  { id: "jp", cx: 92, cy: 16, label: "Japan" },
  { id: "sg", cx: 87, cy: 32, label: "Singapore" },
  { id: "au", cx: 95, cy: 42, label: "Australia" },
  { id: "za", cx: 60, cy: 44, label: "South Africa" },
  { id: "br", cx: 36, cy: 40, label: "Brazil" },
];

const ARC_CURVES: Record<string, number> = {
  "uae-uk": -14,
  "uae-us": 22,
  "uae-ca": -26,
  "uae-eu": 20,
  "uae-in": 6,
  "uae-jp": -10,
  "uae-sg": -24,
  "uae-au": 16,
  "uae-za": 12,
  "uae-br": 28,
};

const ARCS = [
  { from: "uae", to: "uk" },
  { from: "uae", to: "us" },
  { from: "uae", to: "ca" },
  { from: "uae", to: "eu" },
  { from: "uae", to: "in" },
  { from: "uae", to: "jp" },
  { from: "uae", to: "sg" },
  { from: "uae", to: "au" },
  { from: "uae", to: "za" },
  { from: "uae", to: "br" },
];

function getArcPath(fromId: string, toId: string) {
  const from = PINS.find((p) => p.id === fromId)!;
  const to = PINS.find((p) => p.id === toId)!;
  const mx = (from.cx + to.cx) / 2;
  const my = (from.cy + to.cy) / 2;
  const curve = ARC_CURVES[`${fromId}-${toId}`] ?? -8;
  return `M ${from.cx} ${from.cy} Q ${mx} ${my + curve} ${to.cx} ${to.cy}`;
}

export function GlobalReach() {
  return (
    <section className="bg-navy overflow-hidden">
      <div className="max-w-[1400px] mx-auto py-12 lg:py-16 px-4 sm:px-6 lg:px-10">
        <div className="rounded-3xl bg-[#0a1a3a]/60 backdrop-blur-sm p-8 lg:p-12 relative overflow-hidden min-h-[300px] lg:min-h-[380px]">

          {/* --- Map + Pins overlay (full width behind text) --- */}
          <div className="absolute inset-0 hidden sm:block py-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/world-map.svg"
              alt="World map"
              className="absolute inset-0 w-full h-full opacity-40 pointer-events-none select-none"
              aria-hidden="true"
            />

            {/* Animated arcs + pulsing pins */}
            <svg
              viewBox="0 0 107 54"
              className="absolute inset-0 w-full h-full"
              aria-hidden="true"
            >
              {ARCS.map(({ from, to }) => {
                const path = getArcPath(from, to);
                return (
                  <g key={`${from}-${to}`}>
                    <path
                      d={path}
                      fill="none"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="0.25"
                      strokeLinecap="round"
                    />
                    <path
                      d={path}
                      fill="none"
                      stroke="rgba(96,165,250,0.5)"
                      strokeWidth="0.25"
                      strokeLinecap="round"
                      strokeDasharray="3 7"
                      className="arc-dash"
                    />
                  </g>
                );
              })}

              <defs>
                <radialGradient id="pinGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
                </radialGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {PINS.map((pin) => (
                <g key={pin.id} filter="url(#glow)">
                  <circle
                    cx={pin.cx}
                    cy={pin.cy}
                    r="2"
                    fill="url(#pinGlow)"
                    className="pin-pulse"
                  />
                  <circle
                    cx={pin.cx}
                    cy={pin.cy}
                    r="0.8"
                    fill="#60a5fa"
                    stroke="#93c5fd"
                    strokeWidth="0.3"
                  />
                </g>
              ))}
            </svg>
          </div>

          {/* --- Content on top of map --- */}
          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

            {/* Left copy */}
            <div className="max-w-md">
              <h2 className="font-display font-bold text-[28px] lg:text-[34px] leading-tight text-white tracking-tight">
                Trusted by Applicants Across the Globe
              </h2>
              <p className="mt-4 text-[13px] lg:text-sm leading-relaxed text-white/60 font-sans max-w-sm">
                We are a Dubai based visa agency serving residents of all
                nationalities across USA, UK, Canada, Australia and Europe.
              </p>
              <Link
                href="/about"
                className="mt-6 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/[0.04] px-5 py-2.5 text-xs font-semibold text-white font-sans hover:bg-white/[0.08] transition-colors"
              >
                More About Us
              </Link>
            </div>

            {/* Stats right */}
            <div className="xl:w-[200px] flex-shrink-0">
              <div className="grid grid-cols-2 gap-4 xl:grid-cols-1 xl:gap-5">
                {STATS.map((s) => (
                  <div key={s.label} className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-white/[0.06] grid place-items-center flex-shrink-0">
                      <s.icon className="h-[18px] w-[18px] text-blue-400" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-xl font-display font-bold text-white leading-none">
                        <CountUp
                          end={s.end}
                          suffix={s.suffix}
                          decimals={s.decimals}
                          locale={s.locale}
                        />
                      </p>
                      <p className="text-[11px] font-sans text-white/50 mt-1 leading-none">
                        {s.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
