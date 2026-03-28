import React from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface MetricStripStat {
  label: string;
  value: string | number;
  change?: number;
}

export interface MetricStripBlockProps {
  stats: MetricStripStat[];
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function MetricStripBlock({ stats }: MetricStripBlockProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '1.5rem',
        overflowX: 'auto',
        padding: '1rem 0',
      }}
    >
      {stats.map((stat, idx) => (
        <div
          key={idx}
          style={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: '120px',
            padding: '0.75rem 1rem',
            borderRight:
              idx < stats.length - 1
                ? '1px solid var(--color-border, #e2e8f0)'
                : 'none',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-secondary, #64748b)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {stat.label}
          </span>
          <span
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'var(--color-text-primary, #0f172a)',
              marginTop: '0.25rem',
            }}
          >
            {stat.value}
          </span>
          {stat.change != null && (
            <span
              style={{
                fontSize: '0.75rem',
                marginTop: '0.125rem',
                color:
                  stat.change > 0
                    ? 'var(--color-success, #16a34a)'
                    : stat.change < 0
                      ? 'var(--color-error, #dc2626)'
                      : 'var(--color-text-secondary, #64748b)',
              }}
            >
              {stat.change > 0 ? '+' : ''}
              {stat.change}%
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
