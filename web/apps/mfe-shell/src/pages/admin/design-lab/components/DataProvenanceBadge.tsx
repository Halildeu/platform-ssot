import React from 'react';

type ProvenanceLevel = 'live' | 'ci' | 'derived' | 'simulated';

interface DataProvenanceBadgeProps {
  level: ProvenanceLevel;
  className?: string;
}

const CONFIG: Record<ProvenanceLevel, { label: string; color: string; icon: string }> = {
  live: { label: 'Canli Veri', color: 'bg-state-success-bg text-state-success-text dark:bg-state-success-text/30 dark:text-state-success-text', icon: '\u25CF' },
  ci: { label: 'CI Verisi', color: 'bg-action-primary/10 text-action-primary dark:bg-action-primary/30 dark:text-action-primary', icon: '\u25B2' },
  derived: { label: 'Turetilmis', color: 'bg-state-info-bg text-state-info-text dark:bg-action-primary/30 dark:text-action-primary', icon: '\u25C6' },
  simulated: { label: 'Simule', color: 'bg-state-warning-bg text-state-warning-text dark:bg-state-warning-text/30 dark:text-state-warning-text', icon: '\u25CB' },
};

export function DataProvenanceBadge({ level, className }: DataProvenanceBadgeProps) {
  const { label, color, icon } = CONFIG[level];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${color} ${className ?? ''}`}>
      <span>{icon}</span>
      {label}
    </span>
  );
}
