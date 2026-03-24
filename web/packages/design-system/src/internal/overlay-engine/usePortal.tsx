/* ------------------------------------------------------------------ */
/*  usePortal — Standardized portal behavior for overlay components    */
/*                                                                     */
/*  Creates a dedicated container div, appends it to a target          */
/*  (defaults to document.body), and cleans up on unmount. Returns     */
/*  a Portal wrapper component and a ref to the container element.     */
/*                                                                     */
/*  Faz 2.9 — Standardized Portal                                     */
/* ------------------------------------------------------------------ */

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export interface UsePortalOptions {
  /** Whether to use a portal. @default true */
  enabled?: boolean;
  /** Custom container element. @default document.body */
  container?: HTMLElement | null;
  /** HTML id attribute for the portal container div. */
  id?: string;
  /** CSS class name applied to the portal container div. */
  className?: string;
  /** Callback fired when the portal container is attached to the DOM. */
  onReady?: (container: HTMLDivElement) => void;
  /** Whether to remove the container from the DOM on cleanup. @default true */
  autoCleanup?: boolean;
}

/**
 * Standardized portal behavior for overlay components.
 * Creates a dedicated container div and cleans up on unmount.
 *
 * @example
 * ```tsx
 * function Overlay({ children }) {
 *   const { Portal } = usePortal();
 *   return (
 *     <Portal>
 *       <div className="overlay">{children}</div>
 *     </Portal>
 *   );
 * }
 *
 * // Render inline (no portal)
 * function InlineOverlay({ children }) {
 *   const { Portal } = usePortal({ enabled: false });
 *   return <Portal>{children}</Portal>;
 * }
 * ```
 */
export function usePortal(options: UsePortalOptions = {}) {
  const { enabled = true, container, id } = options;
  const portalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const target = container ?? document.body;
    const el = document.createElement("div");
    if (id) el.id = id;
    el.setAttribute("data-portal", "true");
    target.appendChild(el);
    portalRef.current = el;

    return () => {
      if (el.parentNode === target) {
        target.removeChild(el);
      }
      portalRef.current = null;
    };
  }, [enabled, container, id]);

  const Portal: React.FC<{ children: React.ReactNode }> = useCallback(
    ({ children }) => {
      if (!enabled) return <>{children}</>;
      if (!portalRef.current) return null;
      return createPortal(children, portalRef.current);
    },
    [enabled],
  );

  return { Portal, portalElement: portalRef };
}

/** Return type of the usePortal hook. */
export type UsePortalReturn = ReturnType<typeof usePortal>;

/** Props interface alias for usePortal options. */
export interface UsePortalProps extends UsePortalOptions {}
/** Portal container element type. */
export type PortalContainerElement = HTMLDivElement;
