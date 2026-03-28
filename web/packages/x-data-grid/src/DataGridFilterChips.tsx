import React from 'react';
import { cn } from '@mfe/design-system';

export interface ActiveFilter {
  key: string;
  label: string;
  value: string;
  onRemove: () => void;
}

export interface DataGridFilterChipsProps {
  filters: ActiveFilter[];
  onClearAll?: () => void;
  className?: string;
  clearAllLabel?: string;
}

export function DataGridFilterChips({ filters, onClearAll, className, clearAllLabel = 'Clear all' }: DataGridFilterChipsProps) {
  if (filters.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-2 px-4 py-2 border-b border-border-subtle bg-surface-canvas/50', className)}>
      {filters.map((filter) => (
        <span
          key={filter.key}
          className="inline-flex items-center gap-1.5 rounded-full bg-action-primary/10 px-3 py-1 text-xs font-medium text-action-primary"
        >
          <span className="text-text-secondary">{filter.label}:</span>
          <span>{filter.value}</span>
          <button
            type="button"
            onClick={filter.onRemove}
            className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-action-primary/20 transition-colors"
            aria-label={`Remove ${filter.label} filter`}
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}
      {onClearAll && filters.length > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-text-secondary hover:text-text-primary underline-offset-2 hover:underline transition-colors"
        >
          {clearAllLabel}
        </button>
      )}
    </div>
  );
}
