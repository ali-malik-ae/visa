import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ApplicationForm } from "@/components/apply/ApplicationForm";
import { Step5Success } from "@/components/apply/steps/Step5Success";
import { getDisplayVisaTypes } from "@/lib/visa-data";
import { getPageSeo } from "@/lib/sanity/client";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("apply").catch(() => null);
  return {
    title: seo?.title || "Apply for UAE Visa",
    description: seo?.description || "Complete your UAE visa application online in minutes. Secure, fast, and trusted.",
  };
}

interface ApplyPageProps {
  searchParams: Promise<{
    visa?: string;
    nationality?: string;
    date?: string;
    success?: string;
    id?: string;
  }>;
}

export default async function ApplyPage({ searchParams }: ApplyPageProps) {
  const params = await searchParams;

  if (params.success === "1" && params.id) {
    return (
      <div className="min-h-screen bg-mist pt-28 pb-12 px-4">
        <div className="mx-auto max-w-2xl">
          <Step5Success applicationId={params.id} />
        </div>
      </div>
    );
  }

  const visaTypes = await getDisplayVisaTypes();
  const prefilledVisa = visaTypes.find((v) => v.slug === params.visa) ?? null;

  return (
    <div className="min-h-screen bg-mist">
      {/* Header */}
      <section className="pt-28 pb-10 px-4">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted font-sans hover:text-ink transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <h1 className="font-display font-bold text-3xl lg:text-4xl text-ink mb-2">
            Apply for your UAE visa.
          </h1>
          <p className="text-muted font-sans text-sm">
            Four short steps &middot; Roughly 4 minutes &middot; Auto-saved as you go
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="pb-16 px-4">
        <div className="mx-auto max-w-6xl">
          <ApplicationForm
            visaTypes={visaTypes}
            prefilledVisaTypeId={prefilledVisa?.id ?? null}
            prefilledNationality={params.nationality}
            prefilledTravelDate={params.date}
          />
        </div>
      </section>
    </div>
  );
}
