"use client";

import { useState, useMemo } from "react";
import { ArrowRight, Check, Minus } from "lucide-react";
import Link from "next/link";
import { cn, formatAed } from "@/lib/utils";
import { FadeIn } from "@/components/ui/FadeIn";
import { DropdownCompact } from "@/components/ui/Dropdown";
import { SAMPLE_VISA_TYPES, VISA_DETAILS, COMPARE_SLUGS, COMPARE_ROWS } from "@/lib/sample-visas";
import type { VisaType } from "@/types/db";

const DURATION_FILTERS = ["All", "30-day", "60-day", "90-day", "2-year"] as const;
const ENTRY_FILTERS = ["All", "Single", "Multiple"] as const;
const SORT_OPTIONS = ["Popular", "Price: Low", "Price: High", "Duration"] as const;

function durationBadge(days: number): string {
  if (days >= 1825) return "2 YEAR";
  if (days >= 365) return `${Math.round(days / 365)} YEAR`;
  if (days < 1) return `${days}`;
  if (days <= 4) return `${days * 24} HR`;
  return `${days} DAY`;
}

function matchesDuration(visa: VisaType, filter: string): boolean {
  if (filter === "All") return true;
  if (filter === "30-day") return visa.duration_days >= 28 && visa.duration_days <= 32;
  if (filter === "60-day") return visa.duration_days >= 58 && visa.duration_days <= 62;
  if (filter === "90-day") return visa.duration_days >= 88 && visa.duration_days <= 92;
  if (filter === "2-year") return visa.duration_days >= 700;
  return true;
}

