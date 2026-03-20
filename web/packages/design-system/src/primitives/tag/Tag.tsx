import React, { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { Slot } from "../_shared/Slot";
import type { AccessLevel } from "../../internal/access-controller";
import { resolveAccessState, shouldBlockInteraction } from "../../internal/access-controller";
import { stateAttrs } from "../../internal/interaction-core";

/* ------------------------------------------------------------------ */
/*  Tag — Removable label chip                                         */
/* ------------------------------------------------------------------ */

export type TagVariant = "default" | "primary" | "success" | "warning" | "error" | "info" | "danger";
export type TagSize = "sm" | "md" | "lg";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: TagVariant;
  /** @deprecated Use `variant` instead. Will be removed in v3.0.0. */
  tone?: TagVariant;
  size?: TagSize;
  /** Show close button */
  closable?: boolean;
  /** Close callback */
  onClose?: () => void;
  /** Icon before text */
  icon?: React.ReactNode;
  /** Access level — controls visibility/disabled state */
  access?: AccessLevel;
  /** Tooltip/title text explaining access restriction */
  accessReason?: string;
  /**
   * Render via Slot — merges Tag props onto the child element.
   * @example <Tag asChild><a href="/filter/active">Active</a></Tag>
   */
  asChild?: boolean;
}

const variantStyles: Record<TagVariant, string> = {
  default: "bg-[var(--surface-muted)] text-[var(--text-primary)] border-[var(--border-subtle)]",
  primary: "bg-[var(--action-primary)]/10 text-[var(--action-primary)] border-[var(--action-primary)]/20",
  success: "bg-[var(--state-success-bg)] text-[var(--state-success-text)] border-[var(--state-success-text)]/20",
  warning: "bg-[var(--state-warning-bg)] text-[var(--state-warning-text)] border-[var(--state-warning-text)]/20",
  error: "bg-[var(--state-error-bg)] text-[var(--state-error-text)] border-[var(--state-error-text)]/20",
  danger: "bg-[var(--state-error-bg)] text-[var(--state-error-text)] border-[var(--state-error-text)]/20",
  info: "bg-[var(--state-info-bg)] text-[var(--state-info-text)] border-[var(--state-info-text)]/20",
};

const sizeStyles: Record<TagSize, string> = {
  sm: "h-5 px-1.5 text-[10px] gap-1",
  md: "h-6 px-2 text-xs gap-1",
  lg: "h-7 px-2.5 text-xs gap-1.5",
};

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      variant: variantProp,
      tone,
      size = "md",
      closable = false,
      onClose,
      icon,
      access = "full",
      accessReason,
      asChild = false,
      className,
      children,
      title,
      ...rest
    },
    ref,
  ) => {
    const resolvedVariant = variantProp ?? tone ?? "default";

    if (process.env.NODE_ENV !== "production" && tone !== undefined) {
      console.warn(
        '[DesignSystem] "Tag" prop "tone" is deprecated. Use "variant" instead. "tone" will be removed in v3.0.0.',
      );
    }

    const accessState = resolveAccessState(access);
    if (accessState.isHidden) return null;
    const isDisabled = shouldBlockInteraction(access);

    const mergedClassName = cn(
      "inline-flex items-center rounded-md border font-medium leading-none",
      variantStyles[resolvedVariant],
      sizeStyles[size],
      isDisabled && "opacity-50 pointer-events-none",
      className,
    );

    const sharedProps = {
      className: mergedClassName,
      title: accessReason ?? title,
      ...stateAttrs({ component: "tag", disabled: isDisabled }),
      ...rest,
    };

    const inner = (
      <>
        {icon && (
          <span className="shrink-0 [&>svg]:h-3 [&>svg]:w-3">{icon}</span>
        )}
        <span className="truncate">{children}</span>
        {closable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            className="shrink-0 rounded-sm p-0.5 opacity-60 transition hover:opacity-100"
            aria-label="Remove"
          >
            <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
              <path
                d="M9 3L3 9M3 3l6 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </>
    );

    // asChild: merge Tag styling onto child element (icon/closable content stays inside)
    if (asChild) {
      return (
        <Slot ref={ref} {...sharedProps}>
          {children}
        </Slot>
      );
    }

    return (
      <span ref={ref} {...sharedProps}>
        {inner}
      </span>
    );
  },
);

Tag.displayName = "Tag";
