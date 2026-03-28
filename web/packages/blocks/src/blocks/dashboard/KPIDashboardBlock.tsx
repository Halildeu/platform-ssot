import React from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface KPIMetric {
  title: string;
  value: string;
  trend?: {
    direction: 'up' | 'down' | 'flat';
    value: string;
  };
}

export interface KPIDashboardBlockProps {
  metrics: KPIMetric[];
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function KPIDashboardBlock({ metrics }: KPIDashboardBlockProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1rem',
      }}
    >
      {metrics.map((metric, idx) => (
        <div
          key={idx}
          style={{
            padding: '1.25rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--color-border, #e2e8f0)',
            backgroundColor: 'var(--color-surface, #fff)',
          }}
        >
          <div
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary, #64748b)',
              marginBottom: '0.5rem',
            }}
          >
            {metric.title}
          </div>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: 'var(--color-text-primary, #0f172a)',
            }}
          >
            {metric.value}
          </div>
          {metric.trend && (
            <div
              style={{
                marginTop: '0.25rem',
                fontSize: '0.75rem',
                color:
                  metric.trend.direction === 'up'
                    ? 'var(--color-success, #16a34a)'
                    : metric.trend.direction === 'down'
                      ? 'var(--color-error, #dc2626)'
                      : 'var(--color-text-secondary, #64748b)',
              }}
            >
              {metric.trend.direction === 'up'
                ? '\u2191'
                : metric.trend.direction === 'down'
                  ? '\u2193'
                  : '\u2192'}{' '}
              {metric.trend.value}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
