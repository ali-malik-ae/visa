import { formatAed } from "@/lib/utils";
import type { VisaType } from "@/types/db";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Short marketing blurbs keyed by visa slug (editorial, not operational data). */
const DESCRIPTIONS: Record<string, string> = {
  "14d-single": "Single entry, perfect for short visits, leisure and family stays.",
  "30d-single": "Single entry, perfect for short visits, leisure and family stays.",
  "30d-multi": "Frequent travellers. Multiple entries within validity period.",
  "60d-single": "Extended stay, single or multiple entry options available.",
  "60d-multi": "Frequent travellers. Multiple entries within validity period.",
  "96h-transit": "Quick stop-over visa for travellers connecting through UAE.",
  "30d-gcc": "For GCC residents. Fast-tracked documentation and approval.",
  "5y-multi": "Long-term multiple entry. End-to-end documentation support.",
};

function durationBadge(days: number): string {
  if (days >= 1825) return "5 YEARS";
  if (days >= 365) return `${Math.round(days / 365)} YEAR`;
  if (days < 1) return `${days}`;
  if (days <= 4) return `${days * 24} HR`;
  return `${days} DAYS`;
}

export function VisaTypeCard({ visa }: { visa: VisaType }) {
  const isPopular = visa.slug === "30d-single";

  return (
    <div
      className={
        "relative rounded-xl bg-white p-7 flex flex-col transition-all " +
        (isPopular
          ? "border-2 border-blue shadow-md"
          : "border border-line hover:border-gold/40 hover:shadow-sm")
      }
    >
      {isPopular && (
        <span className="absolute top-6 right-6 inline-flex items-center rounded-full bg-blue px-3 py-1 text-[11px] font-semibold text-white font-sans">
          Most Popular
        </span>
      )}

      {/* Badge row */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="inline-flex items-center rounded-md border border-line px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted font-sans">
          {durationBadge(visa.duration_days)}
        </span>
        <span className="inline-flex items-center rounded-md bg-mist-2 px-2.5 py-1 text-[11px] font-medium text-ink font-sans">
          {visa.entry_type === "single" ? "Single Entry" : "Multiple Entry"}
        </span>
      </div>

      <h3 className="font-display font-bold text-xl text-navy mb-2 leading-snug">
        {visa.name}
      </h3>
      <p className="text-sm text-muted font-sans leading-relaxed mb-7 min-h-[2.75rem]">
        {DESCRIPTIONS[visa.slug] ??
          "Reliable UAE visa processing with full document support."}
      </p>

      <div className="mt-auto pt-6 border-t border-line flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] text-muted font-sans uppercase tracking-widest">
            Starting at
          </p>
          <p className="font-display font-bold text-2xl text-navy whitespace-nowrap">
            {formatAed(visa.standard_price_aed)}
          </p>
        </div>
        <Link
          href={`/apply?visa=${visa.slug}`}
          className="inline-flex items-center gap-1.5 h-10 px-5 rounded-lg bg-gold text-navy text-sm font-semibold font-sans hover:bg-gold/90 transition-colors whitespace-nowrap flex-shrink-0"
        >
          Apply <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
