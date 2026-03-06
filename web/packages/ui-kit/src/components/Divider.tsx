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
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  label,
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
        role="separator"
        aria-orientation="vertical"
        data-access-state={accessState.state}
        className={cn('inline-flex h-10 w-px bg-border-subtle', className)}
      />
    );
  }

  return (
    <div
      {...rest}
      role="separator"
      aria-orientation="horizontal"
      data-access-state={accessState.state}
      className={cn('flex items-center gap-3 text-text-subtle', className)}
    >
      <span className="h-px flex-1 bg-border-subtle" />
      {label ? <span className="text-xs font-semibold uppercase tracking-wide">{label}</span> : null}
      <span className="h-px flex-1 bg-border-subtle" />
    </div>
  );
};

export default Divider;
