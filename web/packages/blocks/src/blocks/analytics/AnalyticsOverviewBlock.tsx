import React from 'react';
import type { ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface AnalyticsMetric {
  label: string;
  value: string;
  change: number;
}

export interface AnalyticsOverviewBlockProps {
  period: string;
  metrics: AnalyticsMetric[];
  chart?: ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function AnalyticsOverviewBlock({
  period,
  metrics,
  chart,
}: AnalyticsOverviewBlockProps) {
  return (
    <div>
      {/* Period label */}
      <div
        style={{
          fontSize: '0.8125rem',
          color: 'var(--color-text-secondary, #64748b)',
          marginBottom: '1rem',
        }}
      >
        Period: <strong>{period}</strong>
      </div>

      {/* Metric cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1.5rem',
        }}
      >
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            style={{
              padding: '1rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--color-border, #e2e8f0)',
              backgroundColor: 'var(--color-surface, #fff)',
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-secondary, #64748b)',
                marginBottom: '0.375rem',
              }}
            >
              {metric.label}
            </div>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--color-text-primary, #0f172a)',
              }}
            >
              {metric.value}
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                marginTop: '0.25rem',
                color:
                  metric.change > 0
                    ? 'var(--color-success, #16a34a)'
                    : metric.change < 0
                      ? 'var(--color-error, #dc2626)'
                      : 'var(--color-text-secondary, #64748b)',
              }}
            >
              {metric.change > 0 ? '+' : ''}
              {metric.change}%
            </div>
          </div>
        ))}
      </div>

      {/* Chart area */}
      {chart && (
        <div
          style={{
            padding: '1rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--color-border, #e2e8f0)',
            backgroundColor: 'var(--color-surface, #fff)',
            minHeight: '300px',
          }}
        >
          {chart}
        </div>
      )}
    </div>
  );
}