function VisaCard({ visa }: { visa: VisaType }) {
  const details = VISA_DETAILS[visa.slug];
  const isPopular = visa.slug === "30d-single";

  return (
    <div
      className={cn(
        "relative rounded-2xl bg-white p-6 flex flex-col transition-all",
        isPopular
          ? "border-2 border-blue shadow-md"
          : "border border-line hover:border-blue/40 hover:shadow-sm"
      )}
    >
      {isPopular && (
        <span className="absolute top-4 right-4 inline-flex items-center rounded-full bg-blue px-3 py-1 text-[11px] font-semibold text-white font-sans">
          Most Popular
        </span>
      )}

      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center rounded-md border border-line px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted font-sans">
          {durationBadge(visa.duration_days)}
        </span>
        <span className="inline-flex items-center rounded-md bg-mist-2 px-2.5 py-1 text-[11px] font-medium text-ink font-sans">
          {visa.entry_type === "single" ? "Single Entry" : "Multiple Entry"}
        </span>
      </div>

      <h3 className="font-display font-bold text-xl text-ink mb-1 leading-snug">
        {visa.name}
      </h3>
      <p className="text-xs text-muted font-sans mb-1">
        Processing: {details?.processing ?? "24–72h"}
      </p>

      <ul className="mt-4 space-y-2 mb-6 flex-1">
        {details?.features.map((feat) => (
          <li key={feat} className="flex items-start gap-2 text-sm text-ink font-sans">
            <Check className="h-4 w-4 text-blue flex-shrink-0 mt-0.5" />
            {feat}
          </li>
        ))}
      </ul>

      <div className="pt-4 border-t border-line flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] text-muted font-sans uppercase tracking-widest">
            From
          </p>
          <p className="font-display font-bold text-2xl text-navy whitespace-nowrap">
            {formatAed(visa.standard_price_aed)}
          </p>
        </div>
        <Link
          href={`/apply?visa=${visa.slug}`}
          className="inline-flex items-center gap-1.5 h-10 px-5 rounded-lg bg-blue text-white text-sm font-semibold font-sans hover:bg-blue-hover transition-colors whitespace-nowrap"
        >
          Apply Now <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function ComparisonTable() {
  return (
    <section className="py-16 px-4 bg-mist">
      <div className="mx-auto max-w-5xl">
        <p className="text-blue text-xs font-sans font-semibold uppercase tracking-widest mb-2">
          Compare
        </p>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
          <h2 className="font-display font-bold text-3xl text-ink">
            Side-By-Side.
          </h2>
          <p className="text-muted font-sans text-sm max-w-xs">
            Comparing the three most-applied-for visas. Need help deciding? Talk to a consultant.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-line overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sans">
              <thead>
                <tr className="border-b border-line">
                  <th className="text-left py-4 px-6 font-semibold text-ink">Features</th>
                  {COMPARE_SLUGS.map((slug) => {
                    const visa = SAMPLE_VISA_TYPES.find((v) => v.slug === slug);
                    const isPopular = slug === "30d-single";
                    return (
                      <th key={slug} className="text-center py-4 px-6">
                        <span className={cn("font-semibold", isPopular ? "text-blue" : "text-ink")}>
                          {visa?.name.split("·")[0]?.trim() ?? slug}
                        </span>
                        <span className="text-ink font-semibold">
                          {" "}{visa?.name.split("·")[1]?.trim() ?? ""}
                        </span>
                        {isPopular && (
                          <span className="ml-2 inline-flex items-center rounded-full bg-blue/10 px-2 py-0.5 text-[10px] font-semibold text-blue">
                            Most Popular
                          </span>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, i) => (
                  <tr
                    key={row.label}
                    className={cn(
                      "border-b border-line last:border-0",
                      i % 2 === 0 ? "bg-white" : "bg-mist/50"
                    )}
                  >
                    <td className="py-4 px-6 font-medium text-ink">{row.label}</td>
                    {row.values.map((val, j) => (
                      <td key={j} className="py-4 px-6 text-center text-muted">
                        {typeof val === "boolean" ? (
                          val ? (
                            <Check className="h-5 w-5 text-blue mx-auto" />
                          ) : (
                            <Minus className="h-5 w-4 text-muted/40 mx-auto" />
                          )
                        ) : (
                          val
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export function VisaTypesClient() {
  const [duration, setDuration] = useState<string>("All");
  const [entryType, setEntryType] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("Popular");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000]);

  const allPrices = SAMPLE_VISA_TYPES.map((v) => v.standard_price_aed);
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);

  const filtered = useMemo(() => {
    let result = SAMPLE_VISA_TYPES.filter((visa) => {
      if (!matchesDuration(visa, duration)) return false;
      if (entryType === "Single" && visa.entry_type !== "single") return false;
      if (entryType === "Multiple" && visa.entry_type !== "multiple") return false;
      if (visa.standard_price_aed < priceRange[0] || visa.standard_price_aed > priceRange[1])
        return false;
      return true;
    });

    switch (sortBy) {
      case "Price: Low":
        result = [...result].sort((a, b) => a.standard_price_aed - b.standard_price_aed);
        break;
      case "Price: High":
        result = [...result].sort((a, b) => b.standard_price_aed - a.standard_price_aed);
        break;
      case "Duration":
        result = [...result].sort((a, b) => a.duration_days - b.duration_days);
        break;
      default:
        result = [...result].sort((a, b) => a.sort_order - b.sort_order);
    }

    return result;
  }, [duration, entryType, sortBy, priceRange]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-navy relative overflow-hidden pt-28 pb-14 px-4">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full border border-white/10" />
          <div className="absolute top-8 -right-16 w-72 h-72 rounded-full border border-white/10" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full border border-white/10" />
        </div>
        <div className="relative mx-auto max-w-5xl text-center">
          <FadeIn direction="up" delay={0}>
            <p className="text-blue text-xs font-sans font-semibold uppercase tracking-widest mb-2">
              Visa Catalogue
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={100}>
            <h1 className="font-display font-bold text-4xl lg:text-5xl text-white mb-3 leading-tight">
              Explore UAE visa options.
            </h1>
          </FadeIn>
          <FadeIn direction="up" delay={200}>
            <p className="text-white/60 font-sans text-sm max-w-md mx-auto">
              From a 14-day tourist visa to a 60-day multi-entry. Filter, compare, apply — all in one place.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 flex flex-wrap items-center gap-6">
          {/* Duration */}
          <div>
            <p className="text-[11px] font-sans font-semibold uppercase tracking-widest text-muted mb-2">
              Duration
            </p>
            <div className="flex gap-1">
              {DURATION_FILTERS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={cn(
                    "h-8 px-3 rounded-full text-xs font-sans font-medium transition-colors",
                    duration === d
                      ? "bg-blue text-white"
                      : "bg-mist text-ink hover:bg-mist-2"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Entry Type */}
          <div>
            <p className="text-[11px] font-sans font-semibold uppercase tracking-widest text-muted mb-2">
              Entry Type
            </p>
            <div className="flex gap-1">
              {ENTRY_FILTERS.map((e) => (
                <button
                  key={e}
                  onClick={() => setEntryType(e)}
                  className={cn(
                    "h-8 px-3 rounded-full text-xs font-sans font-medium transition-colors",
                    entryType === e
                      ? "bg-blue text-white"
                      : "bg-mist text-ink hover:bg-mist-2"
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="flex-1 min-w-[200px]">
            <p className="text-[11px] font-sans font-semibold uppercase tracking-widest text-muted mb-2">
              Price Range
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs font-sans text-ink whitespace-nowrap">{formatAed(priceRange[0])}</span>
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="flex-1 h-1.5 bg-line rounded-full appearance-none cursor-pointer accent-blue"
              />
              <span className="text-xs font-sans text-ink whitespace-nowrap">{formatAed(priceRange[1])}</span>
            </div>
          </div>

          {/* Count + Sort */}
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-xs font-sans text-muted whitespace-nowrap">
              {filtered.length} visa{filtered.length !== 1 ? "s" : ""} matching
            </span>
            <DropdownCompact
              options={SORT_OPTIONS.map((s) => ({ value: s, label: `Sort: ${s}` }))}
              value={sortBy}
              onChange={setSortBy}
            />
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="py-12 px-4">
        <div className="mx-auto max-w-6xl">
          {filtered.length === 0 ? (
            <p className="text-center text-muted py-20 font-sans text-sm">
              No visa types match your filters. Try adjusting your criteria.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((visa) => (
                <VisaCard key={visa.id} visa={visa} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Comparison Table */}
      <ComparisonTable />
    </div>
  );
}
