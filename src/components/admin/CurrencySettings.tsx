"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";

export function CurrencySettings() {
  const [loaded, setLoaded] = useState(false);
  const [showUsd, setShowUsd] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/site-settings")
      .then((r) => r.json())
      .then((d) => setShowUsd(Boolean(d.show_usd_pricing)))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  async function toggle() {
    const next = !showUsd;
    setLoading(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ show_usd_pricing: next }),
      });
      if (res.ok) {
        setShowUsd(next);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      // network error — leave state unchanged
    } finally {
      setLoading(false);
    }
  }

  if (!loaded) return null;

  return (
    <div className="bg-white rounded-xl border border-line shadow-sm overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-line">
        <h2 className="font-display font-semibold text-navy">Currency Display</h2>
        <p className="text-xs text-muted font-sans mt-0.5">
          Controls whether USD prices appear alongside AED across the whole site.
        </p>
      </div>
      <div className="p-6">
        <label className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-sans font-semibold text-ink">Show USD pricing</p>
            <p className="text-xs text-muted font-sans mt-0.5 max-w-md">
              When on, an approximate USD figure is shown next to every AED price site-wide, with
              a disclaimer that USD rates fluctuate. Applies to all visitors — not a per-user setting.
              Checkout always charges in AED regardless of this setting.
            </p>
          </div>
          <span className="relative inline-flex items-center flex-shrink-0">
            <input
              type="checkbox"
              checked={showUsd}
              disabled={loading}
              onChange={toggle}
              className="h-5 w-9 rounded-full appearance-none bg-mist-2 checked:bg-gold border border-line checked:border-gold transition-colors cursor-pointer disabled:opacity-50"
            />
            <span
              className={
                "absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform pointer-events-none " +
                (showUsd ? "translate-x-4" : "translate-x-0")
              }
            />
          </span>
        </label>
        {(loading || saved) && (
          <p className="mt-3 text-xs font-sans text-muted flex items-center gap-1.5">
            {loading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" /> Saving…
              </>
            ) : (
              <>
                <Check className="h-3 w-3 text-success" /> Saved
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
