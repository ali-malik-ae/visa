/**
 * Creates the first admin user via BetterAuth.
 * Usage: npx tsx src/lib/db/seed-admin.ts <email> <password> "<name>"
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { auth } from "../auth";
import { db } from "./index";
import { user } from "./schema";
import { eq } from "drizzle-orm";

async function main() {
  const [email, password, name] = process.argv.slice(2);
  if (!email || !password) {
    console.error(
      'Usage: npx tsx src/lib/db/seed-admin.ts <email> <password> "<name>"'
    );
    process.exit(1);
  }

  try {
    // signUpEmail always creates the "consultant" default role (role is
    // input: false — deliberately not settable via the public API). Promote
    // to admin with a direct DB write afterward.
    await auth.api.signUpEmail({
      body: { email, password, name: name ?? "Visati Admin" },
    });
    await db.update(user).set({ role: "admin" }).where(eq(user.email, email));
    console.log(`✓ Admin user created: ${email}`);
    process.exit(0);
  } catch (err) {
    console.error("Failed to create admin user:", err);
    process.exit(1);
  }
}

main();
