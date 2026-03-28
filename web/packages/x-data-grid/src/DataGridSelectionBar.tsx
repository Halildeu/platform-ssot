import React from 'react';
import { cn } from '@mfe/design-system';

export interface DataGridSelectionBarProps {
  selectedCount: number;
  onClearSelection?: () => void;
  children?: React.ReactNode; // Action buttons slot
  className?: string;
  selectedLabel?: string;
  clearLabel?: string;
}

export function DataGridSelectionBar({
  selectedCount,
  onClearSelection,
  children,
  className,
  selectedLabel = 'items selected',
  clearLabel = 'Clear selection',
}: DataGridSelectionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className={cn(
      'flex items-center justify-between gap-4 px-4 py-2.5',
      'border-b border-action-primary/20 bg-action-primary/5',
      'animate-in fade-in slide-in-from-top-1 duration-200',
      className,
    )}>
      <div className="flex items-center gap-3">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-action-primary text-[10px] font-bold text-white">
          {selectedCount}
        </span>
        <span className="text-sm font-medium text-text-primary">
          {selectedCount} {selectedLabel}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {children}
        {onClearSelection && (
          <button
            type="button"
            onClick={onClearSelection}
            className="text-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            {clearLabel}
          </button>
        )}
      </div>
    </div>
  );
}
