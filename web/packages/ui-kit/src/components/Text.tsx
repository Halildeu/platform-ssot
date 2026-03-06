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

export type TextVariant = 'primary' | 'secondary' | 'muted' | 'success' | 'danger';
export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';
export type TextPreset = 'display' | 'heading' | 'title' | 'body' | 'body-sm' | 'caption' | 'mono';
export type TextWrap = 'wrap' | 'nowrap';

type TextElement = 'span' | 'p' | 'div' | 'label' | 'strong' | 'small' | 'h1' | 'h2' | 'h3' | 'h4';

const variantClass: Record<TextVariant, string> = {
  primary: 'text-text-primary',
  secondary: 'text-text-secondary',
  muted: 'text-text-subtle',
  success: 'text-state-success-text',
  danger: 'text-state-danger-text',
};

const sizeClass: Record<TextSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
};

const weightClass: Record<TextWeight, string> = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const presetClass: Record<TextPreset, string> = {
  display: 'text-2xl font-semibold tracking-tight',
  heading: 'text-xl font-semibold tracking-tight',
  title: 'text-lg font-semibold',
  body: 'text-base font-normal',
  'body-sm': 'text-sm font-normal',
  caption: 'text-xs font-medium uppercase tracking-wide',
  mono: 'font-mono text-sm font-medium',
};

export type TextProps = React.HTMLAttributes<HTMLElement> &
  AccessControlledProps & {
    as?: TextElement;
    variant?: TextVariant;
    size?: TextSize;
    weight?: TextWeight;
    preset?: TextPreset;
    truncate?: boolean;
    clampLines?: number;
    mono?: boolean;
    italic?: boolean;
    wrap?: TextWrap;
    children: React.ReactNode;
  };

export const Text: React.FC<TextProps> = ({
  as: Component = 'span',
  variant = 'primary',
  size,
  weight,
  preset = 'body-sm',
  truncate = false,
  clampLines,
  mono = false,
  italic = false,
  wrap = 'wrap',
  className,
  children,
  access = 'full',
  style,
  ...rest
}) => {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) {
    return null;
  }

  const clampStyle =
    typeof clampLines === 'number' && clampLines > 0
      ? {
          display: '-webkit-box',
          WebkitLineClamp: clampLines,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
        }
      : undefined;

  return (
    <Component
      {...rest}
      data-access-state={accessState.state}
      data-preset={preset}
      data-tone={variant}
      data-clamp-lines={clampLines || undefined}
      className={cn(
        presetClass[preset],
        size && sizeClass[size],
        weight && weightClass[weight],
        variantClass[variant],
        mono && 'font-mono',
        italic && 'italic',
        wrap === 'nowrap' && 'whitespace-nowrap',
        truncate && 'truncate',
        clampStyle && 'overflow-hidden',
        className,
      )}
      style={clampStyle ? { ...clampStyle, ...style } : style}
    >
      {children}
    </Component>
  );
};

export default Text;
