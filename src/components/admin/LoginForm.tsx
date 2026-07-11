"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
const inputCls =
  "w-full h-11 px-3.5 rounded-lg border border-line bg-white text-sm font-sans text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-colors";
const labelCls =
  "block text-sm font-sans font-semibold text-ink mb-1.5";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error: authError } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });
      if (authError) {
        setError("Invalid email or password.");
        setLoading(false);
      } else {
        router.push(callbackUrl);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelCls}>Work Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={inputCls}
          placeholder="you@visati.ae"
          autoComplete="email"
        />
      </div>

      <div>
        <label className={labelCls}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputCls}
          placeholder="••••••••••"
          autoComplete="current-password"
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm font-sans text-ink cursor-pointer select-none">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-line text-gold accent-gold"
          />
          Remember me
        </label>
        <Link href="/admin/forgot-password" className="text-sm font-sans font-medium text-gold hover:underline">
          Forgot password?
        </Link>
      </div>

      {error && <p className="text-sm text-danger font-sans">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 rounded-lg bg-gradient-to-r from-gold to-[#F0C864] text-navy font-semibold font-sans text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Sign In
        {!loading && <ArrowRight className="h-4 w-4" />}
      </button>
    </form>
  );
}
