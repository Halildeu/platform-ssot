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

export type SkeletonVariant = 'text' | 'rect' | 'avatar' | 'pill' | 'table-row';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement>, AccessControlledProps {
  variant?: SkeletonVariant;
  lines?: number;
  animated?: boolean;
}

const variantClassNames: Record<SkeletonVariant, string> = {
  text: 'h-4 w-full rounded-md',
  rect: 'h-24 w-full rounded-2xl',
  avatar: 'h-12 w-12 rounded-full',
  pill: 'h-8 w-24 rounded-full',
  'table-row': 'h-3.5 rounded-md',
};

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  lines = 1,
  animated = true,
  className,
  access = 'full',
  ...rest
}) => {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) {
    return null;
  }

  const count = variant === 'text' ? Math.max(1, lines) : variant === 'table-row' ? 4 : 1;
  const tableRowWidths = ['w-full', 'w-4/5', 'w-3/5', 'w-2/5'];

  return (
    <div
      {...rest}
      data-access-state={accessState.state}
      data-variant={variant}
      data-lines={variant === 'text' ? String(Math.max(1, lines)) : undefined}
      data-animated={animated ? 'true' : 'false'}
      className={cn('flex flex-col gap-2', className)}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <span
          key={`${variant}-${index}`}
          className={cn(
            'block border border-border-subtle bg-surface-muted',
            animated && 'animate-pulse motion-reduce:animate-none',
            variantClassNames[variant],
            variant === 'text' && index === count - 1 && count > 1 && 'w-4/5',
            variant === 'table-row' && tableRowWidths[index],
          )}
        />
      ))}
    </div>
  );
};

export default Skeleton;
