"use client";

import { StepIndicator } from "./StepIndicator";
import { Step1VisaType } from "./steps/Step1VisaType";
import { Step2PersonalDetails, type PersonalDetails } from "./steps/Step2PersonalDetails";
import { Step3Documents, type DocumentSet } from "./steps/Step3Documents";
import { Step4Review } from "./steps/Step4Review";
import { Step5Success } from "./steps/Step5Success";
import { OrderSummary } from "./OrderSummary";
import type { VisaTypeData } from "@/types/visa";
import type { ProcessingTier } from "@/types/db";
import { useReducer, useCallback, useRef, useEffect } from "react";

/* ── State ────────────────────────────────────────────── */
interface FormState {
  step: number;
  visaTypeId: number | null;
  processingTier: ProcessingTier;
  details: PersonalDetails;
  documents: DocumentSet;
  errors: Record<string, string>;
  submitting: boolean;
  applicationId: string | null;
}

const initialDetails: PersonalDetails = {
  nationality: "",
  given_name: "",
  surname: "",
  email: "",
  passport_number: "",
  date_of_birth: "",
  passport_expiry: "",
  travel_date: "",
};

const initialDocuments: DocumentSet = {
  passport_copy: null,
  photo: null,
  supporting: null,
};

type Action =
  | { type: "SET_STEP"; step: number }
  | { type: "SET_VISA_TYPE"; id: number }
  | { type: "SET_TIER"; tier: ProcessingTier }
  | { type: "SET_DETAIL"; field: keyof PersonalDetails; value: string }
  | { type: "SET_DOCUMENT"; docType: keyof DocumentSet; file: File | null }
  | { type: "SET_ERRORS"; errors: Record<string, string> }
  | { type: "SET_SUBMITTING"; value: boolean }
  | { type: "SET_SUCCESS"; applicationId: string };

function reducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.step, errors: {} };
    case "SET_VISA_TYPE":
      return { ...state, visaTypeId: action.id };
    case "SET_TIER":
      return { ...state, processingTier: action.tier };
    case "SET_DETAIL":
      return {
        ...state,
        details: { ...state.details, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: "" },
      };
    case "SET_DOCUMENT":
      return {
        ...state,
        documents: { ...state.documents, [action.docType]: action.file },
        errors: { ...state.errors, [action.docType]: "" },
      };
    case "SET_ERRORS":
      return { ...state, errors: action.errors };
    case "SET_SUBMITTING":
      return { ...state, submitting: action.value };
    case "SET_SUCCESS":
      return {
        ...state,
        step: 5,
        submitting: false,
        applicationId: action.applicationId,
      };
    default:
      return state;
  }
}

/* ── Validation ───────────────────────────────────────── */
function validateStep2(details: PersonalDetails) {
  const errs: Record<string, string> = {};
  if (!details.given_name.trim()) errs.given_name = "Required";
  if (!details.surname.trim()) errs.surname = "Required";
  if (!details.email.trim()) errs.email = "Required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) errs.email = "Invalid email";
  if (!details.nationality.trim()) errs.nationality = "Required";
  if (!details.passport_number.trim()) errs.passport_number = "Required";
  if (!details.date_of_birth) errs.date_of_birth = "Required";
  if (!details.passport_expiry) errs.passport_expiry = "Required";
  if (!details.travel_date) errs.travel_date = "Required";
  return errs;
}

function validateStep3(documents: DocumentSet) {
  const errs: Record<string, string> = {};
  if (!documents.passport_copy) errs.passport_copy = "Passport copy is required";
  if (!documents.photo) errs.photo = "Photo is required";
  return errs;
}

/* ── Component ────────────────────────────────────────── */
interface ApplicationFormProps {
  visaTypes: VisaTypeData[];
  prefilledVisaTypeId?: number | null;
  prefilledNationality?: string;
  prefilledTravelDate?: string;
}

