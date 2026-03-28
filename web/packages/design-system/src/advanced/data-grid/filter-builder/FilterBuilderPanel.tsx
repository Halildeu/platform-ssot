/**
 * FilterBuilderPanel — Drawer-based filter builder with AG Grid integration.
 *
 * - DndContext wraps the tree for drag-and-drop reordering
 * - State persisted to gridApi.__filterBuilderTree between opens
 * - On Apply: tree → filterModel → gridApi.setFilterModel()
 * - SSRM: gridApi.refreshServerSide({ purge: true }) called automatically by GridShell on filterChanged
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Filter, X, Trash2, Check } from 'lucide-react';
import type { ColDef, GridApi } from 'ag-grid-community';
import { useFilterBuilder, createEmptyGroup } from './useFilterBuilder';
import { treeToFilterModel, filterModelToTree, extractMultiSearchParams } from './filterModelConverter';
import { FilterGroupNode } from './FilterGroupNode';
import type { FilterGroup } from './types';

export interface FilterBuilderPanelProps {
  gridApi: GridApi | null;
  columnDefs: ColDef[];
  open: boolean;
  onClose: () => void;
}

export const FilterBuilderPanel: React.FC<FilterBuilderPanelProps> = ({
  gridApi,
  columnDefs,
  open,
  onClose,
}) => {
  const {
    root, setRoot,
    addCondition, addGroup, removeNode, updateCondition, setLogic,
    moveNode, moveNodeDnD,
    cloneNode, toggleLock, toggleNot,
    clear, isEmpty, maxDepthReached,
  } = useFilterBuilder(3);

  const [matchCount, setMatchCount] = useState<number | null>(null);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // Import state when panel transitions from closed → open
  const prevOpenRef = React.useRef(false);
  useEffect(() => {
    if (open && !prevOpenRef.current && gridApi) {
      const savedTree = (gridApi as unknown as Record<string, unknown>).__filterBuilderTree as FilterGroup | undefined;
      if (savedTree && Array.isArray(savedTree.children) && savedTree.children.length > 0) {
        setRoot(savedTree);
      } else {
        const model = gridApi.getFilterModel?.() ?? {};
        const imported = Object.keys(model).length > 0
          ? filterModelToTree(model, columnDefs)
          : createEmptyGroup();
        setRoot(imported);
      }
    }
    prevOpenRef.current = open;
  }, [open, gridApi, columnDefs, setRoot]);

  // Live match count (meaningful only for client-side row model)
  useEffect(() => {
    if (!open || !gridApi) { setMatchCount(null); return; }
    try { setMatchCount(gridApi.getDisplayedRowCount?.() ?? null); }
    catch { setMatchCount(null); }
  }, [open, gridApi, root]);

  const handleApply = useCallback(() => {
    if (!gridApi) return;
    const model = treeToFilterModel(root);
    const api = gridApi as unknown as Record<string, unknown>;
    api.__filterBuilderTree = JSON.parse(JSON.stringify(root));
    const multiSearch = extractMultiSearchParams(root);
    if (Object.keys(multiSearch).length > 0) {
      api.__multiSearchParams = multiSearch;
    } else {
      delete api.__multiSearchParams;
    }
    gridApi.setFilterModel(model);
    gridApi.onFilterChanged();
    onClose();
  }, [gridApi, root, onClose]);

  const handleClear = useCallback(() => {
    if (!gridApi) return;
    const api = gridApi as unknown as Record<string, unknown>;
    delete api.__filterBuilderTree;
    delete api.__multiSearchParams;
    gridApi.setFilterModel(null);
    gridApi.onFilterChanged();
    clear();
    onClose();
  }, [gridApi, clear, onClose]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      moveNodeDnD(String(active.id), String(over.id));
    }
  }, [moveNodeDnD]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />

      {/* Panel */}
      <div className="fixed bottom-0 right-0 top-0 z-50 flex w-[620px] flex-col bg-surface-default shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-action-primary/10">
              <Filter className="h-4 w-4 text-action-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text-primary">Filtre Oluşturucu</h2>
              <p className="text-[10px] text-text-subtle">Bağımsız VE/VEYA koşullarıyla gelişmiş filtre</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-subtle hover:bg-surface-muted hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <FilterGroupNode
              group={root}
              columnDefs={columnDefs}
              depth={0}
              isRoot
              maxDepthReached={maxDepthReached}
              onAddCondition={addCondition}
              onAddGroup={addGroup}
              onRemoveNode={removeNode}
              onUpdateCondition={updateCondition}
              onSetLogic={setLogic}
              onMoveNode={moveNode}
              onCloneNode={cloneNode}
              onToggleLock={toggleLock}
              onToggleNot={toggleNot}
            />
          </DndContext>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border-subtle px-6 py-3">
          <div className="text-[11px] text-text-subtle">
            {matchCount != null && (
              <span>{matchCount.toLocaleString('tr-TR')} satır eşleşiyor</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-state-danger-text hover:bg-state-danger-bg"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Temizle
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={isEmpty}
              className="flex items-center gap-1.5 rounded-lg bg-action-primary px-4 py-2 text-xs font-semibold text-text-inverse shadow-sm hover:bg-action-primary/90 disabled:opacity-50"
            >
              <Check className="h-3.5 w-3.5" />
              Uygula
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ── Toolbar Button ──

export const FilterBuilderButton: React.FC<{
  gridApi: GridApi | null;
  columnDefs: ColDef[];
}> = ({ gridApi, columnDefs }) => {
  const [open, setOpen] = useState(false);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    if (!gridApi) return;
    const handler = () => {
      const model = gridApi.getFilterModel?.() ?? {};
      setActiveCount(Object.keys(model).length);
    };
    handler();
    gridApi.addEventListener('filterChanged', handler);
    return () => {
      try { gridApi.removeEventListener('filterChanged', handler); } catch { /* */ }
    };
  }, [gridApi]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition ${
          activeCount > 0
            ? 'bg-action-primary text-text-inverse'
            : 'bg-surface-muted text-text-secondary hover:bg-surface-raised'
        }`}
        title="Filtre Oluşturucu"
      >
        <Filter className="h-3.5 w-3.5" />
        Filtre
        {activeCount > 0 && (
          <span className="rounded-full bg-text-inverse/20 px-1.5 py-0.5 text-[10px] font-bold">
            {activeCount}
          </span>
        )}
      </button>
      <FilterBuilderPanel
        gridApi={gridApi}
        columnDefs={columnDefs}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};
