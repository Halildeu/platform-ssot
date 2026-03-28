/**
 * FilterBuilderPanel — Drawer-based filter builder with AND/OR groups.
 * Reads/writes AG Grid filterModel. Syncs with floating filters.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Filter, X, Trash2, Check } from 'lucide-react';
import type { ColDef, GridApi } from 'ag-grid-community';
import { useFilterBuilder, createEmptyGroup } from './useFilterBuilder';
import { treeToFilterModel, filterModelToTree } from './filterModelConverter';
import { FilterGroupNode } from './FilterGroupNode';

/**
 * Extract comma-separated text values as multiSearch terms.
 * Returns a cleaned root (single values only) + array of multi-search terms.
 */
function extractMultiValueTerms(group: import('./useFilterBuilder').FilterGroup): {
  singleValueRoot: import('./useFilterBuilder').FilterGroup;
  multiSearchTerms: string[];
} {
  const terms: string[] = [];
  const newChildren: import('./useFilterBuilder').FilterNode[] = [];

  for (const child of group.children) {
    if (child.type === 'group') {
      const sub = extractMultiValueTerms(child);
      terms.push(...sub.multiSearchTerms);
      newChildren.push(sub.singleValueRoot);
    } else if (
      child.type === 'condition' &&
      child.filterType === 'text' &&
      typeof child.value === 'string' &&
      child.value.includes(',')
    ) {
      const parts = child.value.split(',').map((s) => s.trim()).filter(Boolean);
      if (parts.length > 1) {
        terms.push(...parts);
        // Don't add to filterModel — handled via multiSearch param
      } else {
        newChildren.push(child);
      }
    } else {
      newChildren.push(child);
    }
  }

  return {
    singleValueRoot: { ...group, children: newChildren },
    multiSearchTerms: terms,
  };
}

/**
 * Expand comma-separated text values into separate OR conditions.
 * "Admin 1, Admin User" → OR group with 2 conditions.
 */
function expandMultiValueConditions(group: import('./useFilterBuilder').FilterGroup): import('./useFilterBuilder').FilterGroup {
  const newChildren: import('./useFilterBuilder').FilterNode[] = [];

  for (const child of group.children) {
    if (child.type === 'group') {
      newChildren.push(expandMultiValueConditions(child));
    } else if (
      child.type === 'condition' &&
      child.filterType === 'text' &&
      typeof child.value === 'string' &&
      child.value.includes(',')
    ) {
      const parts = child.value.split(',').map((s) => s.trim()).filter(Boolean);
      if (parts.length > 1) {
        // Create an OR sub-group with one condition per value
        const orGroup: import('./useFilterBuilder').FilterGroup = {
          type: 'group',
          id: `${child.id}_expanded`,
          logic: 'OR',
          children: parts.map((part, i) => ({
            type: 'condition' as const,
            id: `${child.id}_${i}`,
            colId: child.colId,
            filterType: child.filterType,
            operator: child.operator,
            value: part,
          })),
        };
        newChildren.push(orGroup);
      } else {
        newChildren.push(child);
      }
    } else {
      newChildren.push(child);
    }
  }

  return { ...group, children: newChildren };
}

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
  const { root, setRoot, addCondition, addGroup, removeNode, updateCondition, setLogic, clear, isEmpty, maxDepthReached } =
    useFilterBuilder(3);
  const [matchCount, setMatchCount] = useState<number | null>(null);

  // Import current grid filters ONLY when panel first opens (false→true transition)
  const prevOpenRef = React.useRef(false);
  useEffect(() => {
    if (open && !prevOpenRef.current && gridApi) {
      const model = gridApi.getFilterModel?.() ?? {};
      const imported = Object.keys(model).length > 0
        ? filterModelToTree(model, columnDefs)
        : createEmptyGroup();

      // Re-inject multiSearch terms as a text condition with comma-separated values
      const multiSearch = (gridApi as any).__multiSearch as string | undefined;
      if (multiSearch) {
        const terms = multiSearch.split('|').filter(Boolean);
        if (terms.length > 0) {
          // Find which colId was used — default to first text column
          const textCol = columnDefs.find((c) =>
            c.field && c.filter !== 'agSetColumnFilter' && c.filter !== 'agNumberColumnFilter' && c.filter !== 'agDateColumnFilter'
          );
          const colId = textCol?.field ?? 'fullName';
          imported.children.push({
            type: 'condition' as const,
            id: `fb_multi_${Date.now()}`,
            colId,
            filterType: 'text' as const,
            operator: 'contains',
            value: terms.join(', '),
          });
        }
      }

      setRoot(imported);
    }
    prevOpenRef.current = open;
  }, [open, gridApi, columnDefs, setRoot]);

  // Live match count preview
  useEffect(() => {
    if (!open || !gridApi) {
      setMatchCount(null);
      return;
    }
    try {
      setMatchCount(gridApi.getDisplayedRowCount?.() ?? null);
    } catch {
      setMatchCount(null);
    }
  }, [open, gridApi, root]);

  const handleApply = useCallback(() => {
    if (!gridApi) return;

    // Extract multi-value text conditions → send as multiSearch param to backend
    const { singleValueRoot, multiSearchTerms } = extractMultiValueTerms(root);
    const model = treeToFilterModel(singleValueRoot);

    // Set multiSearch as a custom grid option that SSRM datasource can read
    if (multiSearchTerms.length > 0) {
      (gridApi as any).__multiSearch = multiSearchTerms.join('|');
    } else {
      delete (gridApi as any).__multiSearch;
    }

    gridApi.setFilterModel(model);
    gridApi.onFilterChanged();
    onClose();
  }, [gridApi, root, onClose]);

  const handleClear = useCallback(() => {
    if (!gridApi) return;
    gridApi.setFilterModel(null);
    gridApi.onFilterChanged();
    clear();
    onClose();
  }, [gridApi, clear, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />

      {/* Panel */}
      <div className="fixed bottom-0 right-0 top-0 z-50 flex w-[480px] flex-col bg-surface-default shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-action-primary/10">
              <Filter className="h-4 w-4 text-action-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text-primary">Filtre Oluşturucu</h2>
              <p className="text-[10px] text-text-subtle">Koşulları birleştirerek filtre oluşturun</p>
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
          />
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
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Temizle
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={isEmpty}
              className="flex items-center gap-1.5 rounded-lg bg-action-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-action-primary/90 disabled:opacity-50"
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

  // Track active filter count
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
            ? 'bg-action-primary text-white'
            : 'bg-surface-muted text-text-secondary hover:bg-surface-raised'
        }`}
        title="Filtre Oluşturucu"
      >
        <Filter className="h-3.5 w-3.5" />
        Filtre
        {activeCount > 0 && (
          <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-bold">
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
