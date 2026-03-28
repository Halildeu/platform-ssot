/**
 * FilterGroupNode — Recursive AND/OR group, react-querybuilder layout.
 *
 * Layout per group:
 *   ┌─ [NOT] [+ Kural] [+ Grup] [Clone] [Lock] [Delete]  ── group header
 *   ┃
 *   ┃── FilterConditionRow (kural)
 *   ┃── FilterCombinatorRow (VE ▼)
 *   ┃── FilterConditionRow (kural)
 *   ┃── [FilterGroupNode] (alt grup — recursive)
 *   ┃
 *   └─────────────────────────────────────────────────────
 *
 * Features: branch lines, NOT toggle, clone, lock, independent combinators, DnD via SortableContext.
 */
import React from 'react';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, FolderPlus, Trash2, Copy, Lock, Unlock, GripVertical } from 'lucide-react';
import type { ColDef } from 'ag-grid-community';
import type { FilterGroup, FilterCondition, FilterCombinator, FilterTreeNode } from './types';
import { FilterConditionRow } from './FilterConditionRow';
import { FilterCombinatorRow } from './FilterCombinatorRow';

// ── Depth color scheme (cycles: info → success → warning) ──
const DEPTH_COLORS = [
  { border: 'border-state-info-text/30', bg: 'bg-state-info-bg', headerBg: 'bg-state-info-bg', branchLine: 'bg-state-info-text/40', notActive: 'bg-action-primary text-text-inverse' },
  { border: 'border-state-success-text/30', bg: 'bg-state-success-bg', headerBg: 'bg-state-success-bg', branchLine: 'bg-state-success-text/40', notActive: 'bg-state-success-text text-text-inverse' },
  { border: 'border-state-warning-text/30', bg: 'bg-state-warning-bg', headerBg: 'bg-state-warning-bg', branchLine: 'bg-state-warning-text/40', notActive: 'bg-state-warning-text text-text-inverse' },
];

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
  onSetLogic: (targetId: string, logic: 'AND' | 'OR') => void;
  onMoveNode: (id: string, direction: 'up' | 'down') => void;
  onCloneNode: (id: string) => void;
  onToggleLock: (id: string) => void;
  onToggleNot: (groupId: string) => void;
  parentLocked?: boolean;
}

