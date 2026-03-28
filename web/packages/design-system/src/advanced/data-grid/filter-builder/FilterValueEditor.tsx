/**
 * FilterValueEditor — Renders the correct value input based on filter type.
 * Text → input, Number → number input, Date → date input, Set → checkbox list.
 */
import React from 'react';
import type { FilterType } from './useFilterBuilder';

interface FilterValueEditorProps {
  filterType: FilterType;
  operator: string;
  value: unknown;
  valueTo?: unknown;
  setValues?: string[];
  onChange: (value: unknown, valueTo?: unknown) => void;
}

const INPUT_CLASS =
  'h-8 w-full rounded-md border border-border-subtle bg-surface-default px-2.5 text-xs text-text-primary placeholder:text-text-subtle focus:border-action-primary focus:outline-none focus:ring-1 focus:ring-action-primary';

export const FilterValueEditor: React.FC<FilterValueEditorProps> = ({
  filterType,
  operator,
  value,
  valueTo,
  setValues = [],
  onChange,
}) => {
  // Blank/notBlank operators need no value
  if (operator === 'blank' || operator === 'notBlank') {
    return <span className="text-[11px] italic text-text-subtle">Değer gerekmiyor</span>;
  }

  switch (filterType) {
    case 'text':
      return (
        <input
          type="text"
          className={INPUT_CLASS}
          placeholder="Değer girin..."
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case 'number':
      return (
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            className={INPUT_CLASS}
            placeholder="Değer"
            value={value != null ? String(value) : ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null, valueTo)}
          />
          {operator === 'inRange' && (
            <>
              <span className="text-[10px] text-text-subtle">—</span>
              <input
                type="number"
                className={INPUT_CLASS}
                placeholder="Bitiş"
                value={valueTo != null ? String(valueTo) : ''}
                onChange={(e) => onChange(value, e.target.value ? Number(e.target.value) : null)}
              />
            </>
          )}
        </div>
      );

    case 'date':
      return (
        <div className="flex items-center gap-1.5">
          <input
            type="date"
            className={INPUT_CLASS}
            value={value ? String(value).split(' ')[0] : ''}
            onChange={(e) => onChange(e.target.value ? `${e.target.value} 00:00:00` : null, valueTo)}
          />
          {operator === 'inRange' && (
            <>
              <span className="text-[10px] text-text-subtle">—</span>
              <input
                type="date"
                className={INPUT_CLASS}
                value={valueTo ? String(valueTo).split(' ')[0] : ''}
                onChange={(e) => onChange(value, e.target.value ? `${e.target.value} 23:59:59` : null)}
              />
            </>
          )}
        </div>
      );

    case 'set': {
      const selected = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div className="max-h-32 overflow-auto rounded-md border border-border-subtle bg-surface-default p-1.5">
          {setValues.length === 0 ? (
            <span className="text-[10px] text-text-subtle">Seçenek yok</span>
          ) : (
            setValues.map((v) => (
              <label
                key={v}
                className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-xs text-text-primary hover:bg-surface-muted"
              >
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-border-subtle text-action-primary focus:ring-action-primary"
                  checked={selected.includes(v)}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...selected, v]
                      : selected.filter((s) => s !== v);
                    onChange(next);
                  }}
                />
                {v}
              </label>
            ))
          )}
        </div>
      );
    }

    default:
      return (
        <input
          type="text"
          className={INPUT_CLASS}
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
};
