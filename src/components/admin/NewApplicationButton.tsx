"use client";

import { Check, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { SanityVisaType } from "@/lib/sanity/client";

export function NewApplicationButton() {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [visaTypes, setVisaTypes] = useState<SanityVisaType[]>([]);
  const [form, setForm] = useState({ name: "", email: "", nationality: "", visa: "" });

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

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setDone(true);
  }

  function close() {
    setOpen(false);
    setTimeout(() => {
      setDone(false);
      setForm({ name: "", email: "", nationality: "", visa: visaTypes[0]?.slug ?? "" });
    }, 200);
  }

  const input =
    "w-full h-10 px-3 rounded-lg border border-line bg-white text-sm font-sans text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue";
  const label = "block text-sm font-sans font-semibold text-ink mb-1.5";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-blue text-white text-sm font-semibold font-sans hover:bg-blue-hover transition-colors whitespace-nowrap"
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
              <div className="py-8 text-center">
                <div className="h-12 w-12 rounded-full bg-emerald-50 grid place-items-center mx-auto mb-4">
                  <Check className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="font-display font-bold text-xl text-navy">Application created</h3>
                <p className="text-sm text-muted font-sans mt-1">
                  {form.name || "New applicant"} · {visaTypes.find((v) => v.slug === form.visa)?.name}
                </p>
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
                <div>
                  <label className={label}>Nationality</label>
                  <input className={input} value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} placeholder="e.g. British" />
                </div>
                <div>
                  <label className={label}>Visa Type</label>
                  <select className={`${input} appearance-none`} value={form.visa} onChange={(e) => setForm({ ...form, visa: e.target.value })}>
                    {visaTypes.map((v) => (
                      <option key={v.slug} value={v.slug}>{v.name} — AED {v.price_aed}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="w-full h-11 rounded-lg bg-blue text-white text-sm font-semibold font-sans hover:bg-blue-hover transition-colors">
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
