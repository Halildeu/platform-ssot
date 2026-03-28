/* ------------------------------------------------------------------ */
/*  Outside Click — Click-away detection for overlays                  */
/*                                                                     */
/*  Detects clicks outside a given element and fires a callback.       */
/*  Supports multiple refs (e.g., trigger + panel) and respects        */
/*  portal-mounted elements.                                           */
/*                                                                     */
/*  Faz 2.4 — Outside Click                                            */
/* ------------------------------------------------------------------ */

import { useEffect, useCallback, useRef } from "react";
import type React from "react";

export type UseOutsideClickOptions = {
  /** Whether the listener is active */
  active: boolean;
  /** Callback when click outside is detected */
  onOutsideClick: (event: MouseEvent | TouchEvent) => void;
  /** Additional refs to exclude from "outside" detection */
  excludeRefs?: React.RefObject<HTMLElement | null>[];
};

/**
 * Hook that detects clicks outside a referenced element.
 *
 * @example
 * ```tsx
 * function Dropdown({ onClose }) {
 *   const ref = useOutsideClick({
 *     active: true,
 *     onOutsideClick: () => onClose(),
 *   });
 *   return <div ref={ref}>Dropdown content</div>;
 * }
 * ```
 */
export function useOutsideClick({
  active,
  onOutsideClick,
  excludeRefs = [],
}: UseOutsideClickOptions): React.RefObject<HTMLDivElement | null> {
  const containerRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(onOutsideClick);

  // Keep callback ref fresh to avoid stale closures
  useEffect(() => {
    callbackRef.current = onOutsideClick;
  }, [onOutsideClick]);

  const handleClick = useCallback(
    (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      // Check if click is inside the container
      if (containerRef.current?.contains(target)) return;

      // Check if click is inside any excluded refs
      for (const ref of excludeRefs) {
        if (ref.current?.contains(target)) return;
      }

      callbackRef.current(event);
    },
    [excludeRefs],
  );

  useEffect(() => {
    if (!active) return;

    // Use mousedown instead of click for better UX
    // (fires before focus changes, preventing flash of unfocused state)
    document.addEventListener("mousedown", handleClick, true);
    document.addEventListener("touchstart", handleClick, true);

    return () => {
      document.removeEventListener("mousedown", handleClick, true);
      document.removeEventListener("touchstart", handleClick, true);
    };
  }, [active, handleClick]);

  return containerRef;
}

/**
 * Hook for ESC key dismissal. Often used alongside outside-click.
 *
 * @example
 * ```tsx
 * useEscapeKey(isOpen, () => setIsOpen(false));
 * ```
 */
export function useEscapeKey(
  active: boolean,
  onEscape: () => void,
): void {
  const callbackRef = useRef(onEscape);
  useEffect(() => {
    callbackRef.current = onEscape;
  }, [onEscape]);

  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        callbackRef.current();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [active]);
}
