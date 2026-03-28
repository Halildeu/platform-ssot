/**
 * Defers rendering of non-critical content until after first paint.
 *
 * Returns `false` on the first render and switches to `true` after the
 * specified delay (default 0 ms — i.e. next micro-task after paint).
 *
 * Useful for below-the-fold or secondary UI that should not block
 * initial paint metrics (FCP / LCP).
 *
 * @example
 * ```tsx
 * function Dashboard() {
 *   const ready = useDeferredRender();
 *   return (
 *     <>
 *       <HeroSection />
 *       {ready && <HeavyAnalyticsWidget />}
 *     </>
 *   );
 * }
 * ```
 */
export declare function useDeferredRender(delay?: number): boolean;
