import { db } from "@/lib/db";
import { visaTypes } from "@/lib/db/schema";
import { getVisaTypes, type SanityVisaType } from "@/lib/sanity/client";
import { sanityToVisaType, type VisaTypeData } from "@/types/visa";

/**
 * Returns visa types for public display: content from Sanity, price from
 * Postgres (the source of truth — see types/visa.ts). Falls back to an
 * empty array on error.
 */
export async function getDisplayVisaTypes(): Promise<VisaTypeData[]> {
  try {
    const [sanityVisas, dbRows] = await Promise.all([
      getVisaTypes(),
      db
        .select({
          slug: visaTypes.slug,
          standard_price_aed: visaTypes.standard_price_aed,
          standard_price_usd: visaTypes.standard_price_usd,
        })
        .from(visaTypes),
    ]);

    const priceBySlug = new Map(dbRows.map((r) => [r.slug, r]));

    return sanityVisas.map((v: SanityVisaType, i: number) => {
      const price = priceBySlug.get(v.slug);
      if (!price) {
        console.error(`[visa-data] No Postgres pricing row for Sanity visa type slug "${v.slug}"`);
      }
      return sanityToVisaType(v, i, price ?? { standard_price_aed: 0, standard_price_usd: 0 });
    });
  } catch {
    return [];
  }
}
