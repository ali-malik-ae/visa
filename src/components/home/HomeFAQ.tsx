"use client";

import { cn } from "@/lib/utils";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const FAQS = [
  {
    q: "How long does the visa process take?",
    a: "Most UAE visas are processed in 24–72 hours. Express same-day options are available for urgent travel. We give you a guaranteed turnaround time before you pay.",
  },
  {
    q: "What documents do I need?",
    a: "A clear passport bio-data scan (valid 6+ months), a recent passport photo, and a supporting document such as a hotel booking depending on visa type.",
  },
  {
    q: "Can I track my application in real-time?",
    a: "Yes. Every application gets a unique ID you can enter on our Track page to see live status updates from submission to approval.",
  },
  {
    q: "What happens if my visa is rejected?",
    a: "Where our approval guarantee applies, service fees are refunded for rejections within our control. Government fees are non-refundable.",
  },
  {
    q: "Do you handle visa extensions and renewals?",
    a: "Yes — we assist with renewals and extensions. Message us on WhatsApp before your current visa expires and we'll handle it end to end.",
  },
];

export function HomeFAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="py-16 lg:py-24 bg-mist-2/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left — heading */}
          <div className="lg:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold font-sans mb-4">
              FAQ
            </p>
            <h2 className="font-display font-bold text-3xl lg:text-5xl text-navy leading-tight">
              Questions,
              <br /> answered.
            </h2>
            <p className="mt-5 text-muted font-sans leading-relaxed">
              Can&apos;t find what you&apos;re looking for? Our team is on
              WhatsApp, 24/7.
            </p>
            <Link
              href="/faq"
              className="mt-6 inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-navy text-white text-sm font-semibold font-sans hover:bg-navy-2 transition-colors"
            >
              All FAQs
              <ArrowRight className="h-4 w-4 flex-shrink-0" />
            </Link>
          </div>

          {/* Right — accordion */}
          <div className="lg:col-span-8 space-y-3">
            {FAQS.map((item, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={item.q}
                  className={cn(
                    "rounded-xl border bg-white overflow-hidden transition-colors",
                    isOpen ? "border-gold/50" : "border-line"
                  )}
                >
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-sans font-semibold text-ink text-sm sm:text-base">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-muted flex-shrink-0 transition-transform",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 -mt-1">
                      <p className="text-sm text-muted font-sans leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
