import React, { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { Slot } from "../_shared/Slot";
import { stateAttrs } from "../../internal/interaction-core";

/* ------------------------------------------------------------------ */
/*  Badge — Small status / count indicator                             */
/* ------------------------------------------------------------------ */

export type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "danger"
  | "info"
  | "muted";

export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  /** @deprecated Use `variant` instead. Will be removed in v3.0.0. */
  tone?: BadgeVariant;
  size?: BadgeSize;
  /** Render as a dot (no children) */
  dot?: boolean;
  /**
   * Render via Slot — merges Badge props onto the child element.
   * @example <Badge asChild><a href="/status">Active</a></Badge>
   */
  asChild?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-[var(--surface-muted)] text-[var(--text-secondary)]",
  primary:
    "bg-[var(--action-primary)]/10 text-[var(--action-primary)]",
  success:
    "bg-[var(--state-success-bg)] text-[var(--state-success-text)]",
  warning:
    "bg-[var(--state-warning-bg)] text-[var(--state-warning-text)]",
  error:
    "bg-[var(--state-error-bg)] text-[var(--state-error-text)]",
  danger:
    "bg-[var(--state-error-bg)] text-[var(--state-error-text)]",
  info:
    "bg-[var(--state-info-bg)] text-[var(--state-info-text)]",
  muted:
    "bg-[var(--surface-muted)] text-[var(--text-tertiary)]",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-1.5 py-0.5 text-[10px]",
  md: "px-2 py-0.5 text-xs",
  lg: "px-2.5 py-1 text-xs",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant: variantProp,
      tone,
      size = "md",
      dot = false,
      asChild = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const variant = variantProp ?? tone ?? "default";

    if (process.env.NODE_ENV !== "production" && tone !== undefined) {
      console.warn(
        '[DesignSystem] "Badge" prop "tone" is deprecated. Use "variant" instead. "tone" will be removed in v3.0.0.',
      );
    }

    if (dot) {
      return (
        <span
          ref={ref}
          className={cn(
            "inline-block h-2 w-2 rounded-full",
            variant === "default"
              ? "bg-[var(--text-secondary)]"
              : variantStyles[variant].split(" ").find((c) => c.startsWith("text-"))?.replace("text-", "bg-") ??
                "bg-[var(--text-secondary)]",
            className,
          )}
          {...rest}
        />
      );
    }

    const mergedClassName = cn(
      "inline-flex items-center justify-center rounded-full font-medium leading-none",
      variantStyles[variant],
      sizeStyles[size],
      className,
    );

    const sharedProps = {
      className: mergedClassName,
      ...stateAttrs({ component: "badge" }),
      ...rest,
    };

    if (asChild) {
      return (
        <Slot ref={ref} {...sharedProps}>
          {children}
        </Slot>
      );
    }

    return (
      <span ref={ref} {...sharedProps}>
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";
