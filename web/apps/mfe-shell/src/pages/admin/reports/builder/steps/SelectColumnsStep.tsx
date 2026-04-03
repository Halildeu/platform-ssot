import React from 'react';
import { Check, Key, ArrowRight } from 'lucide-react';
import type { BuilderState } from '../hooks/useBuilderState';

interface Props { state: BuilderState; dispatch: React.Dispatch<any>; }

export const SelectColumnsStep: React.FC<Props> = ({ state, dispatch }) => {
  const selected = state.selectedColumns.length;
  const total = state.availableColumns.length;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-text-primary">Sütunları Seçin</h2>
      <p className="text-sm text-text-secondary">
        <strong>{state.primaryTable}</strong> tablosundan {selected}/{total} sütun seçili.
      </p>

      <div className="max-h-[400px] space-y-1 overflow-y-auto">
        {state.availableColumns.map((col) => (
          <button
            key={col.field}
            type="button"
            onClick={() => dispatch({ type: 'TOGGLE_COLUMN', field: col.field })}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition ${
              col.included ? 'bg-action-primary/10' : 'hover:bg-surface-muted'
            }`}
          >
            <div className={`flex h-5 w-5 items-center justify-center rounded border ${
              col.included ? 'border-action-primary bg-action-primary text-white' : 'border-border-subtle'
            }`}>
              {col.included && <Check className="h-3 w-3" />}
            </div>
            <span className="flex-1 text-sm font-medium">{col.field}</span>
            <span className="rounded bg-surface-muted px-1.5 py-0.5 text-[10px] text-text-tertiary">{col.columnType}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-2 pt-2">
        <button type="button" onClick={() => state.availableColumns.forEach((c) => !c.included && dispatch({ type: 'TOGGLE_COLUMN', field: c.field }))}
          className="text-xs text-action-primary hover:underline">Tümünü seç</button>
        <button type="button" onClick={() => state.availableColumns.forEach((c) => c.included && dispatch({ type: 'TOGGLE_COLUMN', field: c.field }))}
          className="text-xs text-text-secondary hover:underline">Tümünü kaldır</button>
      </div>
    </div>
  );
};
