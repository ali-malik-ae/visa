import { CONTACT } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How Visati uses cookies and similar technologies.",
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-mist pt-28 pb-16 px-4">
      <div className="mx-auto max-w-3xl bg-white rounded-2xl border border-line p-8 lg:p-10 shadow-sm">
        <h1 className="font-display font-bold text-3xl text-navy mb-2">
          Cookie Policy
        </h1>
        <p className="text-sm text-muted font-sans mb-8">
          Last updated {new Date().toLocaleDateString("en-AE", { month: "long", year: "numeric" })}
        </p>

        <div className="space-y-6 text-sm text-ink font-sans leading-relaxed">
          <section>
            <h2 className="font-display font-semibold text-lg text-navy mb-2">Essential Cookies</h2>
            <p>
              We use strictly necessary cookies to operate the site — including
              secure session cookies for admin authentication and to maintain your
              application progress. These cannot be disabled.
            </p>
          </section>
          <section>
            <h2 className="font-display font-semibold text-lg text-navy mb-2">Analytics</h2>
            <p>
              We may use privacy-respecting analytics to understand how visitors
              use our site so we can improve it. No personally identifiable
              information is shared with advertisers.
            </p>
          </section>
          <section>
            <h2 className="font-display font-semibold text-lg text-navy mb-2">Managing Cookies</h2>
            <p>
              You can control or delete cookies through your browser settings.
              Disabling essential cookies may prevent parts of the site from
              functioning. Questions?{" "}
              <a href={`mailto:${CONTACT.email}`} className="text-gold hover:underline">
                {CONTACT.email}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
