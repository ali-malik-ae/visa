import { db } from "@/lib/db";
import { visaTypes } from "@/lib/db/schema";
import { getVisaTypes } from "@/lib/sanity/client";
import { NextResponse } from "next/server";

export async function GET() {
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

    // Price is intentionally never sourced from Sanity — merged in here from
    // Postgres (the source of truth, same value that gets charged via
    // Stripe) so this never diverges from what's actually charged.
    const merged = sanityVisas.map((v) => {
      const price = priceBySlug.get(v.slug);
      return {
        ...v,
        price_aed: price?.standard_price_aed ?? 0,
        price_usd: price?.standard_price_usd ?? 0,
      };
    });

    return NextResponse.json({ visa_types: merged });
  } catch (err) {
    console.error("[GET /api/cms/visa-types]", err);
    return NextResponse.json(
      { error: "Failed to fetch visa types" },
      { status: 500 }
    );
  }
}
