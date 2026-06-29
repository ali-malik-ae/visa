"use client";

import { DocumentUpload } from "@/components/ui/DocumentUpload";
import { Button } from "@/components/ui/Button";

export interface DocumentSet {
  passport_copy: File | null;
  photo: File | null;
  supporting: File | null;
}

interface Step3Props {
  documents: DocumentSet;
  errors: Partial<Record<keyof DocumentSet, string>>;
  onFile: (type: keyof DocumentSet, file: File | null) => void;
  onBack: () => void;
  onNext: () => void;
}

export function Step3Documents({
  documents,
  errors,
  onFile,
  onBack,
  onNext,
}: Step3Props) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-sans font-medium uppercase tracking-wider text-muted mb-2">
          Step 3 of 4
        </p>
        <h2 className="font-display font-bold text-2xl text-navy mb-1">
          Upload Documents
        </h2>
        <p className="text-sm text-muted font-sans">
          Upload clear scanned copies. PDF, JPG, or PNG — maximum 5 MB each.
        </p>
      </div>

      <div className="space-y-5">
        <DocumentUpload
          label="Passport Copy"
          required
          currentFile={documents.passport_copy}
          onFile={(f) => onFile("passport_copy", f)}
          error={errors.passport_copy}
        />
        <DocumentUpload
          label="Passport-Size Photo"
          required
          currentFile={documents.photo}
          onFile={(f) => onFile("photo", f)}
          error={errors.photo}
        />
        <DocumentUpload
          label="Supporting Document (optional)"
          currentFile={documents.supporting}
          onFile={(f) => onFile("supporting", f)}
          error={errors.supporting}
        />
      </div>

      <div className="rounded-lg bg-mist border border-line p-4">
        <p className="text-xs font-sans text-muted leading-relaxed">
          <strong className="text-ink">Requirements:</strong> Passport must be
          valid for 6+ months. Photo must be white background, recent, and
          clearly show your face. Supported formats: PDF, JPG, PNG.
        </p>
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
