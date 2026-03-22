/**
 * Observability Landing Page
 *
 * Combines all observability panels:
 * 1. Web Vitals (6.4)
 * 2. MF Health (6.7)
 * 3. Synthetic Monitor results (if available)
 * 4. Link to Sentry dashboard
 */

import React, { lazy, Suspense } from 'react';
import { Activity, Heart, Radar, ExternalLink } from 'lucide-react';
import { Text } from '@mfe/design-system';

const WebVitalsPanel = lazy(() => import('../observability/WebVitalsPanel'));
const MFHealthPanel = lazy(() => import('../observability/MFHealthPanel'));

function PanelSkeleton() {
  return (
    <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-border-subtle bg-surface-default">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-border-subtle border-t-action-primary" />
    </div>
  );
}

export default function ObservabilityPage() {
  return (
    <div className="space-y-8 pb-12">
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
            Synthetic monitor <code className="rounded bg-surface-canvas px-1.5 py-0.5 text-xs font-mono">npm run monitor:synthetic</code> komutuyla calistirilabilir.
          </p>
          <p className="mt-2">
            Kontrol edilen akislar: Shell boot, Design Lab landing, Component detail, Quality dashboard, Docs portal
          </p>
        </div>
      </section>

      {/* External Links */}
      <section className="grid gap-4 sm:grid-cols-2">
        <a
          href="#"
          className="group flex items-center gap-4 rounded-2xl border border-border-subtle bg-surface-default p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-default hover:shadow-lg"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10">
            <Heart className="h-5 w-5 text-rose-600" />
          </div>
          <div className="min-w-0 flex-1">
            <Text as="div" className="text-sm font-semibold text-text-primary">
              Sentry Dashboard
            </Text>
            <Text variant="secondary" className="mt-0.5 text-xs">
              Hata izleme, performans metrikleri, session replay
            </Text>
          </div>
          <ExternalLink className="h-4 w-4 shrink-0 text-text-secondary opacity-0 transition-opacity group-hover:opacity-100" />
        </a>

        <a
          href="#"
          className="group flex items-center gap-4 rounded-2xl border border-border-subtle bg-surface-default p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-default hover:shadow-lg"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10">
            <Activity className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="min-w-0 flex-1">
            <Text as="div" className="text-sm font-semibold text-text-primary">
              OpenTelemetry Traces
            </Text>
            <Text variant="secondary" className="mt-0.5 text-xs">
              Dagitik izleme, trace propagation, span analizi
            </Text>
          </div>
          <ExternalLink className="h-4 w-4 shrink-0 text-text-secondary opacity-0 transition-opacity group-hover:opacity-100" />
        </a>
      </section>
    </div>
  );
}
