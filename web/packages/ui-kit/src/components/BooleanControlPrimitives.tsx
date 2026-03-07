import React from 'react';
import clsx from 'clsx';
import { Text } from './Text';
import { type AccessLevel } from '../runtime/access-controller';
import { getFieldTone, type FieldSize } from './FieldControlPrimitives';

export type BooleanControlKind = 'checkbox' | 'radio';
export type BooleanControlSize = FieldSize;
export type BooleanControlTone = ReturnType<typeof getFieldTone>;
export type BooleanToggleKind = 'switch';

const sizeMap: Record<BooleanControlSize, { control: string; title: string; body: string; helper: string }> = {
  sm: {
    control: 'h-4 w-4',
    title: 'text-sm font-semibold',
    body: 'text-xs leading-5',
    helper: 'text-xs leading-5',
  },
  md: {
    control: 'h-5 w-5',
    title: 'text-sm font-semibold',
    body: 'text-sm leading-6',
    helper: 'text-sm leading-6',
  },
  lg: {
    control: 'h-6 w-6',
    title: 'text-base font-semibold',
    body: 'text-sm leading-6',
    helper: 'text-sm leading-6',
  },
};

const toneClasses: Record<BooleanControlTone, { frame: string; input: string; helper: string }> = {
  default: {
    frame: 'border-border-default bg-surface-panel text-text-primary hover:bg-surface-muted',
    input: 'border-border-default text-[var(--accent-primary)] accent-[var(--accent-primary)]',
    helper: 'text-text-secondary',
  },
  invalid: {
    frame: 'border-state-danger-border bg-surface-panel text-text-primary focus-within:border-state-danger-border focus-within:ring-state-danger-border/40',
    input: 'border-state-danger-border text-state-danger-text accent-[var(--state-danger-border)]',
    helper: 'text-state-danger-text',
  },
  readonly: {
    frame: 'border-border-default bg-surface-muted text-text-primary',
    input: 'border-border-default text-[var(--accent-primary)] accent-[var(--accent-primary)]',
    helper: 'text-text-secondary',
  },
  disabled: {
    frame: 'border-border-subtle bg-surface-muted text-text-subtle opacity-80 cursor-not-allowed',
    input: 'border-border-subtle text-text-subtle accent-[var(--accent-primary)]',
    helper: 'text-text-subtle',
  },
};

const toggleSizeMap: Record<BooleanControlSize, { track: string; thumb: string; translate: string }> = {
  sm: {
    track: 'h-6 w-10',
    thumb: 'h-4 w-4',
    translate: 'peer-checked:translate-x-4',
  },
  md: {
    track: 'h-7 w-12',
    thumb: 'h-5 w-5',
    translate: 'peer-checked:translate-x-5',
  },
  lg: {
    track: 'h-8 w-14',
    thumb: 'h-6 w-6',
    translate: 'peer-checked:translate-x-6',
  },
};

export const getBooleanInputClass = (
  kind: BooleanControlKind,
  size: BooleanControlSize,
  tone: BooleanControlTone,
  readonly: boolean,
  disabled: boolean,
) =>
  clsx(
    'shrink-0 border bg-surface-canvas transition focus:outline-none focus:ring-2 focus:ring-[var(--accent-focus)] focus:ring-offset-1',
    sizeMap[size].control,
    kind === 'checkbox' ? 'rounded-md' : 'rounded-full',
    toneClasses[tone].input,
    readonly ? 'cursor-default' : disabled ? 'cursor-not-allowed' : 'cursor-pointer',
  );

export const getBooleanFrameClass = (
  size: BooleanControlSize,
  tone: BooleanControlTone,
  fullWidth: boolean,
  className?: string,
) =>
  clsx(
    'group flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-sm transition focus-within:border-[var(--accent-primary)] focus-within:ring-2 focus-within:ring-[var(--accent-focus)] focus-within:ring-offset-1',
    toneClasses[tone].frame,
    fullWidth ? 'w-full' : 'w-fit',
    className,
  );

