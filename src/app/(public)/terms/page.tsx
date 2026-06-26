import { BRAND, CONTACT } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing the use of Visati visa consultancy services.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-mist pt-28 pb-16 px-4">
      <div className="mx-auto max-w-3xl bg-white rounded-2xl border border-line p-8 lg:p-10 shadow-sm">
        <h1 className="font-display font-bold text-3xl text-navy mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-muted font-sans mb-8">
          Last updated {new Date().toLocaleDateString("en-AE", { month: "long", year: "numeric" })}
        </p>

        <div className="space-y-6 text-sm text-ink font-sans leading-relaxed">
          <section>
            <h2 className="font-display font-semibold text-lg text-navy mb-2">1. Our Service</h2>
            <p>
              {BRAND.legalName} is a Dubai-based visa consultancy that assists with
              UAE visa applications. We are a facilitation service; final visa
              approval rests with UAE immigration authorities.
            </p>
          </section>
          <section>
            <h2 className="font-display font-semibold text-lg text-navy mb-2">2. Fees & Payment</h2>
            <p>
              Service fees are displayed before payment and charged at submission.
              Government processing fees are non-refundable. Express processing
              surcharges apply where selected.
            </p>
          </section>
          <section>
            <h2 className="font-display font-semibold text-lg text-navy mb-2">3. Applicant Responsibility</h2>
            <p>
              You are responsible for the accuracy of all submitted information and
              documents. Incorrect or fraudulent details may result in rejection
              without refund.
            </p>
          </section>
          <section>
            <h2 className="font-display font-semibold text-lg text-navy mb-2">4. Refunds</h2>
            <p>
              Where our 100% approval guarantee applies, service fees are refunded
              if a visa is rejected for reasons within our control. Government fees
              remain non-refundable.
            </p>
          </section>
          <section>
            <h2 className="font-display font-semibold text-lg text-navy mb-2">5. Contact</h2>
            <p>
              Questions about these terms?{" "}
              <a href={`mailto:${CONTACT.email}`} className="text-gold hover:underline">
                {CONTACT.email}
              </a>
              . Trade Licence {CONTACT.tradeLicence}.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
