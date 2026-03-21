import React, { useCallback } from 'react';
import type {
  KanbanColumn as KanbanColumnType,
  KanbanCard as KanbanCardType,
  DragResult,
  Swimlane,
} from './types';
import { KanbanColumn } from './KanbanColumn';
import { KanbanSwimlane } from './KanbanSwimlane';
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
  /** When provided, cards are grouped by swimlaneId into horizontal rows. */
  swimlanes?: Swimlane[];
  onToggleSwimlane?: (swimlaneId: string) => void;
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
  swimlanes,
  onToggleSwimlane,
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

  /* ---------------------------------------------------------------- */
  /*  Swimlane mode                                                    */
  /* ---------------------------------------------------------------- */
  if (swimlanes && swimlanes.length > 0) {
    return (
      <div
        className={className}
        role="region"
        aria-label="Kanban board"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: '8px 4px',
          minHeight: '400px',
        }}
      >
        {swimlanes.map((swimlane) => {
          const swimlaneCards = cards.filter(
            (c) => c.swimlaneId === swimlane.id,
          );
          return (
            <KanbanSwimlane
              key={swimlane.id}
              swimlane={swimlane}
              columns={columns}
              cards={swimlaneCards}
              onToggleCollapse={onToggleSwimlane}
              onCardClick={onCardClick}
              renderCard={renderCard}
              draggedCardId={draggedCardId}
              dragOverColumnId={dragOverColumnId}
              dragOverIndex={dragOverIndex}
              onDrop={(cardId, columnId, toIndex) =>
                handleColumnDrop(cardId, columnId, toIndex)
              }
              onDragStart={handlers.onDragStart}
              onDragEnd={handlers.onDragEnd}
              onDragOverCard={handlers.onDragOver}
              onDragEnter={handlers.onDragEnter}
              onDragLeave={handlers.onDragLeave}
              onDropColumn={handlers.onDrop}
            />
          );
        })}

        {/* Cards without a swimlane */}
        {cards.some((c) => !c.swimlaneId) && (
          <KanbanSwimlane
            swimlane={{ id: '__unassigned', title: 'Unassigned' }}
            columns={columns}
            cards={cards.filter((c) => !c.swimlaneId)}
            onToggleCollapse={onToggleSwimlane}
            onCardClick={onCardClick}
            renderCard={renderCard}
            draggedCardId={draggedCardId}
            dragOverColumnId={dragOverColumnId}
            dragOverIndex={dragOverIndex}
            onDrop={(cardId, columnId, toIndex) =>
              handleColumnDrop(cardId, columnId, toIndex)
            }
            onDragStart={handlers.onDragStart}
            onDragEnd={handlers.onDragEnd}
            onDragOverCard={handlers.onDragOver}
            onDragEnter={handlers.onDragEnter}
            onDragLeave={handlers.onDragLeave}
            onDropColumn={handlers.onDrop}
          />
        )}
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Flat mode (original)                                             */
  /* ---------------------------------------------------------------- */
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
