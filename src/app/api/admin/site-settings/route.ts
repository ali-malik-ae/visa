import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/auth-guard";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  const { response } = await requireAdminApi();
  if (response) return response;

  const [row] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, 1))
    .limit(1);

  return NextResponse.json({ show_usd_pricing: row?.show_usd_pricing ?? false });
}

const UpdateSettingsSchema = z.object({
  show_usd_pricing: z.boolean(),
});

export async function PATCH(request: NextRequest) {
  const { response } = await requireAdminApi();
  if (response) return response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = UpdateSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 422 });
  }

  await db
    .update(siteSettings)
    .set({ show_usd_pricing: parsed.data.show_usd_pricing, updated_at: new Date() })
    .where(eq(siteSettings.id, 1));

  return NextResponse.json(parsed.data);
}
