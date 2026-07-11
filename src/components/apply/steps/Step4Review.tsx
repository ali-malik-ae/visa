"use client";

import { Button } from "@/components/ui/Button";
import { formatDualPrice } from "@/lib/utils";
import { useCurrency } from "@/components/CurrencyProvider";
import { EXPRESS_SURCHARGE_AED, EXPRESS_SURCHARGE_USD } from "@/lib/constants";
import type { VisaTypeData } from "@/types/visa";
import type { ProcessingTier } from "@/types/db";
import type { PersonalDetails } from "./Step2PersonalDetails";
import type { DocumentSet } from "./Step3Documents";
import { FileText, Pencil } from "lucide-react";

interface Step4Props {
  visaType: VisaTypeData;
  processingTier: ProcessingTier;
  details: PersonalDetails;
  documents: DocumentSet;
  submitting: boolean;
  onBack: () => void;
  onEdit: (step: number) => void;
  onSubmit: () => void;
}

function ReviewRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-line last:border-0">
      <span className="text-xs font-sans font-medium uppercase tracking-[0.06em] text-muted w-36 flex-shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm font-sans text-ink flex-1 min-w-0 break-words">
        {value}
      </span>
    </div>
  );
}

export function Step4Review({
  visaType,
  processingTier,
  details,
  documents,
  submitting,
  onBack,
  onEdit,
  onSubmit,
}: Step4Props) {
  const { showUsd } = useCurrency();
  const price =
    processingTier === "express"
      ? visaType.standard_price_aed + EXPRESS_SURCHARGE_AED
      : visaType.standard_price_aed;
  const priceUsd =
    processingTier === "express"
      ? visaType.standard_price_usd + EXPRESS_SURCHARGE_USD
      : visaType.standard_price_usd;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-sans font-medium uppercase tracking-wider text-muted mb-2">
          Step 4 of 4
        </p>
        <h2 className="font-display font-bold text-2xl text-navy mb-1">
          Review & Submit
        </h2>
        <p className="text-sm text-muted font-sans">
          Please review your details before submitting.
        </p>
      </div>

      {/* Visa section */}
      <div className="rounded-xl border border-line overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 bg-mist border-b border-line">
          <span className="text-sm font-sans font-medium text-ink">
            Visa Selection
          </span>
          <button
            onClick={() => onEdit(1)}
            className="inline-flex items-center gap-1.5 text-xs text-gold hover:underline"
          >
            <Pencil className="h-3 w-3" />
            Edit
          </button>
        </div>
        <div className="px-5">
          <ReviewRow label="Visa Type" value={visaType.name} />
          <ReviewRow
            label="Processing"
            value={
              processingTier === "express"
                ? "Express (12–24 hrs)"
                : "Standard (1–3 days)"
            }
          />
          <ReviewRow label="Entry Type" value={visaType.entry_type === "single" ? "Single Entry" : "Multiple Entry"} />
        </div>
      </div>

      {/* Personal details section */}
      <div className="rounded-xl border border-line overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 bg-mist border-b border-line">
          <span className="text-sm font-sans font-medium text-ink">
            Personal Details
          </span>
          <button
            onClick={() => onEdit(2)}
            className="inline-flex items-center gap-1.5 text-xs text-gold hover:underline"
          >
            <Pencil className="h-3 w-3" />
            Edit
          </button>
        </div>
        <div className="px-5">
          <ReviewRow label="Full Name" value={`${details.given_name} ${details.surname}`} />
          <ReviewRow label="Email" value={details.email} />
          <ReviewRow label="Nationality" value={details.nationality} />
          <ReviewRow label="Passport No." value={details.passport_number} />
          <ReviewRow label="Date of Birth" value={details.date_of_birth} />
          <ReviewRow label="Passport Expiry" value={details.passport_expiry} />
          <ReviewRow label="Travel Date" value={details.travel_date} />
        </div>
      </div>

      {/* Documents section */}
      <div className="rounded-xl border border-line overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 bg-mist border-b border-line">
          <span className="text-sm font-sans font-medium text-ink">
            Documents
          </span>
          <button
            onClick={() => onEdit(3)}
            className="inline-flex items-center gap-1.5 text-xs text-gold hover:underline"
          >
            <Pencil className="h-3 w-3" />
            Edit
          </button>
        </div>
        <div className="px-5 py-3 space-y-2">
          {Object.entries(documents).map(([type, file]) =>
            file ? (
              <div key={type} className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gold flex-shrink-0" />
                <span className="text-sm font-sans text-ink truncate flex-1 min-w-0">
                  {file.name}
                </span>
                <span className="text-xs text-muted font-sans flex-shrink-0">
                  {(file.size / 1024).toFixed(0)} KB
                </span>
              </div>
            ) : null
          )}
        </div>
      </div>

      {/* Price summary */}
      <div className="rounded-xl border border-gold/20 bg-gold/5 px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-sans text-muted uppercase tracking-wider">
            Total Amount
          </p>
          <p className="text-2xl font-display font-bold text-navy mt-0.5">
            {formatDualPrice(showUsd, price, priceUsd)}
          </p>
        </div>
        <p className="text-xs font-sans text-muted">
          You will be redirected to Stripe to complete payment.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 pt-2 flex-wrap">
        <Button variant="ghost" size="md" onClick={onBack}>
          Back
        </Button>
        <Button
          variant="gold"
          size="lg"
          onClick={onSubmit}
          loading={submitting}
        >
          Pay & Submit
        </Button>
      </div>
    </div>
  );
}
