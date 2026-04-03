"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { variants, type VariantProps } from "../../system/variants";
import { composeRefs, setDisplayName } from "../../system/compose";
import { Slot } from "../_shared/Slot";
import {
  resolveAccessState,
  shouldBlockInteraction,
  accessStyles,
  type AccessLevel,
} from "../../internal/access-controller";
import { stateAttrs } from "../../internal/interaction-core/state-attributes";

// ---------------------------------------------------------------------------
// Variant Definition
// ---------------------------------------------------------------------------

const buttonVariants = variants({
  base: [
    "inline-flex items-center justify-center gap-2",
    "rounded-md font-medium whitespace-nowrap",
    "transition-colors duration-150 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-action-primary",
    "disabled:pointer-events-none disabled:opacity-50",
    "select-none cursor-pointer",
  ],
  variants: {
    variant: {
      primary:
        "bg-action-primary text-text-inverse shadow-sm hover:bg-action-primary-hover active:bg-action-primary-active",
      secondary:
        "bg-surface-muted text-text-primary border border-border-default hover:bg-surface-raised active:bg-surface-muted",
      outline:
        "border border-border-default text-text-primary bg-transparent hover:bg-surface-muted active:bg-surface-raised",
      ghost:
        "text-text-primary bg-transparent hover:bg-surface-muted active:bg-surface-raised",
      danger:
        "bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500",
      link:
        "text-action-primary underline-offset-4 hover:underline p-0 h-auto",
    },
    size: {
      xs: "h-7 px-2.5 text-xs rounded",
      sm: "h-8 px-3 text-sm",
      md: "h-9 px-4 text-sm",
      lg: "h-10 px-5 text-base",
      xl: "h-12 px-6 text-base",
    },
    density: {
      compact: "gap-1",
      comfortable: "gap-2",
      spacious: "gap-3",
    },
    fullWidth: {
      true: "w-full",
    },
  },
  compoundVariants: [
    { variant: "link", size: "xs", className: "text-xs" },
    { variant: "link", size: "sm", className: "text-sm" },
    { variant: "link", size: "lg", className: "text-base" },
  ],
  defaultVariants: {
    variant: "primary",
    size: "md",
    density: "comfortable",
  },
});

// ---------------------------------------------------------------------------
// Icon sizing
// ---------------------------------------------------------------------------

const iconSizeMap: Record<string, string> = {
  xs: "h-3.5 w-3.5",
  sm: "h-4 w-4",
  md: "h-4 w-4",
  lg: "h-5 w-5",
  xl: "h-5 w-5",
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ButtonVariantProps = VariantProps<typeof buttonVariants.variants>;

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled">,
    ButtonVariantProps {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconOnly?: boolean;
  access?: AccessLevel;
  accessReason?: string;
  disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Spinner SVG (inline — no circular dep)
// ---------------------------------------------------------------------------

function ButtonSpinner({ className }: { className?: string }) {
  return (
    <svg className={cn("animate-spin", className)} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    const {
      className,
      variant,
      size = "md",
      density,
      fullWidth,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      iconOnly = false,
      access,
      accessReason,
      disabled: disabledProp,
      children,
      onClick,
      ...rest
    } = props;

    const accessState = resolveAccessState(access);
    if (accessState.isHidden) return null;

    const isDisabled = disabledProp || loading || shouldBlockInteraction(accessState.state);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) { e.preventDefault(); return; }
      onClick?.(e);
    };

    const iconClass = iconSizeMap[size] ?? iconSizeMap.md;
    const renderIcon = (icon: React.ReactNode) =>
      icon ? <span className={cn("shrink-0 [&>svg]:size-full", iconClass)} aria-hidden>{icon}</span> : null;

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : "button"}
        className={cn(
          buttonVariants({ variant, size, density, fullWidth }),
          iconOnly && "aspect-square p-0",
          loading && "cursor-wait",
          accessState.isReadonly && "pointer-events-none opacity-70",
          accessStyles(access),
          className,
        )}
        disabled={isDisabled}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        title={accessState.isDisabled ? accessReason : undefined}
        onClick={handleClick}
        {...stateAttrs({ access, loading, disabled: isDisabled, component: "button" })}
        {...rest}
      >
        {loading ? <ButtonSpinner className={iconClass} /> : renderIcon(leftIcon)}
        {!iconOnly && children}
        {!loading && renderIcon(rightIcon)}
      </Comp>
    );
  },
);

setDisplayName(Button, "Button");

// ---------------------------------------------------------------------------
// IconButton
// ---------------------------------------------------------------------------

export interface IconButtonProps extends Omit<ButtonProps, "iconOnly" | "leftIcon" | "rightIcon"> {
  "aria-label": string;
  icon: React.ReactNode;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ icon, children, ...props }, ref) {
    return (
      <Button ref={ref} iconOnly variant="ghost" size="sm" {...props}>
        {icon}
      </Button>
    );
  },
);

setDisplayName(IconButton, "IconButton");

export { Button, IconButton, buttonVariants };
export type { ButtonVariantProps };
