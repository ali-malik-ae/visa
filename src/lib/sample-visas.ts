import type { VisaType } from "@/types/db";

/**
 * Fallback visa catalogue used when the database is unreachable or empty
 * (e.g. local preview without DATABASE_URL). Mirrors src/lib/db/seed.ts so the
 * public site always has visa cards to render. Real pricing comes from Neon.
 */
const now = new Date().toISOString();

function make(
  id: number,
  slug: string,
  name: string,
  entry_type: VisaType["entry_type"],
  duration_days: number,
  standard_price_aed: number,
  has_express: boolean,
  sort_order: number,
  extra?: Partial<VisaType>
): VisaType {
  return {
    id,
    slug,
    name,
    entry_type,
    duration_days,
    standard_price_aed,
    has_express,
    is_active: true,
    sort_order,
    created_at: now,
    updated_at: now,
    ...extra,
  };
}

export const SAMPLE_VISA_TYPES: VisaType[] = [
  make(1, "14d-single", "14 Days – Single Entry", "single", 14, 459, true, 1),
  make(2, "30d-single", "30 Days – Single Entry", "single", 30, 549, true, 2),
  make(3, "60d-single", "60 Days – Single Entry", "single", 60, 918, true, 3),
  make(4, "30d-multi", "30 Days – Multi Entry", "multiple", 30, 918, true, 4),
  make(5, "60d-multi", "60 Days – Multi Entry", "multiple", 60, 1285, true, 5),
  make(6, "visa-extension", "Visa Extension – Inside UAE", "single", 30, 1285, false, 6),
];

/** Marketing blurbs and feature lists keyed by visa slug. */
export const VISA_DETAILS: Record<
  string,
  { tagline: string; processing: string; features: string[] }
> = {
  "14d-single": {
    tagline: "Quick visit visa for short trips, stopovers, or brief business travel.",
    processing: "24–72h",
    features: ["Single entry", "60-day entry validity", "Photo & passport scan only"],
  },
  "30d-single": {
    tagline: "Single entry, perfect for short visits, leisure and family stays.",
    processing: "24–72h",
    features: ["Single entry", "60-day entry validity", "Free re-submission if rejected"],
  },
  "60d-single": {
    tagline: "Extended stay for longer holidays, family visits, or medical travel.",
    processing: "24–72h",
    features: ["Single entry", "60-day entry validity", "Express upgrade available"],
  },
  "30d-multi": {
    tagline: "Multiple entries within 60 days. Ideal for business travellers.",
    processing: "48–72h",
    features: ["Multiple entries", "60-day entry validity", "Frequent travel friendly"],
  },
  "60d-multi": {
    tagline: "Extended multiple entry for complex itineraries across the region.",
    processing: "48–72h",
    features: ["Multiple entries", "60-day entry validity", "Family bundle discount"],
  },
  "visa-extension": {
    tagline: "Extend your current UAE visa without leaving the country.",
    processing: "3–5 days",
    features: ["Inside UAE", "30-day extension", "No exit required"],
  },
};

/** Comparison table data for the three most popular visas. */
export const COMPARE_SLUGS = ["14d-single", "30d-single", "60d-single"] as const;

export interface CompareRow {
  label: string;
  values: [string | boolean, string | boolean, string | boolean];
}

export const COMPARE_ROWS: CompareRow[] = [
  { label: "Price", values: ["AED 459", "AED 549", "AED 918"] },
  { label: "Duration", values: ["14 days", "30 days", "60 days"] },
  { label: "Entry", values: ["Single", "Single", "Single"] },
  { label: "Entry Validity", values: ["60 days", "60 days", "60 days"] },
  { label: "Processing", values: ["24–72h", "24–72h", "24–72h"] },
  { label: "Express Available", values: [true, true, true] },
  { label: "Refund Guarantee", values: [true, true, true] },
];
