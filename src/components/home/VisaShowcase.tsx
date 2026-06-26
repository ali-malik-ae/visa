import { VisaTypeCard } from "@/components/ui/VisaTypeCard";
import type { VisaType } from "@/types/db";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface VisaShowcaseProps {
  visaTypes: VisaType[];
}

export function VisaShowcase({ visaTypes }: VisaShowcaseProps) {
  const visas = visaTypes.slice(0, 6);

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-10">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold font-sans mb-3">
              Visa Types
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-navy leading-tight">
              Pick the visa that fits
              <br className="hidden sm:block" /> your trip.
            </h2>
          </div>
          <Link
            href="/visa-types"
            className="inline-flex items-center gap-1.5 text-sm font-sans font-semibold text-gold hover:underline flex-shrink-0"
          >
            Compare all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visas.map((visa) => (
            <VisaTypeCard key={visa.id} visa={visa} />
          ))}
        </div>
      </div>
    </section>
  );
}
