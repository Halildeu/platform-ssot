import React from 'react';
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  resolveAccessState,
  type AccessControlledProps,
} from '../runtime/access-controller';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerTone = 'primary' | 'neutral' | 'inverse';
export type SpinnerMode = 'inline' | 'block' | 'overlay';

const sizeClassNames: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-5 w-5 border-2',
  lg: 'h-6 w-6 border-[3px]',
};

const toneClassNames: Record<SpinnerTone, string> = {
  primary: 'text-[var(--accent-primary)]',
  neutral: 'text-text-secondary',
  inverse: 'text-text-inverse',
};

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement>, AccessControlledProps {
  size?: SpinnerSize;
  tone?: SpinnerTone;
  mode?: SpinnerMode;
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  tone = 'primary',
  mode = 'inline',
  label = 'Yükleniyor',
  className,
  access = 'full',
  ...rest
}) => {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) {
    return null;
  }

  const containerClassName = cn(
    'inline-flex items-center gap-2',
    mode === 'block' && 'flex-col justify-center rounded-2xl border border-border-subtle bg-surface-panel p-4',
    mode === 'overlay' && 'flex-col justify-center rounded-2xl bg-surface-panel/90 p-4 shadow-sm backdrop-blur-sm',
    className,
  );

  return (
    <div
      {...rest}
      role="status"
      aria-live="polite"
      aria-busy="true"
      data-access-state={accessState.state}
      data-size={size}
      data-tone={tone}
      data-mode={mode}
      className={containerClassName}
    >
      <span
        aria-hidden="true"
        className={cn(
          'inline-flex animate-spin rounded-full border-current border-t-transparent motion-reduce:animate-none',
          sizeClassNames[size],
          toneClassNames[tone],
        )}
      />
      <span className={cn('text-sm', mode === 'overlay' ? 'text-text-primary' : 'text-text-secondary')}>{label}</span>
    </div>
  );
};

export default Spinner;
