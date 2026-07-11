"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { inputClasses } from "@/components/ui/FormInput";
import { cn } from "@/lib/utils";
import type { VisaType } from "@/types/db";

export function VisaPricingRow({ visa }: { visa: VisaType }) {
  const [priceAed, setPriceAed] = useState(visa.standard_price_aed);
  const [priceUsd, setPriceUsd] = useState(visa.standard_price_usd);
  const [active, setActive] = useState(visa.has_express);
  const [savedPriceAed, setSavedPriceAed] = useState(visa.standard_price_aed);
  const [savedPriceUsd, setSavedPriceUsd] = useState(visa.standard_price_usd);
  const [savedActive, setSavedActive] = useState(visa.has_express);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const dirty =
    priceAed !== savedPriceAed || priceUsd !== savedPriceUsd || active !== savedActive;

  async function save() {
    setLoading(true);
    setSaved(false);
    try {
      await fetch(`/api/admin/visa-types/${visa.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          standard_price_aed: priceAed,
          standard_price_usd: priceUsd,
          has_express: active,
        }),
      }).catch(() => null);
    } finally {
      setSavedPriceAed(priceAed);
      setSavedPriceUsd(priceUsd);
      setSavedActive(active);
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  return (
    <tr className="hover:bg-mist transition-colors">
      <td className="px-5 py-3.5">
        <p className="font-sans text-ink font-medium">{visa.name}</p>
        <p className="font-mono text-xs text-muted">{visa.slug}</p>
      </td>
      <td className="px-5 py-3.5 whitespace-nowrap">
        <div className="inline-flex items-center gap-1.5">
          <span className="text-xs text-muted font-sans">AED</span>
          <input
            type="number"
            value={priceAed}
            min={0}
            onChange={(e) => setPriceAed(Number(e.target.value))}
            className={cn(inputClasses, "w-24 h-9 px-2 text-sm")}
          />
        </div>
      </td>
      <td className="px-5 py-3.5 whitespace-nowrap">
        <div className="inline-flex items-center gap-1.5">
          <span className="text-xs text-muted font-sans">$</span>
          <input
            type="number"
            value={priceUsd}
            min={0}
            onChange={(e) => setPriceUsd(Number(e.target.value))}
            className={cn(inputClasses, "w-24 h-9 px-2 text-sm")}
          />
        </div>
      </td>
      <td className="px-5 py-3.5">
        <button
          onClick={() => setActive((a) => !a)}
          className={
            "px-3 py-1.5 rounded-lg text-xs font-sans font-medium whitespace-nowrap transition-colors " +
            (active
              ? "bg-success/10 text-success border border-success/20"
              : "bg-mist-2 text-muted border border-line")
          }
        >
          {active ? "Available" : "Unavailable"}
        </button>
      </td>
      <td className="px-5 py-3.5 text-right">
        <button
          onClick={save}
          disabled={!dirty || loading}
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-gradient-to-r from-gold to-[#F0C864] text-navy text-sm font-sans font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {saved ? "Saved" : "Save"}
        </button>
      </td>
    </tr>
  );
}
