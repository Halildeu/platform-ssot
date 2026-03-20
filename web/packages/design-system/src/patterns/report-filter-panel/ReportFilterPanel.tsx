import React from "react";
import { cn } from "../../utils/cn";
import {
  resolveAccessState,
  withAccessGuard,
  type AccessControlledProps,
} from "../../internal/access-controller";

/* ------------------------------------------------------------------ */
/*  ReportFilterPanel — Horizontal filter form with submit/reset       */
/* ------------------------------------------------------------------ */

export interface ReportFilterPanelProps extends AccessControlledProps {
  loading?: boolean;
  submitLabel?: string;
  resetLabel?: string;
  onSubmit?: () => void;
  onReset?: () => void;
  testId?: string;
  submitTestId?: string;
  resetTestId?: string;
  children: React.ReactNode;
}

export function ReportFilterPanel({
  loading,
  submitLabel = "Filtrele",
  resetLabel = "Sifirla",
  onSubmit,
  onReset,
  testId,
  submitTestId,
  resetTestId,
  children,
  access = "full",
  accessReason,
}: ReportFilterPanelProps) {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) {
    return null;
  }

  const canSubmit = accessState.state === "full";
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || loading) {
      return;
    }
    onSubmit?.();
  };
  const handleReset = onReset
    ? withAccessGuard<React.MouseEvent<HTMLButtonElement>>(
        accessState.state,
        onReset,
        loading || accessState.isDisabled,
      )
    : undefined;

  const buttonBase = cn(
    "inline-flex items-center justify-center rounded-md border text-sm font-semibold transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-[var(--selection-outline,var(--action-primary))] focus:ring-offset-1",
    "disabled:opacity-60 disabled:cursor-not-allowed px-4 py-2",
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full"
      data-access-state={accessState.state}
      data-testid={testId}
    >
      <div className="flex w-full flex-wrap items-stretch gap-3">
        <div className="flex min-w-0 flex-1 flex-wrap gap-3">
          {React.Children.map(children, (child, index) => (
            <div key={index} className="min-w-[200px] flex-1">
              {child}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            data-testid={submitTestId}
            className={cn(
              buttonBase,
              "border-transparent bg-[var(--action-primary)] text-[var(--action-primary-text)] hover:opacity-90",
            )}
            disabled={loading || !canSubmit}
            title={accessReason}
          >
            {submitLabel}
          </button>
          {onReset && (
            <button
              type="button"
              data-testid={resetTestId}
              className={cn(
                buttonBase,
                "border border-[var(--border-subtle)] bg-[var(--surface-default)] text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]",
              )}
              onClick={handleReset}
              disabled={
                loading || accessState.isDisabled || accessState.isReadonly
              }
              aria-disabled={
                loading || accessState.isDisabled || accessState.isReadonly ||
                undefined
              }
              title={accessReason}
            >
              {resetLabel}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

ReportFilterPanel.displayName = "ReportFilterPanel";
