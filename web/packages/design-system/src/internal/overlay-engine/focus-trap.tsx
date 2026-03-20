/* ------------------------------------------------------------------ */
/*  Focus Trap — Keyboard focus containment for overlays               */
/*                                                                     */
/*  Traps keyboard focus within a container element, preventing Tab    */
/*  from escaping to elements behind the overlay. Supports:            */
/*  - Auto-focus first focusable element on mount                      */
/*  - Wrap-around Tab navigation                                       */
/*  - Restore focus on unmount                                         */
/*  - Initial focus target override                                    */
/*                                                                     */
/*  Faz 2.2 — Focus Trap                                               */
/* ------------------------------------------------------------------ */

import React, { useEffect, useRef, useCallback } from "react";

/* ---- Focusable element query ---- */

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(", ");

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const elements = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
  return elements.filter((el) => {
    // Filter out hidden elements
    if (el.offsetParent === null && el.tagName !== "BODY") return false;
    return !el.closest("[inert]");
  });
}

/* ---- Hook ---- */

export type UseFocusTrapOptions = {
  /** Whether the trap is active */
  active: boolean;
  /** Auto-focus first focusable element on activation */
  autoFocus?: boolean;
  /** Restore focus to previously focused element on deactivation */
  restoreFocus?: boolean;
  /** Ref to the element that should receive initial focus */
  initialFocusRef?: React.RefObject<HTMLElement>;
};

/**
 * Focus trap hook for overlay components.
 *
 * @public Exported for consumer use in custom overlay implementations.
 *
 * @note Built-in overlay components (Dialog, Modal) use native `<dialog>`
 * focus trapping. DetailDrawer and FormDrawer use panel tabIndex for focus
 * containment. This hook is available for consumers building custom overlays
 * that need programmatic focus trapping.
 *
 * @example
 * ```tsx
 * function CustomOverlay({ isOpen, children }) {
 *   const containerRef = useRef<HTMLDivElement>(null);
 *   useFocusTrap(containerRef, isOpen);
 *   return <div ref={containerRef}>{children}</div>;
 * }
 * ```
 */
export function useFocusTrap({
  active,
  autoFocus = true,
  restoreFocus = true,
  initialFocusRef,
}: UseFocusTrapOptions): React.RefObject<HTMLDivElement | null> {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Store the previously focused element when trap activates
  useEffect(() => {
    if (active && restoreFocus) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
  }, [active, restoreFocus]);

  // Auto-focus on activation
  useEffect(() => {
    if (!active || !autoFocus) return;

    // Small delay to ensure container is rendered
    const timeout = setTimeout(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
        return;
      }

      const container = containerRef.current;
      if (!container) return;

      const focusable = getFocusableElements(container);
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        // If no focusable elements, focus the container itself
        container.setAttribute("tabindex", "-1");
        container.focus();
      }
    }, 50);

    return () => clearTimeout(timeout);
  }, [active, autoFocus, initialFocusRef]);

  // Restore focus on deactivation
  useEffect(() => {
    return () => {
      if (restoreFocus && previousFocusRef.current) {
        // Delay to ensure DOM is ready after unmount transition
        setTimeout(() => {
          previousFocusRef.current?.focus();
          previousFocusRef.current = null;
        }, 0);
      }
    };
  }, [restoreFocus]);

  // Tab trap handler
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!active || event.key !== "Tab") return;

      const container = containerRef.current;
      if (!container) return;

      const focusable = getFocusableElements(container);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const firstFocusable = focusable[0];
      const lastFocusable = focusable[focusable.length - 1];

      if (event.shiftKey) {
        // Shift+Tab: wrap from first to last
        if (document.activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable.focus();
        }
      } else {
        // Tab: wrap from last to first
        if (document.activeElement === lastFocusable) {
          event.preventDefault();
          firstFocusable.focus();
        }
      }
    },
    [active],
  );

  // Attach/detach keydown listener
  useEffect(() => {
    if (!active) return;

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [active, handleKeyDown]);

  return containerRef;
}

/* ---- Component wrapper ---- */

export interface FocusTrapProps {
  /** Whether the trap is active */
  active: boolean;
  /** Auto-focus first element */
  autoFocus?: boolean;
  /** Restore focus on deactivation */
  restoreFocus?: boolean;
  /** Initial focus target */
  initialFocusRef?: React.RefObject<HTMLElement>;
  /** Container className */
  className?: string;
  children: React.ReactNode;
}

/**
 * Component wrapper for focus trap.
 *
 * @example
 * ```tsx
 * <FocusTrap active={isOpen}>
 *   <div>Dialog content with trapped focus</div>
 * </FocusTrap>
 * ```
 */
export const FocusTrap: React.FC<FocusTrapProps> = ({
  active,
  autoFocus = true,
  restoreFocus = true,
  initialFocusRef,
  className,
  children,
}) => {
  const ref = useFocusTrap({ active, autoFocus, restoreFocus, initialFocusRef });

  return (
    <div ref={ref} className={className} data-focus-trap={active ? "" : undefined}>
      {children}
    </div>
  );
};

FocusTrap.displayName = "FocusTrap";
