/**
 * Observability Landing Page
 *
 * Combines all observability panels:
 * 1. Web Vitals (6.4)
 * 2. MF Health (6.7)
 * 3. Error Summary Panel (Sentry-derived)
 * 4. Performance Budget Panel (RUM thresholds)
 * 5. Infrastructure Status (backend health grid)
 * 6. Log Stream links (Grafana/Loki/Tempo)
 * 7. Synthetic Monitor info
 * 8. External links (Sentry, Grafana, Loki, Tempo)
 */

import React, { lazy, Suspense, useEffect, useState, useCallback } from 'react';
import {
  Activity,
  Heart,
  Radar,
  ExternalLink,
  AlertTriangle,
  Gauge,
  Server,
  ScrollText,
  BarChart3,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { Text } from '@mfe/design-system';
import { DataProvenanceBadge } from '../components/DataProvenanceBadge';

const WebVitalsPanel = lazy(() => import('../observability/WebVitalsPanel'));
const MFHealthPanel = lazy(() => import('../observability/MFHealthPanel'));

function PanelSkeleton() {
  return (
    <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-border-subtle bg-surface-default">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-border-subtle border-t-action-primary" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Error Summary Panel                                                */
/* ------------------------------------------------------------------ */

type ErrorEntry = { message: string; count: number };
type ErrorTrend = { day: string; count: number };

function useErrorSummary() {
  const [data, setData] = useState<{
    total24h: number;
    topErrors: ErrorEntry[];
    trend: ErrorTrend[];
  } | null>(null);

  useEffect(() => {
    // Try reading from Sentry integration, fall back to sample data
    const sentryErrors = (window as Record<string, unknown>).__SENTRY_ERRORS__;
    if (sentryErrors && Array.isArray(sentryErrors)) {
      const last24h = sentryErrors.filter((e: Record<string, unknown>) => {
        const ts = e.timestamp as number | undefined;
        return ts && Date.now() - ts < 86_400_000;
      });
      const msgCounts = new Map<string, number>();
      for (const err of last24h) {
        const msg = String((err as Record<string, unknown>).message ?? 'Unknown');
        msgCounts.set(msg, (msgCounts.get(msg) ?? 0) + 1);
      }
      const topErrors = [...msgCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([message, count]) => ({ message, count }));

      setData({
        total24h: last24h.length,
        topErrors,
        trend: generateTrendFromErrors(sentryErrors as Array<Record<string, unknown>>),
      });
    } else {
      // Sample derived data for demonstration
      setData({
        total24h: 12,
        topErrors: [
          { message: 'ChunkLoadError: Loading chunk 42 failed', count: 5 },
          { message: 'TypeError: Cannot read properties of undefined', count: 4 },
          { message: 'NetworkError: Failed to fetch', count: 3 },
        ],
        trend: [
          { day: 'Mon', count: 8 },
          { day: 'Tue', count: 15 },
          { day: 'Wed', count: 6 },
          { day: 'Thu', count: 22 },
          { day: 'Fri', count: 12 },
          { day: 'Sat', count: 3 },
          { day: 'Sun', count: 12 },
        ],
      });
    }
  }, []);

  return data;
}

function generateTrendFromErrors(
  errors: Array<Record<string, unknown>>,
): ErrorTrend[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const counts = new Map<string, number>();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86_400_000);
    counts.set(days[d.getDay()], 0);
  }
  for (const e of errors) {
    const ts = e.timestamp as number | undefined;
    if (!ts || Date.now() - ts > 7 * 86_400_000) continue;
    const d = new Date(ts);
    const key = days[d.getDay()];
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()].map(([day, count]) => ({ day, count }));
}

function ErrorSummaryPanel() {
  const data = useErrorSummary();

  if (!data) {
    return <PanelSkeleton />;
  }

  const maxTrend = Math.max(...data.trend.map((t) => t.count), 1);

  return (
    <section className="rounded-2xl border border-border-subtle bg-surface-default p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10">
            <AlertTriangle className="h-4 w-4 text-rose-600" />
          </div>
          <div>
            <Text as="h3" className="text-lg font-semibold text-text-primary">
              Error Summary
            </Text>
            <Text variant="secondary" className="text-xs">
              Son 24 saat hata ozeti
            </Text>
          </div>
        </div>
        <DataProvenanceBadge level="derived" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {/* Left: total + top errors */}
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-text-primary">
              {data.total24h}
            </span>
            <Text variant="secondary" className="text-sm">
              hata (24s)
            </Text>
          </div>
          <div className="flex flex-col mt-3 gap-2">
            {data.topErrors.map((err, i) => (
              <div
                key={i}
                className="flex items-start gap-2 rounded-lg bg-surface-muted p-2"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-rose-100 text-[10px] font-bold text-rose-700">
                  {err.count}
                </span>
                <Text className="text-xs text-text-secondary line-clamp-2 font-mono">
                  {err.message}
                </Text>
              </div>
            ))}
          </div>
        </div>

        {/* Right: 7-day trend bar chart */}
        <div>
          <Text variant="secondary" className="mb-2 text-xs font-medium">
            7-Gun Trend
          </Text>
          <div className="flex items-end gap-1.5" style={{ height: 80 }}>
            {data.trend.map((t) => (
              <div key={t.day} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-rose-400 transition-all"
                  style={{
                    height: `${Math.max((t.count / maxTrend) * 60, 2)}px`,
                  }}
                />
                <Text className="text-[9px] text-text-secondary">{t.day}</Text>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Performance Budget Panel                                           */
/* ------------------------------------------------------------------ */

type PerfMetric = {
  name: string;
  key: string;
  budget: number;
  warnThreshold: number;
  unit: string;
};

const PERF_BUDGETS: PerfMetric[] = [
  { name: 'TTFB', key: 'ttfb', budget: 200, warnThreshold: 150, unit: 'ms' },
  { name: 'FCP', key: 'fcp', budget: 1800, warnThreshold: 1200, unit: 'ms' },
  { name: 'LCP', key: 'lcp', budget: 2500, warnThreshold: 2000, unit: 'ms' },
  { name: 'CLS', key: 'cls', budget: 0.1, warnThreshold: 0.05, unit: '' },
  { name: 'INP', key: 'inp', budget: 200, warnThreshold: 100, unit: 'ms' },
];

function usePerfBudgetValues(): Map<string, number | null> {
  const [values, setValues] = useState<Map<string, number | null>>(new Map());

  useEffect(() => {
    const map = new Map<string, number | null>();

    // Try to get real RUM data from PerformanceObserver entries
    try {
      const nav = performance.getEntriesByType(
        'navigation',
      )[0] as PerformanceNavigationTiming | undefined;
      if (nav) {
        map.set('ttfb', Math.round(nav.responseStart - nav.requestStart));
      }

      const paints = performance.getEntriesByType('paint');
      const fcp = paints.find((e) => e.name === 'first-contentful-paint');
      if (fcp) {
        map.set('fcp', Math.round(fcp.startTime));
      }

      // LCP via stored value from web-vitals or PerformanceObserver
      const lcpVal = (window as Record<string, unknown>).__LCP_VALUE__;
      if (typeof lcpVal === 'number') {
        map.set('lcp', Math.round(lcpVal));
      }

      // CLS via stored value
      const clsVal = (window as Record<string, unknown>).__CLS_VALUE__;
      if (typeof clsVal === 'number') {
        map.set('cls', Math.round(clsVal * 1000) / 1000);
      }

      // INP via stored value
      const inpVal = (window as Record<string, unknown>).__INP_VALUE__;
      if (typeof inpVal === 'number') {
        map.set('inp', Math.round(inpVal));
      }
    } catch {
      // Performance API not available
    }

    setValues(map);
  }, []);

  return values;
}

function getBudgetStatus(
  value: number | null | undefined,
  metric: PerfMetric,
): 'pass' | 'warn' | 'fail' | 'measuring' {
  if (value == null) return 'measuring';
  if (value <= metric.warnThreshold) return 'pass';
  if (value <= metric.budget) return 'warn';
  return 'fail';
}

const STATUS_COLORS = {
  pass: 'bg-emerald-100 text-emerald-700',
  warn: 'bg-amber-100 text-amber-700',
  fail: 'bg-rose-100 text-rose-700',
  measuring: 'bg-surface-muted text-text-secondary',
};

const STATUS_LABELS = {
  pass: 'PASS',
  warn: 'WARN',
  fail: 'FAIL',
  measuring: '...',
};

function PerformanceBudgetPanel() {
  const values = usePerfBudgetValues();

  return (
    <section className="rounded-2xl border border-border-subtle bg-surface-default p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <Gauge className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <Text as="h3" className="text-lg font-semibold text-text-primary">
              Performance Budget
            </Text>
            <Text variant="secondary" className="text-xs">
              Core Web Vitals butce esikleri
            </Text>
          </div>
        </div>
        <DataProvenanceBadge level="live" />
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle text-left">
              <th className="pb-2 pr-4 text-xs font-medium text-text-secondary">
                Metrik
              </th>
              <th className="pb-2 pr-4 text-xs font-medium text-text-secondary">
                Mevcut
              </th>
              <th className="pb-2 pr-4 text-xs font-medium text-text-secondary">
                Butce
              </th>
              <th className="pb-2 text-xs font-medium text-text-secondary">
                Durum
              </th>
            </tr>
          </thead>
          <tbody>
            {PERF_BUDGETS.map((metric) => {
              const value = values.get(metric.key);
              const status = getBudgetStatus(value, metric);
              const displayValue =
                value != null
                  ? metric.key === 'cls'
                    ? value.toFixed(3)
                    : `${value}${metric.unit}`
                  : 'olculuyor...';

              return (
                <tr
                  key={metric.key}
                  className="border-b border-border-subtle/50"
                >
                  <td className="py-2.5 pr-4 font-mono text-xs font-semibold text-text-primary">
                    {metric.name}
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-xs text-text-primary">
                    {displayValue}
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-xs text-text-secondary">
                    {metric.key === 'cls'
                      ? `< ${metric.budget}`
                      : `< ${metric.budget}${metric.unit}`}
                  </td>
                  <td className="py-2.5">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLORS[status]}`}
                    >
                      {STATUS_LABELS[status]}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Infrastructure Status Panel                                        */
/* ------------------------------------------------------------------ */

type ServiceStatus = {
  name: string;
  status: 'UP' | 'DOWN' | 'UNKNOWN';
  responseTime: number | null;
};

const BACKEND_SERVICES = [
  { name: 'auth', url: 'http://localhost:8088/actuator/health' },
  { name: 'user', url: 'http://localhost:8089/actuator/health' },
  { name: 'permission', url: 'http://localhost:8090/actuator/health' },
  { name: 'variant', url: 'http://localhost:8091/actuator/health' },
  { name: 'core-data', url: 'http://localhost:8092/actuator/health' },
  { name: 'report', url: 'http://localhost:8095/actuator/health' },
  { name: 'gateway', url: 'http://localhost:8080/actuator/health' },
  { name: 'keycloak', url: 'http://localhost:8081/' },
];

function useInfraStatus(): ServiceStatus[] {
  const [statuses, setStatuses] = useState<ServiceStatus[]>(() =>
    BACKEND_SERVICES.map((s) => ({
      name: s.name,
      status: 'UNKNOWN',
      responseTime: null,
    })),
  );

  useEffect(() => {
    let cancelled = false;

    async function checkAll() {
      const results = await Promise.all(
        BACKEND_SERVICES.map(async (svc) => {
          const start = performance.now();
          try {
            const res = await fetch(svc.url, {
              signal: AbortSignal.timeout(5000),
            });
            const elapsed = Math.round(performance.now() - start);
            if (res.ok) {
              return {
                name: svc.name,
                status: 'UP' as const,
                responseTime: elapsed,
              };
            }
            return {
              name: svc.name,
              status: 'DOWN' as const,
              responseTime: elapsed,
            };
          } catch {
            return {
              name: svc.name,
              status: 'UNKNOWN' as const,
              responseTime: null,
            };
          }
        }),
      );
      if (!cancelled) setStatuses(results);
    }

    checkAll();
    return () => {
      cancelled = true;
    };
  }, []);

  return statuses;
}

const SERVICE_STATUS_ICON: Record<string, React.ReactNode> = {
  UP: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
  DOWN: <XCircle className="h-4 w-4 text-rose-600" />,
  UNKNOWN: <HelpCircle className="h-4 w-4 text-text-secondary" />,
};

function InfraStatusPanel() {
  const statuses = useInfraStatus();
  const upCount = statuses.filter((s) => s.status === 'UP').length;

  return (
    <section className="rounded-2xl border border-border-subtle bg-surface-default p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
            <Server className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <Text as="h3" className="text-lg font-semibold text-text-primary">
              Infrastructure Status
            </Text>
            <Text variant="secondary" className="text-xs">
              Backend servis saglik durumu ({upCount}/{statuses.length} UP)
            </Text>
          </div>
        </div>
        <DataProvenanceBadge level="live" />
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {statuses.map((svc) => (
          <div
            key={svc.name}
            className="flex items-center gap-2.5 rounded-xl border border-border-subtle/50 bg-surface-muted px-3 py-2.5"
          >
            {SERVICE_STATUS_ICON[svc.status]}
            <div className="min-w-0 flex-1">
              <Text className="text-xs font-semibold text-text-primary">
                {svc.name}
              </Text>
              <Text variant="secondary" className="text-[10px]">
                {svc.status}
                {svc.responseTime != null && ` \u00B7 ${svc.responseTime}ms`}
              </Text>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Log Stream Panel                                                   */
/* ------------------------------------------------------------------ */

function LogStreamPanel() {
  return (
    <section className="rounded-2xl border border-border-subtle bg-surface-default p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
            <ScrollText className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <Text as="h3" className="text-lg font-semibold text-text-primary">
              Log Stream
            </Text>
            <Text variant="secondary" className="text-xs">
              Log ve trace kaynaklarina erisim
            </Text>
          </div>
        </div>
        <DataProvenanceBadge level="derived" />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <a
          href="http://localhost:3010/explore"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 rounded-xl border border-border-subtle/50 bg-surface-muted p-3 transition hover:border-border-default hover:shadow-xs"
        >
          <BarChart3 className="h-5 w-5 text-amber-600" />
          <div className="min-w-0 flex-1">
            <Text className="text-sm font-semibold text-text-primary">
              Grafana Loki
            </Text>
            <Text variant="secondary" className="text-xs">
              Log kayitlari arama ve analiz
            </Text>
          </div>
          <ExternalLink className="h-3.5 w-3.5 text-text-secondary opacity-0 transition-opacity group-hover:opacity-100" />
        </a>

        <a
          href="http://localhost:3010/explore"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 rounded-xl border border-border-subtle/50 bg-surface-muted p-3 transition hover:border-border-default hover:shadow-xs"
        >
          <Activity className="h-5 w-5 text-indigo-600" />
          <div className="min-w-0 flex-1">
            <Text className="text-sm font-semibold text-text-primary">
              Grafana Tempo
            </Text>
            <Text variant="secondary" className="text-xs">
              Dagitik izleme ve trace analizi
            </Text>
          </div>
          <ExternalLink className="h-3.5 w-3.5 text-text-secondary opacity-0 transition-opacity group-hover:opacity-100" />
        </a>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function ObservabilityPage() {
  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
            <Activity className="h-5 w-5 text-cyan-600" />
          </div>
          <div>
            <Text as="h1" className="text-2xl font-bold text-text-primary">
              Observability
            </Text>
            <Text variant="secondary" className="text-sm">
              Canli performans, saglik ve izleme verileri
            </Text>
          </div>
        </div>
      </div>

      {/* Web Vitals Panel */}
      <section className="rounded-2xl border border-border-subtle bg-surface-default p-6">
        <Suspense fallback={<PanelSkeleton />}>
          <WebVitalsPanel />
        </Suspense>
      </section>

      {/* MF Health Panel */}
      <section className="rounded-2xl border border-border-subtle bg-surface-default p-6">
        <Suspense fallback={<PanelSkeleton />}>
          <MFHealthPanel />
        </Suspense>
      </section>

      {/* Error Summary Panel */}
      <ErrorSummaryPanel />

      {/* Performance Budget Panel */}
      <PerformanceBudgetPanel />

      {/* Infrastructure Status */}
      <InfraStatusPanel />

      {/* Log Stream */}
      <LogStreamPanel />

      {/* Synthetic Monitor Info */}
      <section className="rounded-2xl border border-border-subtle bg-surface-default p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
            <Radar className="h-4 w-4 text-violet-600" />
          </div>
          <div>
            <Text as="h3" className="text-lg font-semibold text-text-primary">
              Synthetic Monitor
            </Text>
            <Text variant="secondary" className="text-xs">
              Kritik akislarin otomatik duman testleri
            </Text>
          </div>
        </div>
        <div className="mt-4 rounded-xl bg-surface-muted p-4 text-sm text-text-secondary">
          <p>
            Synthetic monitor{' '}
            <code className="rounded-sm bg-surface-canvas px-1.5 py-0.5 text-xs font-mono">
              npm run monitor:synthetic
            </code>{' '}
            komutuyla calistirilabilir.
          </p>
          <p className="mt-2">
            Kontrol edilen akislar: Shell boot, Design Lab landing, Component
            detail, Quality dashboard, Docs portal
          </p>
        </div>
      </section>

      {/* External Links */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <a
          href="#"
          className="group flex items-center gap-4 rounded-2xl border border-border-subtle bg-surface-default p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-default hover:shadow-lg"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10">
            <Heart className="h-5 w-5 text-rose-600" />
          </div>
          <div className="min-w-0 flex-1">
            <Text as="div" className="text-sm font-semibold text-text-primary">
              Sentry
            </Text>
            <Text variant="secondary" className="mt-0.5 text-xs">
              Hata izleme ve session replay
            </Text>
          </div>
          <ExternalLink className="h-4 w-4 shrink-0 text-text-secondary opacity-0 transition-opacity group-hover:opacity-100" />
        </a>

        <a
          href="http://localhost:3010"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 rounded-2xl border border-border-subtle bg-surface-default p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-default hover:shadow-lg"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
            <BarChart3 className="h-5 w-5 text-amber-600" />
          </div>
          <div className="min-w-0 flex-1">
            <Text as="div" className="text-sm font-semibold text-text-primary">
              Grafana
            </Text>
            <Text variant="secondary" className="mt-0.5 text-xs">
              Dashboard ve metrik goruntuleme
            </Text>
          </div>
          <ExternalLink className="h-4 w-4 shrink-0 text-text-secondary opacity-0 transition-opacity group-hover:opacity-100" />
        </a>

        <a
          href="http://localhost:3010/explore"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 rounded-2xl border border-border-subtle bg-surface-default p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-default hover:shadow-lg"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">
            <ScrollText className="h-5 w-5 text-cyan-600" />
          </div>
          <div className="min-w-0 flex-1">
            <Text as="div" className="text-sm font-semibold text-text-primary">
              Loki
            </Text>
            <Text variant="secondary" className="mt-0.5 text-xs">
              Log arama (Loki datasource)
            </Text>
          </div>
          <ExternalLink className="h-4 w-4 shrink-0 text-text-secondary opacity-0 transition-opacity group-hover:opacity-100" />
        </a>

        <a
          href="http://localhost:3010/explore"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 rounded-2xl border border-border-subtle bg-surface-default p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-default hover:shadow-lg"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10">
            <Activity className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="min-w-0 flex-1">
            <Text as="div" className="text-sm font-semibold text-text-primary">
              Tempo
            </Text>
            <Text variant="secondary" className="mt-0.5 text-xs">
              Dagitik trace analizi (Tempo datasource)
            </Text>
          </div>
          <ExternalLink className="h-4 w-4 shrink-0 text-text-secondary opacity-0 transition-opacity group-hover:opacity-100" />
        </a>
      </section>
    </div>
  );
}
