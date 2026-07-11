import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/** Whether USD equivalents are shown alongside AED prices site-wide. Admin-controlled, not per-visitor. */
export async function getShowUsdSetting(): Promise<boolean> {
  const [row] = await db
    .select({ show_usd_pricing: siteSettings.show_usd_pricing })
    .from(siteSettings)
    .where(eq(siteSettings.id, 1))
    .limit(1);
  return row?.show_usd_pricing ?? false;
}
