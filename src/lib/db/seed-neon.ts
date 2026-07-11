/**
 * Seed Neon DB with sample data for dashboard demo.
 * All rows tagged with sample_id = "sample" for easy cleanup.
 *
 * Usage:  npx tsx src/lib/db/seed-neon.ts
 * Cleanup: npx tsx src/lib/db/seed-neon.ts --clean
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

const SAMPLE = "sample";

const visaTypesData = [
  { slug: "14d-single", name: "14-Day Single Entry", entry: "single", days: 14, price: 459, priceUsd: 125, sort: 1 },
  { slug: "30d-single", name: "30-Day Single Entry", entry: "single", days: 30, price: 549, priceUsd: 150, sort: 2 },
  { slug: "60d-single", name: "60-Day Single Entry", entry: "single", days: 60, price: 918, priceUsd: 250, sort: 3 },
  { slug: "30d-multi", name: "30-Day Multiple Entry", entry: "multiple", days: 30, price: 918, priceUsd: 250, sort: 4 },
  { slug: "60d-multi", name: "60-Day Multiple Entry", entry: "multiple", days: 60, price: 1285, priceUsd: 350, sort: 5 },
  { slug: "visa-extension", name: "Visa Extension", entry: "single", days: 30, price: 1285, priceUsd: 350, sort: 6 },
];

const applicationsData = [
  { id: "VST-SAMPLE-001", visa: 2, nat: "United Kingdom", given: "James", surname: "Whitfield", passport: "GB1234567", dob: "1990-05-15", exp: "2030-05-15", travel: "2026-07-15", email: "james@example.com", tier: "standard", status: "approved", amount: 549 },
  { id: "VST-SAMPLE-002", visa: 2, nat: "France", given: "Sophie", surname: "Laurent", passport: "FR7654321", dob: "1988-09-22", exp: "2029-09-22", travel: "2026-08-01", email: "sophie@example.com", tier: "express", status: "processing", amount: 549 },
  { id: "VST-SAMPLE-003", visa: 3, nat: "India", given: "Priya", surname: "Sharma", passport: "IN9876543", dob: "1995-02-10", exp: "2031-02-10", travel: "2026-07-20", email: "priya@example.com", tier: "standard", status: "reviewing", amount: 918 },
  { id: "VST-SAMPLE-004", visa: 1, nat: "Germany", given: "Hans", surname: "Mueller", passport: "DE4567890", dob: "1992-11-30", exp: "2028-11-30", travel: "2026-09-10", email: "hans@example.com", tier: "standard", status: "submitted", amount: 459 },
];

const statusHistoryData = [
  { app: "VST-SAMPLE-001", status: "submitted", note: "Application received" },
  { app: "VST-SAMPLE-001", status: "reviewing", note: "Documents verified" },
  { app: "VST-SAMPLE-001", status: "processing", note: "Submitted to GDRFA" },
  { app: "VST-SAMPLE-001", status: "approved", note: "Visa approved" },
  { app: "VST-SAMPLE-002", status: "submitted", note: "Application received" },
  { app: "VST-SAMPLE-002", status: "reviewing", note: "Documents verified" },
  { app: "VST-SAMPLE-002", status: "processing", note: "Submitted to GDRFA" },
  { app: "VST-SAMPLE-003", status: "submitted", note: "Application received" },
  { app: "VST-SAMPLE-003", status: "reviewing", note: "Documents under review" },
  { app: "VST-SAMPLE-004", status: "submitted", note: "Application received" },
];

const inquiriesData = [
  { name: "Ahmed Khan", email: "ahmed@example.com", phone: "+971501234567", subject: "Visa processing time", message: "How long does a 30-day tourist visa take? I'm travelling next month.", resolved: false },
  { name: "Lisa Chen", email: "lisa@example.com", phone: null, subject: "Document requirements", message: "Do I need to submit original passport or is a scan enough?", resolved: true },
];

async function seed() {
  console.log("Seeding Neon DB...\n");

  // Visa types
  for (const v of visaTypesData) {
    await sql`
      INSERT INTO visa_types (slug, name, entry_type, duration_days, standard_price_aed, standard_price_usd, sort_order, sample_id)
      VALUES (${v.slug}, ${v.name}, ${v.entry}, ${v.days}, ${v.price}, ${v.priceUsd}, ${v.sort}, ${SAMPLE})
      ON CONFLICT (slug) DO UPDATE SET
        name = ${v.name},
        entry_type = ${v.entry},
        duration_days = ${v.days},
        standard_price_aed = ${v.price},
        standard_price_usd = ${v.priceUsd},
        sort_order = ${v.sort},
        sample_id = ${SAMPLE}
    `;
  }
  console.log(`  ✓ ${visaTypesData.length} visa types`);

  // Applications
  for (const a of applicationsData) {
    await sql`
      INSERT INTO applications (id, visa_type_id, nationality, given_name, surname, passport_number, date_of_birth, passport_expiry, travel_date, applicant_email, processing_tier, status, amount_paid_aed, sample_id)
      VALUES (${a.id}, ${a.visa}, ${a.nat}, ${a.given}, ${a.surname}, ${a.passport}, ${a.dob}, ${a.exp}, ${a.travel}, ${a.email}, ${a.tier}, ${a.status}, ${a.amount}, ${SAMPLE})
      ON CONFLICT (id) DO UPDATE SET
        visa_type_id = ${a.visa},
        nationality = ${a.nat},
        given_name = ${a.given},
        surname = ${a.surname},
        passport_number = ${a.passport},
        date_of_birth = ${a.dob},
        passport_expiry = ${a.exp},
        travel_date = ${a.travel},
        applicant_email = ${a.email},
        processing_tier = ${a.tier},
        status = ${a.status},
        amount_paid_aed = ${a.amount},
        sample_id = ${SAMPLE}
    `;
  }
  console.log(`  ✓ ${applicationsData.length} applications`);

  // Status history
  for (const s of statusHistoryData) {
    await sql`
      INSERT INTO status_history (application_id, status, note, sample_id)
      VALUES (${s.app}, ${s.status}, ${s.note}, ${SAMPLE})
    `;
  }
  console.log(`  ✓ ${statusHistoryData.length} status history entries`);

  // Inquiries
  for (const i of inquiriesData) {
    await sql`
      INSERT INTO inquiries (name, email, phone, subject, message, resolved, sample_id)
      VALUES (${i.name}, ${i.email}, ${i.phone}, ${i.subject}, ${i.message}, ${i.resolved}, ${SAMPLE})
    `;
  }
  console.log(`  ✓ ${inquiriesData.length} inquiries`);

  console.log("\n✅ Seed complete! All sample data tagged with sample_id = 'sample'");
}

async function clean() {
  console.log("Removing sample data...\n");
  await sql`DELETE FROM status_history WHERE sample_id = ${SAMPLE}`;
  console.log("  ✓ status_history cleared");
  await sql`DELETE FROM payments WHERE sample_id = ${SAMPLE}`;
  console.log("  ✓ payments cleared");
  await sql`DELETE FROM documents WHERE sample_id = ${SAMPLE}`;
  console.log("  ✓ documents cleared");
  await sql`DELETE FROM applications WHERE sample_id = ${SAMPLE}`;
  console.log("  ✓ applications cleared");
  await sql`DELETE FROM inquiries WHERE sample_id = ${SAMPLE}`;
  console.log("  ✓ inquiries cleared");
  await sql`DELETE FROM visa_types WHERE sample_id = ${SAMPLE}`;
  console.log("  ✓ visa_types cleared");
  console.log("\n✅ All sample data removed!");
}

const cmd = process.argv[2];
if (cmd === "--clean") {
  clean().catch((e) => { console.error(e); process.exit(1); });
} else {
  seed().catch((e) => { console.error(e); process.exit(1); });
}
