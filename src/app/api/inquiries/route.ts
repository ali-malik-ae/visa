import { db } from "@/lib/db";
import { inquiries } from "@/lib/db/schema";
import { sendAdminNotificationEmail } from "@/lib/resend";
import { checkRateLimit } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const InquirySchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(255),
  phone: z.string().max(50).optional(),
  subject: z.string().min(1).max(300),
  message: z.string().min(10).max(5000),
});

export async function POST(request: NextRequest) {
  const limited = checkRateLimit(request, "inquiries-create", { max: 5, windowSeconds: 60 });
  if (limited) return limited;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = InquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { name, email, phone, subject, message } = parsed.data;

  const [inquiry] = await db
    .insert(inquiries)
    .values({ name, email, phone, subject, message })
    .returning({ id: inquiries.id });

  sendAdminNotificationEmail({
    inquiryName: name,
    inquiryEmail: email,
    subject,
    message,
  }).catch(() => null);

  return NextResponse.json({ id: inquiry.id }, { status: 201 });
}
