import React from 'react';
import { Eye, X } from 'lucide-react';
import { useSchemaSnapshot } from '../hooks/useTableDiscovery';
import type { BuilderState } from '../hooks/useBuilderState';
import type { SchemaTableInfo } from '@mfe/shared-types';

const DISPLAY_CANDIDATES = ['NAME', 'TITLE', 'DESCRIPTION', 'LABEL', 'AD', 'BASLIK', 'TANIM'];

function findDisplayColumn(table: SchemaTableInfo): string | undefined {
  for (const candidate of DISPLAY_CANDIDATES) {
    const col = table.columns.find(
      (c) => c.name.toUpperCase() === candidate || c.name.toUpperCase().endsWith(`_${candidate}`),
    );
    if (col) return col.name;
  }
  return table.columns.find(
    (c) => !c.pk && (c.dataType.toLowerCase().includes('varchar') || c.dataType.toLowerCase().includes('char')),
  )?.name;
}

interface Props { state: BuilderState; dispatch: React.Dispatch<any>; }

export const ConfigureLookupsStep: React.FC<Props> = ({ state, dispatch }) => {
  const { data: snapshot } = useSchemaSnapshot(state.schema);

  /* Find FK columns that could use lookup */
  const fkCandidates = state.selectedColumns.filter((col) => {
    const join = state.joins.find((j) => j.fromColumn.toUpperCase() === col.field.toUpperCase());
    return Boolean(join);
  });

  const handleAddLookup = (fkColumn: string) => {
    const join = state.joins.find((j) => j.fromColumn.toUpperCase() === fkColumn.toUpperCase());
    if (!join || !snapshot) return;

    const refTable = snapshot.tables[join.toTable];
    if (!refTable) return;

    const displayCol = findDisplayColumn(refTable);
    if (!displayCol) return;

    dispatch({
      type: 'ADD_LOOKUP',
      lookup: { fkColumn, lookupTable: join.toTable, lookupPk: join.toColumn, displayColumn: displayCol },
    });
  };

  const lookupSet = new Set(state.lookups.map((l) => l.fkColumn.toUpperCase()));

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-text-primary">ID → İsim Eşleme</h2>
      <p className="text-sm text-text-secondary">
        FK sütunları için ID yerine okunabilir isim gösterilsin mi? (Opsiyonel)
      </p>

      {/* Configured lookups */}
      {state.lookups.map((l) => (
        <div key={l.fkColumn} className="flex items-center gap-2 rounded-lg bg-state-info-bg px-3 py-2">
          <Eye className="h-4 w-4 text-state-info-text" />
          <span className="text-sm">{l.fkColumn} → {l.lookupTable}.{l.displayColumn}</span>
          <button type="button" onClick={() => dispatch({ type: 'REMOVE_LOOKUP', fkColumn: l.fkColumn })} className="ml-auto">
            <X className="h-4 w-4 text-text-tertiary hover:text-state-danger-text" />
          </button>
        </div>
      ))}

      {/* FK candidates */}
      <div className="space-y-1">
        {fkCandidates.map((col) => {
          const isConfigured = lookupSet.has(col.field.toUpperCase());
          if (isConfigured) return null;
          return (
            <button
              key={col.field}
              type="button"
              onClick={() => handleAddLookup(col.field)}
              className="flex w-full items-center gap-2 rounded-lg border border-border-subtle px-3 py-2 text-left hover:bg-surface-muted"
            >
              <span className="flex-1 text-sm">{col.field}</span>
              <span className="text-xs text-action-primary">Lookup ekle</span>
            </button>
          );
        })}
        {!fkCandidates.length && !state.lookups.length && (
          <p className="py-4 text-center text-sm text-text-tertiary">
            FK sütunu bulunamadı. İlişkili tablo eklerseniz burada görünür.
          </p>
        )}
      </div>
    </div>
  );
};
