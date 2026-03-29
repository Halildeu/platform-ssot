import React, { type DragEvent } from 'react';
import type { KanbanColumn as KanbanColumnType, KanbanCard as KanbanCardType } from './types';
import { KanbanCard } from './KanbanCard';
import { getDndKitCore, getDndKitSortable } from './createDndKitEngine';

export interface KanbanColumnProps {
  column: KanbanColumnType;
  cards: KanbanCardType[];
  onDrop: (cardId: string, toIndex: number) => void;
  onCardClick?: (card: KanbanCardType) => void;
  renderCard?: (card: KanbanCardType) => React.ReactNode;
  isDragOver?: boolean;
  dragOverIndex?: number;
  draggedCardId?: string | null;
  onDragStart?: (e: DragEvent<HTMLElement>, cardId: string, columnId: string) => void;
  onDragEnd?: (e: DragEvent<HTMLElement>) => void;
  onDragOverCard?: (e: DragEvent<HTMLElement>, columnId: string, index: number) => void;
  onDragEnter?: (e: DragEvent<HTMLElement>, columnId: string) => void;
  onDragLeave?: (e: DragEvent<HTMLElement>) => void;
  onDropColumn?: (e: DragEvent<HTMLElement>, columnId: string) => void;
  /** When true, uses @dnd-kit SortableContext instead of HTML5 DnD props. */
  useDndKit?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Column header (shared between both engines)                        */
/* ------------------------------------------------------------------ */

const ColumnHeader: React.FC<{
  column: KanbanColumnType;
  cardCount: number;
}> = ({ column, cardCount }) => {
  const isAtLimit = column.limit != null && cardCount >= column.limit;
  const isOverLimit = column.limit != null && cardCount > column.limit;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 12px 8px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {column.color && (
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: column.color,
              flexShrink: 0,
            }}
          />
        )}
        <h3
          style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--text-primary))',
          }}
        >
          {column.title}
        </h3>
      </div>
      <span
        style={{
          fontSize: '12px',
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: 'var(--radius-sm)',
          background: isOverLimit
            ? 'var(--color-error))'
            : isAtLimit
              ? 'var(--color-warning))'
              : 'var(--surface-default))',
          color: isOverLimit || isAtLimit
            ? 'var(--surface-default)'
            : 'var(--text-secondary))',
        }}
      >
        {cardCount}
        {column.limit != null && `/${column.limit}`}
      </span>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  @dnd-kit column renderer                                           */
/* ------------------------------------------------------------------ */

const DndKitColumnBody: React.FC<{
  column: KanbanColumnType;
  cards: KanbanCardType[];
  onCardClick?: (card: KanbanCardType) => void;
  renderCard?: (card: KanbanCardType) => React.ReactNode;
}> = ({ column, cards, onCardClick, renderCard }) => {
  const core = getDndKitCore();
  const sortable = getDndKitSortable();

  if (!core || !sortable) return null;

  const { useDroppable } = core;
  const { SortableContext, verticalListSortingStrategy } = sortable;

  // Register the column as a droppable so empty columns accept cards
  // eslint-disable-next-line react-hooks/rules-of-hooks -- conditional is stable
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: column.id });

  const cardIds = cards.map((c) => c.id);

  return (
    <div
      ref={setDropRef}
      role="region"
      aria-label={`Column: ${column.title}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '300px',
        minWidth: '300px',
        maxHeight: '100%',
        background: isOver
          ? 'var(--surface-hover))'
          : 'var(--surface-subtle))',
        borderRadius: 'var(--radius-lg)',
        border: isOver
          ? '2px dashed var(--border-accent))'
          : '2px solid transparent',
        transition: 'background 0.15s ease, border-color 0.15s ease',
      }}
    >
      <ColumnHeader column={column} cardCount={cards.length} />

      <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            padding: '4px 12px 12px',
            overflowY: 'auto',
            flex: 1,
            minHeight: '60px',
          }}
        >
          {cards.map((card) =>
            renderCard ? (
              <div key={card.id}>{renderCard(card)}</div>
            ) : (
              <KanbanCard
                key={card.id}
                card={card}
                onClick={onCardClick}
                useDndKit
              />
            ),
          )}
        </div>
      </SortableContext>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  KanbanColumn — public component                                    */
/* ------------------------------------------------------------------ */

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  cards,
  onDrop,
  onCardClick,
  renderCard,
  isDragOver = false,
  dragOverIndex = -1,
  draggedCardId,
  onDragStart,
  onDragEnd,
  onDragOverCard,
  onDragEnter,
  onDragLeave,
  onDropColumn,
  useDndKit: useDndKitProp = false,
}) => {
  /* ---- @dnd-kit path ---- */
  if (useDndKitProp) {
    return (
      <DndKitColumnBody
        column={column}
        cards={cards}
        onCardClick={onCardClick}
        renderCard={renderCard}
      />
    );
  }

  /* ---- HTML5 DnD path (original) ---- */

  const handleDragOver = (e: DragEvent<HTMLElement>, index: number) => {
    e.preventDefault();
    onDragOverCard?.(e, column.id, index);
  };

  const handleColumnDragOver = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    onDragOverCard?.(e, column.id, cards.length);
  };

  const handleDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain');
    if (cardId) {
      onDrop(cardId, dragOverIndex >= 0 ? dragOverIndex : cards.length);
    }
    onDropColumn?.(e, column.id);
  };

  const handleDragEnter = (e: DragEvent<HTMLElement>) => {
    onDragEnter?.(e, column.id);
  };

  const handleDragLeave = (e: DragEvent<HTMLElement>) => {
    onDragLeave?.(e);
  };

  return (
    <div
      role="region"
      aria-label={`Column: ${column.title}`}
      onDragOver={handleColumnDragOver}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '300px',
        minWidth: '300px',
        maxHeight: '100%',
        background: isDragOver
          ? 'var(--surface-hover))'
          : 'var(--surface-subtle))',
        borderRadius: 'var(--radius-lg)',
        border: isDragOver
          ? '2px dashed var(--border-accent))'
          : '2px solid transparent',
        transition: 'background 0.15s ease, border-color 0.15s ease',
      }}
    >
      <ColumnHeader column={column} cardCount={cards.length} />

      {/* Card List */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '4px 12px 12px',
          overflowY: 'auto',
          flex: 1,
          minHeight: '60px',
        }}
      >
        {cards.map((card, index) => (
          <React.Fragment key={card.id}>
            {/* Drop indicator line */}
            {isDragOver && dragOverIndex === index && (
              <div
                style={{
                  height: '2px',
                  background: 'var(--border-accent))',
                  borderRadius: '1px',
                  margin: '0 4px',
                  transition: 'opacity 0.1s ease',
                }}
              />
            )}
            <div
              onDragOver={(e) => handleDragOver(e, index)}
            >
              {renderCard ? (
                renderCard(card)
              ) : (
                <KanbanCard
                  card={card}
                  onClick={onCardClick}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  isDragging={draggedCardId === card.id}
                />
              )}
            </div>
          </React.Fragment>
        ))}
        {/* Drop indicator at the end */}
        {isDragOver && dragOverIndex === cards.length && (
          <div
            style={{
              height: '2px',
              background: 'var(--border-accent))',
              borderRadius: '1px',
              margin: '0 4px',
            }}
          />
        )}
      </div>
    </div>
  );
};
