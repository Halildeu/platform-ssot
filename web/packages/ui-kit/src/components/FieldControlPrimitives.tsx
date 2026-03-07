import React from 'react';
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Text } from './Text';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type FieldSize = 'sm' | 'md' | 'lg';
export type FieldTone = 'default' | 'invalid' | 'readonly' | 'disabled';

const fieldShellClass: Record<FieldTone, string> = {
  default:
    'border-border-default bg-surface-panel text-text-primary focus-within:border-[var(--accent-primary)] focus-within:ring-2 focus-within:ring-[var(--accent-focus)] focus-within:ring-offset-1',
  invalid:
    'border-state-danger-border bg-surface-panel text-text-primary focus-within:border-state-danger-border focus-within:ring-2 focus-within:ring-state-danger-border/40 focus-within:ring-offset-1',
  readonly:
    'border-border-subtle bg-surface-muted text-text-secondary shadow-none focus-within:border-border-subtle focus-within:ring-0',
  disabled:
    'border-border-subtle bg-surface-muted text-text-subtle opacity-80 shadow-none',
};

const fieldSizeClass: Record<FieldSize, string> = {
  sm: 'min-h-10 rounded-xl px-3 py-2',
  md: 'min-h-11 rounded-2xl px-4 py-3',
  lg: 'min-h-12 rounded-2xl px-4 py-3.5',
};

const fieldInputTextClass: Record<FieldSize, string> = {
  sm: 'text-sm leading-6',
  md: 'text-sm leading-6',
  lg: 'text-base leading-7',
};

const fieldSlotClass: Record<FieldSize, string> = {
  sm: 'min-w-4 text-sm',
  md: 'min-w-5 text-sm',
  lg: 'min-w-5 text-base',
};

export const getFieldTone = ({
  invalid,
  disabled,
  readonly,
}: {
  invalid?: boolean;
  disabled?: boolean;
  readonly?: boolean;
}): FieldTone => {
  if (disabled) return 'disabled';
  if (readonly) return 'readonly';
  if (invalid) return 'invalid';
  return 'default';
};

export const buildDescribedBy = (...ids: Array<string | undefined>) => {
  const value = ids.filter(Boolean).join(' ').trim();
  return value || undefined;
};

export const getFieldFrameClass = (size: FieldSize, tone: FieldTone, fullWidth: boolean, className?: string) =>
  cn(
    'group flex items-start gap-3 border shadow-sm transition',
    fieldShellClass[tone],
    fieldSizeClass[size],
    fullWidth && 'w-full',
    className,
  );

export const getFieldInputClass = (size: FieldSize, className?: string) =>
  cn(
    'min-w-0 flex-1 border-0 bg-transparent p-0 text-text-primary placeholder:text-text-subtle focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:text-text-subtle',
    fieldInputTextClass[size],
    className,
  );

export const getFieldSlotClass = (size: FieldSize) =>
  cn('inline-flex shrink-0 items-center justify-center text-text-secondary', fieldSlotClass[size]);

type FieldControlShellProps = {
  inputId: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  countLabel?: string;
  required?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
};

export const FieldControlShell: React.FC<FieldControlShellProps> = ({
  inputId,
  label,
  description,
  hint,
  error,
  countLabel,
  required = false,
  fullWidth = true,
  children,
}) => (
  <div className={cn('space-y-2.5', fullWidth && 'w-full')}>
    {label || description ? (
      <div className="space-y-1">
        {label ? (
          <label htmlFor={inputId} className="block text-sm font-semibold text-text-primary">
            {label}
            {required ? (
              <span aria-hidden="true" className="ml-1 text-state-danger-text">
                *
              </span>
            ) : null}
          </label>
        ) : null}
        {description ? (
          <Text as="div" variant="secondary" className="text-sm leading-6">
            {description}
          </Text>
        ) : null}
      </div>
    ) : null}

    {children}

    {hint || error || countLabel ? (
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {error ? (
            <Text as="div" variant="danger" className="text-sm leading-6">
              {error}
            </Text>
          ) : hint ? (
            <Text as="div" variant="secondary" className="text-sm leading-6">
              {hint}
            </Text>
          ) : null}
        </div>
        {countLabel ? (
          <Text
            as="div"
            variant={error ? 'danger' : 'muted'}
            className="shrink-0 text-xs font-medium tabular-nums"
          >
            {countLabel}
          </Text>
        ) : null}
      </div>
    ) : null}
  </div>
);
