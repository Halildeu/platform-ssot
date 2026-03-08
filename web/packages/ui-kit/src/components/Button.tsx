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

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

const variantClassNames: Record<ButtonVariant, string> = {
  primary:
    'border-transparent bg-[var(--accent-primary)] text-text-inverse shadow-sm hover:bg-[var(--accent-primary-hover)] focus-visible:ring-[var(--accent-focus)]',
  secondary:
    'border-border-default bg-surface-panel text-text-primary shadow-sm hover:bg-surface-muted focus-visible:ring-[var(--accent-focus)]',
  ghost:
    'border-transparent bg-transparent text-text-secondary hover:bg-accent-soft focus-visible:ring-[var(--accent-focus)]',
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    AccessControlledProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  access?: AccessLevel;
  accessReason?: string;
}

export const Button = ({
  children,
  className,
  variant = 'primary',
  access = 'full',
  accessReason,
  disabled,
  onClick,
  title,
  ...props
}: ButtonProps) => {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) {
    return null;
  }
  const isReadonly = accessState.isReadonly;
  const resolvedDisabled = disabled || accessState.isDisabled;
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
      data-access-state={accessState.state}
      className={cn(
        'inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
        variantClassNames[variant],
        className,
      )}
      aria-readonly={isReadonly || undefined}
      aria-disabled={resolvedDisabled || isReadonly || undefined}
      disabled={resolvedDisabled}
      onClick={handleClick}
      title={accessReason ?? title}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
