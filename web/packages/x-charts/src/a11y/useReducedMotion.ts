/**
 * useReducedMotion — Reactive hook for prefers-reduced-motion
 *
 * Listens to OS-level motion preference changes and returns current state.
 * Charts should disable animation when this returns true.
 *
 * @see chart-viz-engine-selection D-009 (a11y)
 */
import { useState, useEffect } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function getInitialState(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(QUERY).matches;
}

/**
 * Returns `true` when the user's OS prefers reduced motion.
 *
 * @example
 * ```tsx
 * const reducedMotion = useReducedMotion();
 * <BarChart animate={!reducedMotion} />
 * ```
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(getInitialState);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return reduced;
}
