/**
 * Real User Monitoring — Web Vitals + custom metrics
 * Integrates with Sentry performance monitoring
 */

interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  id: string;
}

const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  INP: { good: 200, poor: 500 },
  TTFB: { good: 800, poor: 1800 },
};

function getRating(name: string, value: number): WebVitalMetric['rating'] {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

function reportMetric(metric: WebVitalMetric): void {
  // Send to Sentry as custom measurement
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof window !== 'undefined' && (window as any).__SENTRY__) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Sentry = (window as any).__SENTRY__;
      Sentry.setMeasurement?.(metric.name, metric.value, 'millisecond');
    } catch {
      // Sentry not available, skip
    }
  }

  // Console in development
  if (process.env.NODE_ENV === 'development') {
    const color = metric.rating === 'good' ? '32' : metric.rating === 'poor' ? '31' : '33';
    console.log(
      `[RUM] \x1b[${color}m${metric.name}: ${metric.value.toFixed(1)}ms (${metric.rating})\x1b[0m`
    );
  }
}

export function initRUM(): void {
  if (typeof window === 'undefined') return;
  if (typeof PerformanceObserver === 'undefined') return;

  // Largest Contentful Paint
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1];
      if (last) {
        reportMetric({
          name: 'LCP',
          value: last.startTime,
          rating: getRating('LCP', last.startTime),
          id: `lcp-${Date.now()}`,
        });
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch { /* unsupported */ }

  // First Input Delay
  try {
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fid = (entry as any).processingStart - entry.startTime;
        reportMetric({
          name: 'FID',
          value: fid,
          rating: getRating('FID', fid),
          id: `fid-${Date.now()}`,
        });
      }
    });
    fidObserver.observe({ type: 'first-input', buffered: true });
  } catch { /* unsupported */ }

  // Cumulative Layout Shift
  try {
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(entry as any).hadRecentInput) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          clsValue += (entry as any).value;
        }
      }
      reportMetric({
        name: 'CLS',
        value: clsValue,
        rating: getRating('CLS', clsValue),
        id: `cls-${Date.now()}`,
      });
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch { /* unsupported */ }

  // Time to First Byte
  try {
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navEntry) {
      reportMetric({
        name: 'TTFB',
        value: navEntry.responseStart,
        rating: getRating('TTFB', navEntry.responseStart),
        id: `ttfb-${Date.now()}`,
      });
    }
  } catch { /* unsupported */ }
}
