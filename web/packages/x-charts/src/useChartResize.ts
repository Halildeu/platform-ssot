import { useState, useEffect, useRef, type RefObject } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ChartResizeState {
  /** Current container width in pixels. */
  width: number;
  /** Current container height in pixels. */
  height: number;
  /** True while the container is actively being resized (debounced). */
  isResizing: boolean;
}

export interface UseChartResizeOptions {
  /** Debounce delay in ms before committing a resize. @default 150 */
  debounceMs?: number;
  /** Initial width if the container hasn't been measured yet. @default 0 */
  initialWidth?: number;
  /** Initial height if the container hasn't been measured yet. @default 0 */
  initialHeight?: number;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

/**
 * Observes the dimensions of a container element via `ResizeObserver`
 * and returns debounced width/height values plus an `isResizing` flag.
 *
 * Works standalone — no charting library dependency.
 */
export function useChartResize(
  containerRef: RefObject<HTMLElement | null>,
  options: UseChartResizeOptions = {},
): ChartResizeState {
  const { debounceMs = 150, initialWidth = 0, initialHeight = 0 } = options;

  const [size, setSize] = useState<{ width: number; height: number }>({
    width: initialWidth,
    height: initialHeight,
  });
  const [isResizing, setIsResizing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Measure immediately on mount
    const rect = el.getBoundingClientRect();
    setSize({ width: Math.round(rect.width), height: Math.round(rect.height) });

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        setIsResizing(true);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
          setSize({ width: Math.round(w), height: Math.round(h) });
          setIsResizing(false);
        }, debounceMs);
      }
    });

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [containerRef, debounceMs]);

  return { ...size, isResizing };
}

export default useChartResize;
