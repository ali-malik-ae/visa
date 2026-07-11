import { db } from "@/lib/db";
import { visaTypes } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/auth-guard";
import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const { response } = await requireAdminApi();
  if (response) return response;

  const types = await db.select().from(visaTypes).orderBy(asc(visaTypes.sort_order));
  return NextResponse.json({ visa_types: types });
}
