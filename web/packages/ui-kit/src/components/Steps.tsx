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

export type StepsOrientation = 'horizontal' | 'vertical';
export type StepsSize = 'sm' | 'md';
export type StepStatus = 'complete' | 'current' | 'upcoming' | 'error';

export interface StepItem {
  value: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  status?: StepStatus;
  optional?: boolean;
  disabled?: boolean;
}

export interface StepsProps extends AccessControlledProps {
  items: StepItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: StepsOrientation;
  size?: StepsSize;
  interactive?: boolean;
  className?: string;
}

const sizeClass: Record<StepsSize, { marker: string; title: string; description: string }> = {
  sm: {
    marker: 'h-8 w-8 text-xs',
    title: 'text-sm',
    description: 'text-xs',
  },
  md: {
    marker: 'h-10 w-10 text-sm',
    title: 'text-sm',
    description: 'text-sm',
  },
};

const statusMarkerClass: Record<StepStatus, string> = {
  complete: 'border-transparent bg-[var(--accent-primary)] text-text-inverse',
  current: 'border-[var(--accent-primary)] bg-accent-soft text-text-primary',
  upcoming: 'border-border-subtle bg-surface-default text-text-secondary',
  error: 'border-state-danger-border bg-state-danger text-state-danger-text',
};

function resolveStatus(item: StepItem, index: number, currentIndex: number): StepStatus {
  if (item.status) return item.status;
  if (index < currentIndex) return 'complete';
  if (index === currentIndex) return 'current';
  return 'upcoming';
}

export const Steps = React.forwardRef<HTMLOListElement, StepsProps>(function Steps(
  {
    items,
    value,
    defaultValue,
    onValueChange,
    orientation = 'horizontal',
    size = 'md',
    interactive = false,
    className,
    access = 'full',
    accessReason,
  },
  ref,
) {
  const accessState = resolveAccessState(access);
  const firstValue = items[0]?.value ?? '';
  const isControlled = typeof value === 'string';
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? firstValue);

  const currentValue = isControlled ? value ?? firstValue : internalValue;
  const currentIndex = Math.max(0, items.findIndex((item) => item.value === currentValue));
  const blocked = accessState.isDisabled || accessState.isReadonly;
  const interactionState: AccessLevel = blocked ? 'disabled' : accessState.state;

  if (accessState.isHidden || items.length === 0) {
    return null;
  }

  const commit = (nextValue: string) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onValueChange?.(nextValue);
  };

  return (
    <ol
      ref={ref}
      aria-label="Progress steps"
      title={accessReason}
      data-access-state={accessState.state}
      data-orientation={orientation}
      className={cn(
        'flex min-w-0 gap-4',
        orientation === 'horizontal' ? 'flex-col xl:flex-row xl:items-stretch' : 'flex-col',
        className,
      )}
    >
      {items.map((item, index) => {
        const status = resolveStatus(item, index, currentIndex);
        const clickable = interactive && !blocked && !item.disabled;
        const content = (
          <>
            <span
              aria-hidden="true"
              className={cn(
                'inline-flex shrink-0 items-center justify-center rounded-full border font-semibold shadow-sm',
                sizeClass[size].marker,
                statusMarkerClass[status],
              )}
            >
              {status === 'complete' ? '✓' : index + 1}
            </span>
            <span className="min-w-0">
              <span className={cn('block font-semibold text-text-primary', sizeClass[size].title)}>{item.title}</span>
              {item.description ? (
                <span className={cn('mt-1 block leading-6 text-text-secondary', sizeClass[size].description)}>{item.description}</span>
              ) : null}
              {item.optional ? <span className="mt-1 block text-xs text-text-subtle">Opsiyonel</span> : null}
            </span>
          </>
        );

        return (
          <li
            key={item.value}
            className={cn(
              'flex min-w-0 gap-3',
              orientation === 'horizontal' && 'xl:flex-1',
              orientation === 'vertical' && 'items-start',
            )}
            data-step-status={status}
          >
            {clickable ? (
              <button
                type="button"
                className={cn(
                  'flex min-w-0 flex-1 items-start gap-3 rounded-2xl border border-border-subtle bg-surface-default p-3 text-left transition hover:bg-surface-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-focus)] focus-visible:ring-offset-1',
                  status === 'current' && 'border-[var(--accent-primary)] shadow-sm',
                )}
                aria-current={status === 'current' ? 'step' : undefined}
                aria-disabled={item.disabled || undefined}
                onClick={withAccessGuard<React.MouseEvent<HTMLButtonElement>>(
                  interactionState,
                  () => commit(item.value),
                  Boolean(item.disabled),
                )}
              >
                {content}
              </button>
            ) : (
              <div
                className={cn(
                  'flex min-w-0 flex-1 items-start gap-3 rounded-2xl border border-border-subtle bg-surface-default p-3',
                  status === 'current' && 'border-[var(--accent-primary)] shadow-sm',
                  item.disabled && 'opacity-60',
                )}
                aria-current={status === 'current' ? 'step' : undefined}
              >
                {content}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
});

export default Steps;
