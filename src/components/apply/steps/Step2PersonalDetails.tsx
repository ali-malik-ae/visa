"use client";

import { FormInput } from "@/components/ui/FormInput";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";

export interface PersonalDetails {
  nationality: string;
  given_name: string;
  surname: string;
  email: string;
  passport_number: string;
  date_of_birth: string;
  passport_expiry: string;
  travel_date: string;
}

interface Step2Props {
  details: PersonalDetails;
  errors: Partial<Record<keyof PersonalDetails, string>>;
  onChange: (field: keyof PersonalDetails, value: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const today = new Date().toISOString().split("T")[0];

export function Step2PersonalDetails({
  details,
  errors,
  onChange,
  onBack,
  onNext,
}: Step2Props) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-sans font-medium uppercase tracking-wider text-muted mb-2">
          Step 2 of 4
        </p>
        <h2 className="font-display font-bold text-2xl text-navy mb-1">
          Personal Details
        </h2>
        <p className="text-sm text-muted font-sans">
          Enter your details exactly as they appear in your passport.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          label="Given Name"
          value={details.given_name}
          onChange={(e) => onChange("given_name", e.target.value)}
          error={errors.given_name}
          placeholder="As in passport"
          autoComplete="given-name"
        />
        <FormInput
          label="Surname"
          value={details.surname}
          onChange={(e) => onChange("surname", e.target.value)}
          error={errors.surname}
          placeholder="As in passport"
          autoComplete="family-name"
        />
        <FormInput
          label="Email Address"
          type="email"
          value={details.email}
          onChange={(e) => onChange("email", e.target.value)}
          error={errors.email}
          placeholder="confirmation@example.com"
          autoComplete="email"
          className="sm:col-span-2"
        />
        <FormInput
          label="Nationality"
          value={details.nationality}
          onChange={(e) => onChange("nationality", e.target.value)}
          error={errors.nationality}
          placeholder="e.g. Indian"
          autoComplete="country-name"
        />
        <FormInput
          label="Passport Number"
          value={details.passport_number}
          onChange={(e) =>
            onChange("passport_number", e.target.value.toUpperCase())
          }
          error={errors.passport_number}
          placeholder="e.g. A1234567"
          className="font-mono"
        />
        <DatePicker
          label="Date of Birth"
          value={details.date_of_birth}
          onChange={(v) => onChange("date_of_birth", v)}
          error={errors.date_of_birth}
          max={today}
        />
        <DatePicker
          label="Passport Expiry Date"
          value={details.passport_expiry}
          onChange={(v) => onChange("passport_expiry", v)}
          error={errors.passport_expiry}
          min={today}
        />
        <DatePicker
          label="Intended Travel Date"
          value={details.travel_date}
          onChange={(v) => onChange("travel_date", v)}
          error={errors.travel_date}
          min={today}
          className="sm:col-span-2"
        />
      </div>

      <div className="flex items-center justify-between gap-4 pt-2 flex-wrap">
        <Button variant="ghost" size="md" onClick={onBack}>
          Back
        </Button>
        <Button variant="gold" size="lg" onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
}
