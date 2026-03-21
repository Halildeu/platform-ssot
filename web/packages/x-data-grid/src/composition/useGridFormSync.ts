import { useState, useCallback } from 'react';

/* ------------------------------------------------------------------ */
/*  Form -> Grid Data Entry Composition Hook                          */
/*  Form submit adds/updates a grid row.                              */
/* ------------------------------------------------------------------ */

export interface UseGridFormSyncReturn<TRow> {
  /** Current rows managed by the sync */
  rows: TRow[];
  /** Add a new row */
  addRow: (row: TRow) => void;
  /** Partially update an existing row by id */
  updateRow: (id: string, updates: Partial<TRow>) => void;
  /** Remove a row by id */
  deleteRow: (id: string) => void;
  /** The row currently being edited (null if none) */
  editingRow: TRow | null;
  /** Begin editing an existing row */
  startEdit: (row: TRow) => void;
  /** Cancel the current edit */
  cancelEdit: () => void;
}

export interface UseGridFormSyncOptions<TRow> {
  /** Initial row set */
  initialRows?: TRow[];
  /** Which field holds the row id (default: 'id') */
  idField?: keyof TRow & string;
  /** Called after a row is added */
  onRowAdded?: (row: TRow) => void;
  /** Called after a row is updated */
  onRowUpdated?: (row: TRow) => void;
  /** Called after a row is deleted */
  onRowDeleted?: (id: string) => void;
}

/**
 * Bidirectional sync between a form and a data-grid.
 *
 * ```tsx
 * const { rows, addRow, startEdit, editingRow } = useGridFormSync<Employee>({
 *   initialRows: employees,
 *   idField: 'employeeId',
 * });
 * ```
 */
export function useGridFormSync<TRow extends Record<string, unknown>>(
  options: UseGridFormSyncOptions<TRow> = {},
): UseGridFormSyncReturn<TRow> {
  const {
    initialRows = [],
    idField = 'id' as keyof TRow & string,
    onRowAdded,
    onRowUpdated,
    onRowDeleted,
  } = options;

  const [rows, setRows] = useState<TRow[]>(initialRows);
  const [editingRow, setEditingRow] = useState<TRow | null>(null);

  const addRow = useCallback(
    (row: TRow) => {
      setRows((prev) => [...prev, row]);
      setEditingRow(null);
      onRowAdded?.(row);
    },
    [onRowAdded],
  );

  const updateRow = useCallback(
    (id: string, updates: Partial<TRow>) => {
      setRows((prev) =>
        prev.map((row) => {
          if (String(row[idField]) === id) {
            const updated = { ...row, ...updates };
            onRowUpdated?.(updated);
            return updated;
          }
          return row;
        }),
      );
      setEditingRow(null);
    },
    [idField, onRowUpdated],
  );

  const deleteRow = useCallback(
    (id: string) => {
      setRows((prev) => prev.filter((row) => String(row[idField]) !== id));
      if (editingRow && String(editingRow[idField]) === id) {
        setEditingRow(null);
      }
      onRowDeleted?.(id);
    },
    [idField, editingRow, onRowDeleted],
  );

  const startEdit = useCallback((row: TRow) => {
    setEditingRow(row);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingRow(null);
  }, []);

  return {
    rows,
    addRow,
    updateRow,
    deleteRow,
    editingRow,
    startEdit,
    cancelEdit,
  };
}
