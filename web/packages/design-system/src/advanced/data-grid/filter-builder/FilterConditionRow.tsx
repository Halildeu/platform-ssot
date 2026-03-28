/**
 * FilterConditionRow — Single filter condition: [Column] [Operator] [Value] [Delete]
 */
import React, { useMemo } from 'react';
import { Trash2 } from 'lucide-react';
import type { ColDef } from 'ag-grid-community';
import type { FilterCondition, FilterType } from './useFilterBuilder';
import { TEXT_OPERATORS, NUMBER_OPERATORS, DATE_OPERATORS } from './filterModelConverter';
import { FilterValueEditor } from './FilterValueEditor';

interface FilterConditionRowProps {
  condition: FilterCondition;
  columnDefs: ColDef[];
  onUpdate: (id: string, updates: Partial<FilterCondition>) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

const SELECT_CLASS =
  'h-8 rounded-md border border-border-subtle bg-surface-default px-2 text-xs text-text-primary focus:border-action-primary focus:outline-none focus:ring-1 focus:ring-action-primary';

function detectFilterType(colDef?: ColDef): FilterType {
  if (!colDef) return 'text';
  const f = colDef.filter;
  if (f === 'agSetColumnFilter') return 'set';
  if (f === 'agNumberColumnFilter') return 'number';
  if (f === 'agDateColumnFilter') return 'date';
  // agMultiColumnFilter wraps others — check inner filter
  if (f === 'agMultiColumnFilter' && colDef.filterParams) {
    const filters = (colDef.filterParams as Record<string, unknown>).filters as Array<{ filter: string }> | undefined;
    if (filters?.[0]?.filter === 'agNumberColumnFilter') return 'number';
    if (filters?.[0]?.filter === 'agDateColumnFilter') return 'date';
    if (filters?.[0]?.filter === 'agSetColumnFilter') return 'set';
  }
  return 'text';
}

function getOperators(filterType: FilterType) {
  switch (filterType) {
    case 'number': return NUMBER_OPERATORS;
    case 'date': return DATE_OPERATORS;
    case 'set': return [{ value: 'in', label: 'İçinde' }];
    default: return TEXT_OPERATORS;
  }
}

function getSetValues(colDef?: ColDef): string[] {
  if (!colDef?.filterParams) return [];
  const params = colDef.filterParams as Record<string, unknown>;
  if (Array.isArray(params.values)) return params.values as string[];
  return [];
}

export const FilterConditionRow: React.FC<FilterConditionRowProps> = ({
  condition,
  columnDefs,
  onUpdate,
  onRemove,
  canRemove,
}) => {
  const filterableColumns = useMemo(
    () =>
      columnDefs
        .filter((c) => c.field && c.headerName && c.filter !== false)
        .map((c) => ({ field: c.field as string, label: c.headerName as string, colDef: c })),
    [columnDefs],
  );

  const selectedCol = filterableColumns.find((c) => c.field === condition.colId);
  const filterType = selectedCol ? detectFilterType(selectedCol.colDef) : condition.filterType;
  const operators = getOperators(filterType);
  const setValues = selectedCol ? getSetValues(selectedCol.colDef) : [];

  const handleColChange = (colId: string) => {
    const col = filterableColumns.find((c) => c.field === colId);
    const ft = col ? detectFilterType(col.colDef) : 'text';
    const ops = getOperators(ft);
    onUpdate(condition.id, {
      colId,
      filterType: ft,
      operator: ft === 'set' ? 'in' : ops[0]?.value ?? 'contains',
      value: ft === 'set' ? [] : '',
      valueTo: undefined,
    });
  };

  return (
    <div className="flex items-start gap-2 rounded-lg bg-surface-muted/50 px-3 py-2">
      {/* Column selector */}
      <select
        className={`${SELECT_CLASS} min-w-[130px]`}
        value={condition.colId}
        onChange={(e) => handleColChange(e.target.value)}
      >
        <option value="">Sütun seçin...</option>
        {filterableColumns.map((col) => (
          <option key={col.field} value={col.field}>
            {col.label}
          </option>
        ))}
      </select>

      {/* Operator selector */}
      {filterType !== 'set' && (
        <select
          className={`${SELECT_CLASS} min-w-[120px]`}
          value={condition.operator}
          onChange={(e) => onUpdate(condition.id, { operator: e.target.value })}
        >
          {operators.map((op) => (
            <option key={op.value} value={op.value}>
              {op.label}
            </option>
          ))}
        </select>
      )}

      {/* Value editor */}
      <div className="min-w-0 flex-1">
        <FilterValueEditor
          filterType={filterType}
          operator={condition.operator}
          value={condition.value}
          valueTo={condition.valueTo}
          setValues={setValues}
          onChange={(val, valTo) => onUpdate(condition.id, { value: val, valueTo: valTo })}
        />
      </div>

      {/* Delete button */}
      {canRemove && (
        <button
          type="button"
          onClick={() => onRemove(condition.id)}
          className="mt-1 shrink-0 rounded p-1 text-text-subtle hover:bg-rose-100 hover:text-rose-600"
          title="Koşulu sil"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};
