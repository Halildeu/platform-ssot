"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { setDisplayName, composeEventHandlers } from "../../system/compose";
import { stateAttrs } from "../../internal/interaction-core/state-attributes";

// ---------------------------------------------------------------------------
// Placement styles
// ---------------------------------------------------------------------------

const placementStyles: Record<string, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const arrowStyles: Record<string, string> = {
  top: "top-full left-1/2 -translate-x-1/2 border-t-gray-900 border-x-transparent border-b-transparent dark:border-t-gray-100",
  bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 border-x-transparent border-t-transparent dark:border-b-gray-100",
  left: "left-full top-1/2 -translate-y-1/2 border-l-gray-900 border-y-transparent border-r-transparent dark:border-l-gray-100",
  right: "right-full top-1/2 -translate-y-1/2 border-r-gray-900 border-y-transparent border-l-transparent dark:border-r-gray-100",
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TooltipProps {
  content: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  openDelay?: number;
  closeDelay?: number;
  arrow?: boolean;
  disabled?: boolean;
  children: React.ReactElement;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function Tooltip(props: TooltipProps) {
  const {
    content,
    placement = "top",
    openDelay = 200,
    closeDelay = 150,
    arrow = true,
    disabled = false,
    children,
    className,
  } = props;

  const [visible, setVisible] = React.useState(false);
  const openTimer = React.useRef<ReturnType<typeof setTimeout>>();
  const closeTimer = React.useRef<ReturnType<typeof setTimeout>>();

  const show = React.useCallback(() => {
    clearTimeout(closeTimer.current);
    openTimer.current = setTimeout(() => setVisible(true), openDelay);
  }, [openDelay]);

  const hide = React.useCallback(() => {
    clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => setVisible(false), closeDelay);
  }, [closeDelay]);

  // Cleanup
  React.useEffect(() => {
    return () => {
      clearTimeout(openTimer.current);
      clearTimeout(closeTimer.current);
    };
  }, []);

  // Escape dismissal
  React.useEffect(() => {
    if (!visible) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setVisible(false); }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [visible]);

  if (disabled || !content) return children;

  // Compose event handlers with child's existing handlers
  const child = React.Children.only(children);
  const childProps = child.props as Record<string, unknown>;

  const triggerProps = {
    onMouseEnter: composeEventHandlers(
      childProps.onMouseEnter as (() => void) | undefined,
      show,
      { checkForDefaultPrevented: false },
    ),
    onMouseLeave: composeEventHandlers(
      childProps.onMouseLeave as (() => void) | undefined,
      hide,
      { checkForDefaultPrevented: false },
    ),
    onFocus: composeEventHandlers(
      childProps.onFocus as (() => void) | undefined,
      show,
      { checkForDefaultPrevented: false },
    ),
    onBlur: composeEventHandlers(
      childProps.onBlur as (() => void) | undefined,
      hide,
      { checkForDefaultPrevented: false },
    ),
    "aria-describedby": visible ? "ds-tooltip" : undefined,
  };

  return (
    <span className="relative inline-flex">
      {React.cloneElement(child, triggerProps)}

      {visible && (
        <span
          id="ds-tooltip"
          role="tooltip"
          className={cn(
            "absolute z-50 px-2.5 py-1.5 rounded-md text-xs font-medium",
            "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900",
            "shadow-lg pointer-events-none whitespace-nowrap",
            "animate-in fade-in-0 zoom-in-95 duration-150",
            placementStyles[placement],
            className,
          )}
          {...stateAttrs({ component: "tooltip" })}
        >
          {content}
          {arrow && (
            <span
              className={cn("absolute border-4", arrowStyles[placement])}
              aria-hidden
            />
          )}
        </span>
      )}
    </span>
  );
}

setDisplayName(Tooltip, "Tooltip");

export { Tooltip };
