"use client";

import { cn } from "@/lib/utils";
import type { AdminAppStatus } from "@/lib/admin-sample-data";
import { Check, ChevronDown, Download, FileText, Loader2, Mail, Upload } from "lucide-react";
import { useRef, useState } from "react";

type FullStatus = AdminAppStatus | "draft";

interface AppDetail {
  id: string;
  given_name: string;
  surname: string;
  nationality: string;
  passport_number: string;
  date_of_birth: string;
  passport_expiry: string;
  travel_date: string;
  applicant_email: string | null;
  processing_tier: string;
  status: FullStatus;
  amount_paid_aed: number | null;
  visa_type_name: string;
  created_at: string;
  updated_at: string;
}

interface HistoryEntry {
  id: number;
  status: FullStatus;
  note: string | null;
  created_at: string;
}

interface DocumentEntry {
  id: number;
  document_type: string;
  filename: string;
  size_bytes: number;
  uploaded_at: string;
  signed_url: string;
}

const STATUS_LABEL: Record<FullStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  reviewing: "Under Review",
  processing: "Processing",
  approved: "Approved",
  rejected: "Rejected",
};

const UPDATABLE_STATUSES: FullStatus[] = ["submitted", "reviewing", "processing", "approved", "rejected"];

const ALLOWED_UPLOAD_TYPES = [".pdf", ".jpg", ".jpeg", ".png"];

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("en-AE", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ApplicationDetailClient({
  app,
  history: initialHistory,
  documents: initialDocuments,
}: {
  app: AppDetail;
  history: HistoryEntry[];
  documents: DocumentEntry[];
}) {
  const [status, setStatus] = useState<FullStatus>(app.status);
  const [history, setHistory] = useState(initialHistory);
  const [docs, setDocs] = useState(initialDocuments);
  const [dropOpen, setDropOpen] = useState(false);
  const [note, setNote] = useState("");
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function updateStatus(s: FullStatus) {
    setUpdating(true);
    setDropOpen(false);
    try {
      const res = await fetch(`/api/admin/applications/${app.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: s, note: note.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? "Could not update status.");
        return;
      }
      setStatus(s);
      setHistory((h) => [...h, { id: h.length + 1000, status: s, note: note.trim() || null, created_at: data.updated_at }]);
      setNote("");
      showToast(`Status updated to ${STATUS_LABEL[s]}`);
    } catch {
      showToast("Network error. Could not update status.");
    } finally {
      setUpdating(false);
    }
  }

  async function uploadFile() {
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("document_type", "supporting");
      const res = await fetch(`/api/applications/${app.id}/documents`, { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error ?? "Upload failed.");
        return;
      }
      setDocs((d) => [...d, {
        id: data.id,
        document_type: "supporting",
        filename: data.filename,
        size_bytes: file.size,
        uploaded_at: new Date().toISOString(),
        signed_url: "",
      }]);
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      setUploadError("Network error during upload.");
    } finally {
      setUploading(false);
    }
  }

  const fields = [
    { label: "Full Name", value: `${app.given_name} ${app.surname}` },
    { label: "Date of Birth", value: app.date_of_birth },
    { label: "Nationality", value: app.nationality },
    { label: "Passport No.", value: app.passport_number },
    { label: "Passport Expiry", value: app.passport_expiry },
    { label: "Travel Date", value: app.travel_date },
    { label: "Email", value: app.applicant_email ?? "—" },
    { label: "Visa Type", value: app.visa_type_name },
    { label: "Processing", value: app.processing_tier === "express" ? "Express" : "Standard" },
    { label: "Amount Paid", value: app.amount_paid_aed ? `AED ${app.amount_paid_aed}` : "—" },
  ];

  const mailUrl = app.applicant_email
    ? `mailto:${app.applicant_email}?subject=Your Visati Application ${app.id}&body=Hello ${app.given_name}, your visa application status is: ${STATUS_LABEL[status]}.`
    : null;

  return (
    <>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-navy text-white text-sm font-sans font-medium px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <Check className="h-4 w-4 text-success" /> {toast}
        </div>
      )}

      <div className="px-4 lg:px-8 pb-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status + notes */}
          <div className="bg-white rounded-xl border border-line p-5 lg:p-6">
            <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
              <h2 className="font-display font-bold text-navy">Status</h2>
              <div className="flex items-center gap-2">
                <div ref={dropRef} className="relative">
                  <button
                    onClick={() => setDropOpen((o) => !o)}
                    disabled={updating}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-gold/10 text-gold text-xs font-semibold font-sans hover:bg-gold/20 transition-colors disabled:opacity-50"
                  >
                    {updating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : STATUS_LABEL[status]}
                    {!updating && <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                  {dropOpen && (
                    <div className="absolute right-0 top-full mt-1 z-20 min-w-[160px] bg-white rounded-xl border border-line shadow-lg py-1">
                      {UPDATABLE_STATUSES.map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(s)}
                          className={cn(
                            "w-full text-left px-4 py-2 text-sm font-sans hover:bg-mist transition-colors",
                            s === status ? "text-gold font-semibold" : "text-ink"
                          )}
                        >
                          {STATUS_LABEL[s]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Optional note — included in the status-change email to the client and saved to the timeline below…"
              className="w-full px-3 py-2.5 rounded-lg border border-line bg-white text-sm font-sans text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold resize-none mb-5"
            />

            <p className="text-xs font-semibold uppercase tracking-wider text-muted font-sans mb-3">Timeline</p>
            <div className="space-y-4">
              {history.length === 0 && <p className="text-sm text-muted font-sans">No status history yet.</p>}
              {[...history].reverse().map((h) => (
                <div key={h.id} className="flex gap-3">
                  <div className="h-7 w-7 rounded-full bg-mist-2 grid place-items-center flex-shrink-0">
                    <Check className="h-3.5 w-3.5 text-navy" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-sans font-semibold text-ink">{STATUS_LABEL[h.status]}</p>
                    {h.note && <p className="text-sm font-sans text-muted mt-0.5">{h.note}</p>}
                    <p className="text-xs text-muted font-sans mt-0.5">{formatDateTime(h.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Personal info */}
          <div className="bg-white rounded-xl border border-line p-5 lg:p-6">
            <h2 className="font-display font-bold text-navy mb-5">Personal Information</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5">
              {fields.map((f) => (
                <div key={f.label} className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted font-sans">{f.label}</p>
                  <p className="text-sm font-sans text-ink mt-1 break-words">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-xl border border-line p-5 lg:p-6">
            <h2 className="font-display font-bold text-navy mb-4">Documents</h2>
            {docs.length === 0 ? (
              <p className="text-sm text-muted font-sans mb-4">No documents uploaded.</p>
            ) : (
              <ul className="space-y-3 mb-4">
                {docs.map((d) => (
                  <li key={d.id} className="flex items-center gap-3 p-3 rounded-lg border border-line">
                    <span className="h-9 w-9 rounded-lg bg-mist grid place-items-center flex-shrink-0">
                      <FileText className="h-4 w-4 text-muted" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-sans font-medium text-ink truncate">{d.filename}</p>
                      <p className="text-xs text-muted font-sans">{d.document_type} · {formatSize(d.size_bytes)}</p>
                    </div>
                    {d.signed_url && (
                      <a
                        href={d.signed_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:inline-flex items-center gap-1 text-xs font-sans font-medium text-gold hover:underline px-2 flex-shrink-0"
                      >
                        <Download className="h-3.5 w-3.5" /> Download
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {file ? (
              <div className="flex items-center gap-2">
                <span className="flex-1 min-w-0 text-xs font-sans text-ink truncate">{file.name}</span>
                <button onClick={() => setFile(null)} className="text-xs font-sans text-muted hover:text-ink flex-shrink-0">
                  Clear
                </button>
                <button
                  onClick={uploadFile}
                  disabled={uploading}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-navy text-white text-xs font-semibold font-sans disabled:opacity-50 flex-shrink-0"
                >
                  {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                  {uploading ? "Uploading…" : "Upload"}
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 h-10 px-3 rounded-lg border border-dashed border-line text-xs font-sans font-medium text-muted hover:border-gold hover:text-gold cursor-pointer transition-colors">
                <Upload className="h-3.5 w-3.5" />
                Choose a file to attach
                <input
                  ref={fileRef}
                  type="file"
                  accept={ALLOWED_UPLOAD_TYPES.join(",")}
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="hidden"
                />
              </label>
            )}
            {uploadError && <p className="text-xs text-danger font-sans mt-1.5">{uploadError}</p>}
          </div>
        </div>

        {/* Right rail */}
        <div className="space-y-6">
          {status !== "approved" && status !== "rejected" && (
            <div className="bg-white rounded-xl border border-line p-5">
              <h3 className="font-display font-bold text-navy mb-4">Decision</h3>
              <div className="space-y-2">
                <button
                  onClick={() => updateStatus("approved")}
                  disabled={updating}
                  className="w-full inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg bg-gradient-to-r from-gold to-[#F0C864] text-navy text-sm font-semibold font-sans hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Check className="h-4 w-4" /> Approve Application
                </button>
                <button
                  onClick={() => updateStatus("rejected")}
                  disabled={updating}
                  className="w-full inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg border border-danger/30 bg-danger/5 text-danger text-sm font-semibold font-sans hover:bg-danger/10 transition-colors disabled:opacity-50"
                >
                  Reject Application
                </button>
              </div>
            </div>
          )}

          {status === "approved" && (
            <div className="bg-success/5 border border-success/20 rounded-xl p-5 text-center">
              <div className="h-10 w-10 rounded-full bg-success grid place-items-center mx-auto mb-2">
                <Check className="h-5 w-5 text-white" />
              </div>
              <p className="font-display font-bold text-navy">Approved</p>
              <p className="text-xs text-muted font-sans mt-1">This application has been approved</p>
            </div>
          )}

          {status === "rejected" && (
            <div className="bg-danger/5 border border-danger/20 rounded-xl p-5 text-center">
              <p className="font-display font-bold text-navy">Rejected</p>
              <p className="text-xs text-muted font-sans mt-1">This application has been rejected</p>
            </div>
          )}

          {mailUrl && (
            <div className="bg-white rounded-xl border border-line p-5">
              <h3 className="font-display font-bold text-navy mb-4">Client Communication</h3>
              <a href={mailUrl} className="block">
                <button className="w-full inline-flex items-center gap-2.5 h-11 px-4 rounded-lg border border-line text-sm font-semibold font-sans text-ink hover:bg-mist transition-colors">
                  <Mail className="h-4 w-4 text-muted" /> Send Email
                </button>
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
