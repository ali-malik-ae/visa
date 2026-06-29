"use client";

import { Button } from "@/components/ui/Button";
import { Check, Printer } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BRAND, CONTACT } from "@/lib/constants";
import type { TrackResponse } from "@/types/api";

interface Step5Props {
  applicationId: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getStatusLabel(status: string) {
  switch (status) {
    case "submitted": return "Submitted";
    case "under_review": return "Under Review";
    case "processing": return "Processing";
    case "approved": return "Approved";
    case "rejected": return "Rejected";
    default: return status;
  }
}

async function openReceiptPrint(applicationId: string): Promise<void> {
  const res = await fetch(`/api/track?id=${encodeURIComponent(applicationId)}`);
  if (!res.ok) throw new Error("Could not fetch application data");
  const result: TrackResponse = await res.json();

  const statusColor =
    result.status === "approved" ? "#16a34a" :
    result.status === "rejected" ? "#dc2626" : "#080F1E";

  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) {
    alert("Please allow pop-ups for this site to print your receipt.");
    return;
  }

  win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Visati Receipt — ${result.application_id}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
    body{font-family:system-ui,-apple-system,sans-serif;color:#1a1a1a;background:#fff;padding:48px;max-width:640px;margin:0 auto}
    .header{display:flex;justify-content:space-between;align-items:center;padding-bottom:24px;margin-bottom:28px;border-bottom:2px solid #080F1E}
    .logo-wrap{display:flex;align-items:center;gap:10px}
    .brand{font-size:20px;font-weight:700;color:#080F1E;letter-spacing:.05em;line-height:1}
    .tagline{font-size:10px;color:#999;margin-top:3px}
    .receipt-ref{text-align:right}
    .receipt-ref p:first-child{font-size:11px;color:#999;text-transform:uppercase;letter-spacing:.06em}
    .receipt-ref p:last-child{font-size:14px;font-weight:700;font-family:monospace;color:#080F1E;margin-top:3px}
    table{width:100%;border-collapse:collapse;margin-bottom:32px}
    td{padding:11px 0;border-bottom:1px solid #eee;vertical-align:middle}
    td:first-child{font-size:10px;color:#999;text-transform:uppercase;letter-spacing:.06em;width:42%}
    td:last-child{font-size:13px;font-weight:500;text-align:right}
    .badge{display:inline-block;padding:3px 12px;border-radius:20px;font-size:11px;font-weight:700;color:#fff}
    .footer{border-top:2px solid #080F1E;padding-top:20px;text-align:center;font-size:10px;color:#bbb;line-height:1.7}
    @media print{body{padding:0}@page{margin:1.5cm 1cm;size:A4}}
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-wrap">
      <svg style="height:32px;flex-shrink:0" viewBox="0 0 191.5 267" aria-hidden="true">
        <path d="M 191.5 65 L 0 133.5 L 0.5 56.5 L 118.5 0 L 191.5 0 L 191.5 65 Z" fill="#3D7BFF"/>
        <path transform="translate(0,101)" d="M 0 166 L 0 32 L 89 0 L 137 10 C 74.6 52.4 19.667 131.667 0 166 Z" fill="#0057FF"/>
        <path transform="translate(0,101)" d="M 137 10 L 0 32.5 L 90 0 L 137 10 Z" fill="#0042C4"/>
      </svg>
      <div>
        <p class="brand">VISATI</p>
        <p class="tagline">Dubai Visas. Simplified.</p>
      </div>
    </div>
    <div class="receipt-ref">
      <p>Application Receipt</p>
      <p>${result.application_id}</p>
    </div>
  </div>
  <table>
    <tr><td>Applicant</td><td>${result.applicant_name}</td></tr>
    <tr><td>Visa Type</td><td>${result.visa_type_name}</td></tr>
    <tr><td>Status</td><td><span class="badge" style="background:${statusColor}">${getStatusLabel(result.status)}</span></td></tr>
    <tr><td>Submitted</td><td>${formatDate(result.created_at)}</td></tr>
    <tr><td>Travel Date</td><td>${result.travel_date ? formatDate(result.travel_date) : "TBD"}</td></tr>
  </table>
  <div class="footer">
    <p>${BRAND.legalName} &middot; ${BRAND.location}</p>
    <p>${CONTACT.email} &middot; ${CONTACT.phone}</p>
    <p style="margin-top:8px">Auto-generated receipt. For questions, contact us on WhatsApp.</p>
  </div>
  <script>window.addEventListener('load',function(){window.print()});<\/script>
</body>
</html>`);
  win.document.close();
}

export function Step5Success({ applicationId }: Step5Props) {
  const [downloading, setDownloading] = useState(false);

  async function handlePrint() {
    setDownloading(true);
    try {
      await openReceiptPrint(applicationId);
    } catch (err) {
      console.error("Receipt print failed:", err);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-8 text-center">
        {/* Checkmark icon */}
        <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
          <Check className="h-8 w-8 text-success" strokeWidth={3} />
        </div>

        {/* Heading */}
        <h2 className="font-display font-bold text-3xl text-ink mb-3">
          Application submitted.
        </h2>
        <p className="text-sm font-sans text-muted leading-relaxed mb-6">
          We&apos;ve received your application. You&apos;ll get a confirmation
          email within minutes and WhatsApp updates at every stage.
        </p>

        {/* Application ID box */}
        <div className="rounded-xl bg-mist border border-line px-6 py-5 mb-6">
          <p className="text-[11px] font-sans font-semibold uppercase tracking-wider text-muted mb-2">
            Your Application ID
          </p>
          <p className="font-mono text-xl font-bold text-ink tracking-wider">
            {applicationId}
          </p>
          <p className="text-xs font-sans text-muted mt-2">
            Keep this safe to track your application.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <Link href={`/track?id=${applicationId}`} className="flex-1">
            <Button variant="gold" size="md" className="w-full">
              Track Application
            </Button>
          </Link>
          <Button
            variant="gold-outline"
            size="md"
            className="flex-1"
            onClick={handlePrint}
            disabled={downloading}
          >
            {downloading ? (
              "Loading…"
            ) : (
              <>
                <Printer className="h-4 w-4 mr-1.5" />
                Print / Save
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
