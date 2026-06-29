"use client";

import { cn, formatAed, EXPRESS_SURCHARGE_AED } from "@/lib/utils";
import type { VisaType } from "@/types/db";
import Link from "next/link";
import { Button } from "./Button";
import { Chip } from "./StatusBadge";

interface VisaCardProps {
  visa: VisaType;
  selected?: boolean;
  onSelect?: (id: number) => void;
  showApplyLink?: boolean;
  compact?: boolean;
  className?: string;
}

function formatDuration(days: number): string {
  if (days >= 1825) return "5 Years";
  if (days >= 365) return `${Math.round(days / 365)} Year${days >= 730 ? "s" : ""}`;
  if (days >= 4) return `${days} Days`;
  return `${days} Days`;
}

export function VisaCard({
  visa,
  selected,
  onSelect,
  showApplyLink = true,
  compact = false,
  className,
}: VisaCardProps) {
  const isPopular = visa.slug === "30d-single";

  return (
    <div
      className={cn(
        "relative rounded-xl border bg-white transition-all duration-150",
        "hover:shadow-md hover:border-blue/40",
        selected && "border-blue ring-2 ring-blue/20 shadow-md",
        !selected && "border-line",
        onSelect && "cursor-pointer",
        compact ? "p-4" : "p-6",
        className
      )}
      onClick={() => onSelect?.(visa.id)}
    >
      {isPopular && (
        <div className="absolute -top-3 left-4">
          <Chip label="Most Popular" variant="popular" />
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div>
          <h3
            className={cn(
              "font-display font-semibold text-ink leading-tight",
              compact ? "text-base" : "text-lg"
            )}
          >
            {visa.name}
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          <Chip
            label={formatDuration(visa.duration_days)}
            variant="duration"
          />
          <Chip
            label={visa.entry_type === "single" ? "Single Entry" : "Multiple Entry"}
            variant="entry"
          />
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs text-muted font-sans uppercase tracking-wider">
              Starting from
            </p>
            <p
              className={cn(
                "font-display font-bold text-navy",
                compact ? "text-xl" : "text-2xl"
              )}
            >
              {formatAed(visa.standard_price_aed)}
            </p>
            {visa.has_express && (
              <p className="text-xs text-muted font-sans mt-0.5">
                Express: {formatAed(visa.standard_price_aed + EXPRESS_SURCHARGE_AED)}
              </p>
            )}
          </div>

          {showApplyLink && !onSelect && (
            <Link href={`/apply?visa=${visa.slug}`}>
              <Button size="sm" variant="gold">
                Apply Now
              </Button>
            </Link>
          )}

          {onSelect && (
            <Button
              size="sm"
              variant={selected ? "dark" : "secondary"}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(visa.id);
              }}
            >
              {selected ? "Selected" : "Select"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
