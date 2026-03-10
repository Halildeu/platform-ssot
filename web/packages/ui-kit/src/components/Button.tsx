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

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large';
type ButtonIntent = ButtonVariant;
type LoadingDisplay = 'label' | 'spinner-only';

const variantClassNames: Record<ButtonVariant, string> = {
  primary:
    'border-transparent bg-[var(--accent-primary)] text-text-inverse shadow-sm hover:bg-[var(--accent-primary-hover)] focus-visible:ring-[var(--accent-focus)]',
  secondary:
    'border-border-default bg-surface-panel text-text-primary shadow-sm hover:bg-surface-muted focus-visible:ring-[var(--accent-focus)]',
  ghost:
    'border-transparent bg-transparent text-text-secondary hover:bg-accent-soft focus-visible:ring-[var(--accent-focus)]',
};

const sizeClassNames: Record<Exclude<ButtonSize, 'small' | 'medium' | 'large'>, string> = {
  sm: 'min-h-9 gap-2 px-3 py-2 text-xs',
  md: 'min-h-10 gap-2.5 px-4 py-2 text-sm',
  lg: 'min-h-11 gap-3 px-5 py-2.5 text-base',
};

const normalizeSize = (size: ButtonSize): keyof typeof sizeClassNames => {
  switch (size) {
    case 'small':
      return 'sm';
    case 'large':
      return 'lg';
    case 'medium':
    default:
      return 'md';
  }
};

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    AccessControlledProps {
  children?: React.ReactNode;
  label?: string;
  variant?: ButtonVariant;
  intent?: ButtonIntent;
  primary?: boolean;
  size?: ButtonSize;
  fullWidth?: boolean;
  leadingVisual?: React.ReactNode;
  trailingVisual?: React.ReactNode;
  loading?: boolean;
  loadingDisplay?: LoadingDisplay;
  loadingLabel?: string;
  access?: AccessLevel;
  accessReason?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    label,
    className,
    variant,
    intent,
    primary,
    size = 'md',
    fullWidth = false,
    leadingVisual,
    trailingVisual,
    loading = false,
    loadingDisplay = 'label',
    loadingLabel,
    access = 'full',
    accessReason,
    disabled,
    onClick,
    title,
    ...props
  },
  ref,
) {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) {
    return null;
  }
  const isReadonly = accessState.isReadonly;
  const resolvedDisabled = disabled || loading || accessState.isDisabled;
  const resolvedVariant = variant ?? intent ?? (primary === false ? 'secondary' : 'primary');
  const resolvedSize = normalizeSize(size);
  const content = loading && loadingDisplay === 'label' && typeof loadingLabel === 'string' && loadingLabel.length > 0
    ? loadingLabel
    : children ?? label;
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

  return (
    <button
      ref={ref}
      data-access-state={accessState.state}
      data-size={resolvedSize}
      className={cn(
        'inline-flex items-center justify-center rounded-md border font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
        sizeClassNames[resolvedSize],
        variantClassNames[resolvedVariant],
        fullWidth && 'w-full',
        className,
      )}
      aria-readonly={isReadonly || undefined}
      aria-disabled={resolvedDisabled || isReadonly || undefined}
      aria-busy={loading || undefined}
      disabled={resolvedDisabled}
      onClick={handleClick}
      title={accessReason ?? title}
      {...props}
    >
      {loading && loadingDisplay === 'spinner-only' ? (
        <span aria-hidden="true" className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      ) : null}
      {leadingVisual ? <span aria-hidden="true" className="inline-flex items-center justify-center">{leadingVisual}</span> : null}
      {content ? <span className={loading && loadingDisplay === 'spinner-only' ? 'sr-only' : undefined}>{content}</span> : null}
      {trailingVisual ? <span aria-hidden="true" className="inline-flex items-center justify-center">{trailingVisual}</span> : null}
    </button>
  );
});

export default Button;
