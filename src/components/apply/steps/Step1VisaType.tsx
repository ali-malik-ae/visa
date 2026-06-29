"use client";

import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { Dropdown } from "@/components/ui/Dropdown";
import { NationalityDropdown } from "@/components/ui/NationalityDropdown";
import type { VisaTypeData } from "@/types/visa";
import type { ProcessingTier } from "@/types/db";

interface Step1Props {
  visaTypes: VisaTypeData[];
  selectedVisaTypeId: number | null;
  processingTier: ProcessingTier;
  onVisaTypeChange: (id: number) => void;
  onTierChange: (tier: ProcessingTier) => void;
  onNext: () => void;
  error?: string;
  nationality?: string;
  onNationalityChange?: (value: string) => void;
  travelDate?: string;
  onTravelDateChange?: (value: string) => void;
}

export function Step1VisaType({
  visaTypes,
  selectedVisaTypeId,
  processingTier,
  onVisaTypeChange,
  onTierChange,
  onNext,
  error,
  nationality = "",
  onNationalityChange,
  travelDate = "",
  onTravelDateChange,
}: Step1Props) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-sans font-medium uppercase tracking-wider text-muted mb-2">
          Step 1 of 4
        </p>
        <h2 className="font-display font-bold text-2xl text-navy mb-1">
          Tell us about your trip
        </h2>
      </div>

      {error && (
        <p className="text-sm text-danger font-sans bg-danger/10 border border-danger/20 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <div className="space-y-5">
        {/* Nationality with map illustration */}
        <div className="relative">
          <div className="absolute -top-4 -right-4 w-32 h-20 opacity-20 pointer-events-none hidden sm:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/world-map.svg"
              alt=""
              className="w-full h-full object-contain"
            />
          </div>
          <NationalityDropdown
            label="Nationality"
            value={nationality}
            onChange={(val) => onNationalityChange?.(val)}
          />
          <p className="text-xs text-muted font-sans mt-1.5">
            As shown on your passport
          </p>
        </div>

        {/* Visa Type */}
        <div>
          <Dropdown
            label="Visa Type"
            value={selectedVisaTypeId?.toString() ?? ""}
            onChange={(val) => {
              const id = parseInt(val, 10);
              if (!isNaN(id)) onVisaTypeChange(id);
            }}
            options={[
              { value: "", label: "Select visa type" },
              ...visaTypes.map((v) => ({
                value: v.id.toString(),
                label: `${v.name} - ${v.entry_type === "single" ? "Single Entry" : "Multiple Entry"}`,
              })),
            ]}
          />
          <p className="text-xs text-muted font-sans mt-1.5">
            Pick the closest match — we&apos;ll refine in step 4
          </p>
        </div>

        {/* Travel Date */}
        <DatePicker
          label="Travel Date"
          value={travelDate}
          onChange={(v) => onTravelDateChange?.(v)}
          min={today}
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button
          variant="gold"
          size="lg"
          onClick={onNext}
          disabled={!selectedVisaTypeId}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
