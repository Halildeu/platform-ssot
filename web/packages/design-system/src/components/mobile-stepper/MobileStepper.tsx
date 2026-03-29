import React from "react";
import { cn } from "../../utils/cn";
import { resolveAccessState, type AccessControlledProps } from "../../internal/access-controller";

/* ------------------------------------------------------------------ */
/*  MobileStepper — Compact stepper for small viewport scenarios       */
/* ------------------------------------------------------------------ */

export type MobileStepperVariant = "dots" | "text" | "progress";
export type MobileStepperSize = "sm" | "md" | "lg";
export type MobileStepperPosition = "static" | "bottom";

export interface MobileStepperProps extends AccessControlledProps {
  /** Current active step index (0-based). */
  activeStep: number;
  /** Total number of steps. */
  steps: number;
  /** Display variant: dot indicators, text counter, or progress bar. */
  variant?: MobileStepperVariant;
  /** Position: static (inline) or fixed to bottom. */
  position?: MobileStepperPosition;
  /** Size variant. */
  size?: MobileStepperSize;
  /** Callback fired when Next is clicked. */
  onNext?: () => void;
  /** Callback fired when Back is clicked. */
  onBack?: () => void;
  /** Label for the Next button. */
  nextLabel?: string;
  /** Label for the Back button. */
  backLabel?: string;
  /** Additional CSS class. */
  className?: string;
  /** Test ID for the root element. */
  "data-testid"?: string;
}

const sizeMap: Record<MobileStepperSize, { dot: string; bar: string; text: string; btn: string; gap: string }> = {
  sm: { dot: "h-1.5 w-1.5", bar: "h-1", text: "text-xs", btn: "px-2 py-1 text-xs", gap: "gap-1" },
  md: { dot: "h-2 w-2", bar: "h-1.5", text: "text-sm", btn: "px-3 py-1.5 text-sm", gap: "gap-1.5" },
  lg: { dot: "h-2.5 w-2.5", bar: "h-2", text: "text-base", btn: "px-4 py-2 text-base", gap: "gap-2" },
};

/**
 * MobileStepper — compact step indicator for mobile/narrow viewports.
 *
 * Three variants:
 * - **dots** — dot indicators showing progress
 * - **text** — "Step 2 / 5" text counter
 * - **progress** — progress bar
 */
export const MobileStepper: React.FC<MobileStepperProps> = ({
  activeStep,
  steps,
  variant = "dots",
  position = "static",
  size = "md",
  onNext,
  onBack,
  nextLabel = "İleri",
  backLabel = "Geri",
  className,
  "data-testid": testId,
  ...accessProps
}) => {
  const accessState = resolveAccessState(accessProps);
  const isDisabled = accessState === "disabled" || accessState === "hidden";
  const isReadOnly = accessState === "readonly";
  const isHidden = accessState === "hidden";

  if (isHidden) return null;

  const s = sizeMap[size];
  const isFirst = activeStep <= 0;
  const isLast = activeStep >= steps - 1;

  const positionClass = position === "bottom"
    ? "fixed inset-x-0 bottom-0 z-10"
    : "";

  return (
    <div
      className={cn(
        "flex items-center justify-between border-t border-border-subtle bg-surface-default px-4 py-2",
        positionClass,
        className,
      )}
      data-testid={testId}
      role="navigation"
      aria-label="Stepper navigation"
    >
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        disabled={isFirst || isDisabled || isReadOnly}
        className={cn(
          "rounded-md font-medium text-action-primary transition",
          "hover:bg-action-primary/10 disabled:cursor-not-allowed disabled:text-text-disabled disabled:opacity-50",
          s.btn,
        )}
        aria-label={backLabel}
      >
        {backLabel}
      </button>

      {/* Indicator */}
      <div className="flex flex-1 items-center justify-center">
        {variant === "dots" && (
          <div className={cn("flex items-center", s.gap)} role="group" aria-label={`Step ${activeStep + 1} of ${steps}`}>
            {Array.from({ length: steps }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "rounded-full transition-all",
                  s.dot,
                  i === activeStep
                    ? "bg-action-primary scale-125"
                    : "bg-border-strong",
                )}
                aria-current={i === activeStep ? "step" : undefined}
              />
            ))}
          </div>
        )}

        {variant === "text" && (
          <span className={cn("font-medium text-text-secondary", s.text)}>
            {activeStep + 1} / {steps}
          </span>
        )}

        {variant === "progress" && (
          <div
            className={cn("w-full max-w-48 overflow-hidden rounded-full bg-surface-muted", s.bar)}
            role="progressbar"
            aria-valuenow={activeStep + 1}
            aria-valuemin={1}
            aria-valuemax={steps}
          >
            <div
              className={cn("rounded-full bg-action-primary transition-all", s.bar)}
              style={{ width: `${((activeStep + 1) / steps) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Next button */}
      <button
        type="button"
        onClick={onNext}
        disabled={isLast || isDisabled || isReadOnly}
        className={cn(
          "rounded-md font-medium text-action-primary transition",
          "hover:bg-action-primary/10 disabled:cursor-not-allowed disabled:text-text-disabled disabled:opacity-50",
          s.btn,
        )}
        aria-label={nextLabel}
      >
        {nextLabel}
      </button>
    </div>
  );
};

MobileStepper.displayName = "MobileStepper";

export default MobileStepper;
