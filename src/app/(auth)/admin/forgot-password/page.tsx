"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { isAuthorizedStaffEmail } from "@/lib/staff-email";

const inputCls =
  "w-full h-11 px-3.5 rounded-lg border border-line bg-white text-sm font-sans text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue transition-colors";
const labelCls = "block text-sm font-sans font-semibold text-ink mb-1.5";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();

    if (!isAuthorizedStaffEmail(trimmed)) {
      setError("This email isn't authorized to request a password reset.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
      await fetch(`${baseUrl}/api/auth/request-password-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          redirectTo: `${window.location.origin}/admin/reset-password`,
        }),
      });
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mist px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl border border-line p-8 text-center">
            <div className="h-12 w-12 rounded-full bg-green-50 grid place-items-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="font-display font-bold text-xl text-navy mb-2">
              Check your email
            </h1>
            <p className="text-sm text-muted font-sans mb-6">
              We sent a password reset link to <strong>{email}</strong>. The link expires in 1 hour.
            </p>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 text-sm font-sans font-medium text-blue hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-mist px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-line p-8">
          <div className="text-center mb-6">
            <h1 className="font-display font-bold text-xl text-navy mb-1">
              Reset password
            </h1>
            <p className="text-sm text-muted font-sans">
              Enter your work email to receive a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={labelCls}>Work Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                required
                className={inputCls}
                placeholder="you@visati.ae"
                autoComplete="email"
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-danger font-sans">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-blue text-white font-semibold font-sans text-sm flex items-center justify-center gap-2 hover:bg-blue-hover transition-colors disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Send reset link
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 text-sm font-sans font-medium text-blue hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
