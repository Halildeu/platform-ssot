import React from 'react';
import type {
  Swimlane,
  KanbanColumn as KanbanColumnType,
  KanbanCard as KanbanCardType,
} from './types';
import { KanbanColumn } from './KanbanColumn';

export interface KanbanSwimlaneProps {
  swimlane: Swimlane;
  columns: KanbanColumnType[];
  cards: KanbanCardType[];
  onToggleCollapse?: (swimlaneId: string) => void;
  onCardClick?: (card: KanbanCardType) => void;
  renderCard?: (card: KanbanCardType) => React.ReactNode;
  className?: string;
  /** Drag-drop handlers forwarded from KanbanBoard */
  draggedCardId?: string | null;
  dragOverColumnId?: string | null;
  dragOverIndex?: number;
  onDrop?: (cardId: string, columnId: string, toIndex: number) => void;
  onDragStart?: (e: React.DragEvent<HTMLElement>, cardId: string, columnId: string) => void;
  onDragEnd?: (e: React.DragEvent<HTMLElement>) => void;
  onDragOverCard?: (e: React.DragEvent<HTMLElement>, columnId: string, index: number) => void;
  onDragEnter?: (e: React.DragEvent<HTMLElement>, columnId: string) => void;
  onDragLeave?: (e: React.DragEvent<HTMLElement>) => void;
  onDropColumn?: (e: React.DragEvent<HTMLElement>, columnId: string) => void;
}

export const KanbanSwimlane: React.FC<KanbanSwimlaneProps> = ({
  swimlane,
  columns,
  cards,
  onToggleCollapse,
  onCardClick,
  renderCard,
  className,
  draggedCardId,
  dragOverColumnId,
  dragOverIndex = -1,
  onDrop,
  onDragStart,
  onDragEnd,
  onDragOverCard,
  onDragEnter,
  onDragLeave,
  onDropColumn,
}) => {
  const getColumnCards = (columnId: string) =>
    cards.filter((c) => c.columnId === columnId);

  const totalCards = cards.length;

  return (
    <div
      className={className}
      role="region"
      aria-label={`Swimlane: ${swimlane.title}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle))',
        overflow: 'hidden',
      }}
    >
      {/* Swimlane Header */}
      <button
        type="button"
        onClick={() => onToggleCollapse?.(swimlane.id)}
        aria-expanded={!swimlane.collapsed}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          width: '100%',
          padding: '10px 16px',
          background: 'var(--surface-subtle))',
          border: 'none',
          borderBottom: swimlane.collapsed
            ? 'none'
            : '1px solid var(--border-subtle))',
          cursor: 'pointer',
          textAlign: 'left',
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--text-primary))',
          transition: 'background 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--surface-hover))';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--surface-subtle))';
        }}
      >
        {/* Color indicator */}
        {swimlane.color && (
          <span
            style={{
              width: '4px',
              height: '20px',
              borderRadius: '2px',
              background: swimlane.color,
              flexShrink: 0,
            }}
          />
        )}

        {/* Collapse chevron */}
        <span
          aria-hidden="true"
          style={{
            display: 'inline-flex',
            transition: 'transform 0.15s ease',
            transform: swimlane.collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
            fontSize: '12px',
            color: 'var(--text-tertiary))',
          }}
        >
          &#x25BC;
        </span>

        <span style={{ flex: 1 }}>{swimlane.title}</span>

        {/* Card count badge */}
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--surface-default))',
            color: 'var(--text-secondary))',
          }}
        >
          {totalCards}
        </span>
      </button>

      {/* Columns row (hidden when collapsed) */}
      {!swimlane.collapsed && (
        <div
          style={{
            display: 'flex',
            gap: '16px',
            overflowX: 'auto',
            padding: '12px',
            minHeight: '120px',
            alignItems: 'flex-start',
          }}
        >
          {columns.map((column) => {
            const colCards = getColumnCards(column.id);
            return (
              <KanbanColumn
                key={column.id}
                column={column}
                cards={colCards}
                isDragOver={dragOverColumnId === column.id}
                dragOverIndex={dragOverColumnId === column.id ? dragOverIndex : -1}
                draggedCardId={draggedCardId}
                onDrop={(cardId, toIndex) => onDrop?.(cardId, column.id, toIndex)}
                onCardClick={onCardClick}
                renderCard={renderCard}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragOverCard={onDragOverCard}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDropColumn={onDropColumn}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
