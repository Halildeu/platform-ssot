import React, { useMemo, useState } from 'react';
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  resolveAccessState,
  type AccessControlledProps,
} from '../runtime/access-controller';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';

const sizeClassNames: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

const shapeClassNames: Record<AvatarShape, string> = {
  circle: 'rounded-full',
  square: 'rounded-2xl',
};

const getInitials = (value?: string): string => {
  if (!value) return '•';
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '•';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
};

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement>, AccessControlledProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  fallbackIcon?: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  shape = 'circle',
  fallbackIcon,
  className,
  access = 'full',
  ...rest
}) => {
  const accessState = resolveAccessState(access);
  const [imageFailed, setImageFailed] = useState(false);
  const initials = useMemo(() => getInitials(name ?? alt), [name, alt]);
  if (accessState.isHidden) {
    return null;
  }

  const showImage = Boolean(src) && !imageFailed;

  return (
    <div
      {...rest}
      data-access-state={accessState.state}
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden border border-border-subtle bg-surface-muted font-semibold text-text-secondary',
        sizeClassNames[size],
        shapeClassNames[shape],
        className,
      )}
      aria-label={name ?? alt ?? 'Avatar'}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt ?? name ?? 'Avatar'}
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : fallbackIcon ? (
        <span aria-hidden="true">{fallbackIcon}</span>
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </div>
  );
};

export default Avatar;
