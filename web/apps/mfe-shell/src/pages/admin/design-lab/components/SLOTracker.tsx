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
          emerald: 'text-emerald-500',
          amber: 'text-amber-500',
          red: 'text-red-500',
        };
        const badgeBgClasses = {
          emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
          amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
          red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
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
