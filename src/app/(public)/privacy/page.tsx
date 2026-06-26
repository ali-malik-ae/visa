import { BRAND, CONTACT } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Visati collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-mist pt-28 pb-16 px-4">
      <div className="mx-auto max-w-3xl bg-white rounded-2xl border border-line p-8 lg:p-10 shadow-sm">
        <h1 className="font-display font-bold text-3xl text-navy mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted font-sans mb-8">
          Last updated {new Date().toLocaleDateString("en-AE", { month: "long", year: "numeric" })}
        </p>

        <div className="space-y-6 text-sm text-ink font-sans leading-relaxed">
          <section>
            <h2 className="font-display font-semibold text-lg text-navy mb-2">1. Data We Collect</h2>
            <p>
              We collect the personal information you provide when applying for a
              visa: name, nationality, passport details, travel dates, contact
              email, and uploaded documents (passport copy, photo, supporting
              documents). We also collect payment information processed securely
              by Stripe.
            </p>
          </section>
          <section>
            <h2 className="font-display font-semibold text-lg text-navy mb-2">2. How We Use Your Data</h2>
            <p>
              Your data is used solely to process your UAE visa application,
              communicate status updates, and meet legal and immigration
              requirements. We never sell your personal information to third
              parties.
            </p>
          </section>
          <section>
            <h2 className="font-display font-semibold text-lg text-navy mb-2">3. Data Security</h2>
            <p>
              Documents are stored in encrypted cloud storage with access via
              time-limited signed URLs. Payment processing is handled by Stripe
              (PCI DSS Level 1 compliant). We retain application data only as long
              as required for processing and legal compliance.
            </p>
          </section>
          <section>
            <h2 className="font-display font-semibold text-lg text-navy mb-2">4. Contact</h2>
            <p>
              For privacy questions or data deletion requests, contact us at{" "}
              <a href={`mailto:${CONTACT.email}`} className="text-gold hover:underline">
                {CONTACT.email}
              </a>
              . {BRAND.legalName}, {CONTACT.office}.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
