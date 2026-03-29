import React from 'react';
import type { ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ChartGridItem {
  title: string;
  children: ReactNode;
}

export interface ChartGridBlockProps {
  charts: ChartGridItem[];
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ChartGridBlock({ charts }: ChartGridBlockProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
      }}
    >
      {charts.map((chart, idx) => (
        <div
          key={idx}
          style={{
            padding: '1rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--color-border))',
            backgroundColor: 'var(--color-surface))',
          }}
        >
          <h3
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--color-text-primary))',
              marginBottom: '0.75rem',
              margin: '0 0 0.75rem 0',
            }}
          >
            {chart.title}
          </h3>
          <div style={{ minHeight: '200px' }}>{chart.children}</div>
        </div>
      ))}
    </div>
  );
}
