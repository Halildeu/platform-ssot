import React from 'react';
import clsx from 'clsx';
import {
  resolveAccessState,
  withAccessGuard,
  type AccessControlledProps,
} from '../../runtime/access-controller';

export interface FilterBarProps extends AccessControlledProps {
  children?: React.ReactNode;
  onReset?: () => void;
  onSaveView?: () => void;
  extra?: React.ReactNode;
  className?: string;
}

const actionButtonBase =
  'inline-flex items-center justify-center rounded-md border text-sm font-medium transition-colors px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-selection-outline focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50';

export const FilterBar: React.FC<FilterBarProps> = ({
  children,
  onReset,
  onSaveView,
  extra,
  className,
  access = 'full',
  accessReason,
}) => {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) {
    return null;
  }

  const handleReset = onReset
    ? withAccessGuard<React.MouseEvent<HTMLButtonElement>>(accessState.state, onReset, accessState.isDisabled)
    : undefined;
  const handleSaveView = onSaveView
    ? withAccessGuard<React.MouseEvent<HTMLButtonElement>>(accessState.state, onSaveView, accessState.isDisabled)
    : undefined;

  return (
    <div
      className={clsx(
        'mfe-filter-bar flex flex-wrap gap-4 items-end',
        className,
      )}
      data-access-state={accessState.state}
    >
      <div className="flex flex-wrap gap-4 flex-1">{children}</div>
      <div className="flex items-center gap-2">
        {onReset && (
          <button
            type="button"
            onClick={handleReset}
            data-testid="filter-bar-reset"
            className={clsx(
              actionButtonBase,
              'border-border-subtle bg-surface-panel text-text-primary hover:bg-surface-muted',
            )}
            title={accessReason}
            disabled={accessState.isDisabled}
            aria-disabled={accessState.isDisabled || accessState.isReadonly || undefined}
          >
            Sıfırla
          </button>
        )}
        {onSaveView && (
          <button
            type="button"
            onClick={handleSaveView}
            data-testid="filter-bar-save-view"
            className={clsx(
              actionButtonBase,
              'border-transparent bg-action-primary text-action-primary-text hover:opacity-90',
            )}
            title={accessReason}
            disabled={accessState.isDisabled || accessState.isReadonly}
            aria-disabled={accessState.isDisabled || accessState.isReadonly || undefined}
          >
            Görünümü Kaydet
          </button>
        )}
        {extra}
      </div>
    </div>
  );
};

export default FilterBar;
