import React, { type DragEvent } from 'react';
import type { KanbanColumn as KanbanColumnType, KanbanCard as KanbanCardType } from './types';
import { KanbanCard } from './KanbanCard';

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
}

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
}) => {
  const isAtLimit = column.limit != null && cards.length >= column.limit;
  const isOverLimit = column.limit != null && cards.length > column.limit;

  const handleDragOver = (e: DragEvent<HTMLElement>, index: number) => {
    e.preventDefault();
    onDragOverCard?.(e, column.id, index);
  };

  const handleColumnDragOver = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    // When dragging over empty area at the bottom, set index to card count
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
          ? 'var(--surface-hover, #f9fafb)'
          : 'var(--surface-subtle, #f3f4f6)',
        borderRadius: 'var(--radius-lg, 12px)',
        border: isDragOver
          ? '2px dashed var(--border-accent, #3b82f6)'
          : '2px solid transparent',
        transition: 'background 0.15s ease, border-color 0.15s ease',
      }}
    >
      {/* Column Header */}
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
              color: 'var(--text-primary, #111827)',
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
            borderRadius: 'var(--radius-sm, 4px)',
            background: isOverLimit
              ? 'var(--color-error, #ef4444)'
              : isAtLimit
                ? 'var(--color-warning, #f59e0b)'
                : 'var(--surface-default, #fff)',
            color: isOverLimit || isAtLimit
              ? '#fff'
              : 'var(--text-secondary, #6b7280)',
          }}
        >
          {cards.length}
          {column.limit != null && `/${column.limit}`}
        </span>
      </div>

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
                  background: 'var(--border-accent, #3b82f6)',
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
              background: 'var(--border-accent, #3b82f6)',
              borderRadius: '1px',
              margin: '0 4px',
            }}
          />
        )}
      </div>
    </div>
  );
};
