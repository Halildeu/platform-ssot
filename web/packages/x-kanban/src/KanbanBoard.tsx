import React, { useCallback } from 'react';
import type {
  KanbanColumn as KanbanColumnType,
  KanbanCard as KanbanCardType,
  DragResult,
  Swimlane,
} from './types';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard as KanbanCardComponent } from './KanbanCard';
import { KanbanSwimlane } from './KanbanSwimlane';
import { useDragDrop } from './useDragDrop';
import {
  hasDndKit,
  getDndKitCore,
  useDndKitKanban,
} from './createDndKitEngine';

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
  /** Force HTML5 engine even when @dnd-kit is available. */
  forceHtml5?: boolean;
}

/* ------------------------------------------------------------------ */
/*  DndKit-powered board (used when @dnd-kit is installed)             */
/* ------------------------------------------------------------------ */

const DndKitBoard: React.FC<
  KanbanBoardProps & { getColumnCards: (columnId: string) => KanbanCardType[] }
> = ({
  columns,
  cards,
  onCardMove,
  onCardClick,
  onColumnAdd,
  renderCard,
  className,
  addColumnLabel = '+ Add Column',
  getColumnCards,
}) => {
  const handleCardMove = useCallback(
    (cardId: string, fromCol: string, toCol: string, toIndex: number) => {
      onCardMove?.({ cardId, fromColumnId: fromCol, toColumnId: toCol, toIndex });
    },
    [onCardMove],
  );

  const {
    contextProps,
    activeCard,
    DragOverlayComponent,
    announcement,
  } = useDndKitKanban({
    columns,
    cards,
    onCardMove: handleCardMove,
  });

  const core = getDndKitCore();
  if (!core || !contextProps) return null;

  const { DndContext } = core;

  return (
    <DndContext {...contextProps}>
      {/* ARIA live region for screen reader drag announcements */}
      <div
        role="status"
        aria-live="assertive"
        aria-atomic="true"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {announcement}
      </div>

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
            onDrop={() => {}}
            onCardClick={onCardClick}
            renderCard={renderCard}
            useDndKit
          />
        ))}

        {onColumnAdd && (
          <AddColumnButton label={addColumnLabel} onClick={onColumnAdd} />
        )}
      </div>

      {/* Drag overlay — renders the card being dragged as a floating ghost */}
      {DragOverlayComponent && activeCard && (
        <DragOverlayComponent>
          {renderCard ? (
            renderCard(activeCard)
          ) : (
            <KanbanCardComponent card={activeCard} isDragging />
          )}
        </DragOverlayComponent>
      )}
    </DndContext>
  );
};

/* ------------------------------------------------------------------ */
/*  Shared "Add Column" button                                         */
/* ------------------------------------------------------------------ */

const AddColumnButton: React.FC<{ label: string; onClick: () => void }> = ({
  label,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
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
      transition:
        'border-color 0.15s ease, color 0.15s ease, background 0.15s ease',
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
    {label}
  </button>
);

/* ------------------------------------------------------------------ */
/*  KanbanBoard — public component                                     */
/* ------------------------------------------------------------------ */

export const KanbanBoard: React.FC<KanbanBoardProps> = (props) => {
  const {
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
    forceHtml5 = false,
  } = props;

  const useDndKitEngine = !forceHtml5 && hasDndKit();

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
  /*  @dnd-kit path (flat mode only for v1 — swimlanes TBD)           */
  /* ---------------------------------------------------------------- */
  if (useDndKitEngine && (!swimlanes || swimlanes.length === 0)) {
    return (
      <DndKitBoard
        {...props}
        getColumnCards={getColumnCards}
      />
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Swimlane mode (HTML5 engine — dnd-kit swimlane support is TBD)  */
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
  /*  Flat mode — HTML5 fallback                                       */
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

      {onColumnAdd && (
        <AddColumnButton label={addColumnLabel} onClick={onColumnAdd} />
      )}
    </div>
  );
};
