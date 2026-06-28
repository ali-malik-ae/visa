import type { SanityVisaType } from "@/lib/sanity/client";

/**
 * Unified visa type used by frontend components.
 * Maps from Sanity's VisaTypeContent to a format the UI expects.
 */
export interface VisaTypeData {
  id: number;
  slug: string;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  features: string[];
  badge_text: string | null;
  entry_type: "single" | "multiple";
  duration_days: number;
  standard_price_aed: number;
  processing_time: string;
  has_express: boolean;
  sort_order: number;
}

export function sanityToVisaType(v: SanityVisaType, index: number): VisaTypeData {
  return {
    id: index + 1,
    slug: v.slug,
    name: v.name,
    icon: v.icon,
    tagline: v.tagline,
    description: v.description,
    features: v.features,
    badge_text: v.badge_text,
    entry_type: v.entry_type,
    duration_days: v.duration_days,
    standard_price_aed: v.price_aed,
    processing_time: v.processing_time,
    has_express: v.has_express,
    sort_order: v.sort_order,
  };
}

export interface CompareRow {
  label: string;
  values: [string | boolean, string | boolean, string | boolean];
}

export const COMPARE_SLUGS = ["14d-single", "30d-single", "60d-single"] as const;
