"use client";

import { VisaPricingRow } from "./VisaPricingRow";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import type { VisaType } from "@/types/db";

export function VisaPricingSection() {
  const { isAdmin } = useCurrentUser();
  const [visaTypes, setVisaTypes] = useState<VisaType[]>([]);

  useEffect(() => {
    if (!isAdmin) return;
    fetch("/api/admin/visa-types")
      .then((r) => r.json())
      .then((d) => setVisaTypes(d.visa_types ?? []))
      .catch(() => {});
  }, [isAdmin]);

  const list = [...visaTypes].sort((a, b) => a.sort_order - b.sort_order);

  if (!isAdmin) {
    return (
      <div className="bg-white rounded-xl border border-line shadow-sm p-8 flex flex-col items-center text-center">
        <div className="h-12 w-12 rounded-full bg-mist grid place-items-center mb-3">
          <Lock className="h-5 w-5 text-muted" />
        </div>
        <p className="font-display font-semibold text-navy">Visa Pricing</p>
        <p className="text-sm text-muted font-sans mt-1 max-w-xs">
          Pricing configuration is restricted to the Administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-line shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-line">
        <h2 className="font-display font-semibold text-navy">Visa Pricing</h2>
        <p className="text-xs text-muted font-sans mt-0.5">AED and USD are set independently per visa type — not auto-converted.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-mist text-left">
              <th className="px-5 py-3 font-sans font-semibold text-muted text-xs uppercase tracking-wide">Visa Type</th>
              <th className="px-5 py-3 font-sans font-semibold text-muted text-xs uppercase tracking-wide">AED</th>
              <th className="px-5 py-3 font-sans font-semibold text-muted text-xs uppercase tracking-wide">USD</th>
              <th className="px-5 py-3 font-sans font-semibold text-muted text-xs uppercase tracking-wide">Express</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {list.map((visa) => (
              <VisaPricingRow key={visa.id} visa={visa} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