export const getBooleanToggleInputClass = (readonly: boolean, disabled: boolean) =>
  clsx('peer sr-only', readonly ? 'cursor-default' : disabled ? 'cursor-not-allowed' : 'cursor-pointer');

export const getBooleanToggleTrackClass = (
  size: BooleanControlSize,
  tone: BooleanControlTone,
  readonly: boolean,
  disabled: boolean,
) =>
  clsx(
    'relative inline-flex items-center rounded-full border transition duration-200 ease-out',
    toggleSizeMap[size].track,
    tone === 'default' && 'border-border-default bg-surface-muted peer-checked:border-[var(--accent-primary)] peer-checked:bg-[var(--accent-primary)]',
    tone === 'invalid' &&
      'border-state-danger-border bg-surface-muted peer-checked:border-state-danger-border peer-checked:bg-state-danger-border',
    tone === 'readonly' &&
      'border-border-default bg-surface-muted peer-checked:border-[var(--accent-primary)]/70 peer-checked:bg-[var(--accent-primary)]/70',
    tone === 'disabled' &&
      'border-border-subtle bg-surface-muted opacity-70 peer-checked:border-[var(--accent-primary)]/50 peer-checked:bg-[var(--accent-primary)]/50',
    readonly ? 'cursor-default' : disabled ? 'cursor-not-allowed' : 'cursor-pointer',
    'peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--accent-focus)] peer-focus-visible:ring-offset-1',
  );

export const getBooleanToggleThumbClass = (size: BooleanControlSize) =>
  clsx(
    'pointer-events-none absolute left-0.5 top-1/2 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out -translate-y-1/2',
    toggleSizeMap[size].thumb,
    toggleSizeMap[size].translate,
  );

export type BooleanControlShellProps = {
  inputId: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  descriptionId?: string;
  hintId?: string;
  errorId?: string;
  required?: boolean;
  fullWidth?: boolean;
  size?: BooleanControlSize;
  tone: BooleanControlTone;
  accessState: AccessLevel;
  accessReason?: string;
  className?: string;
  control: React.ReactNode;
};

export const BooleanControlShell: React.FC<BooleanControlShellProps> = ({
  inputId,
  label,
  description,
  descriptionId,
  hint,
  hintId,
  error,
  errorId,
  required = false,
  fullWidth = true,
  size = 'md',
  tone,
  accessState,
  accessReason,
  className,
  control,
}) => {
  const helperTone = toneClasses[tone].helper;

  return (
    <div className={clsx('space-y-2.5', fullWidth ? 'w-full' : 'w-fit')}>
      <label
        htmlFor={inputId}
        className={getBooleanFrameClass(size, tone, fullWidth, className)}
        data-access-state={accessState}
        data-field-tone={tone}
        title={accessReason}
      >
        <span className="mt-0.5 shrink-0">{control}</span>
        <span className="min-w-0 flex-1">
          {label ? (
            <span className="flex items-center gap-2">
              <Text as="span" className={clsx('text-text-primary', sizeMap[size].title)}>
                {label}
              </Text>
              {required ? <span className="text-state-danger-text" aria-hidden="true">*</span> : null}
            </span>
          ) : null}
          {description ? (
            <Text as="div" variant="secondary" className={clsx('mt-1', sizeMap[size].body)}>
              <span id={descriptionId}>{description}</span>
            </Text>
          ) : null}
        </span>
      </label>
      {error ? (
        <Text as="div" className={clsx('pl-1', sizeMap[size].helper, helperTone)}>
          <span id={errorId}>{error}</span>
        </Text>
      ) : hint ? (
        <Text as="div" variant="secondary" className={clsx('pl-1', sizeMap[size].helper, helperTone)}>
          <span id={hintId}>{hint}</span>
        </Text>
      ) : null}
    </div>
  );
};
