/**
 * FilterGroupNode — Recursive AND/OR group with conditions and sub-groups.
 */
import React from 'react';
import { Plus, FolderPlus, Trash2 } from 'lucide-react';
import type { ColDef } from 'ag-grid-community';
import type { FilterGroup, FilterCondition } from './useFilterBuilder';
import { FilterConditionRow } from './FilterConditionRow';

interface FilterGroupNodeProps {
  group: FilterGroup;
  columnDefs: ColDef[];
  depth: number;
  isRoot?: boolean;
  maxDepthReached: boolean;
  onAddCondition: (parentId: string) => void;
  onAddGroup: (parentId: string) => void;
  onRemoveNode: (id: string) => void;
  onUpdateCondition: (id: string, updates: Partial<FilterCondition>) => void;
  onSetLogic: (groupId: string, logic: 'AND' | 'OR') => void;
  onIndentNode?: (id: string) => void;
  onOutdentNode?: (id: string) => void;
  onMoveNode?: (id: string, direction: 'up' | 'down') => void;
}

const DEPTH_STYLES = [
  { border: 'border-blue-200', bg: 'bg-blue-50/40', accent: 'text-blue-700', label: 'border-l-blue-400' },
  { border: 'border-violet-200', bg: 'bg-violet-50/40', accent: 'text-violet-700', label: 'border-l-violet-400' },
  { border: 'border-amber-200', bg: 'bg-amber-50/40', accent: 'text-amber-700', label: 'border-l-amber-400' },
];

export const FilterGroupNode: React.FC<FilterGroupNodeProps> = ({
  group,
  columnDefs,
  depth,
  isRoot = false,
  maxDepthReached,
  onAddCondition,
  onAddGroup,
  onRemoveNode,
  onUpdateCondition,
  onSetLogic,
  onIndentNode,
  onOutdentNode,
  onMoveNode,
}) => {
  const style = DEPTH_STYLES[depth % DEPTH_STYLES.length];
  const totalChildren = group.children.length;

  return (
    <div className={isRoot
      ? ''
      : `mt-2 rounded-lg border ${style.border} ${style.bg} p-3`
    }>
      {/* Group header — only for sub-groups, root is implicit */}
      {!isRoot && (
        <div className="mb-2 flex items-center gap-2">
          <span className={`text-[9px] font-bold uppercase ${style.accent}`}>
            Seviye {depth}
          </span>
          <div className="inline-flex rounded-md border border-border-subtle bg-surface-default text-[11px] font-semibold">
            <button type="button" className={`rounded-l-md px-2.5 py-1 transition ${group.logic === 'AND' ? 'bg-action-primary text-white' : 'text-text-secondary hover:bg-surface-muted'}`} onClick={() => onSetLogic(group.id, 'AND')}>VE</button>
            <button type="button" className={`rounded-r-md px-2.5 py-1 transition ${group.logic === 'OR' ? 'bg-action-primary text-white' : 'text-text-secondary hover:bg-surface-muted'}`} onClick={() => onSetLogic(group.id, 'OR')}>VEYA</button>
          </div>
          <span className="text-[10px] text-text-subtle">
            {group.logic === 'AND' ? 'Tüm koşullar sağlanmalı' : 'Herhangi biri yeterli'}
          </span>
          <button type="button" onClick={() => onRemoveNode(group.id)} className="ml-auto rounded p-1 text-text-subtle hover:bg-rose-100 hover:text-rose-600" title="Grubu sil">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
      </div>

      {/* Empty state */}
      {totalChildren === 0 && (
        <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border-subtle py-6 text-center">
          <div>
            <p className="text-sm text-text-subtle">Henüz koşul eklenmedi</p>
            <p className="mt-1 text-[10px] text-text-subtle">Aşağıdaki butonları kullanarak koşul veya grup ekleyin</p>
          </div>
        </div>
      )}

      {/* Conditions with logic connectors between them */}
      <div className="flex flex-col gap-1">
        {group.children.map((child, index) => {
          const connector = index > 0 ? (
            <div key={`conn_${child.id}`} className="flex items-center gap-2 py-0.5 pl-2">
              <button
                type="button"
                onClick={() => onSetLogic(group.id, group.logic === 'AND' ? 'OR' : 'AND')}
                className={`cursor-pointer rounded-full px-2.5 py-0.5 text-[9px] font-bold transition hover:opacity-80 ${
                  group.logic === 'AND'
                    ? 'bg-blue-100 text-blue-700 hover:bg-orange-100 hover:text-orange-700'
                    : 'bg-orange-100 text-orange-700 hover:bg-blue-100 hover:text-blue-700'
                }`}
                title={`Tıkla: ${group.logic === 'AND' ? 'VEYA' : 'VE'} olarak değiştir`}
              >
                {group.logic === 'AND' ? 'VE' : 'VEYA'}
              </button>
              <div className="h-px flex-1 bg-border-subtle" />
            </div>
          ) : null;

          if (child.type === 'condition') {
            return (
              <React.Fragment key={child.id}>
                {connector}
                <FilterConditionRow
                  condition={child}
                  columnDefs={columnDefs}
                  onUpdate={onUpdateCondition}
                  onRemove={onRemoveNode}
                  onIndent={onIndentNode}
                  onOutdent={onOutdentNode}
                  onMove={onMoveNode}
                  canRemove={totalChildren > 1}
                  canIndent={!maxDepthReached}
                  canOutdent={!isRoot && depth > 0}
                />
              </React.Fragment>
            );
          }
          if (child.type === 'group') {
            return (
              <React.Fragment key={child.id}>
                {connector}
                <FilterGroupNode
                  group={child}
                  columnDefs={columnDefs}
                  depth={depth + 1}
                  maxDepthReached={maxDepthReached}
                  onAddCondition={onAddCondition}
                  onAddGroup={onAddGroup}
                  onRemoveNode={onRemoveNode}
                  onUpdateCondition={onUpdateCondition}
                  onSetLogic={onSetLogic}
                  onIndentNode={onIndentNode}
                  onOutdentNode={onOutdentNode}
                  onMoveNode={onMoveNode}
                />
              </React.Fragment>
            );
          }
          return null;
        })}
      </div>

      {/* Add buttons */}
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onAddCondition(group.id)}
          className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
        >
          <Plus className="h-3.5 w-3.5" />
          Koşul Ekle
        </button>
        {!maxDepthReached && (
          <button
            type="button"
            onClick={() => onAddGroup(group.id)}
            className="flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 hover:bg-violet-100"
          >
            <FolderPlus className="h-3.5 w-3.5" />
            Grup Ekle
          </button>
        )}
      </div>
    </div>
  );
};
