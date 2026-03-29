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
            border: '1px solid var(--color-border))',
            backgroundColor: 'var(--color-surface))',
          }}
        >
          <div
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary))',
              marginBottom: '0.5rem',
            }}
          >
            {metric.title}
          </div>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: 'var(--color-text-primary))',
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
                    ? 'var(--color-success))'
                    : metric.trend.direction === 'down'
                      ? 'var(--color-error))'
                      : 'var(--color-text-secondary))',
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
