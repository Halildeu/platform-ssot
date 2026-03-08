import React from 'react';
import {
  resolveAccessState,
  type AccessControlledProps,
} from '../runtime/access-controller';

type TextVariant = 'primary' | 'secondary' | 'muted';
type TextSize = 'sm' | 'md' | 'lg';

const variantClass: Record<TextVariant, string> = {
  primary: 'text-text-primary',
  secondary: 'text-text-secondary',
  muted: 'text-text-secondary opacity-80',
};

const sizeClass: Record<TextSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export type TextProps = {
  as?: 'span' | 'p' | 'div';
  variant?: TextVariant;
  size?: TextSize;
  className?: string;
  children: React.ReactNode;
} & AccessControlledProps;

export const Text: React.FC<TextProps> = ({
  as: Component = 'span',
  variant = 'primary',
  size = 'sm',
  className = '',
  children,
  access = 'full',
}) => {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) {
    return null;
  }
  return (
    <Component
      data-access-state={accessState.state}
      className={`${variantClass[variant]} ${sizeClass[size]} ${className}`}
    >
      {children}
    </Component>
  );
};

export default Text;
