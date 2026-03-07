import React from 'react';
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  resolveAccessState,
  withAccessGuard,
  type AccessControlledProps,
  type AccessLevel,
} from '../runtime/access-controller';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

const variantClassNames: Record<ButtonVariant, string> = {
  primary:
    'border-transparent bg-[var(--accent-primary)] text-text-inverse shadow-sm hover:bg-[var(--accent-primary-hover)] focus-visible:ring-[var(--accent-focus)]',
  secondary:
    'border-border-default bg-surface-panel text-text-primary shadow-sm hover:bg-surface-muted focus-visible:ring-[var(--accent-focus)]',
  ghost:
    'border-transparent bg-transparent text-text-secondary hover:bg-accent-soft focus-visible:ring-[var(--accent-focus)]',
  destructive:
    'border-state-danger-border bg-state-danger text-state-danger-text shadow-sm hover:opacity-95 focus-visible:ring-[var(--accent-focus)]',
};

const sizeClassNames: Record<ButtonSize, string> = {
  sm: 'min-h-9 gap-1.5 rounded-lg px-3 py-2 text-sm',
  md: 'min-h-10 gap-2 rounded-xl px-4 py-2.5 text-sm',
  lg: 'min-h-12 gap-2.5 rounded-xl px-5 py-3 text-base',
};

const spinnerSizeClassNames: Record<ButtonSize, string> = {
  sm: 'h-3.5 w-3.5 border-[1.5px]',
  md: 'h-4 w-4 border-2',
  lg: 'h-4.5 w-4.5 border-2',
};

const slotSizeClassNames: Record<ButtonSize, string> = {
  sm: 'min-w-3.5 text-sm',
  md: 'min-w-4 text-base',
  lg: 'min-w-5 text-lg',
};

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    AccessControlledProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingLabel?: string;
  leadingVisual?: React.ReactNode;
  trailingVisual?: React.ReactNode;
  fullWidth?: boolean;
  loadingDisplay?: 'label' | 'spinner-only';
}

const LoadingSpinner: React.FC<{ size: ButtonSize }> = ({ size }) => (
  <span
    aria-hidden="true"
    className={cn(
      'inline-flex animate-spin rounded-full border-current border-t-transparent',
      spinnerSizeClassNames[size],
    )}
  />
);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    loadingLabel = 'Yükleniyor',
    leadingVisual,
    trailingVisual,
    fullWidth = false,
    loadingDisplay = 'label',
    access = 'full',
    accessReason,
    disabled,
    onClick,
    title,
    type,
    ...props
  },
  ref,
) {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) {
    return null;
  }

  const isReadonly = accessState.isReadonly;
  const resolvedDisabled = disabled || accessState.isDisabled || loading;
  const interactionState: AccessLevel = resolvedDisabled
    ? 'disabled'
    : isReadonly
      ? 'readonly'
      : accessState.state;
  const handleClick = withAccessGuard<React.MouseEvent<HTMLButtonElement>>(
    interactionState,
    onClick,
    resolvedDisabled,
  );
  const titleText = accessReason ?? title;
  const hasLeadingSlot = loading || Boolean(leadingVisual);
  const hasTrailingSlot = Boolean(trailingVisual);

  const renderContent = (options: { loadingContent?: boolean; visuallyHidden?: boolean } = {}) => {
    const { loadingContent = false, visuallyHidden = false } = options;
    const leadingNode = loadingContent ? <LoadingSpinner size={size} /> : leadingVisual;

    return (
      <span
        className={cn(
          'inline-flex items-center justify-center [column-gap:inherit]',
          visuallyHidden && 'invisible',
        )}
        aria-hidden={visuallyHidden || undefined}
      >
        {hasLeadingSlot ? (
          <span
            className={cn(
              'inline-flex shrink-0 items-center justify-center',
              slotSizeClassNames[size],
            )}
          >
            {leadingNode}
          </span>
        ) : null}
        {loadingContent && loadingDisplay === 'spinner-only' ? null : (
          <span className="min-w-0 truncate">{loadingContent ? loadingLabel : children}</span>
        )}
        {hasTrailingSlot ? (
          <span
            className={cn(
              'inline-flex shrink-0 items-center justify-center',
              slotSizeClassNames[size],
              loadingContent && 'opacity-0',
            )}
            aria-hidden={loadingContent || undefined}
          >
            {trailingVisual}
          </span>
        ) : null}
      </span>
    );
  };

  return (
    <button
      {...props}
      ref={ref}
      type={type ?? 'button'}
      data-access-state={accessState.state}
      data-variant={variant}
      data-size={size}
      data-loading={loading ? 'true' : 'false'}
      data-slot-layout="stacked"
      data-leading-slot={hasLeadingSlot ? 'true' : 'false'}
      data-trailing-slot={hasTrailingSlot ? 'true' : 'false'}
      className={cn(
        'inline-flex shrink-0 items-center justify-center whitespace-nowrap border font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
        sizeClassNames[size],
        variantClassNames[variant],
        fullWidth && 'w-full',
        className,
      )}
      aria-readonly={isReadonly || undefined}
      aria-disabled={resolvedDisabled || isReadonly || undefined}
      aria-busy={loading || undefined}
      disabled={resolvedDisabled}
      onClick={handleClick}
      title={titleText}
    >
      <span
        className={cn(
          'grid items-center justify-center [grid-template-areas:stack]',
          fullWidth && 'w-full',
        )}
      >
        <span className="[grid-area:stack]">{renderContent({ visuallyHidden: loading })}</span>
        {loading ? (
          <span data-loading-layer="true" className="[grid-area:stack]">
            {renderContent({ loadingContent: true })}
          </span>
        ) : null}
      </span>
    </button>
  );
});

export default Button;
