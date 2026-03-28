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
}

const DEPTH_COLORS = [
  'border-l-blue-400',
  'border-l-violet-400',
  'border-l-amber-400',
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
}) => {
  const borderColor = DEPTH_COLORS[depth % DEPTH_COLORS.length];
  const conditions = group.children.filter((c) => c.type === 'condition') as FilterCondition[];
  const subGroups = group.children.filter((c) => c.type === 'group') as FilterGroup[];
  const totalChildren = group.children.length;

  return (
    <div className={`${isRoot ? '' : `ml-2 border-l-2 ${borderColor} pl-3`}`}>
      {/* Group header: AND/OR toggle */}
      <div className="mb-2 flex items-center gap-2">
        <div className="inline-flex rounded-md border border-border-subtle bg-surface-default text-[11px] font-semibold">
          <button
            type="button"
            className={`rounded-l-md px-2.5 py-1 transition ${
              group.logic === 'AND'
                ? 'bg-action-primary text-white'
                : 'text-text-secondary hover:bg-surface-muted'
            }`}
            onClick={() => onSetLogic(group.id, 'AND')}
          >
            VE
          </button>
          <button
            type="button"
            className={`rounded-r-md px-2.5 py-1 transition ${
              group.logic === 'OR'
                ? 'bg-action-primary text-white'
                : 'text-text-secondary hover:bg-surface-muted'
            }`}
            onClick={() => onSetLogic(group.id, 'OR')}
          >
            VEYA
          </button>
        </div>

        <span className="text-[10px] text-text-subtle">
          {group.logic === 'AND' ? 'Tüm koşullar sağlanmalı' : 'Herhangi biri yeterli'}
        </span>

        {!isRoot && (
          <button
            type="button"
            onClick={() => onRemoveNode(group.id)}
            className="ml-auto rounded p-1 text-text-subtle hover:bg-rose-100 hover:text-rose-600"
            title="Grubu sil"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Conditions */}
      <div className="flex flex-col gap-2">
        {group.children.map((child) => {
          if (child.type === 'condition') {
            return (
              <FilterConditionRow
                key={child.id}
                condition={child}
                columnDefs={columnDefs}
                onUpdate={onUpdateCondition}
                onRemove={onRemoveNode}
                canRemove={totalChildren > 1}
              />
            );
          }
          if (child.type === 'group') {
            return (
              <FilterGroupNode
                key={child.id}
                group={child}
                columnDefs={columnDefs}
                depth={depth + 1}
                maxDepthReached={maxDepthReached}
                onAddCondition={onAddCondition}
                onAddGroup={onAddGroup}
                onRemoveNode={onRemoveNode}
                onUpdateCondition={onUpdateCondition}
                onSetLogic={onSetLogic}
              />
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
