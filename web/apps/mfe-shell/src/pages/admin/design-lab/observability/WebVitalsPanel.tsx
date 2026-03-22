/**
 * Web Vitals RUM Dashboard Panel
 *
 * Reads from RUM data (apps/mfe-shell/src/lib/rum.ts output)
 * Shows: LCP, FID, CLS, INP, TTFB
 *
 * Data source: derived from rum.ts telemetry if available,
 * otherwise shows "RUM verisi toplaniyor" placeholder
 */

import React, { useEffect, useState } from 'react';
import { DataProvenanceBadge } from '../components/DataProvenanceBadge';

interface VitalData {
  name: string;
  label: string;
  value: number | null;
  unit: string;
  thresholds: { good: number; needsImprovement: number };
  description: string;
}

const VITAL_CONFIGS: Omit<VitalData, 'value'>[] = [
  {
    name: 'LCP',
    label: 'Largest Contentful Paint',
    unit: 's',
    thresholds: { good: 2.5, needsImprovement: 4 },
    description: 'En buyuk icerigin render suresi',
  },
  {
    name: 'FID',
    label: 'First Input Delay',
    unit: 'ms',
    thresholds: { good: 100, needsImprovement: 300 },
    description: 'Ilk kullanici etkilesiminin gecikmesi',
  },
  {
    name: 'CLS',
    label: 'Cumulative Layout Shift',
    unit: '',
    thresholds: { good: 0.1, needsImprovement: 0.25 },
    description: 'Toplam gorsel kayma skoru',
  },
  {
    name: 'INP',
    label: 'Interaction to Next Paint',
    unit: 'ms',
    thresholds: { good: 200, needsImprovement: 500 },
    description: 'Etkilesimden sonraki boya suresi',
  },
  {
    name: 'TTFB',
    label: 'Time to First Byte',
    unit: 'ms',
    thresholds: { good: 800, needsImprovement: 1800 },
    description: 'Ilk byte\'in alinma suresi',
  },
];

function getRating(value: number, thresholds: { good: number; needsImprovement: number }): 'good' | 'needs-improvement' | 'poor' {
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.needsImprovement) return 'needs-improvement';
  return 'poor';
}

const RATING_COLORS: Record<string, { bg: string; text: string; ring: string; bar: string }> = {
  good: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    text: 'text-emerald-700 dark:text-emerald-400',
    ring: 'ring-emerald-200 dark:ring-emerald-800',
    bar: 'bg-emerald-500',
  },
  'needs-improvement': {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    text: 'text-amber-700 dark:text-amber-400',
    ring: 'ring-amber-200 dark:ring-amber-800',
    bar: 'bg-amber-500',
  },
  poor: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-700 dark:text-red-400',
    ring: 'ring-red-200 dark:ring-red-800',
    bar: 'bg-red-500',
  },
};

function VitalCard({ vital }: { vital: VitalData }) {
  if (vital.value === null) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-surface-default p-5 ring-1 ring-border-subtle">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {vital.name}
        </div>
        <div className="text-sm text-text-secondary">{vital.label}</div>
        <div className="mt-4 text-center text-sm italic text-text-secondary">
          RUM verisi toplaniyor...
        </div>
        <div className="mt-2 text-xs text-text-secondary">{vital.description}</div>
      </div>
    );
  }

  const rating = getRating(vital.value, vital.thresholds);
  const colors = RATING_COLORS[rating];

  // Gauge percentage (0-100) based on the poor threshold as max
  const maxVal = vital.thresholds.needsImprovement * 1.5;
  const pct = Math.min(100, (vital.value / maxVal) * 100);

  const displayValue = vital.unit === 's'
    ? `${(vital.value / 1000).toFixed(2)}s`
    : vital.unit === 'ms'
      ? `${Math.round(vital.value)}ms`
      : vital.value.toFixed(3);

  return (
    <div className={`rounded-2xl border border-border-subtle ${colors.bg} p-5 ring-1 ${colors.ring}`}>
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {vital.name}
        </div>
        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${colors.text} ${colors.bg}`}>
          {rating === 'good' ? 'Iyi' : rating === 'needs-improvement' ? 'Gelistirilmeli' : 'Kotu'}
        </span>
      </div>

      <div className={`mt-2 text-2xl font-bold tabular-nums ${colors.text}`}>
        {displayValue}
      </div>

      <div className="mt-1 text-xs text-text-secondary">{vital.label}</div>

      {/* Gauge bar */}
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
        <div
          className={`h-full rounded-full ${colors.bar} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Thresholds */}
      <div className="mt-1.5 flex justify-between text-[10px] text-text-secondary">
        <span>0</span>
        <span>{vital.thresholds.good}{vital.unit}</span>
        <span>{vital.thresholds.needsImprovement}{vital.unit}</span>
      </div>

      <div className="mt-2 text-xs text-text-secondary">{vital.description}</div>
    </div>
  );
}

export default function WebVitalsPanel() {
  const [vitals, setVitals] = useState<VitalData[]>(
    VITAL_CONFIGS.map((c) => ({ ...c, value: null })),
  );

  useEffect(() => {
    // Attempt to read RUM data from performance observers if available
    function collectVitals() {
      const collected: Record<string, number> = {};

      // TTFB from Navigation Timing
      try {
        const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
        if (navEntry?.responseStart) {
          collected['TTFB'] = navEntry.responseStart;
        }
      } catch { /* not available */ }

      // LCP from PerformanceObserver
      try {
        const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
        if (lcpEntries.length > 0) {
          collected['LCP'] = lcpEntries[lcpEntries.length - 1].startTime;
        }
      } catch { /* not available */ }

      // Update vitals with any collected data
      setVitals((prev) =>
        prev.map((v) => ({
          ...v,
          value: collected[v.name] ?? v.value,
        })),
      );
    }

    collectVitals();
    const interval = setInterval(collectVitals, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary">Web Vitals</h3>
        <DataProvenanceBadge level="derived" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {vitals.map((v) => (
          <VitalCard key={v.name} vital={v} />
        ))}
      </div>
    </div>
  );
}
