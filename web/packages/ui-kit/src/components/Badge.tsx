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

export type BadgeTone = 'default' | 'info' | 'success' | 'warning' | 'danger' | 'muted';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, AccessControlledProps {
  tone?: BadgeTone;
  children: React.ReactNode;
}

const toneClassNames: Record<BadgeTone, string> = {
  default: 'border-border-subtle bg-surface-muted text-text-secondary',
  info: 'border-state-info-border bg-state-info text-state-info-text',
  success: 'border-state-success-border bg-state-success text-state-success-text',
  warning: 'border-state-warning-border bg-state-warning text-state-warning-text',
  danger: 'border-state-danger-border bg-state-danger text-state-danger-text',
  muted: 'border-border-subtle bg-surface-panel text-text-subtle',
};

export const Badge: React.FC<BadgeProps> = ({
  tone = 'default',
  className,
  children,
  access = 'full',
  ...rest
}) => {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) {
    return null;
  }
  return (
    <span
      data-access-state={accessState.state}
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold leading-tight',
        toneClassNames[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
};

export default Badge;
