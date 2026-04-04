/**
 * Viewport-Aware Lazy Chart Initialization
 *
 * Defers ECharts init until the chart container is visible in viewport.
 * Uses IntersectionObserver for zero-cost idle tracking.
 *
 * @see contract P6 DoD: "Viewport-aware lazy initialization"
 */

import { useState, useEffect, useRef } from 'react';

export interface LazyChartOptions {
  /** Root margin for IntersectionObserver. @default '200px' (preload 200px before visible) */
  rootMargin?: string;
  /** Whether lazy loading is enabled. @default true */
  enabled?: boolean;
}

/**
 * Hook that tracks visibility and returns whether to render the chart.
 *
 * ```tsx
 * const { containerRef, shouldRender } = useLazyChart();
 * return (
 *   <div ref={containerRef}>
 *     {shouldRender ? <EChartsChart ... /> : <Placeholder />}
 *   </div>
 * );
 * ```
 */
export function useLazyChart(options?: LazyChartOptions) {
  const { rootMargin = '200px', enabled = true } = options ?? {};
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(!enabled);

  useEffect(() => {
    if (!enabled || shouldRender) return;
    const el = containerRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, shouldRender, rootMargin]);

  return { containerRef, shouldRender };
}
