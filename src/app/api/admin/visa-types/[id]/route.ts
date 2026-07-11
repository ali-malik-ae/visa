import { db } from "@/lib/db";
import { visaTypes } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/auth-guard";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UpdateVisaSchema = z.object({
  standard_price_aed: z.number().int().min(0).max(100000).optional(),
  standard_price_usd: z.number().int().min(0).max(100000).optional(),
  has_express: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = UpdateVisaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 422 });
  }

  await db
    .update(visaTypes)
    .set({ ...parsed.data, updated_at: new Date() })
    .where(eq(visaTypes.id, numericId));

  return NextResponse.json({ id: numericId, ...parsed.data });
}
