import React, { useCallback } from 'react';
import type { KanbanColumn as KanbanColumnType, KanbanCard as KanbanCardType, DragResult } from './types';
import { KanbanColumn } from './KanbanColumn';
import { useDragDrop } from './useDragDrop';

export interface KanbanBoardProps {
  columns: KanbanColumnType[];
  cards: KanbanCardType[];
  onCardMove?: (result: DragResult) => void;
  onCardClick?: (card: KanbanCardType) => void;
  onColumnAdd?: () => void;
  renderCard?: (card: KanbanCardType) => React.ReactNode;
  className?: string;
  addColumnLabel?: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  cards,
  onCardMove,
  onCardClick,
  onColumnAdd,
  renderCard,
  className,
  addColumnLabel = '+ Add Column',
}) => {
  const {
    draggedCardId,
    dragOverColumnId,
    dragOverIndex,
    sourceColumnId,
    handlers,
  } = useDragDrop();

  const getColumnCards = useCallback(
    (columnId: string) => cards.filter((c) => c.columnId === columnId),
    [cards],
  );

  const handleColumnDrop = useCallback(
    (cardId: string, columnId: string, toIndex: number) => {
      if (!onCardMove || !draggedCardId) return;
      const card = cards.find((c) => c.id === cardId);
      if (!card) return;

      onCardMove({
        cardId,
        fromColumnId: sourceColumnId ?? card.columnId,
        toColumnId: columnId,
        toIndex,
      });
    },
    [onCardMove, cards, draggedCardId, sourceColumnId],
  );

  return (
    <div
      className={className}
      role="region"
      aria-label="Kanban board"
      style={{
        display: 'flex',
        gap: '16px',
        overflowX: 'auto',
        padding: '8px 4px',
        minHeight: '400px',
        alignItems: 'flex-start',
      }}
    >
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          column={column}
          cards={getColumnCards(column.id)}
          isDragOver={dragOverColumnId === column.id}
          dragOverIndex={dragOverColumnId === column.id ? dragOverIndex : -1}
          draggedCardId={draggedCardId}
          onDrop={(cardId, toIndex) => handleColumnDrop(cardId, column.id, toIndex)}
          onCardClick={onCardClick}
          renderCard={renderCard}
          onDragStart={handlers.onDragStart}
          onDragEnd={handlers.onDragEnd}
          onDragOverCard={handlers.onDragOver}
          onDragEnter={handlers.onDragEnter}
          onDragLeave={handlers.onDragLeave}
          onDropColumn={handlers.onDrop}
        />
      ))}

      {/* Add Column Button */}
      {onColumnAdd && (
        <button
          type="button"
          onClick={onColumnAdd}
          aria-label="Add new column"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '300px',
            minWidth: '300px',
            minHeight: '120px',
            border: '2px dashed var(--border-subtle, #d1d5db)',
            borderRadius: 'var(--radius-lg, 12px)',
            background: 'transparent',
            color: 'var(--text-tertiary, #9ca3af)',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'border-color 0.15s ease, color 0.15s ease, background 0.15s ease',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.borderColor = 'var(--border-accent, #3b82f6)';
            el.style.color = 'var(--text-primary, #111827)';
            el.style.background = 'var(--surface-subtle, #f9fafb)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.borderColor = 'var(--border-subtle, #d1d5db)';
            el.style.color = 'var(--text-tertiary, #9ca3af)';
            el.style.background = 'transparent';
          }}
        >
          {addColumnLabel}
        </button>
      )}
    </div>
  );
};
