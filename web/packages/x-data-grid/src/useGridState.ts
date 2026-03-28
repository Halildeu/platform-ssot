import { useCallback, useMemo, useState } from 'react';
import type { ColumnState, GridApi } from 'ag-grid-community';

interface GridPersistedState {
  columnState: ColumnState[];
  filterModel: Record<string, unknown>;
  sortModel: Array<{ colId: string; sort: 'asc' | 'desc' }>;
  columnGroupState: Array<{ groupId: string; open: boolean }>;
}

const STORAGE_PREFIX = 'x-data-grid-state:';

function getStorageKey(gridId: string): string {
  return `${STORAGE_PREFIX}${gridId}`;
}

export function useGridState(gridId: string) {
  const [hasSavedState, setHasSavedState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(getStorageKey(gridId)) !== null;
    } catch {
      return false;
    }
  });

  const saveState = useCallback(
    (api: GridApi) => {
      try {
        const state: GridPersistedState = {
          columnState: api.getColumnState(),
          filterModel: api.getFilterModel(),
          sortModel: api.getColumnState()
            .filter((col) => col.sort != null)
            .map((col) => ({ colId: col.colId, sort: col.sort as 'asc' | 'desc' })),
          columnGroupState: api.getColumnGroupState(),
        };

        localStorage.setItem(getStorageKey(gridId), JSON.stringify(state));
        setHasSavedState(true);
      } catch (error) {
        console.error('[X-Data-Grid] useGridState: failed to save state:', error);
      }
    },
    [gridId],
  );

  const restoreState = useCallback(
    (api: GridApi) => {
      try {
        const raw = localStorage.getItem(getStorageKey(gridId));
        if (!raw) return;

        const state: GridPersistedState = JSON.parse(raw);

        if (state.columnState) {
          api.applyColumnState({ state: state.columnState, applyOrder: true });
        }
        if (state.filterModel) {
          api.setFilterModel(state.filterModel);
        }
        if (state.columnGroupState) {
          api.setColumnGroupState(state.columnGroupState);
        }
      } catch (error) {
        console.error('[X-Data-Grid] useGridState: failed to restore state:', error);
      }
    },
    [gridId],
  );

  const clearState = useCallback(() => {
    try {
      localStorage.removeItem(getStorageKey(gridId));
      setHasSavedState(false);
    } catch (error) {
      console.error('[X-Data-Grid] useGridState: failed to clear state:', error);
    }
  }, [gridId]);

  return useMemo(
    () => ({
      saveState,
      restoreState,
      clearState,
      hasSavedState,
    }),
    [saveState, restoreState, clearState, hasSavedState],
  );
}
