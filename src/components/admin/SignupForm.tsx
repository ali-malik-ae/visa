"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { isAuthorizedStaffEmail } from "@/lib/staff-email";

const inputCls =
  "w-full h-11 px-3.5 rounded-lg border border-line bg-white text-sm font-sans text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-colors";
const labelCls = "block text-sm font-sans font-semibold text-ink mb-1.5";

const ROLES = ["Visa Consultant", "Senior Consultant", "Team Lead", "Administrator"];

export function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "Aisha",
    lastName: "Rahman",
    email: "aisha@visati.ae",
    role: ROLES[0],
    password: "",
    confirm: "",
  });
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isAuthorizedStaffEmail(form.email)) {
      setError("Please use a @visati.ae work email.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!agree) {
      setError("Please accept the internal staff policies.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { error: authError } = await authClient.signUp.email({
        email: form.email.trim(),
        password: form.password,
        name: `${form.firstName} ${form.lastName}`.trim(),
      });
      if (authError) {
        setError("Could not create account. Try a different email.");
        setLoading(false);
      } else {
        router.push("/admin");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>First Name</label>
          <input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} className={inputCls} required />
        </div>
        <div>
          <label className={labelCls}>Last Name</label>
          <input value={form.lastName} onChange={(e) => set("lastName", e.target.value)} className={inputCls} required />
        </div>
      </div>

      <div>
        <label className={labelCls}>Work Email</label>
        <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} placeholder="you@visati.ae" required />
      </div>

      <div>
        <label className={labelCls}>Role</label>
        <select value={form.role} onChange={(e) => set("role", e.target.value)} className={`${inputCls} appearance-none`}>
          {ROLES.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Password</label>
          <input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} className={inputCls} placeholder="••••••••••" required />
        </div>
        <div>
          <label className={labelCls}>Confirm Password</label>
          <input type="password" value={form.confirm} onChange={(e) => set("confirm", e.target.value)} className={inputCls} placeholder="••••••••••" required />
        </div>
      </div>

      <label className="flex items-start gap-2 text-sm font-sans text-ink cursor-pointer select-none pt-1">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="h-4 w-4 mt-0.5 rounded border-line accent-gold" />
        <span>
          I agree to the{" "}
          <span className="font-semibold text-gold">internal staff policies</span> and data
          handling guidelines.
        </span>
      </label>

      {error && <p className="text-sm text-danger font-sans">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 rounded-lg bg-gradient-to-r from-gold to-[#F0C864] text-navy font-semibold font-sans text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Create Account
        {!loading && <ArrowRight className="h-4 w-4" />}
      </button>
    </form>
  );
}
