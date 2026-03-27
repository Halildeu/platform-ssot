/* ------------------------------------------------------------------ */
/*  Focus Restore — Save and restore focus for overlay components      */
/*                                                                     */
/*  Saves the currently focused element when the overlay opens,        */
/*  and restores focus to it when the overlay closes.                  */
/*                                                                     */
/*  Faz 2 — Overlay & Focus Engine                                     */
/* ------------------------------------------------------------------ */

import { useRef, useEffect } from "react";

/**
 * Saves the currently focused element when the overlay opens,
 * and restores focus to it when the overlay closes.
 *
 * @param isOpen - Whether the overlay is currently open
 *
 * @example
 * ```tsx
 * function Drawer({ open, children }) {
 *   useFocusRestore(open);
 *   return open ? <div>{children}</div> : null;
 * }
 * ```
 */
export function useFocusRestore(isOpen: boolean): void {
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;

    if (isOpen) {
      // Save the currently focused element
      triggerRef.current = document.activeElement as HTMLElement;
    } else if (triggerRef.current) {
      // Restore focus when closed
      // Use requestAnimationFrame to ensure DOM is ready
      const el = triggerRef.current;
      triggerRef.current = null;
      requestAnimationFrame(() => {
        el?.focus();
      });
    }
  }, [isOpen]);
}
