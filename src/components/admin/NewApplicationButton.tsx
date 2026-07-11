"use client";

import { Check, Loader2, Plus, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { SanityVisaType } from "@/lib/sanity/client";
import { NationalityDropdown } from "@/components/ui/NationalityDropdown";
import { ADMIN_EVENTS } from "@/lib/admin-events";

// /api/cms/visa-types merges in the real (Postgres) price under these two
// fields — see that route for why price never comes from Sanity directly.
type VisaTypeOption = SanityVisaType & { price_aed: number; price_usd: number };

export function NewApplicationButton() {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visaTypes, setVisaTypes] = useState<VisaTypeOption[]>([]);
  const [form, setForm] = useState({ name: "", email: "", nationality: "", visa: "" });
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    fetch("/api/cms/visa-types")
      .then((r) => r.json())
      .then((d) => {
        const types = d.visa_types ?? [];
        setVisaTypes(types);
        if (types.length > 0) setForm((f) => ({ ...f, visa: types[0].slug }));
      })
      .catch(() => {});
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const [given_name, ...rest] = form.name.trim().split(/\s+/);
      const res = await fetch("/api/admin/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          given_name,
          surname: rest.join(" ") || given_name,
          applicant_email: form.email,
          nationality: form.nationality,
          visa_type_slug: form.visa,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not create application.");
        return;
      }
      setApplicationId(data.application_id);
      setDone(true);
      window.dispatchEvent(new Event(ADMIN_EVENTS.applicationsChanged));
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function uploadFile() {
    if (!file || !applicationId) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("document_type", "passport");
      const res = await fetch(`/api/applications/${applicationId}/documents`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Upload failed.");
        return;
      }
      setUploaded(true);
      setFile(null);
    } catch {
      setError("Network error during upload.");
    } finally {
      setUploading(false);
    }
  }

  function close() {
    setOpen(false);
    setTimeout(() => {
      setDone(false);
      setError(null);
      setApplicationId(null);
      setFile(null);
      setUploaded(false);
      setForm({ name: "", email: "", nationality: "", visa: visaTypes[0]?.slug ?? "" });
    }, 200);
  }

  const input =
    "w-full h-10 px-3 rounded-lg border border-line bg-white text-sm font-sans text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold";
  const label = "block text-sm font-sans font-semibold text-ink mb-1.5";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-gradient-to-r from-gold to-[#F0C864] text-navy text-sm font-semibold font-sans hover:opacity-90 transition-opacity whitespace-nowrap"
      >
        <Plus className="h-4 w-4" /> New Application
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={close} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
            <button onClick={close} className="absolute top-4 right-4 text-muted hover:text-ink">
              <X className="h-5 w-5" />
            </button>

            {done ? (
              <div className="py-6 text-center">
                <div className="h-12 w-12 rounded-full bg-emerald-50 grid place-items-center mx-auto mb-4">
                  <Check className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="font-display font-bold text-xl text-navy">Application created</h3>
                <p className="text-sm text-muted font-sans mt-1">
                  {applicationId} · {form.name || "New applicant"}
                </p>

                <div className="mt-6 text-left">
                  <label className={label}>Passport document (optional)</label>
                  <p className="text-xs text-muted font-sans mb-2 -mt-1">
                    Attach the client&apos;s passport scan now, or add it later from the application page.
                  </p>
                  {uploaded ? (
                    <p className="text-sm text-emerald-600 font-sans flex items-center gap-1.5">
                      <Check className="h-4 w-4" /> Document uploaded.
                    </p>
                  ) : file ? (
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
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        className="hidden"
                      />
                    </label>
                  )}
                  {error && <p className="text-xs text-danger font-sans mt-2">{error}</p>}
                </div>

                <button onClick={close} className="mt-6 h-10 px-5 rounded-lg bg-navy text-white text-sm font-semibold font-sans">
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <h3 className="font-display font-bold text-xl text-navy">New Application</h3>
                <div>
                  <label className={label}>Applicant Name</label>
                  <input className={input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" required />
                </div>
                <div>
                  <label className={label}>Email</label>
                  <input type="email" className={input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="client@email.com" required />
                </div>
                <NationalityDropdown
                  label="Nationality"
                  value={form.nationality}
                  onChange={(v) => setForm({ ...form, nationality: v })}
                />
                <div>
                  <label className={label}>Visa Type</label>
                  <select className={`${input} appearance-none`} value={form.visa} onChange={(e) => setForm({ ...form, visa: e.target.value })}>
                    {visaTypes.map((v) => (
                      <option key={v.slug} value={v.slug}>{v.name} — AED {v.price_aed}</option>
                    ))}
                  </select>
                </div>
                {error && <p className="text-sm text-danger font-sans">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting || !form.nationality}
                  className="w-full h-11 rounded-lg bg-gradient-to-r from-gold to-[#F0C864] text-navy text-sm font-semibold font-sans hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Create Application
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
