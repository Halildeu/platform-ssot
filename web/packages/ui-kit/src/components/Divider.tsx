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

export type DividerOrientation = 'horizontal' | 'vertical';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement>, AccessControlledProps {
  orientation?: DividerOrientation;
  label?: React.ReactNode;
  decorative?: boolean;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  label,
  decorative = false,
  className,
  access = 'full',
  ...rest
}) => {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) {
    return null;
  }

  if (orientation === 'vertical') {
    return (
      <div
        {...rest}
        role={decorative ? undefined : 'separator'}
        aria-orientation={decorative ? undefined : 'vertical'}
        aria-hidden={decorative || undefined}
        data-access-state={accessState.state}
        data-orientation="vertical"
        data-decorative={decorative ? 'true' : 'false'}
        className={cn('inline-flex h-10 w-px bg-border-subtle', className)}
      />
    );
  }

  return (
    <div
      {...rest}
      role={decorative ? undefined : 'separator'}
      aria-orientation={decorative ? undefined : 'horizontal'}
      aria-hidden={decorative || undefined}
      data-access-state={accessState.state}
      data-orientation="horizontal"
      data-decorative={decorative ? 'true' : 'false'}
      className={cn('flex items-center gap-3 text-text-subtle', className)}
    >
      <span className="h-px flex-1 bg-border-subtle" />
      {label ? <span className="text-xs font-semibold uppercase tracking-wide">{label}</span> : null}
      <span className="h-px flex-1 bg-border-subtle" />
    </div>
  );
};

export default Divider;
