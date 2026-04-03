"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { variants } from "../../system/variants";
import { setDisplayName } from "../../system/compose";
import { Slot } from "../_shared/Slot";
import { stateAttrs } from "../../internal/interaction-core/state-attributes";

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const badgeVariants = variants({
  base: "inline-flex items-center font-medium transition-colors select-none",
  variants: {
    variant: {
      default: "bg-surface-muted text-text-primary border border-border-default",
      primary: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
      success: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
      warning: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
      error: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
      danger: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
      info: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
      muted: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
    },
    size: {
      sm: "text-[10px] px-1.5 py-0.5 rounded",
      md: "text-xs px-2 py-0.5 rounded-md",
      lg: "text-sm px-2.5 py-1 rounded-md",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

// Dot colors — explicit map (no fragile string parsing)
const dotColorMap: Record<string, string> = {
  default: "bg-gray-500",
  primary: "bg-blue-500",
  success: "bg-green-500",
  warning: "bg-amber-500",
  error: "bg-red-500",
  danger: "bg-red-500",
  info: "bg-sky-500",
  muted: "bg-gray-400",
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof badgeVariants.variants.variant;
  size?: "sm" | "md" | "lg";
  dot?: boolean;
  asChild?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  function Badge(props, ref) {
    const {
      className,
      variant = "default",
      size,
      dot = false,
      asChild = false,
      children,
      ...rest
    } = props;

    const Comp = asChild ? Slot : "span";

    return (
      <Comp
        ref={ref}
        className={cn(badgeVariants({ variant, size }), dot && "gap-1.5", className)}
        {...stateAttrs({ component: "badge" })}
        {...rest}
      >
        {dot && (
          <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotColorMap[variant])} aria-hidden />
        )}
        {children}
      </Comp>
    );
  },
);

setDisplayName(Badge, "Badge");

export { Badge, badgeVariants };
