import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { db } from "./index";
import { visaTypes } from "./schema";
import { sql } from "drizzle-orm";

/**
 * Source of truth: visati.ae live pricing (USD, converted at the 3.67 AED peg),
 * confirmed against /dubai-visa via the WP REST API on 2026-07-10.
 * Slugs match the Sanity `visaTypeContent` catalog exactly — join key across stores.
 */
const VISA_SEED = [
  {
    slug: "14d-single",
    name: "14-Day Single Entry",
    entry_type: "single" as const,
    duration_days: 14,
    standard_price_aed: 459,
    standard_price_usd: 125,
    has_express: true,
    is_active: true,
    sort_order: 1,
  },
  {
    slug: "30d-single",
    name: "30-Day Single Entry",
    entry_type: "single" as const,
    duration_days: 30,
    standard_price_aed: 549,
    standard_price_usd: 150,
    has_express: true,
    is_active: true,
    sort_order: 2,
  },
  {
    slug: "60d-single",
    name: "60-Day Single Entry",
    entry_type: "single" as const,
    duration_days: 60,
    standard_price_aed: 918,
    standard_price_usd: 250,
    has_express: true,
    is_active: true,
    sort_order: 3,
  },
  {
    slug: "30d-multi",
    name: "30-Day Multiple Entry",
    entry_type: "multiple" as const,
    duration_days: 30,
    standard_price_aed: 918,
    standard_price_usd: 250,
    has_express: true,
    is_active: true,
    sort_order: 4,
  },
  {
    slug: "60d-multi",
    name: "60-Day Multiple Entry",
    entry_type: "multiple" as const,
    duration_days: 60,
    standard_price_aed: 1285,
    standard_price_usd: 350,
    has_express: true,
    is_active: true,
    sort_order: 5,
  },
  {
    slug: "visa-extension",
    name: "Visa Extension",
    entry_type: "single" as const,
    duration_days: 30,
    standard_price_aed: 1285,
    standard_price_usd: 350,
    has_express: false,
    is_active: true,
    sort_order: 6,
  },
];

/** Not offered on visati.ae — deactivated rather than deleted (may hold FK history). */
const DEACTIVATE_SLUGS = ["96h-transit", "30d-gcc", "5y-multi"];

async function seed() {
  console.log("Seeding visa types…");
  for (const visa of VISA_SEED) {
    await db
      .insert(visaTypes)
      .values(visa)
      .onConflictDoUpdate({
        target: visaTypes.slug,
        set: {
          name: sql`excluded.name`,
          standard_price_aed: sql`excluded.standard_price_aed`,
          standard_price_usd: sql`excluded.standard_price_usd`,
          has_express: sql`excluded.has_express`,
          is_active: sql`excluded.is_active`,
          sort_order: sql`excluded.sort_order`,
          updated_at: sql`now()`,
        },
      });
    console.log(`  ✓ ${visa.slug}`);
  }

  for (const slug of DEACTIVATE_SLUGS) {
    await db
      .update(visaTypes)
      .set({ is_active: false, updated_at: sql`now()` })
      .where(sql`slug = ${slug}`);
    console.log(`  ✗ deactivated ${slug} (not on visati.ae)`);
  }

  console.log("Done.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
