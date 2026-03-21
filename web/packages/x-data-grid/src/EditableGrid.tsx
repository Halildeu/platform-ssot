import React, { useCallback, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { CellValueChangedEvent, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { cn, GridShell } from '@mfe/design-system';

export interface EditableGridProps<TRow> {
  gridId: string;
  columnDefs: ColDef<TRow>[];
  data: TRow[];
  onCellValueChanged?: (params: { rowData: TRow; field: string; oldValue: unknown; newValue: unknown }) => void;
  onSave?: (changedRows: TRow[]) => Promise<void>;
  editType?: 'cell' | 'fullRow';
  undoRedoCellEditing?: boolean;
  className?: string;
}

export function EditableGrid<TRow>({
  gridId,
  columnDefs,
  data,
  onCellValueChanged,
  onSave,
  editType = 'cell',
  undoRedoCellEditing = true,
  className,
}: EditableGridProps<TRow>) {
  const gridApiRef = useRef<GridApi<TRow> | null>(null);
  const [changedRowIds, setChangedRowIds] = useState<Set<string | number>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  const mergedDefaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      editable: true,
    }),
    [],
  );

  const handleGridReady = useCallback((event: GridReadyEvent<TRow>) => {
    gridApiRef.current = event.api;
  }, []);

  const handleCellValueChanged = useCallback(
    (event: CellValueChangedEvent<TRow>) => {
      const rowId = event.node.id;
      if (rowId != null) {
        setChangedRowIds((prev) => {
          const next = new Set(prev);
          next.add(rowId);
          return next;
        });
      }

      // Flash the edited cell
      if (event.column) {
        event.api.flashCells({
          rowNodes: [event.node],
          columns: [event.column],
        });
      }

      if (onCellValueChanged && event.data) {
        onCellValueChanged({
          rowData: event.data,
          field: event.colDef.field ?? '',
          oldValue: event.oldValue,
          newValue: event.newValue,
        });
      }
    },
    [onCellValueChanged],
  );

  const handleSave = useCallback(async () => {
    if (!gridApiRef.current || !onSave || changedRowIds.size === 0) return;

    const changedRows: TRow[] = [];
    gridApiRef.current.forEachNode((node) => {
      if (node.id != null && changedRowIds.has(node.id) && node.data) {
        changedRows.push(node.data);
      }
    });

    setIsSaving(true);
    try {
      await onSave(changedRows);
      setChangedRowIds(new Set());
    } catch (error) {
      console.error('[X-Data-Grid] EditableGrid save error:', error);
    } finally {
      setIsSaving(false);
    }
  }, [onSave, changedRowIds]);

  const isDirty = changedRowIds.size > 0;

  return (
    <div className="flex flex-col">
      {isDirty && onSave && (
        <div className={cn(
          'flex items-center justify-between px-4 py-2',
          'border-b border-warning/20 bg-warning/5',
          'animate-in fade-in slide-in-from-top-1 duration-200',
        )}>
          <span className="text-sm text-text-secondary">
            {changedRowIds.size} {changedRowIds.size === 1 ? 'row' : 'rows'} modified
          </span>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium text-white transition-colors',
              'bg-action-primary hover:bg-action-primary/90',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          >
            {isSaving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      )}
      <GridShell className={cn('ag-theme-alpine', className)}>
        <AgGridReact<TRow>
          gridId={gridId}
          columnDefs={columnDefs}
          rowData={data}
          defaultColDef={mergedDefaultColDef}
          editType={editType === 'fullRow' ? 'fullRow' : undefined}
          undoRedoCellEditing={undoRedoCellEditing}
          undoRedoCellEditingLimit={20}
          enableCellChangeFlash
          onGridReady={handleGridReady}
          onCellValueChanged={handleCellValueChanged}
        />
      </GridShell>
    </div>
  );
}
