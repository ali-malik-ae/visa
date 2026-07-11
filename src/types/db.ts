export type ProcessingTier = "standard" | "express";
export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "reviewing"
  | "processing"
  | "approved"
  | "rejected";
export type EntryType = "single" | "multiple";
export type PaymentStatus = "pending" | "succeeded" | "failed";

export interface VisaType {
  id: number;
  slug: string;
  name: string;
  entry_type: EntryType;
  duration_days: number;
  standard_price_aed: number;
  standard_price_usd: number;
  has_express: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  visa_type_id: number;
  nationality: string;
  given_name: string;
  surname: string;
  passport_number: string;
  date_of_birth: string;
  passport_expiry: string;
  travel_date: string;
  processing_tier: ProcessingTier;
  status: ApplicationStatus;
  stripe_payment_intent_id: string | null;
  amount_paid_aed: number | null;
  created_at: string;
  updated_at: string;
}

export interface StatusHistory {
  id: number;
  application_id: string;
  status: ApplicationStatus;
  note: string | null;
  changed_by_admin_id: string | null;
  created_at: string;
}

export interface Document {
  id: number;
  application_id: string;
  document_type: string;
  r2_key: string;
  filename: string;
  size_bytes: number;
  uploaded_at: string;
}

export interface Payment {
  id: number;
  application_id: string;
  stripe_payment_intent_id: string;
  amount_aed: number;
  status: PaymentStatus;
  created_at: string;
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  resolved: boolean;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  created_at: string;
}
