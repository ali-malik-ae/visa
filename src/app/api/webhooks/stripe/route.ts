import { db } from "@/lib/db";
import { applications, payments, statusHistory, user, visaTypes } from "@/lib/db/schema";
import { sendConfirmationEmail, sendNewApplicationAlertEmail } from "@/lib/resend";
import { stripe } from "@/lib/stripe";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[stripe-webhook] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    const applicationId = session.metadata?.application_id;
    if (!applicationId) {
      console.error("[stripe-webhook] missing application_id in metadata");
      return NextResponse.json({ received: true });
    }

    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null;

    /* Idempotency: skip if payment already recorded */
    if (paymentIntentId) {
      const existing = await db
        .select({ id: payments.id })
        .from(payments)
        .where(eq(payments.stripe_payment_intent_id, paymentIntentId))
        .limit(1);
      if (existing.length > 0) {
        return NextResponse.json({ received: true });
      }
    }

    /* Fetch application for email */
    const [app] = await db
      .select()
      .from(applications)
      .where(eq(applications.id, applicationId))
      .limit(1);

    if (!app) {
      console.error("[stripe-webhook] application not found", applicationId);
      return NextResponse.json({ received: true });
    }

    const amountAed = session.amount_total ? session.amount_total / 100 : app.amount_paid_aed ?? 0;

    /* Update application status + create payment record + status history */
    await db
      .update(applications)
      .set({ status: "submitted", updated_at: new Date() })
      .where(eq(applications.id, applicationId));

    if (paymentIntentId) {
      await db.insert(payments).values({
        application_id: applicationId,
        stripe_payment_intent_id: paymentIntentId,
        amount_aed: amountAed,
        status: "succeeded",
      });
    }

    await db.insert(statusHistory).values({
      application_id: applicationId,
      status: "submitted",
      note: "Payment confirmed — application submitted for review",
    });

    /* Send confirmation email (non-blocking) */
    if (app.applicant_email) {
      sendConfirmationEmail({
        to: app.applicant_email,
        applicantName: `${app.given_name} ${app.surname}`,
        applicationId,
        visaTypeName: String(app.visa_type_id),
        travelDate: app.travel_date,
      }).catch(() => null);
    }

    /* Alert opted-in admins of the new submission (non-blocking) */
    Promise.all([
      db
        .select({ email: user.email })
        .from(user)
        .where(and(eq(user.role, "admin"), eq(user.status, "active"), eq(user.email_alerts, true))),
      db.select({ name: visaTypes.name }).from(visaTypes).where(eq(visaTypes.id, app.visa_type_id)).limit(1),
    ])
      .then(([admins, [visaType]]) =>
        sendNewApplicationAlertEmail({
          to: admins.map((a) => a.email),
          applicationId,
          applicantName: `${app.given_name} ${app.surname}`,
          visaTypeName: visaType?.name ?? "Unknown",
        })
      )
      .catch(() => null);
  } else if (event.type === "checkout.session.async_payment_failed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const applicationId = session.metadata?.application_id;
    if (applicationId) {
      await db.insert(statusHistory).values({
        application_id: applicationId,
        status: "draft",
        note: "Payment failed — awaiting retry",
      });
    }
  }

  return NextResponse.json({ received: true });
}
