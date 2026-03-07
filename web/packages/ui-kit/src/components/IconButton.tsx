import React from 'react';
import Button, { type ButtonProps, type ButtonSize, type ButtonVariant } from './Button';

export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'leadingVisual' | 'trailingVisual'> {
  icon: React.ReactNode;
  label: string;
  selected?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-10 w-10 p-0',
  md: 'h-11 w-11 p-0',
  lg: 'h-12 w-12 p-0',
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  {
    icon,
    label,
    selected = false,
    variant = 'ghost',
    size = 'md',
    className,
    title,
    ...props
  },
  ref,
) {
  return (
    <Button
      {...props}
      ref={ref}
      variant={selected ? 'secondary' : variant}
      size={size}
      loadingDisplay="spinner-only"
      className={`${sizeClass[size]} ${selected ? 'ring-1 ring-[var(--accent-focus)]' : ''} ${className ?? ''}`.trim()}
      aria-label={label}
      aria-pressed={selected || undefined}
      title={title ?? label}
    >
      <span aria-hidden="true" className="inline-flex items-center justify-center text-current">{icon}</span>
    </Button>
  );
});

export default IconButton;
