/* ------------------------------------------------------------------ */
/*  Portal — React portal wrapper for overlay rendering               */
/*                                                                     */
/*  Provides a <Portal> component and usePortal() hook for rendering  */
/*  overlay content into a separate DOM container, typically           */
/*  document.body. Handles container lifecycle management.             */
/*                                                                     */
/*  Faz 2.8 — Portal                                                   */
/* ------------------------------------------------------------------ */

import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

/* ---- usePortal Hook ---- */

/**
 * Hook that creates and manages a portal container div.
 * Appends to the target (defaults to document.body) on mount,
 * removes on unmount.
 *
 * @example
 * ```tsx
 * function Overlay({ children }) {
 *   const container = usePortal();
 *   if (!container) return null;
 *   return ReactDOM.createPortal(children, container);
 * }
 * ```
 */
export function usePortal(target?: HTMLElement): HTMLElement | null {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const parent = target ?? document.body;
    const div = document.createElement("div");
    div.setAttribute("data-overlay-portal", "");
    parent.appendChild(div);
    containerRef.current = div;
    setMounted(true);

    return () => {
      parent.removeChild(div);
      containerRef.current = null;
    };
  }, [target]);

  return mounted ? containerRef.current : null;
}

/* ---- Portal Component ---- */

export interface PortalProps {
  children: React.ReactNode;
  /** Target container element. Defaults to document.body. */
  container?: HTMLElement;
}

/**
 * Renders children into a portal container outside the parent DOM hierarchy.
 *
 * @example
 * ```tsx
 * <Portal>
 *   <div className="modal-overlay">Modal content</div>
 * </Portal>
 * ```
 */
export const Portal: React.FC<PortalProps> = ({ children, container }) => {
  const portalContainer = usePortal(container);

  if (!portalContainer) return null;
  return ReactDOM.createPortal(children, portalContainer);
};

Portal.displayName = "Portal";
