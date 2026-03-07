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
export type TextWrap = 'wrap' | 'nowrap' | 'pretty' | 'balance';
export type TextAlign = 'left' | 'center' | 'right';

type TextElement = 'span' | 'p' | 'div' | 'label' | 'strong' | 'small' | 'h1' | 'h2' | 'h3' | 'h4';

const variantClass: Record<TextVariant, string> = {
  primary: 'text-text-primary',
  secondary: 'text-text-secondary',
  muted: 'text-text-subtle',
  success: 'text-state-success-text',
  danger: 'text-state-danger-text',
};

const sizeClass: Record<TextSize, string> = {
  xs: 'text-xs leading-5',
  sm: 'text-sm leading-6',
  md: 'text-base leading-7',
  lg: 'text-lg leading-7',
  xl: 'text-xl leading-8',
  '2xl': 'text-2xl leading-tight',
};

const weightClass: Record<TextWeight, string> = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const presetClass: Record<TextPreset, string> = {
  display: 'text-3xl font-semibold leading-tight tracking-tight text-balance',
  heading: 'text-2xl font-semibold leading-tight tracking-tight text-balance',
  title: 'text-lg font-semibold leading-7',
  body: 'text-base font-normal leading-7',
  'body-sm': 'text-sm font-normal leading-6',
  caption: 'text-xs font-semibold uppercase leading-5 tracking-[0.16em]',
  mono: 'font-mono text-sm font-medium leading-6',
};

const wrapClass: Record<TextWrap, string> = {
  wrap: '',
  nowrap: 'whitespace-nowrap',
  pretty: '[text-wrap:pretty]',
  balance: '[text-wrap:balance]',
};

const alignClass: Record<TextAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
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
    tabularNums?: boolean;
    italic?: boolean;
    wrap?: TextWrap;
    align?: TextAlign;
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
  tabularNums = false,
  italic = false,
  wrap = 'wrap',
  align = 'left',
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
        tabularNums && 'tabular-nums',
        italic && 'italic',
        wrapClass[wrap],
        alignClass[align],
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
