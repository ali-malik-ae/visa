/**
 * Creates demo users via BetterAuth.
 * Usage: npx tsx src/lib/db/seed-users.ts
 */
import "dotenv/config";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { auth } from "../auth";

const users = [
  { email: "aisha@visati.ae", password: "visati-demo", name: "Aisha Abdullah", role: "consultant" },
  { email: "mariam@visati.ae", password: "visati-admin", name: "Mariam Khalid", role: "admin" },
];

async function main() {
  for (const u of users) {
    try {
      const result = await auth.api.signUpEmail({
        body: { email: u.email, password: u.password, name: u.name },
      });
      // Set role if the user table supports it
      if (result?.user?.id) {
        const { db } = await import("../db");
        const { user } = await import("../db/schema");
        const { eq } = await import("drizzle-orm");
        await db.update(user).set({ role: u.role }).where(eq(user.id, result.user.id));
        console.log(`✓ ${u.role} user created: ${u.email} (${u.name})`);
      } else {
        console.log(`✓ User created: ${u.email}`);
      }
    } catch (err: any) {
      if (err?.message?.includes("already exists")) {
        console.log(`⚠ User already exists: ${u.email}`);
      } else {
        console.error(`✗ Failed to create ${u.email}:`, err?.message ?? err);
      }
    }
  }
}

main();
