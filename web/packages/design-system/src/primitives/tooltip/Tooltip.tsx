import React, { useState, useRef, useCallback, useEffect, useId } from "react";
import { stateAttrs } from "../../internal/interaction-core";
import { registerLayer, unregisterLayer } from "../../internal/overlay-engine";
import { cn } from "../../utils/cn";

/* ------------------------------------------------------------------ */
/*  Tooltip — Hover / focus information overlay                        */
/* ------------------------------------------------------------------ */

export type TooltipPlacement = "top" | "bottom" | "left" | "right";
export type TooltipAlign = "start" | "center" | "end";

export interface TooltipProps {
  /** Tooltip content — primary prop */
  content?: React.ReactNode;
  placement?: TooltipPlacement;
  align?: TooltipAlign;
  /** Delay before showing (ms) */
  delay?: number;
  /** Alias for delay — delay before showing (ms) */
  openDelay?: number;
  /** Delay before hiding (ms) */
  closeDelay?: number;
  /** Disable tooltip */
  disabled?: boolean;
  /** Show arrow indicator */
  showArrow?: boolean;
  /** Additional class for the wrapper */
  className?: string;
  /**
   * Render the trigger via Slot — merges tooltip event handlers
   * directly onto the child element, removing the wrapper `<span>`.
   * The child element must accept `className`, `onMouseEnter`,
   * `onMouseLeave`, `onFocus`, `onBlur`, and `onKeyDown` props.
   * @example
   * <Tooltip content="Settings" asChild>
   *   <IconButton icon={<GearIcon />} aria-label="Settings" />
   * </Tooltip>
   */
  asChild?: boolean;
  children: React.ReactNode;
}

const placementStyles: Record<TooltipPlacement, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const arrowStyles: Record<TooltipPlacement, string> = {
  top: "top-full left-1/2 -translate-x-1/2 border-t-[var(--text-primary)] border-x-transparent border-b-transparent",
  bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-[var(--text-primary)] border-x-transparent border-t-transparent",
  left: "left-full top-1/2 -translate-y-1/2 border-l-[var(--text-primary)] border-y-transparent border-r-transparent",
  right: "right-full top-1/2 -translate-y-1/2 border-r-[var(--text-primary)] border-y-transparent border-l-transparent",
};

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  placement = "top",
  align: _align,
  delay,
  openDelay,
  closeDelay = 0,
  disabled = false,
  showArrow = false,
  className,
  asChild = false,
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const showTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const resolvedDelay = openDelay ?? delay ?? 200;
  const resolvedContent = content;
  const layerId = useId();

  /* ---- overlay-engine: layer-stack registration ---- */
  useEffect(() => {
    if (visible) {
      registerLayer(`tooltip-${layerId}`, "toast");
    }
    return () => {
      if (visible) {
        unregisterLayer(`tooltip-${layerId}`);
      }
    };
  }, [visible, layerId]);

  const show = useCallback(() => {
    if (disabled) return;
    clearTimeout(hideTimeoutRef.current);
    showTimeoutRef.current = setTimeout(() => setVisible(true), resolvedDelay);
  }, [resolvedDelay, disabled]);

  const hide = useCallback(() => {
    clearTimeout(showTimeoutRef.current);
    if (closeDelay > 0) {
      hideTimeoutRef.current = setTimeout(() => setVisible(false), closeDelay);
    } else {
      setVisible(false);
    }
  }, [closeDelay]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        hide();
      }
    },
    [hide],
  );

  if (!resolvedContent) {
    return <>{children}</>;
  }

  const tooltipPopup = visible ? (
    <span
      role="tooltip"
      {...stateAttrs({ state: visible ? "open" : "closed", component: "tooltip" })}
      className={cn(
        "pointer-events-none absolute z-[1600] rounded-lg px-2.5 py-1.5",
        "bg-[var(--text-primary)] text-xs font-medium text-[var(--text-inverse)]",
        "shadow-lg animate-in fade-in-0 zoom-in-95",
        placementStyles[placement],
      )}
    >
      {resolvedContent}
      {showArrow && (
        <span
          className={cn(
            "absolute border-4",
            arrowStyles[placement],
          )}
        />
      )}
    </span>
  ) : null;

  const triggerProps = {
    onMouseEnter: show,
    onMouseLeave: hide,
    onFocus: show,
    onBlur: hide,
    onKeyDown: handleKeyDown,
  };

  // asChild: merge trigger behavior onto the child element directly,
  // avoiding the extra wrapper <span>. The child must support className
  // and event handler props.
  if (asChild) {
    const child = React.Children.only(children);
    if (!React.isValidElement(child)) {
      console.warn("Tooltip: asChild requires a single valid React element as child.");
      return <>{children}</>;
    }

    const childProps = child.props as Record<string, unknown>;
    return React.cloneElement(child, {
      ...triggerProps,
      className: cn("relative inline-flex", childProps.className as string | undefined, className),
      // Compose event handlers with child's existing handlers
      onMouseEnter: childProps.onMouseEnter
        ? (e: React.MouseEvent) => { show(); (childProps.onMouseEnter as (e: React.MouseEvent) => void)(e); }
        : show,
      onMouseLeave: childProps.onMouseLeave
        ? (e: React.MouseEvent) => { hide(); (childProps.onMouseLeave as (e: React.MouseEvent) => void)(e); }
        : hide,
      onFocus: childProps.onFocus
        ? (e: React.FocusEvent) => { show(); (childProps.onFocus as (e: React.FocusEvent) => void)(e); }
        : show,
      onBlur: childProps.onBlur
        ? (e: React.FocusEvent) => { hide(); (childProps.onBlur as (e: React.FocusEvent) => void)(e); }
        : hide,
    } as Record<string, unknown>,
      ...(React.Children.toArray((child.props as { children?: React.ReactNode }).children)),
      tooltipPopup,
    );
  }

  return (
    <span
      className={cn("relative inline-flex", className)}
      {...triggerProps}
    >
      {children}
      {tooltipPopup}
    </span>
  );
};

Tooltip.displayName = "Tooltip";
