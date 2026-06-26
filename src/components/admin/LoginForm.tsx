"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
const inputCls =
  "w-full h-11 px-3.5 rounded-lg border border-line bg-white text-sm font-sans text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue transition-colors";
const labelCls =
  "block text-sm font-sans font-semibold text-ink mb-1.5";

// UI-first preview accounts. Remove when real auth is wired.
const DEMO_ACCOUNTS = [
  { label: "Consultant", email: "aisha@visati.ae", password: "visati-demo", dest: "/admin", role: "consultant" as const },
  { label: "Administrator", email: "mariam@visati.ae", password: "visati-admin", dest: "/admin/users", role: "admin" as const },
] as const;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  const [email, setEmail] = useState<string>(DEMO_ACCOUNTS[0].email);
  const [password, setPassword] = useState<string>(DEMO_ACCOUNTS[0].password);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function enterDemo(dest: string, role: "consultant" | "admin") {
    document.cookie = "better-auth.session_token=ui-preview-demo; path=/; max-age=86400; samesite=lax";
    document.cookie = `visati-preview-role=${role}; path=/; max-age=86400; samesite=lax`;
    router.push(callbackUrl === "/admin" ? dest : callbackUrl);
  }

  function matchingDemo() {
    return DEMO_ACCOUNTS.find(
      (a) => a.email === email.trim().toLowerCase() && a.password === password
    ) ?? null;
  }

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
        const demo = matchingDemo();
        if (demo) return enterDemo(demo.dest, demo.role);
        setError("Invalid email or password.");
        setLoading(false);
      } else {
        router.push(callbackUrl);
      }
    } catch {
      const demo = matchingDemo();
      if (demo) return enterDemo(demo.dest, demo.role);
      setError("Invalid email or password.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Quick-switch demo accounts */}
      <div className="rounded-lg bg-mist border border-line p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted font-sans mb-2">
          Preview accounts
        </p>
        <div className="flex gap-2">
          {DEMO_ACCOUNTS.map((a) => (
            <button
              key={a.email}
              type="button"
              onClick={() => { setEmail(a.email); setPassword(a.password); setError(null); }}
              className={
                "flex-1 rounded-md py-1.5 text-xs font-semibold font-sans transition-colors " +
                (email === a.email
                  ? "bg-navy text-white"
                  : "bg-white border border-line text-ink hover:bg-mist-2")
              }
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
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
            className="h-4 w-4 rounded border-line text-blue accent-blue"
          />
          Remember me
        </label>
        <button type="button" className="text-sm font-sans font-medium text-blue hover:underline">
          Forgot password?
        </button>
      </div>

      {error && <p className="text-sm text-danger font-sans">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 rounded-lg bg-blue text-white font-semibold font-sans text-sm flex items-center justify-center gap-2 hover:bg-blue-hover transition-colors disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Sign In
        {!loading && <ArrowRight className="h-4 w-4" />}
      </button>
    </form>
  );
}