export function ApplicationForm({
  visaTypes,
  prefilledVisaTypeId,
  prefilledNationality,
  prefilledTravelDate,
}: ApplicationFormProps) {
  const stepRef = useRef<HTMLDivElement>(null);

  const [state, dispatch] = useReducer(reducer, {
    step: 1,
    visaTypeId: prefilledVisaTypeId ?? null,
    processingTier: "standard",
    details: {
      ...initialDetails,
      nationality: prefilledNationality ?? "",
      travel_date: prefilledTravelDate ?? "",
    },
    documents: initialDocuments,
    errors: {},
    submitting: false,
    applicationId: null,
  });

  const selectedVisaType = visaTypes.find((v) => v.id === state.visaTypeId) ?? null;

  // Scroll to step indicator on step change (with offset for sticky header)
  useEffect(() => {
    if (stepRef.current) {
      const y = stepRef.current.getBoundingClientRect().top + window.scrollY - 72; // 72px offset
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [state.step]);

  const handleStep1Next = useCallback(() => {
    if (!state.visaTypeId) {
      dispatch({ type: "SET_ERRORS", errors: { visa: "Please select a visa type" } });
      return;
    }
    dispatch({ type: "SET_STEP", step: 2 });
  }, [state.visaTypeId]);

  const handleStep2Next = useCallback(() => {
    const errs = validateStep2(state.details);
    if (Object.keys(errs).length > 0) {
      dispatch({ type: "SET_ERRORS", errors: errs });
      return;
    }
    dispatch({ type: "SET_STEP", step: 3 });
  }, [state.details]);

  const handleStep3Next = useCallback(() => {
    const errs = validateStep3(state.documents);
    if (Object.keys(errs).length > 0) {
      dispatch({ type: "SET_ERRORS", errors: errs });
      return;
    }
    dispatch({ type: "SET_STEP", step: 4 });
  }, [state.documents]);

  const handleSubmit = useCallback(async () => {
    if (!selectedVisaType) return;
    dispatch({ type: "SET_SUBMITTING", value: true });

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visa_type_slug: selectedVisaType.slug,
          nationality: state.details.nationality,
          given_name: state.details.given_name,
          surname: state.details.surname,
          passport_number: state.details.passport_number,
          date_of_birth: state.details.date_of_birth,
          passport_expiry: state.details.passport_expiry,
          travel_date: state.details.travel_date,
          processing_tier: state.processingTier,
          applicant_email: state.details.email || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        dispatch({ type: "SET_ERRORS", errors: { submit: err.error ?? "Submission failed" } });
        dispatch({ type: "SET_SUBMITTING", value: false });
        return;
      }

      const { checkout_url, application_id } = await res.json();

      /* Upload documents (fire-and-forget before redirect) */
      for (const [docType, file] of Object.entries(state.documents)) {
        if (!file) continue;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("document_type", docType);
        await fetch(`/api/applications/${application_id}/documents`, {
          method: "POST",
          body: formData,
        }).catch(() => null);
      }

      window.location.href = checkout_url;
    } catch {
      dispatch({ type: "SET_ERRORS", errors: { submit: "Something went wrong. Please try again." } });
      dispatch({ type: "SET_SUBMITTING", value: false });
    }
  }, [state, selectedVisaType]);

  return (
    <div className="w-full space-y-6">
      {/* Step indicator — white card */}
      {state.step < 5 && (
        <div ref={stepRef} className="rounded-2xl border border-line bg-white p-6">
          <StepIndicator currentStep={state.step} />
        </div>
      )}

      {/* Two-column layout for steps 1–4 */}
      {state.step < 5 ? (
        <div className="rounded-2xl border border-line bg-white p-6 lg:p-8 flex flex-col lg:flex-row gap-8">
          {/* Main form */}
          <div className="flex-1 min-w-0 max-w-2xl">
            {state.errors.submit && (
              <p className="mb-4 text-sm text-danger font-sans bg-danger/10 border border-danger/20 rounded-lg px-4 py-3">
                {state.errors.submit}
              </p>
            )}

            {state.step === 1 && (
              <Step1VisaType
                visaTypes={visaTypes}
                selectedVisaTypeId={state.visaTypeId}
                processingTier={state.processingTier}
                onVisaTypeChange={(id) => dispatch({ type: "SET_VISA_TYPE", id })}
                onTierChange={(tier) => dispatch({ type: "SET_TIER", tier })}
                onNext={handleStep1Next}
                error={state.errors.visa}
                nationality={state.details.nationality}
                onNationalityChange={(value) =>
                  dispatch({ type: "SET_DETAIL", field: "nationality", value })
                }
                travelDate={state.details.travel_date}
                onTravelDateChange={(value) =>
                  dispatch({ type: "SET_DETAIL", field: "travel_date", value })
                }
              />
            )}

            {state.step === 2 && (
              <Step2PersonalDetails
                details={state.details}
                errors={state.errors}
                onChange={(field, value) =>
                  dispatch({ type: "SET_DETAIL", field, value })
                }
                onBack={() => dispatch({ type: "SET_STEP", step: 1 })}
                onNext={handleStep2Next}
              />
            )}

            {state.step === 3 && (
              <Step3Documents
                documents={state.documents}
                errors={state.errors}
                onFile={(docType, file) =>
                  dispatch({ type: "SET_DOCUMENT", docType, file })
                }
                onBack={() => dispatch({ type: "SET_STEP", step: 2 })}
                onNext={handleStep3Next}
              />
            )}

            {state.step === 4 && selectedVisaType && (
              <Step4Review
                visaType={selectedVisaType}
                processingTier={state.processingTier}
                details={state.details}
                documents={state.documents}
                submitting={state.submitting}
                onBack={() => dispatch({ type: "SET_STEP", step: 3 })}
                onEdit={(step) => dispatch({ type: "SET_STEP", step })}
                onSubmit={handleSubmit}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <OrderSummary
              visaType={selectedVisaType}
              processingTier={state.processingTier}
            />
          </div>
        </div>
      ) : (
        /* Step 5 — success, centered */
        state.applicationId && (
          <Step5Success applicationId={state.applicationId} />
        )
      )}
    </div>
  );
}
