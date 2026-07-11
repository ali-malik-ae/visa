"use client";

import { Button } from "@/components/ui/Button";
import { StatusTimeline } from "@/components/ui/StatusTimeline";
import type { TrackResponse } from "@/types/api";
import { APP_ID_REGEX } from "@/lib/utils";
import { FadeIn } from "@/components/ui/FadeIn";
import { WHATSAPP_URL, BRAND, CONTACT } from "@/lib/constants";
import { inputClasses } from "@/components/ui/FormInput";
import { cn } from "@/lib/utils";
import { Search, Printer, Phone } from "lucide-react";
import { useEffect, useState } from "react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("en-AE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusColor(status: string) {
  switch (status) {
    case "approved": return "bg-success";
    case "rejected": return "bg-danger";
    case "processing": return "bg-info";
    default: return "bg-muted";
  }
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

function printReceipt(result: TrackResponse) {
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
        <path d="M 191.5 65 L 0 133.5 L 0.5 56.5 L 118.5 0 L 191.5 0 L 191.5 65 Z" fill="#F0C864"/>
        <path transform="translate(0,101)" d="M 0 166 L 0 32 L 89 0 L 137 10 C 74.6 52.4 19.667 131.667 0 166 Z" fill="#C49A2C"/>
        <path transform="translate(0,101)" d="M 137 10 L 0 32.5 L 90 0 L 137 10 Z" fill="#AD8724"/>
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
    ${result.updated_at ? `<tr><td>Last Updated</td><td>${formatDateTime(result.updated_at)}</td></tr>` : ""}
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

interface TrackClientProps {
  initialId?: string;
}

export function TrackClient({ initialId }: TrackClientProps) {
  const [inputId, setInputId] = useState(initialId?.toUpperCase() ?? "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function track(id: string) {
    if (!APP_ID_REGEX.test(id)) {
      setError("Please enter a valid Application ID (e.g. VIS-2026-AB1234).");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/track?id=${encodeURIComponent(id)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
      } else {
        setResult(data as TrackResponse);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initialId) track(initialId.trim().toUpperCase());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialId]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    track(inputId.trim().toUpperCase());
  }

  return (
    <div className="min-h-screen bg-mist">
      {/* Header */}
      <section className="pt-28 pb-16 px-4">
        <div className="mx-auto max-w-2xl text-center">
          <FadeIn direction="up" delay={0}>
            <p className="text-gold text-xs font-sans font-semibold uppercase tracking-widest mb-3">
              Track
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={100}>
            <h1 className="font-display font-bold text-4xl lg:text-5xl text-ink mb-3">
              Where&apos;s your visa?
            </h1>
          </FadeIn>
          <FadeIn direction="up" delay={200}>
            <p className="text-muted font-sans text-sm">
              Enter your Application ID to see real-time status, team notes, and expected decision date.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Search */}
      <section className="pb-12 px-4">
        <div className="mx-auto max-w-3xl">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-line p-4 shadow-sm flex items-center gap-3 max-w-2xl mx-auto"
          >
            <Search className="h-5 w-5 text-muted flex-shrink-0 ml-2" />
            <input
              type="text"
              value={inputId}
              onChange={(e) => {
                setInputId(e.target.value);
                setError(null);
              }}
              placeholder="VIS-2026-XXXXXX"
              className={cn(inputClasses, "flex-1 min-w-0 font-mono border-0 bg-transparent focus:ring-0 h-12")}
              autoComplete="off"
              spellCheck={false}
            />
            <Button
              type="submit"
              variant="gold"
              size="md"
              loading={loading}
              className="whitespace-nowrap flex-shrink-0"
            >
              Track &rarr;
            </Button>
          </form>

          {error && (
            <p className="mt-3 text-sm text-danger font-sans text-center max-w-2xl mx-auto">{error}</p>
          )}

          <p className="text-center text-xs text-muted font-sans mt-3 max-w-2xl mx-auto">
            Can&apos;t find your ID? Check your email or{" "}
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
              WhatsApp us
            </a>
          </p>

          {/* Result */}
          {result && (
            <div className="mt-8 space-y-6">
              {/* Application card */}
              <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
                {/* Header row */}
                <div className="flex items-start justify-between gap-4 flex-wrap mb-1">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-mono text-sm text-muted">{result.application_id}</p>
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-sans font-medium text-white",
                        getStatusColor(result.status)
                      )}>
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        {getStatusLabel(result.status)}
                      </span>
                    </div>
                    <h2 className="font-display font-bold text-2xl text-ink mb-1">
                      {result.applicant_name}
                    </h2>
                    <p className="text-sm text-muted font-sans">
                      {result.visa_type_name} &middot; Submitted {formatDate(result.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-sans font-semibold uppercase tracking-wider text-muted mb-1">
                      Expected by
                    </p>
                    <p className="font-display font-bold text-xl text-ink">
                      {result.travel_date ? formatDate(result.travel_date) : "TBD"}
                    </p>
                    {result.status !== "rejected" && (
                      <p className="text-xs font-sans text-success font-medium mt-1 flex items-center justify-end gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-success" />
                        On track
                      </p>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-line my-5" />

                {/* Status timeline */}
                <StatusTimeline
                  history={result.status_history}
                  currentStatus={result.status}
                />

                {/* Divider */}
                <div className="border-t border-line my-5" />

                {/* Team note */}
                {result.status_history && result.status_history.length > 0 && (
                  <div className="flex items-start gap-3 mb-5">
                    <div className="h-8 w-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-sans font-bold text-gold">A</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-sans font-semibold text-ink">Aisha</span>
                        <span className="text-xs font-sans text-muted">Visa Consultant</span>
                        <span className="text-xs font-sans text-muted">&middot;</span>
                        <span className="text-xs font-sans text-muted">
                          {result.status_history[result.status_history.length - 1]?.created_at
                            ? formatDateTime(result.status_history[result.status_history.length - 1].created_at)
                            : ""}
                        </span>
                      </div>
                      <p className="text-sm font-sans text-ink leading-relaxed">
                        Your application has cleared internal review and is now with the GDRFA. We expect a decision within 48 hours. We&apos;ll WhatsApp you the moment it lands.
                      </p>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between gap-4 flex-wrap pt-4 border-t border-line">
                  <p className="text-xs text-muted font-sans">
                    Last updated: {result.updated_at ? formatDateTime(result.updated_at) : "N/A"}
                  </p>
                  <div className="flex items-center gap-3">
                    <Button variant="secondary" size="sm" onClick={() => printReceipt(result)}>
                      <Printer className="h-4 w-4 mr-1.5" />
                      Print / Save
                    </Button>
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="whatsapp" size="sm">
                        <Phone className="h-4 w-4 mr-1.5" />
                        WhatsApp Team
                      </Button>
                    </a>
                  </div>
                </div>
              </div>

              {/* Status legend */}
              <div className="flex items-center justify-center gap-6 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-success" />
                  <span className="text-xs font-sans text-muted">On track</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-info" />
                  <span className="text-xs font-sans text-muted">Processing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-success" />
                  <span className="text-xs font-sans text-muted">Approved</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-danger" />
                  <span className="text-xs font-sans text-muted">Rejected</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
