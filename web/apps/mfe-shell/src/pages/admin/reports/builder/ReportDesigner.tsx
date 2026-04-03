/**
 * ReportDesigner — Drag & Drop canvas for visual report design.
 *
 * 3-panel layout:
 * - Left: Table/column tree (drag source)
 * - Center: Column canvas (drop zone, reorder)
 * - Right: Properties panel (selected column config)
 */

import React, { useState, useCallback } from 'react';
import { GripVertical, X, Settings2, Table2, Columns3, ChevronDown, ChevronRight } from 'lucide-react';
import type { BuilderState, ColumnDef } from './hooks/useBuilderState';
import { useSchemaSnapshot } from './hooks/useTableDiscovery';

interface Props {
  state: BuilderState;
  dispatch: React.Dispatch<any>;
}

/* ------------------------------------------------------------------ */
/*  Left Panel: Table Tree                                             */
/* ------------------------------------------------------------------ */

const TableTreePanel: React.FC<{
  state: BuilderState;
  snapshot: any;
  onAddColumn: (field: string, headerName: string, columnType: string) => void;
}> = ({ state, snapshot, onAddColumn }) => {
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set([state.primaryTable]));

  const toggleTable = (name: string) => {
    setExpandedTables((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const allTables = [state.primaryTable, ...state.relatedTables].filter(Boolean);
  const selectedFields = new Set(state.selectedColumns.map((c) => c.field));

  return (
    <div className="flex h-full flex-col border-r border-border-subtle bg-surface-default">
      <div className="border-b border-border-subtle px-3 py-2 text-xs font-semibold text-text-secondary">
        <Columns3 className="mr-1.5 inline h-3.5 w-3.5" />
        Tablolar & Sütunlar
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {allTables.map((tableName) => {
          const table = snapshot?.tables?.[tableName];
          if (!table) return null;
          const isExpanded = expandedTables.has(tableName);
          return (
            <div key={tableName}>
              <button
                type="button"
                onClick={() => toggleTable(tableName)}
                className="flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-text-primary hover:bg-surface-muted"
              >
                {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                <Table2 className="h-3 w-3 text-text-tertiary" />
                {tableName}
                <span className="ml-auto text-[10px] text-text-tertiary">{table.columns?.length}</span>
              </button>
              {isExpanded && table.columns?.map((col: any) => {
                const field = tableName === state.primaryTable ? col.name : `${tableName}.${col.name}`;
                const isSelected = selectedFields.has(field);
                return (
                  <button
                    key={field}
                    type="button"
                    onClick={() => !isSelected && onAddColumn(field, col.name, 'text')}
                    disabled={isSelected}
                    className={`ml-4 flex w-[calc(100%-16px)] items-center gap-1.5 rounded px-2 py-0.5 text-[11px] ${
                      isSelected ? 'text-text-tertiary opacity-50' : 'text-text-secondary hover:bg-surface-muted cursor-pointer'
                    }`}
                  >
                    <span className="flex-1 truncate">{col.name}</span>
                    <span className="text-[9px] text-text-tertiary">{col.dataType}</span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Center Panel: Column Canvas                                        */
/* ------------------------------------------------------------------ */

const CanvasPanel: React.FC<{
  columns: ColumnDef[];
  selectedField: string | null;
  onSelect: (field: string) => void;
  onRemove: (field: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}> = ({ columns, selectedField, onSelect, onRemove, onReorder }) => {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== index) {
      onReorder(dragIndex, index);
      setDragIndex(index);
    }
  };
  const handleDragEnd = () => setDragIndex(null);

  return (
    <div className="flex h-full flex-col bg-surface-canvas">
      <div className="border-b border-border-subtle bg-surface-default px-3 py-2 text-xs font-semibold text-text-secondary">
        Rapor Sütunları ({columns.length})
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {columns.map((col, i) => (
          <div
            key={col.field}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDragEnd={handleDragEnd}
            onClick={() => onSelect(col.field)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition ${
              selectedField === col.field
                ? 'border-action-primary bg-action-primary/5'
                : 'border-border-subtle bg-surface-default hover:border-action-primary/30'
            }`}
          >
            <GripVertical className="h-4 w-4 cursor-grab text-text-tertiary" />
            <span className="flex-1 text-sm font-medium">{col.headerName}</span>
            <span className="rounded bg-surface-muted px-1.5 py-0.5 text-[10px]">{col.columnType}</span>
            <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(col.field); }}>
              <X className="h-3.5 w-3.5 text-text-tertiary hover:text-state-danger-text" />
            </button>
          </div>
        ))}
        {!columns.length && (
          <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-border-subtle text-sm text-text-tertiary">
            Sol panelden sütun ekleyin
          </div>
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Right Panel: Properties                                            */
/* ------------------------------------------------------------------ */

const COLUMN_TYPES = [
  'text', 'bold-text', 'number', 'currency', 'date', 'boolean', 'badge', 'status', 'percent', 'enum', 'link',
];

const PropertiesPanel: React.FC<{
  column: ColumnDef | null;
  onChangeType: (field: string, type: string) => void;
}> = ({ column, onChangeType }) => (
  <div className="flex h-full flex-col border-l border-border-subtle bg-surface-default">
    <div className="border-b border-border-subtle px-3 py-2 text-xs font-semibold text-text-secondary">
      <Settings2 className="mr-1.5 inline h-3.5 w-3.5" />
      Özellikler
    </div>
    {column ? (
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <div>
          <label className="text-[10px] font-medium text-text-tertiary">Alan Adı</label>
          <p className="text-sm font-medium">{column.field}</p>
        </div>
        <div>
          <label className="text-[10px] font-medium text-text-tertiary">Başlık</label>
          <p className="text-sm">{column.headerName}</p>
        </div>
        <div>
          <label className="text-[10px] font-medium text-text-tertiary">Sütun Tipi</label>
          <select
            value={column.columnType}
            onChange={(e) => onChangeType(column.field, e.target.value)}
            className="mt-1 w-full rounded-lg border border-border-subtle px-2 py-1.5 text-sm"
          >
            {COLUMN_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
    ) : (
      <div className="flex flex-1 items-center justify-center p-4 text-xs text-text-tertiary">
        Sütun seçin
      </div>
    )}
  </div>
);

/* ------------------------------------------------------------------ */
/*  Main Designer                                                      */
/* ------------------------------------------------------------------ */

export const ReportDesigner: React.FC<Props> = ({ state, dispatch }) => {
  const { data: snapshot } = useSchemaSnapshot(state.schema);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const handleAddColumn = useCallback((field: string, headerName: string, columnType: string) => {
    dispatch({
      type: 'TOGGLE_COLUMN',
      field,
    });
  }, [dispatch]);

  const handleRemoveColumn = useCallback((field: string) => {
    dispatch({ type: 'TOGGLE_COLUMN', field });
  }, [dispatch]);

  const handleReorder = useCallback((from: number, to: number) => {
    /* Reorder via toggle sequence — simplified for now */
  }, []);

  const handleChangeType = useCallback((field: string, columnType: string) => {
    dispatch({ type: 'SET_COLUMN_TYPE', field, columnType });
  }, [dispatch]);

  const selectedColumn = state.selectedColumns.find((c) => c.field === selectedField) ?? null;

  return (
    <div className="flex h-[600px] overflow-hidden rounded-2xl border border-border-subtle">
      {/* Left: Table tree — 240px */}
      <div className="w-[240px] shrink-0">
        <TableTreePanel state={state} snapshot={snapshot} onAddColumn={handleAddColumn} />
      </div>

      {/* Center: Canvas — flex */}
      <div className="min-w-0 flex-1">
        <CanvasPanel
          columns={state.selectedColumns}
          selectedField={selectedField}
          onSelect={setSelectedField}
          onRemove={handleRemoveColumn}
          onReorder={handleReorder}
        />
      </div>

      {/* Right: Properties — 220px */}
      <div className="w-[220px] shrink-0">
        <PropertiesPanel column={selectedColumn} onChangeType={handleChangeType} />
      </div>
    </div>
  );
};
