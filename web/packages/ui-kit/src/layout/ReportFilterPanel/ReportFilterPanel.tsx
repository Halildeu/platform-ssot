import React from 'react';
import {
  resolveAccessState,
  withAccessGuard,
  type AccessControlledProps,
} from '../../runtime/access-controller';

export interface ReportFilterPanelProps extends AccessControlledProps {
  loading?: boolean;
  submitLabel?: string;
  resetLabel?: string;
  onSubmit?: () => void;
  onReset?: () => void;
  children: React.ReactNode;
}

export function ReportFilterPanel({
  loading,
  submitLabel = 'Filtrele',
  resetLabel = 'Sıfırla',
  onSubmit,
  onReset,
  children,
  access = 'full',
  accessReason,
}: ReportFilterPanelProps) {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) {
    return null;
  }

  const canSubmit = accessState.state === 'full';
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || loading) {
      return;
    }
    onSubmit?.();
  };
  const handleReset = onReset
    ? withAccessGuard<React.MouseEvent<HTMLButtonElement>>(accessState.state, onReset, loading || accessState.isDisabled)
    : undefined;

  const buttonBase =
    'inline-flex items-center justify-center rounded-md border text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-selection-outline focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-2';

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full"
      data-access-state={accessState.state}
      data-testid="report-filter-panel"
    >
      <div className="flex w-full flex-wrap items-stretch gap-3">
        <div className="flex min-w-0 flex-1 flex-wrap gap-3">
          {React.Children.map(children, (child, index) => (
            <div key={index} className="flex-1 min-w-[200px]">
              {child}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            data-testid="report-filter-submit"
            className={`${buttonBase} border-transparent bg-action-primary text-action-primary-text hover:opacity-90`}
            disabled={loading || !canSubmit}
            title={accessReason}
          >
            {submitLabel}
          </button>
          {onReset && (
            <button
              type="button"
              data-testid="report-filter-reset"
              className={`${buttonBase} border border-border-subtle bg-surface-default text-text-secondary hover:bg-surface-muted`}
              onClick={handleReset}
              disabled={loading || accessState.isDisabled || accessState.isReadonly}
              aria-disabled={loading || accessState.isDisabled || accessState.isReadonly || undefined}
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
