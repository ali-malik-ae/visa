import { db } from "@/lib/db";
import { applications, statusHistory, visaTypes } from "@/lib/db/schema";
import { stripe } from "@/lib/stripe";
import { generateAppId, EXPRESS_SURCHARGE_AED } from "@/lib/utils";
import { checkRateLimit } from "@/lib/rate-limit";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const CreateApplicationSchema = z.object({
  visa_type_slug: z.string().min(1).max(100),
  nationality: z.string().min(1).max(100),
  given_name: z.string().min(1).max(200),
  surname: z.string().min(1).max(200),
  passport_number: z.string().min(3).max(50),
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  passport_expiry: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  travel_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  processing_tier: z.enum(["standard", "express"]),
  applicant_email: z.string().email().max(255).optional(),
});

export async function POST(request: NextRequest) {
  const limited = checkRateLimit(request, "applications-create", { max: 10, windowSeconds: 60 });
  if (limited) return limited;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = CreateApplicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const data = parsed.data;

  /* Fetch visa type for pricing — linked by slug (shared key with Sanity content) */
  const [visaType] = await db
    .select()
    .from(visaTypes)
    .where(eq(visaTypes.slug, data.visa_type_slug))
    .limit(1);

  if (!visaType || !visaType.is_active) {
    return NextResponse.json(
      { error: "Visa type not found or inactive" },
      { status: 404 }
    );
  }

  if (data.processing_tier === "express" && !visaType.has_express) {
    return NextResponse.json(
      { error: "Express processing not available for this visa type" },
      { status: 400 }
    );
  }

  const amountAed =
    data.processing_tier === "express"
      ? visaType.standard_price_aed + EXPRESS_SURCHARGE_AED
      : visaType.standard_price_aed;

  /* Generate application ID */
  const applicationId = generateAppId();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  /* Create Stripe Checkout session */
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "aed",
          unit_amount: amountAed * 100,
          product_data: {
            name: visaType.name,
            description: `${data.processing_tier === "express" ? "Express" : "Standard"} processing · Application ${applicationId}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      application_id: applicationId,
    },
    success_url: `${appUrl}/apply?success=1&id=${applicationId}`,
    cancel_url: `${appUrl}/apply`,
  });

  /* Persist draft application */
  await db.insert(applications).values({
    id: applicationId,
    visa_type_id: visaType.id,
    nationality: data.nationality,
    given_name: data.given_name,
    surname: data.surname,
    passport_number: data.passport_number,
    date_of_birth: data.date_of_birth,
    passport_expiry: data.passport_expiry,
    travel_date: data.travel_date,
    processing_tier: data.processing_tier,
    applicant_email: data.applicant_email ?? null,
    status: "draft",
    stripe_payment_intent_id: session.payment_intent as string | null,
    amount_paid_aed: amountAed,
  });

  await db.insert(statusHistory).values({
    application_id: applicationId,
    status: "draft",
    note: "Application created — awaiting payment",
  });

  return NextResponse.json(
    { application_id: applicationId, checkout_url: session.url },
    { status: 201 }
  );
}
