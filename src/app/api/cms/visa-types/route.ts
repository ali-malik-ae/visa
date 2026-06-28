import { getVisaTypes } from "@/lib/sanity/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const visaTypes = await getVisaTypes();
    return NextResponse.json({ visa_types: visaTypes });
  } catch (err) {
    console.error("[GET /api/cms/visa-types]", err);
    return NextResponse.json(
      { error: "Failed to fetch visa types from Sanity" },
      { status: 500 }
    );
  }
}
