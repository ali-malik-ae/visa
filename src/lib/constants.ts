/* ── Contact Details ─────────────────────────────────── */
export const CONTACT = {
  whatsapp: "971000000000",
  whatsappText: "Hello Visati, I'd like to enquire about a UAE visa.",
  whatsappReplyTime: "Average reply 2 min",
  email: "concierge@visati.ae",
  emailReplyTime: "Reply within 1 hour",
  adminEmail: "admin@visati.ae",
  phone: "+971 4 1234 5678",
  phoneHours: "Sun–Thu, 9am–6pm GST",
  office: "Boulevard Plaza Tower 1\nDowntown Dubai, UAE",
  officeNote: "By appointment",
  hours: "Sunday — Thursday\n9:00 AM — 9:00 PM GST",
  hoursNote: "WhatsApp 24/7",
  tradeLicence: "DED-XXXX-XXXX",
};

export const WHATSAPP_URL = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(CONTACT.whatsappText)}`;

/* ── Social Media ────────────────────────────────────── */
export const SOCIAL = {
  instagram: "https://instagram.com/visati.ae",
  facebook: "https://facebook.com/visati.ae",
  twitter: "https://twitter.com/visatiuae",
  linkedin: "https://linkedin.com/company/visati",
};

/* ── Brand ───────────────────────────────────────────── */
export const BRAND = {
  name: "Visati",
  tagline: "Dubai Visas. Simplified.",
  description:
    "UAE visa consultancy. Concierge-grade processing for travellers and businesses.",
  legalName: "Visati Visa Services LLC",
  location: "Dubai, UAE",
  url: "https://visati.ae",
  rating: "4.9",
  clientCount: "15,000+",
  approvalRate: "98%",
  avgProcessing: "24–72h",
  countriesServed: "184",
  visasProcessed: "1,20,000+",
};

/* ── Stats Data (centralized for reuse) ──────────────── */
import {
  Globe,
  Users,
  CheckCircle,
  Star,
  Clock,
  Building2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import type { ComponentType } from "react";

type StatItem =
  | { type: "countup"; end: number; prefix?: string; suffix?: string; locale?: string; decimals?: number; label: string; Icon: ComponentType<{ className?: string; strokeWidth?: number }> }
  | { type: "static"; value: string; label: string; Icon: ComponentType<{ className?: string; strokeWidth?: number }> };

export const HERO_STATS: StatItem[] = [
  { type: "countup", end: 120000, suffix: "+", locale: "en-IN", label: "Visas Issued", Icon: Users },
  { type: "countup", end: 98, suffix: "%", label: "Approval Rate", Icon: CheckCircle },
  { type: "static", value: BRAND.avgProcessing, label: "Avg. Processing", Icon: Clock },
  { type: "countup", end: 184, label: "Countries Served", Icon: Globe },
];

export const GLOBAL_STATS: StatItem[] = [
  { type: "countup", end: 42, suffix: "+", label: "Countries Served", Icon: Globe },
  { type: "countup", end: 120000, suffix: "+", locale: "en-IN", label: "Visas Processed", Icon: Users },
  { type: "countup", end: 98, suffix: "%", label: "Approval Rate", Icon: CheckCircle },
  { type: "countup", end: 4.9, decimals: 1, suffix: "/5", label: "Customer Rating", Icon: Star },
];

export const ABOUT_STATS: StatItem[] = [
  { type: "countup", end: 15000, suffix: "+", locale: "en-IN", label: "Travellers served", Icon: Users },
  { type: "countup", end: 98, suffix: "%", label: "Approval rate", Icon: CheckCircle },
  { type: "countup", end: 184, label: "Countries served", Icon: Globe },
  { type: "static", value: BRAND.avgProcessing, label: "Avg. processing time", Icon: Clock },
];

/* ── Express Surcharge ────────────────────────────────── */
export const EXPRESS_SURCHARGE_AED = 99;
