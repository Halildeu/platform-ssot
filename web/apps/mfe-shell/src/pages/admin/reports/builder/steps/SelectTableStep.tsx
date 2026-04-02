import React, { useState, useMemo } from 'react';
import { Table2, Search } from 'lucide-react';
import { useTableList } from '../hooks/useTableDiscovery';
import type { BuilderState, ColumnDef } from '../hooks/useBuilderState';
import type { SchemaTableInfo } from '@mfe/shared-types';
import { inferColumnType } from '../../../../../../apps/mfe-reporting/src/utils/schemaColumnMapper';

interface Props {
  state: BuilderState;
  dispatch: React.Dispatch<any>;
}

function tableToColumns(table: SchemaTableInfo): ColumnDef[] {
  return table.columns.map((col) => ({
    field: col.name,
    headerName: col.name,
    columnType: inferColumnType(col.dataType) ?? 'text',
    included: !col.pk && !col.identity, // exclude PK/identity by default
  }));
}

export const SelectTableStep: React.FC<Props> = ({ state, dispatch }) => {
  const { tables, domains, isLoading } = useTableList(state.schema);
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState<string | null>(null);

  const domainNames = useMemo(() => Object.keys(domains).sort(), [domains]);

  const filtered = useMemo(() => {
    let result = tables;
    if (domainFilter) {
      const domainTables = new Set((domains[domainFilter] ?? []).map((t) => t.toUpperCase()));
      result = result.filter((t) => domainTables.has(t.name.toUpperCase()));
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((t) => t.name.toLowerCase().includes(q));
    }
    return result;
  }, [tables, search, domainFilter, domains]);

  const handleSelectTable = (table: SchemaTableInfo) => {
    dispatch({
      type: 'SET_PRIMARY_TABLE',
      table: table.name,
      columns: tableToColumns(table),
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-text-primary">Ana Tablo Seçin</h2>
      <p className="text-sm text-text-secondary">
        Raporun ana veri kaynağı olacak tabloyu seçin. {tables.length} tablo mevcut.
      </p>

      {/* Search + domain filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tablo ara..."
            className="w-full rounded-lg border border-border-subtle py-2 pl-8 pr-3 text-sm"
          />
        </div>
        <select
          value={domainFilter ?? ''}
          onChange={(e) => setDomainFilter(e.target.value || null)}
          className="rounded-lg border border-border-subtle px-3 py-2 text-sm"
        >
          <option value="">Tüm domainler</option>
          {domainNames.map((d) => (
            <option key={d} value={d}>{d} ({(domains[d] ?? []).length})</option>
          ))}
        </select>
      </div>

      {/* Table list */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 animate-pulse rounded-lg bg-surface-muted" />
          ))}
        </div>
      ) : (
        <div className="max-h-[400px] space-y-1 overflow-y-auto">
          {filtered.map((table) => (
            <button
              key={table.name}
              type="button"
              onClick={() => handleSelectTable(table)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition ${
                state.primaryTable === table.name
                  ? 'bg-action-primary/10 text-action-primary font-medium'
                  : 'hover:bg-surface-muted'
              }`}
            >
              <Table2 className="h-4 w-4 shrink-0 text-text-tertiary" />
              <span className="flex-1 text-sm">{table.name}</span>
              <span className="text-[10px] text-text-tertiary">{table.columnCount} sütun</span>
              {table.rowCount != null && (
                <span className="text-[10px] text-text-tertiary">{table.rowCount.toLocaleString('tr-TR')} satır</span>
              )}
            </button>
          ))}
          {!filtered.length && (
            <p className="py-8 text-center text-sm text-text-tertiary">Eşleşen tablo yok.</p>
          )}
        </div>
      )}
    </div>
  );
};
