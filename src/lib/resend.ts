import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY ?? "re_placeholder");

const FROM = process.env.RESEND_FROM_EMAIL ?? "noreply@visati.ae";
const ADMIN_EMAIL =
  process.env.ADMIN_NOTIFICATION_EMAIL ?? "admin@visati.ae";

export async function sendConfirmationEmail(params: {
  to: string;
  applicantName: string;
  applicationId: string;
  visaTypeName: string;
  travelDate: string;
}): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: `Visa Application Received — ${params.applicationId}`,
      html: `
        <h2>Thank you, ${params.applicantName}!</h2>
        <p>Your visa application has been received and is under review.</p>
        <p><strong>Application ID:</strong> ${params.applicationId}</p>
        <p><strong>Visa Type:</strong> ${params.visaTypeName}</p>
        <p><strong>Travel Date:</strong> ${params.travelDate}</p>
        <p>Track your application at <a href="${process.env.NEXT_PUBLIC_APP_URL}/track">visati.ae/track</a></p>
      `,
    });
  } catch (err) {
    console.error("[resend] sendConfirmationEmail failed", err);
  }
}

export async function sendStatusUpdateEmail(params: {
  to: string;
  applicantName: string;
  applicationId: string;
  status: string;
  note?: string;
}): Promise<void> {
  try {
    const statusLabel: Record<string, string> = {
      submitted: "Submitted",
      reviewing: "Under Review",
      processing: "Processing",
      approved: "Approved",
      rejected: "Rejected",
    };
    await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: `Application Update — ${params.applicationId} is now ${statusLabel[params.status] ?? params.status}`,
      html: `
        <h2>Application Status Update</h2>
        <p>Dear ${params.applicantName},</p>
        <p>Your application <strong>${params.applicationId}</strong> status has been updated to: <strong>${statusLabel[params.status] ?? params.status}</strong></p>
        ${params.note ? `<p><em>Note from our team: ${params.note}</em></p>` : ""}
        <p>Track your application at <a href="${process.env.NEXT_PUBLIC_APP_URL}/track">visati.ae/track</a></p>
      `,
    });
  } catch (err) {
    console.error("[resend] sendStatusUpdateEmail failed", err);
  }
}

export async function sendAdminNotificationEmail(params: {
  inquiryName: string;
  inquiryEmail: string;
  subject: string;
  message: string;
}): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `New Inquiry: ${params.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${params.inquiryName}</p>
        <p><strong>Email:</strong> ${params.inquiryEmail}</p>
        <p><strong>Subject:</strong> ${params.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${params.message}</p>
      `,
    });
  } catch (err) {
    console.error("[resend] sendAdminNotificationEmail failed", err);
  }
}

export async function sendNewApplicationAlertEmail(params: {
  to: string[];
  applicationId: string;
  applicantName: string;
  visaTypeName: string;
}): Promise<void> {
  if (params.to.length === 0) return;
  try {
    await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: `New Application — ${params.applicationId}`,
      html: `
        <h2>New visa application submitted</h2>
        <p><strong>Applicant:</strong> ${params.applicantName}</p>
        <p><strong>Application ID:</strong> ${params.applicationId}</p>
        <p><strong>Visa Type:</strong> ${params.visaTypeName}</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/applications/${params.applicationId}">View in dashboard</a></p>
      `,
    });
  } catch (err) {
    console.error("[resend] sendNewApplicationAlertEmail failed", err);
  }
}

export async function sendInquiryReplyEmail(params: {
  to: string;
  inquiryName: string;
  subject: string;
  message: string;
}): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: `Re: ${params.subject}`,
      html: `
        <p>Hi ${params.inquiryName},</p>
        <p>${params.message.replace(/\n/g, "<br>")}</p>
        <p>— The Visati Team</p>
      `,
    });
  } catch (err) {
    console.error("[resend] sendInquiryReplyEmail failed", err);
    throw err;
  }
}

export async function sendPasswordResetEmail(params: {
  to: string;
  userName: string;
  resetUrl: string;
}): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: "Reset Your Visati Admin Password",
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 20px; color: #1a1a1a;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="font-size: 22px; font-weight: bold; color: #080F1E; margin: 0;">VISATI</h1>
            <p style="font-size: 11px; color: #666; margin: 4px 0 0;">Dubai Visas. Simplified.</p>
          </div>
          <h2 style="font-size: 18px; margin-bottom: 12px;">Reset your password</h2>
          <p style="font-size: 14px; color: #444; line-height: 1.6;">
            Hi ${params.userName},
          </p>
          <p style="font-size: 14px; color: #444; line-height: 1.6;">
            We received a request to reset your admin dashboard password. Click the button below to set a new password:
          </p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${params.resetUrl}" style="display: inline-block; padding: 12px 32px; background: #080F1E; color: #fff; font-size: 14px; font-weight: 600; border-radius: 8px; text-decoration: none;">
              Reset Password
            </a>
          </div>
          <p style="font-size: 13px; color: #888; line-height: 1.5;">
            This link expires in 1 hour. If you did not request a password reset, you can safely ignore this email.
          </p>
          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; text-align: center; font-size: 11px; color: #999;">
            <p style="margin: 0;">Visati Visa Services LLC &middot; Dubai, UAE</p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("[resend] sendPasswordResetEmail failed", err);
  }
}
