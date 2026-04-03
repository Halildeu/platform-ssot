import React from 'react';
import type { CrossFilter } from './crossFilterTypes';

interface ActiveFilterChipsProps {
  filters: CrossFilter[];
  onRemove: (filter: CrossFilter) => void;
  onClearAll: () => void;
}

const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  filters,
  onRemove,
  onClearAll,
}) => {
  if (filters.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-text-subtle">Aktif Filtreler:</span>
      {filters.map((f) => (
        <button
          key={`${f.dimension}-${f.value}`}
          type="button"
          onClick={() => onRemove(f)}
          className="inline-flex items-center gap-1 rounded-md border border-action-primary/30 bg-action-primary/10 px-2 py-0.5 text-xs font-medium text-action-primary transition hover:bg-action-primary/20"
        >
          {f.displayLabel}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
            <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      ))}
      {filters.length > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-state-danger-text underline-offset-2 hover:underline"
        >
          Hepsini Temizle
        </button>
      )}
    </div>
  );
};

export default ActiveFilterChips;
