import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const STEPS = [
  { id: 1, label: "Visa Selection" },
  { id: 2, label: "Personal Details" },
  { id: 3, label: "Documents" },
  { id: 4, label: "Review & Submit" },
];

interface StepIndicatorProps {
  currentStep: number;
  className?: string;
}

export function StepIndicator({ currentStep, className }: StepIndicatorProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-start justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-4 left-[calc(12.5%+8px)] right-[calc(12.5%+8px)] h-0.5 bg-line" />
        <div
          className="absolute top-4 left-[calc(12.5%+8px)] h-0.5 bg-navy transition-all duration-300"
          style={{
            width: `${((Math.min(currentStep, 4) - 1) / 3) * (100 - 25)}%`,
          }}
        />

        {STEPS.map((step) => {
          const isDone = currentStep > step.id;
          const isActive = currentStep === step.id;
          return (
            <div
              key={step.id}
              className="flex flex-col items-center gap-2 relative z-10 w-1/4"
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center border-2 transition-colors text-sm font-mono font-medium",
                  isDone && "bg-navy border-navy text-white",
                  isActive && "bg-navy border-navy text-white",
                  !isDone && !isActive && "bg-white border-line text-muted"
                )}
              >
                {isDone ? (
                  <Check className="h-4 w-4" />
                ) : (
                  step.id
                )}
              </div>
              <div className="text-center">
                <span className="text-[10px] font-sans text-muted uppercase tracking-wider block">
                  Step {step.id}
                </span>
                <span
                  className={cn(
                    "text-xs font-sans font-medium whitespace-nowrap hidden sm:block",
                    isActive && "text-ink",
                    isDone && "text-ink",
                    !isDone && !isActive && "text-muted"
                  )}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
