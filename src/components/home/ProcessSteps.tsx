import { FadeIn } from "@/components/ui/FadeIn";

const STEPS = [
  {
    step: "01",
    title: "Choose Visa",
    description: "Select the visa type that matches your travel plans.",
  },
  {
    step: "02",
    title: "Submit Details",
    description: "Fill in your personal information and upload documents.",
  },
  {
    step: "03",
    title: "We Process",
    description: "Our team reviews and submits to immigration authorities.",
  },
  {
    step: "04",
    title: "Travel Ready",
    description: "Receive your approved visa by email. Ready to go.",
  },
];

export function ProcessSteps() {
  return (
    <section className="py-16 lg:py-24 bg-mist">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-14">
            <p className="text-xs font-sans font-semibold uppercase tracking-widest text-gold mb-3">
              The Process
            </p>
            <h2 className="font-display font-bold text-3xl lg:text-5xl text-navy">
              Four simple steps.
            </h2>
          </div>
        </FadeIn>

        {/* Mobile: stacked list */}
        <div className="lg:hidden space-y-4">
          {STEPS.map((s, i) => (
            <FadeIn key={s.step} delay={i * 100} direction="left">
              <div className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5">
                <span className="font-display text-2xl font-bold text-gold w-10 flex-shrink-0">
                  {s.step}
                </span>
                <div>
                  <h3 className="font-display font-bold text-lg text-navy">
                    {s.title}
                  </h3>
                  <p className="text-sm font-sans text-muted mt-1 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Desktop: 4-col with connecting line */}
        <div className="hidden lg:grid grid-cols-4 gap-x-4 relative">
          <div className="absolute top-7 left-[12.5%] right-[12.5%] h-px bg-line" />

          {STEPS.map((s, i) => (
            <FadeIn key={s.step} delay={i * 120} direction="up">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="relative z-10 h-14 w-14 rounded-full bg-white border border-line shadow-sm flex items-center justify-center">
                  <span className="font-display text-lg font-bold text-navy">
                    {s.step}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-navy">
                  {s.title}
                </h3>
                <p className="text-sm font-sans text-muted leading-relaxed max-w-[14rem]">
                  {s.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
