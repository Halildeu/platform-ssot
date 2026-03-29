import React from 'react';
import { KPIDashboardBlock } from '../blocks/dashboard/KPIDashboardBlock';
import type { KPIMetric } from '../blocks/dashboard/KPIDashboardBlock';
import { ChartGridBlock } from '../blocks/dashboard/ChartGridBlock';
import type { ChartGridItem } from '../blocks/dashboard/ChartGridBlock';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ActivityItem {
  id: string;
  text: string;
  time: string;
}

export interface DashboardPageTemplateProps {
  title: string;
  kpis: KPIMetric[];
  charts?: ChartGridItem[];
  recentActivity?: ActivityItem[];
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function DashboardPageTemplate({
  title,
  kpis,
  charts,
  recentActivity,
}: DashboardPageTemplateProps) {
  return (
    <div>
      <h1
        style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--color-text-primary))',
          margin: '0 0 1.5rem 0',
        }}
      >
        {title}
      </h1>

      {/* KPI row */}
      <div style={{ marginBottom: '1.5rem' }}>
        <KPIDashboardBlock metrics={kpis} />
      </div>

      {/* Charts */}
      {charts && charts.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <ChartGridBlock charts={charts} />
        </div>
      )}

      {/* Recent activity */}
      {recentActivity && recentActivity.length > 0 && (
        <div
          style={{
            padding: '1rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--color-border))',
            backgroundColor: 'var(--color-surface))',
          }}
        >
          <h2
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--color-text-primary))',
              margin: '0 0 0.75rem 0',
            }}
          >
            Recent Activity
          </h2>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {recentActivity.map((item) => (
              <li
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid var(--color-border))',
                  fontSize: '0.875rem',
                }}
              >
                <span style={{ color: 'var(--color-text-primary))' }}>
                  {item.text}
                </span>
                <span
                  style={{
                    color: 'var(--color-text-secondary))',
                    fontSize: '0.75rem',
                    whiteSpace: 'nowrap',
                    marginLeft: '1rem',
                  }}
                >
                  {item.time}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
