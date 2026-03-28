/**
 * FilterGroupNode — Recursive AND/OR group inspired by react-querybuilder.
 *
 * Layout:
 *   ┌─ [+ Rule] [+ Group] [Clone] [Delete]  ───── group header
 *   │  [Field ▼] [Op ▼] [Value]  [↑↓→←🗑]   ───── rule
 *   │            ─── AND ▼ ───                ───── combinator (clickable)
 *   │  [Field ▼] [Op ▼] [Value]  [↑↓→←🗑]   ───── rule
 *   │            ─── AND ▼ ───
 *   │  ┌─ [+ Rule] [+ Group] [Delete]        ───── sub-group
 *   │  │  [Field ▼] [Op ▼] [Value]
 *   │  │            ─── OR ▼ ───
 *   │  │  [Field ▼] [Op ▼] [Value]
 *   │  └──────────────────────────────────
 *   └────────────────────────────────────────
 */
import React from 'react';
import { Plus, FolderPlus, Trash2, ChevronUp, ChevronDown, IndentIncrease, IndentDecrease } from 'lucide-react';
import type { ColDef } from 'ag-grid-community';
import type { FilterGroup, FilterCondition, FilterCombinator } from './useFilterBuilder';
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

const DEPTH_COLORS = [
  { border: 'border-blue-300', bg: 'bg-blue-50/50', headerBg: 'bg-blue-100', text: 'text-blue-800' },
  { border: 'border-violet-300', bg: 'bg-violet-50/50', headerBg: 'bg-violet-100', text: 'text-violet-800' },
  { border: 'border-amber-300', bg: 'bg-amber-50/50', headerBg: 'bg-amber-100', text: 'text-amber-800' },
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
  const colors = DEPTH_COLORS[depth % DEPTH_COLORS.length];
  const totalChildren = group.children.length;

  return (
    <div className={isRoot ? 'flex flex-col gap-0' : `rounded-lg border ${colors.border} ${colors.bg} overflow-hidden`}>
      {/* Group header bar — always visible */}
      <div className={`flex items-center gap-2 px-3 py-2 ${isRoot ? '' : colors.headerBg}`}>
        {/* Action buttons */}
        <button
          type="button"
          onClick={() => onAddCondition(group.id)}
          className="flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-blue-700"
        >
          <Plus className="h-3 w-3" />
          Kural
        </button>
        {!maxDepthReached && (
          <button
            type="button"
            onClick={() => onAddGroup(group.id)}
            className="flex items-center gap-1 rounded-md bg-violet-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-violet-700"
          >
            <FolderPlus className="h-3 w-3" />
            Grup
          </button>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Group delete (not root) */}
        {!isRoot && (
          <button
            type="button"
            onClick={() => onRemoveNode(group.id)}
            className="rounded p-1 text-text-subtle hover:bg-rose-100 hover:text-rose-600"
            title="Grubu sil"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Rules + combinators */}
      <div className={`flex flex-col ${isRoot ? '' : 'px-3 pb-3'}`}>
        {/* Empty state */}
        {totalChildren === 0 && (
          <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border-subtle py-8 text-center">
            <div>
              <p className="text-sm text-text-subtle">Henüz kural eklenmedi</p>
              <p className="mt-1 text-[10px] text-text-subtle">Yukarıdaki &quot;Kural&quot; butonuna tıklayın</p>
            </div>
          </div>
        )}

        {group.children.map((child) => (
          <React.Fragment key={child.id}>
            {/* Independent combinator — each one toggles independently */}
            {child.type === 'combinator' ? (
              <div className="flex items-center gap-2 py-1">
                <div className="h-px flex-1 bg-border-subtle" />
                <button
                  type="button"
                  onClick={() => onSetLogic(child.id, child.logic === 'AND' ? 'OR' : 'AND')}
                  className={`rounded-full px-3 py-0.5 text-[10px] font-bold transition ${
                    child.logic === 'AND'
                      ? 'bg-blue-100 text-blue-700 hover:bg-orange-100 hover:text-orange-700'
                      : 'bg-orange-100 text-orange-700 hover:bg-blue-100 hover:text-blue-700'
                  }`}
                  title={`Tıkla: ${child.logic === 'AND' ? 'VEYA' : 'VE'} olarak değiştir`}
                >
                  {child.logic === 'AND' ? 'VE' : 'VEYA'}
                </button>
                <div className="h-px flex-1 bg-border-subtle" />
              </div>
            ) : null}

            {/* Rule */}
            {child.type === 'condition' ? (
              <FilterConditionRow
                condition={child}
                columnDefs={columnDefs}
                onUpdate={onUpdateCondition}
                onRemove={onRemoveNode}
                onIndent={onIndentNode}
                onOutdent={onOutdentNode}
                onMove={onMoveNode}
                canRemove={totalChildren > 1 || !isRoot}
                canIndent={!maxDepthReached}
                canOutdent={!isRoot && depth > 0}
              />
            ) : (
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
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
