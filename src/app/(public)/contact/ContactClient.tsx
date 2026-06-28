"use client";

import { Button } from "@/components/ui/Button";
import { FormInput, FormTextarea } from "@/components/ui/FormInput";
import { Dropdown } from "@/components/ui/Dropdown";
import { FadeIn } from "@/components/ui/FadeIn";
import { CONTACT, WHATSAPP_URL } from "@/lib/constants";
import { Clock, Mail, MapPin, Phone, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useState } from "react";

interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const initial: FormState = {
  name: "",
  email: "",
  phone: "",
  subject: "General Inquiry",
  message: "",
};

const subjectOptions = [
  { value: "General Inquiry", label: "General Inquiry" },
  { value: "Visa Application", label: "Visa Application" },
  { value: "Visa Status", label: "Visa Status" },
  { value: "Pricing Question", label: "Pricing Question" },
  { value: "Partnership", label: "Partnership" },
  { value: "Other", label: "Other" },
];

export function ContactClient() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function set(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  }

  function validate() {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.subject.trim()) e.subject = "Required";
    if (form.message.trim().length < 10) e.message = "Message must be at least 10 characters";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setServerError(null);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          subject: form.subject.trim(),
          message: form.message.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setServerError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setSuccess(true);
        setForm(initial);
      }
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-28 pb-14 px-4">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left Column */}
          <div className="space-y-8">
            <FadeIn direction="left" delay={0}>
              <div>
                <p className="text-gold text-xs font-sans font-semibold uppercase tracking-widest mb-3">
                  Contact
                </p>
                <h1 className="font-display font-bold text-4xl lg:text-5xl text-ink mb-4">
                  Get in touch.
                </h1>
                <p className="text-muted font-sans text-sm leading-relaxed max-w-md">
                  Whether you&apos;re applying, tracking, or just exploring options —
                  our consultants are around. Pick the channel that suits you.
                </p>
              </div>
            </FadeIn>

            <FadeIn direction="left" delay={100}>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-whatsapp text-white font-sans font-semibold text-sm rounded-xl px-6 py-3 hover:bg-whatsapp-hover transition-colors"
              >
                <FaWhatsapp className="h-5 w-5" />
                WhatsApp &middot; {CONTACT.whatsappReplyTime}
              </a>
            </FadeIn>

            <FadeIn direction="left" delay={200}>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-gold/10 flex items-center justify-center">
                      <Mail className="h-4 w-4 text-gold" />
                    </div>
                    <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-muted">Email</span>
                  </div>
                  <a href={`mailto:${CONTACT.email}`} className="text-sm text-ink font-sans font-medium hover:underline break-all block">
                    {CONTACT.email}
                  </a>
                  <p className="text-xs text-muted font-sans mt-0.5">{CONTACT.emailReplyTime}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-gold/10 flex items-center justify-center">
                      <Phone className="h-4 w-4 text-gold" />
                    </div>
                    <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-muted">Phone</span>
                  </div>
                  <a href={`tel:${CONTACT.phone}`} className="text-sm text-ink font-sans font-medium hover:underline block">
                    {CONTACT.phone}
                  </a>
                  <p className="text-xs text-muted font-sans mt-0.5">{CONTACT.phoneHours}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-gold/10 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-gold" />
                    </div>
                    <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-muted">Office</span>
                  </div>
                  <p className="text-sm text-ink font-sans font-medium whitespace-pre-line">{CONTACT.office}</p>
                  <p className="text-xs text-muted font-sans mt-0.5">{CONTACT.officeNote}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-gold/10 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-gold" />
                    </div>
                    <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-muted">Hours</span>
                  </div>
                  <p className="text-sm text-ink font-sans font-medium whitespace-pre-line">{CONTACT.hours}</p>
                  <p className="text-xs text-muted font-sans mt-0.5">{CONTACT.hoursNote}</p>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={300}>
              <div className="rounded-2xl overflow-hidden border border-line h-56">
                <iframe
                  title="Visati Office — Boulevard Plaza Tower 1, Downtown Dubai"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.1835!2d55.2708!3d25.1972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f434f9d1e1a1b%3A0x1234567890abcdef!2sBoulevard%20Plaza%20Tower%201%2C%20Downtown%20Dubai!5e0!3m2!1sen!2sae!4v1700000000000!5m2!1sen!2sae"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-2xl"
                />
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Form */}
          <FadeIn direction="right" delay={200}>
            <div className="rounded-2xl bg-mist p-6 lg:p-8">
              <h2 className="font-display font-bold text-2xl text-ink mb-1">
                Send an inquiry.
              </h2>
              <p className="text-muted font-sans text-sm mb-6">
                For everything that isn&apos;t a live application.
              </p>

            {success ? (
              <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="h-4 w-4 text-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-sans font-semibold text-ink text-sm">Message sent</h3>
                      <button
                        onClick={() => setSuccess(false)}
                        className="text-muted hover:text-ink transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-muted font-sans text-sm mt-1">
                      We&apos;ve got it. Reply heading your way in under 60 min.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <FormInput
                  label="Full Name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  error={errors.name}
                  placeholder="James Whitfield"
                  autoComplete="name"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    error={errors.email}
                    placeholder="james.w@gmail.com"
                    autoComplete="email"
                  />
                  <FormInput
                    label="Phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+44"
                    autoComplete="tel"
                  />
                </div>
                <Dropdown
                  label="Subject"
                  options={subjectOptions}
                  value={form.subject}
                  onChange={(v) => set("subject", v)}
                  error={errors.subject}
                />
                <FormTextarea
                  label="Message"
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  error={errors.message}
                  placeholder="Hi — I'm planning a family trip in March and have a few questions about the 60-day tourist visa..."
                  rows={5}
                />
                {serverError && (
                  <p className="text-sm text-danger font-sans">{serverError}</p>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  className="w-full"
                >
                  Send Message &rarr;
                </Button>
                <p className="text-center text-xs text-muted font-sans">
                  We&apos;ll reply within 1 business hour.
                </p>
              </form>
            )}
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
