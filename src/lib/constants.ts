/* ── Contact Details ─────────────────────────────────── */
export const CONTACT = {
  whatsapp: "971585542344",
  whatsappText: "Hello Visati, I'd like to enquire about a UAE visa.",
  whatsappReplyTime: "Average reply 2 min",
  email: "visa@visati.ae",
  emailReplyTime: "Reply within 1 hour",
  adminEmail: "admin@visati.ae",
  phone: "+971 58 554 2344",
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
  clientCount: "1,000+",
  approvalRate: "99%",
  avgProcessing: "24–72h",
  countriesServed: "184",
  visasProcessed: "1,000+",
  googleReviews: "100+",
};

/* ── Stats Data (centralized for reuse) ──────────────── */
import {
  Globe,
  Users,
  CheckCircle,
  Star,
  Clock,
} from "lucide-react";
import type { ComponentType } from "react";

type StatItem =
  | { type: "countup"; end: number; prefix?: string; suffix?: string; locale?: string; decimals?: number; label: string; Icon: ComponentType<{ className?: string; strokeWidth?: number }> }
  | { type: "static"; value: string; label: string; Icon: ComponentType<{ className?: string; strokeWidth?: number }> };

export const HERO_STATS: StatItem[] = [
  { type: "countup", end: 1000, suffix: "+", label: "Happy Travelers", Icon: Users },
  { type: "countup", end: 99, suffix: "%", label: "Approval Rate", Icon: CheckCircle },
  { type: "static", value: BRAND.avgProcessing, label: "Avg. Processing", Icon: Clock },
  { type: "countup", end: 100, suffix: "+", label: "Google Reviews", Icon: Star },
];

export const GLOBAL_STATS: StatItem[] = [
  { type: "countup", end: 1000, suffix: "+", label: "Happy Travelers", Icon: Users },
  { type: "countup", end: 99, suffix: "%", label: "Approval Rate", Icon: CheckCircle },
  { type: "countup", end: 100, suffix: "+", label: "Google Reviews", Icon: Star },
  { type: "countup", end: 4.9, decimals: 1, suffix: "/5", label: "Customer Rating", Icon: Globe },
];

export const ABOUT_STATS: StatItem[] = [
  { type: "countup", end: 1000, suffix: "+", label: "Happy Travelers", Icon: Users },
  { type: "countup", end: 99, suffix: "%", label: "Approval Rate", Icon: CheckCircle },
  { type: "countup", end: 100, suffix: "+", label: "Google Reviews", Icon: Star },
  { type: "static", value: BRAND.avgProcessing, label: "Avg. Processing", Icon: Clock },
];

/* ── Express Surcharge ────────────────────────────────── */
export const EXPRESS_SURCHARGE_AED = 99;
export const EXPRESS_SURCHARGE_USD = 27;
