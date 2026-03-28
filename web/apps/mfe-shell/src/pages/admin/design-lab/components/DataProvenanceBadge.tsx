import React from 'react';

type ProvenanceLevel = 'live' | 'ci' | 'derived' | 'simulated';

interface DataProvenanceBadgeProps {
  level: ProvenanceLevel;
  className?: string;
}

const CONFIG: Record<ProvenanceLevel, { label: string; color: string; icon: string }> = {
  live: { label: 'Canli Veri', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: '\u25CF' },
  ci: { label: 'CI Verisi', color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400', icon: '\u25B2' },
  derived: { label: 'Turetilmis', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: '\u25C6' },
  simulated: { label: 'Simule', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: '\u25CB' },
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
