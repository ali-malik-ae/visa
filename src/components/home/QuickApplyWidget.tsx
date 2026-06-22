"use client";

import type { VisaType } from "@/types/db";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Zap } from "lucide-react";
import { Dropdown } from "@/components/ui/Dropdown";
import { DatePickerDark } from "@/components/ui/DatePicker";
import { NationalityDropdown } from "@/components/ui/NationalityDropdown";

interface QuickApplyWidgetProps {
  visaTypes: VisaType[];
}

export function QuickApplyWidget({ visaTypes }: QuickApplyWidgetProps) {
  const router = useRouter();
  const [nationality, setNationality] = useState("");
  const [visaSlug, setVisaSlug] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const today = new Date().toISOString().split("T")[0];

  const visaOptions = visaTypes.map((v) => ({
    value: v.slug,
    label: v.name,
  }));

  function validate() {
    const errs: Record<string, string> = {};
    if (!nationality.trim()) errs.nationality = "Required";
    if (!visaSlug) errs.visaType = "Select a visa type";
    if (!travelDate) errs.travelDate = "Required";
    return errs;
  }

  function handleContinue() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const params = new URLSearchParams({
      visa: visaSlug,
      nationality,
      date: travelDate,
    });
    router.push(`/apply?${params.toString()}`);
  }

  const labelCls =
    "text-[11px] font-semibold uppercase tracking-widest text-white/50 font-sans";

  return (
    <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 shadow-2xl">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-blue font-sans mb-1.5">
            Quick Apply
          </p>
          <h3 className="font-display font-bold text-lg text-white leading-snug">
            Check eligibility in 30 sec
          </h3>
        </div>
        <span className="h-9 w-9 grid place-items-center rounded-lg bg-white/10 flex-shrink-0">
          <Zap className="h-4 w-4 text-white/70" />
        </span>
      </div>

      <div className="space-y-4">
        {/* Nationality */}
        <div className="flex flex-col gap-1.5">
          <NationalityDropdown
            value={nationality}
            onChange={(v) => {
              setNationality(v);
              setErrors((p) => ({ ...p, nationality: "" }));
            }}
            placeholder="Select nationality"
            error={errors.nationality}
            dark
          />
        </div>

        {/* Visa Type */}
        <div className="flex flex-col gap-1.5">
          <Dropdown
            label="Visa Type"
            options={visaOptions}
            value={visaSlug}
            onChange={(v) => {
              setVisaSlug(v);
              setErrors((p) => ({ ...p, visaType: "" }));
            }}
            placeholder="Select type"
            error={errors.visaType}
            dark
          />
        </div>

        {/* Travel Date */}
        <DatePickerDark
          label="Travel Date"
          value={travelDate}
          onChange={(v) => {
            setTravelDate(v);
            setErrors((p) => ({ ...p, travelDate: "" }));
          }}
          min={today}
          error={errors.travelDate}
        />

        <button
          onClick={handleContinue}
          className="w-full h-12 rounded-xl bg-blue text-white font-semibold font-sans text-sm flex items-center justify-center gap-2 hover:bg-blue-hover transition-colors"
        >
          Continue
          <ArrowRight className="h-4 w-4 flex-shrink-0" />
        </button>

        <p className="flex items-center justify-center gap-1.5 text-xs text-white/40 font-sans">
          <Lock className="h-3 w-3 flex-shrink-0" />
          Encrypted &amp; secure · No payment now
        </p>
      </div>
    </div>
  );
}