// ── Sortable wrapper for non-root groups ──
const SortableGroupWrapper: React.FC<{
  id: string;
  disabled: boolean;
  children: React.ReactNode;
}> = ({ id, disabled, children }) => {
  const { setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return <div ref={setNodeRef} style={style}>{children}</div>;
};

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
  onMoveNode,
  onCloneNode,
  onToggleLock,
  onToggleNot,
  parentLocked = false,
}) => {
  const colors = DEPTH_COLORS[depth % DEPTH_COLORS.length];
  const isLocked = group.locked || parentLocked;
  const substantialChildren = group.children.filter((c) => c.type !== 'combinator');

  const sortableIds = group.children
    .filter((c) => c.type !== 'combinator')
    .map((c) => c.id);

  return (
    <div
      className={[
        isRoot ? 'flex flex-col gap-0' : `overflow-hidden rounded-lg border ${colors.border} ${colors.bg}`,
        isLocked && !isRoot ? 'opacity-80 ring-1 ring-amber-300' : '',
      ].join(' ')}
    >
      {/* ── Group header ── */}
      <div
        className={[
          'flex flex-wrap items-center gap-1.5 px-3 py-2',
          isRoot ? 'rounded-lg bg-surface-muted/60' : colors.headerBg,
        ].join(' ')}
      >
        {/* DnD grip (non-root groups) */}
        {!isRoot && (
          <span className={`touch-none text-text-subtle ${isLocked ? 'cursor-not-allowed opacity-40' : 'cursor-grab'}`}>
            <GripVertical className="h-3.5 w-3.5" />
          </span>
        )}

        {/* NOT toggle */}
        <button
          type="button"
          disabled={isLocked}
          onClick={() => onToggleNot(group.id)}
          className={[
            'rounded px-2 py-0.5 text-[10px] font-bold transition',
            group.not
              ? colors.notActive
              : 'bg-surface-default text-text-subtle ring-1 ring-border-subtle hover:ring-text-subtle',
            isLocked ? 'cursor-not-allowed opacity-60' : '',
          ].join(' ')}
          title={group.not ? 'NOT aktif — tıkla: kaldır' : 'NOT ekle (grubu tersine çevir)'}
        >
          DEĞİL
        </button>

        {/* + Rule */}
        <button
          type="button"
          disabled={isLocked}
          onClick={() => onAddCondition(group.id)}
          className="flex items-center gap-1 rounded-md bg-action-primary px-2.5 py-1 text-[11px] font-semibold text-text-inverse hover:bg-action-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus className="h-3 w-3" />
          Kural
        </button>

        {/* + Group */}
        {!maxDepthReached && (
          <button
            type="button"
            disabled={isLocked}
            onClick={() => onAddGroup(group.id)}
            className="flex items-center gap-1 rounded-md bg-action-primary/15 px-2.5 py-1 text-[11px] font-semibold text-action-primary hover:bg-action-primary/25 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FolderPlus className="h-3 w-3" />
            Grup
          </button>
        )}

        <div className="flex-1" />

        {/* Clone group */}
        {!isRoot && (
          <button
            type="button"
            onClick={() => onCloneNode(group.id)}
            className="rounded p-1 text-text-subtle hover:bg-surface-default/60 hover:text-text-secondary"
            title="Grubu kopyala"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Lock group */}
        {!isRoot && !parentLocked && (
          <button
            type="button"
            onClick={() => onToggleLock(group.id)}
            className={[
              'rounded p-1 transition',
              group.locked ? 'text-state-warning-text hover:bg-state-warning-bg' : 'text-text-subtle hover:bg-surface-default/60 hover:text-state-warning-text',
            ].join(' ')}
            title={group.locked ? 'Grubu aç' : 'Grubu kilitle'}
          >
            {group.locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
          </button>
        )}

        {/* Delete group */}
        {!isRoot && (
          <button
            type="button"
            onClick={() => onRemoveNode(group.id)}
            disabled={isLocked}
            className="rounded p-1 text-text-subtle hover:bg-state-danger-bg hover:text-state-danger-text disabled:cursor-not-allowed disabled:opacity-40"
            title="Grubu sil"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* ── Body: rules + combinators + sub-groups ── */}
      <div className={`flex flex-col ${isRoot ? 'mt-2' : 'p-3'}`}>
        {/* Empty state */}
        {substantialChildren.length === 0 && (
          <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border-subtle py-8 text-center">
            <div>
              <p className="text-sm text-text-subtle">Henüz kural eklenmedi</p>
              <p className="mt-1 text-[10px] text-text-subtle">Yukarıdaki &quot;Kural&quot; butonuna tıklayın</p>
            </div>
          </div>
        )}

        {/* Branch container */}
        {substantialChildren.length > 0 && (
          <div className="relative flex flex-col gap-0">
            {/* Vertical branch line */}
            {!isRoot && (
              <div
                className={`absolute bottom-3 top-3 w-0.5 ${colors.branchLine}`}
                style={{ left: '-12px' }}
              />
            )}

            <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
              {group.children.map((child: FilterTreeNode) => {
                if (child.type === 'combinator') {
                  return (
                    <FilterCombinatorRow
                      key={child.id}
                      combinator={child as FilterCombinator}
                      onSetLogic={onSetLogic}
                      disabled={isLocked}
                    />
                  );
                }

                if (child.type === 'condition') {
                  return (
                    <FilterConditionRow
                      key={child.id}
                      condition={child}
                      columnDefs={columnDefs}
                      onUpdate={onUpdateCondition}
                      onRemove={onRemoveNode}
                      onMove={onMoveNode}
                      onClone={onCloneNode}
                      onToggleLock={onToggleLock}
                      canRemove={substantialChildren.length > 1 || !isRoot}
                      parentLocked={isLocked}
                    />
                  );
                }

                if (child.type === 'group') {
                  return (
                    <SortableGroupWrapper
                      key={child.id}
                      id={child.id}
                      disabled={isLocked || (child as FilterGroup).locked === true}
                    >
                      <div className={`relative ${!isRoot ? 'ml-3' : ''} mt-2`}>
                        {/* Horizontal branch connector */}
                        {!isRoot && (
                          <div
                            className={`absolute top-4 h-0.5 w-3 ${colors.branchLine}`}
                            style={{ left: '-12px' }}
                          />
                        )}
                        <FilterGroupNode
                          group={child as FilterGroup}
                          columnDefs={columnDefs}
                          depth={depth + 1}
                          maxDepthReached={maxDepthReached}
                          onAddCondition={onAddCondition}
                          onAddGroup={onAddGroup}
                          onRemoveNode={onRemoveNode}
                          onUpdateCondition={onUpdateCondition}
                          onSetLogic={onSetLogic}
                          onMoveNode={onMoveNode}
                          onCloneNode={onCloneNode}
                          onToggleLock={onToggleLock}
                          onToggleNot={onToggleNot}
                          parentLocked={isLocked}
                        />
                      </div>
                    </SortableGroupWrapper>
                  );
                }

                return null;
              })}
            </SortableContext>
          </div>
        )}
      </div>
    </div>
  );
};
