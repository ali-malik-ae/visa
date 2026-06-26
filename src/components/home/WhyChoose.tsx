import { ArrowRight, Clock, FileText, ShieldCheck } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";

const FEATURES = [
  {
    icon: ShieldCheck,
    iconClass: "text-indigo-600 bg-indigo-50",
    title: "100% Approval Guarantee",
    description:
      "100% refund guarantee if your visa is rejected for any reason within our control.",
  },
  {
    icon: Clock,
    iconClass: "text-blue bg-blue/10",
    title: "Fast Processing",
    description:
      "Most visas processed in 24–48 hours. Same-day express option available.",
  },
  {
    icon: FaWhatsapp,
    iconClass: "text-whatsapp bg-whatsapp/10",
    title: "Dedicated Support 24/7",
    description:
      "Our visa experts are on WhatsApp 24/7. Real people, instant replies.",
  },
  {
    icon: FileText,
    iconClass: "text-gold bg-gold/10",
    title: "Document Verification",
    description:
      "We pre-check every document. Catch issues before the embassy does.",
  },
];

export function WhyChoose() {
  return (
    <section className="py-16 lg:py-24 bg-mist-2/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left — heading */}
          <FadeIn direction="left">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-gold font-sans mb-4">
                Why Choose Visati
              </p>
              <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-navy leading-tight">
                The VISATI
                <br /> Difference.
              </h2>
              <p className="mt-5 text-muted font-sans leading-relaxed max-w-md">
                Visati handles every step, from documentation to embassy
                follow-ups, so you can focus on the trip instead of the
                paperwork.
              </p>
              <Link
                href="/contact"
                className="mt-7 inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-navy text-white text-sm font-semibold font-sans hover:bg-navy-2 transition-colors"
              >
                Read our story
                <ArrowRight className="h-4 w-4 flex-shrink-0" />
              </Link>
            </div>
          </FadeIn>

          {/* Right — 2x2 feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map(({ icon: Icon, iconClass, title, description }, i) => (
              <FadeIn key={title} delay={i * 100} direction="right">
                <div className="rounded-2xl border border-line bg-white p-6 hover:shadow-sm transition-shadow">
                  <div className={`h-10 w-10 rounded-lg grid place-items-center mb-4 ${iconClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display font-bold text-base text-navy mb-2 leading-snug">
                    {title}
                  </h3>
                  <p className="text-sm text-muted font-sans leading-relaxed">
                    {description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
