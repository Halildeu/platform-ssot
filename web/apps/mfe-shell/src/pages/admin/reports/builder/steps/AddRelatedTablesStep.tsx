import React from 'react';
import { Link2, Plus, X } from 'lucide-react';
import { useTableRelationships, useSchemaSnapshot } from '../hooks/useTableDiscovery';
import type { BuilderState } from '../hooks/useBuilderState';

interface Props { state: BuilderState; dispatch: React.Dispatch<any>; }

export const AddRelatedTablesStep: React.FC<Props> = ({ state, dispatch }) => {
  const { data: snapshot } = useSchemaSnapshot(state.schema);
  const { outgoing, incoming } = useTableRelationships(state.primaryTable, snapshot ?? null);
  const allRels = [...outgoing, ...incoming];
  const addedSet = new Set(state.relatedTables.map((t) => t.toUpperCase()));

  const handleAdd = (tableName: string, fromTable: string, fromCol: string, toTable: string, toCol: string) => {
    if (addedSet.has(tableName.toUpperCase())) return;
    const table = snapshot?.tables[tableName];
    if (!table) return;

    dispatch({
      type: 'ADD_RELATED_TABLE',
      table: tableName,
      join: { fromTable, fromColumn: fromCol, toTable, toColumn: toCol, joinType: 'left' as const },
      columns: table.columns.map((c) => ({
        field: `${tableName}.${c.name}`,
        headerName: `${tableName}.${c.name}`,
        columnType: 'text',
        included: false,
      })),
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-text-primary">İlişkili Tabloları Ekleyin</h2>
      <p className="text-sm text-text-secondary">
        <strong>{state.primaryTable}</strong> ile ilişkili {allRels.length} tablo bulundu. (Opsiyonel)
      </p>

      {/* Added tables */}
      {state.relatedTables.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-semibold text-text-secondary">Eklenen tablolar:</p>
          {state.relatedTables.map((t) => (
            <div key={t} className="flex items-center gap-2 rounded-lg bg-state-success-bg px-3 py-2">
              <Link2 className="h-4 w-4 text-state-success-text" />
              <span className="flex-1 text-sm font-medium">{t}</span>
              <button type="button" onClick={() => dispatch({ type: 'REMOVE_RELATED_TABLE', table: t })}>
                <X className="h-4 w-4 text-text-tertiary hover:text-state-danger-text" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Discovered relationships */}
      <div className="max-h-[300px] space-y-1 overflow-y-auto">
        {allRels.map((rel, i) => {
          const targetTable = rel.fromTable.toUpperCase() === state.primaryTable.toUpperCase() ? rel.toTable : rel.fromTable;
          const isAdded = addedSet.has(targetTable.toUpperCase());
          return (
            <div key={`${rel.fromTable}-${rel.fromColumn}-${i}`} className="flex items-center gap-2 rounded-lg border border-border-subtle px-3 py-2">
              <span className="text-xs text-text-tertiary">{rel.fromTable}.{rel.fromColumn}</span>
              <span className="text-text-tertiary">→</span>
              <span className="text-xs text-text-tertiary">{rel.toTable}.{rel.toColumn}</span>
              <span className="ml-auto rounded bg-surface-muted px-1.5 py-0.5 text-[9px]">{Math.round(rel.confidence * 100)}%</span>
              {!isAdded && (
                <button
                  type="button"
                  onClick={() => handleAdd(targetTable, rel.fromTable, rel.fromColumn, rel.toTable, rel.toColumn)}
                  className="rounded-md bg-action-primary p-1 text-action-primary-text"
                >
                  <Plus className="h-3 w-3" />
                </button>
              )}
              {isAdded && <span className="text-[10px] text-state-success-text">Eklendi</span>}
            </div>
          );
        })}
        {!allRels.length && <p className="py-4 text-center text-sm text-text-tertiary">İlişki bulunamadı.</p>}
      </div>
    </div>
  );
};
