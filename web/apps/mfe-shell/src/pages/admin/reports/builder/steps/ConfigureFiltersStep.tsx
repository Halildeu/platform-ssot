import React from 'react';
import { Filter, Plus, X } from 'lucide-react';
import type { BuilderState, FilterDef } from '../hooks/useBuilderState';

interface Props { state: BuilderState; dispatch: React.Dispatch<any>; }

const FILTER_TYPES = [
  { value: 'text', label: 'Metin' },
  { value: 'number', label: 'Sayı' },
  { value: 'date', label: 'Tarih' },
  { value: 'set', label: 'Seçenek Listesi' },
];

export const ConfigureFiltersStep: React.FC<Props> = ({ state, dispatch }) => {
  const addFilter = (field: string) => {
    const col = state.selectedColumns.find((c) => c.field === field);
    if (!col) return;
    const type = col.columnType === 'number' || col.columnType === 'currency' ? 'number'
      : col.columnType === 'date' ? 'date'
      : col.columnType === 'badge' || col.columnType === 'status' || col.columnType === 'enum' ? 'set'
      : 'text';
    const newFilter: FilterDef = { field, type: type as FilterDef['type'], label: col.headerName };
    dispatch({ type: 'SET_FILTERS', filters: [...state.filters, newFilter] });
  };

  const removeFilter = (field: string) => {
    dispatch({ type: 'SET_FILTERS', filters: state.filters.filter((f) => f.field !== field) });
  };

  const filterFields = new Set(state.filters.map((f) => f.field));
  const available = state.selectedColumns.filter((c) => !filterFields.has(c.field));

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-text-primary">Filtreleri Ayarlayın</h2>
      <p className="text-sm text-text-secondary">
        Kullanıcıların veriyi filtreleyebileceği alanları seçin. (Opsiyonel)
      </p>

      {/* Active filters */}
      {state.filters.map((f) => (
        <div key={f.field} className="flex items-center gap-2 rounded-lg border border-border-subtle px-3 py-2">
          <Filter className="h-4 w-4 text-action-primary" />
          <span className="flex-1 text-sm font-medium">{f.field}</span>
          <span className="rounded bg-surface-muted px-1.5 py-0.5 text-[10px]">{f.type}</span>
          <button type="button" onClick={() => removeFilter(f.field)}>
            <X className="h-4 w-4 text-text-tertiary hover:text-state-danger-text" />
          </button>
        </div>
      ))}

      {/* Available columns to add as filter */}
      {available.length > 0 && (
        <div className="space-y-1 pt-2">
          <p className="text-xs font-semibold text-text-secondary">Filtre ekle:</p>
          <div className="flex flex-wrap gap-1">
            {available.map((col) => (
              <button
                key={col.field}
                type="button"
                onClick={() => addFilter(col.field)}
                className="inline-flex items-center gap-1 rounded-full border border-border-subtle px-2 py-1 text-[10px] text-text-secondary hover:bg-surface-muted"
              >
                <Plus className="h-3 w-3" />
                {col.field}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
