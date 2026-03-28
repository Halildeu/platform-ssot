import React from 'react';
import { Text } from '@mfe/design-system';

interface SLOMetric {
  name: string;
  target: string;
  current: number; // 0-100
  status: 'healthy' | 'warning' | 'critical';
  budgetRemaining: number; // percentage
}

interface SLOTrackerProps {
  metrics: SLOMetric[];
}

export type { SLOMetric };

export function SLOTracker({ metrics }: SLOTrackerProps) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {metrics.map((m) => {
        const colorMap = { healthy: 'emerald', warning: 'amber', critical: 'red' } as const;
        const color = colorMap[m.status];
        const strokeClasses = {
          emerald: 'text-state-success-text',
          amber: 'text-state-warning-text',
          red: 'text-state-danger-text',
        };
        const badgeBgClasses = {
          emerald: 'bg-state-success-bg text-state-success-text dark:bg-state-success-text/30 dark:text-state-success-text',
          amber: 'bg-state-warning-bg text-state-warning-text dark:bg-state-warning-text/30 dark:text-state-warning-text',
          red: 'bg-state-danger-bg text-state-danger-text dark:bg-state-danger-text/30 dark:text-state-danger-text',
        };
        const r = 32;
        const circumference = 2 * Math.PI * r;
        const offset = circumference - (m.current / 100) * circumference;

        return (
          <div key={m.name} className="flex flex-col items-center gap-2 rounded-xl border border-border-subtle bg-surface-default p-4">
            <div className="relative h-20 w-20">
              <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r={r} fill="none" stroke="currentColor" strokeWidth="4" className="text-surface-muted" />
                <circle cx="40" cy="40" r={r} fill="none" strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className={strokeClasses[color]} />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold tabular-nums text-text-primary">
                {m.current}%
              </span>
            </div>
            <Text className="text-xs font-semibold text-text-primary">{m.name}</Text>
            <Text className="text-[10px] text-text-secondary">Hedef: {m.target}</Text>
            <div className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${badgeBgClasses[color]}`}>
              Bütçe: %{m.budgetRemaining}
            </div>
          </div>
        );
      })}
    </div>
  );
}
