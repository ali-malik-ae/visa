"use client";

import { CheckCircle, Phone, Shield } from "lucide-react";
import type { VisaTypeData } from "@/types/visa";
import type { ProcessingTier } from "@/types/db";
import { formatAed } from "@/lib/utils";
import { EXPRESS_SURCHARGE_AED, WHATSAPP_URL } from "@/lib/constants";

interface OrderSummaryProps {
  visaType: VisaTypeData | null;
  processingTier: ProcessingTier;
}

export function OrderSummary({ visaType, processingTier }: OrderSummaryProps) {
  if (!visaType) {
    return (
      <div className="sticky top-6">
        <h3 className="text-xs font-sans font-semibold uppercase tracking-wider text-blue mb-4">
          Order Summary
        </h3>
        <p className="text-sm font-sans text-muted">
          Select a visa type to see pricing details.
        </p>

        {/* Guarantee placeholder */}
        <div className="flex items-start gap-3 mt-5 rounded-xl bg-navy px-4 py-4">
          <Shield className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-sans font-semibold text-white mb-1">
              100% refund on rejection.
            </p>
            <p className="text-xs font-sans text-white/80 leading-relaxed">
              If your visa is rejected in violation with our policy, we refund the full fee. No questions.
            </p>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 mt-5 rounded-xl bg-whatsapp/10 border border-whatsapp/20 px-4 py-3 hover:bg-whatsapp/20 transition-colors"
        >
          <div className="h-10 w-10 rounded-full bg-whatsapp flex items-center justify-center flex-shrink-0">
            <Phone className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-sans font-semibold text-ink">Need Help?</p>
            <p className="text-xs font-sans text-muted">WhatsApp us immediately</p>
          </div>
        </a>
      </div>
    );
  }

  const price = visaType.standard_price_aed;
  const serviceFee = Math.round(price * 0.1);
  const total =
    processingTier === "express"
      ? price + EXPRESS_SURCHARGE_AED + serviceFee
      : price + serviceFee;

  return (
    <div className="sticky top-6">
      {/* Order Summary with grey background */}
      <div className="rounded-xl bg-mist p-5">
        <h3 className="text-xs font-sans font-semibold uppercase tracking-wider text-blue mb-4">
          Order Summary
        </h3>

        {/* Visa details */}
        <div className="pb-4 border-b border-line">
          <h4 className="font-display font-bold text-lg text-ink mb-1">
            {visaType.name}
          </h4>
          <p className="text-sm font-sans text-muted">
            {visaType.entry_type === "single" ? "Single entry" : "Multiple entry"} ·{" "}
            {processingTier === "express" ? "12–24h" : "24/7h"} processing
          </p>
        </div>

        {/* Price breakdown */}
        <div className="space-y-3 py-4 border-b border-line">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-sans text-muted">Visa Fee</span>
            <span className="text-sm font-sans font-medium text-ink">{formatAed(price)}</span>
          </div>
          {processingTier === "express" && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-sans text-muted">Express Surcharge</span>
              <span className="text-sm font-sans font-medium text-ink">
                {formatAed(EXPRESS_SURCHARGE_AED)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-sans text-muted">Service Fee</span>
            <span className="text-sm font-sans font-medium text-ink">{formatAed(serviceFee)}</span>
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between gap-3 pt-4">
          <span className="text-sm font-sans font-semibold text-ink">Total</span>
          <span className="text-xl font-display font-bold text-navy">
            {formatAed(total)}
          </span>
        </div>
      </div>

      {/* Guarantee — dark navy */}
      <div className="flex items-start gap-3 mt-4 rounded-xl bg-navy px-4 py-4">
        <Shield className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-sans font-semibold text-white mb-1">
            100% refund on rejection.
          </p>
          <p className="text-xs font-sans text-white/80 leading-relaxed">
            If your visa is rejected in violation with our policy, we refund the full fee. No questions.
          </p>
        </div>
      </div>

      {/* WhatsApp CTA */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 mt-4 rounded-xl bg-whatsapp/10 border border-whatsapp/20 px-4 py-3 hover:bg-whatsapp/20 transition-colors"
      >
        <div className="h-10 w-10 rounded-full bg-whatsapp flex items-center justify-center flex-shrink-0">
          <Phone className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-sans font-semibold text-ink">Need Help?</p>
          <p className="text-xs font-sans text-muted">WhatsApp us immediately</p>
        </div>
      </a>
    </div>
  );
}
