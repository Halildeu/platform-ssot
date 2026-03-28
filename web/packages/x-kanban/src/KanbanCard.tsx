import React, { type DragEvent } from 'react';
import type { KanbanCard as KanbanCardType } from './types';
import { useSortableCard } from './createDndKitEngine';

const PRIORITY_COLORS: Record<string, string> = {
  low: 'var(--color-success))',
  medium: 'var(--color-warning))',
  high: 'var(--color-orange)',
  critical: 'var(--color-error))',
};

export interface KanbanCardProps {
  card: KanbanCardType;
  onClick?: (card: KanbanCardType) => void;
  onDragStart?: (e: DragEvent<HTMLElement>, cardId: string, columnId: string) => void;
  onDragEnd?: (e: DragEvent<HTMLElement>) => void;
  isDragging?: boolean;
  /** When true, uses @dnd-kit useSortable instead of HTML5 draggable. */
  useDndKit?: boolean;
}

function formatDueDate(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `${days}d left`;
}

/* ------------------------------------------------------------------ */
/*  Card content (shared between both engines)                         */
/* ------------------------------------------------------------------ */

const CardContent: React.FC<{ card: KanbanCardType }> = ({ card }) => {
  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();

  return (
    <>
      {/* Header: drag handle + priority */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            color: 'var(--text-tertiary))',
            fontSize: '12px',
            lineHeight: 1,
            cursor: 'grab',
          }}
        >
          &#x2630;
        </span>
        {card.priority && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 600,
              color: PRIORITY_COLORS[card.priority],
              textTransform: 'capitalize',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: PRIORITY_COLORS[card.priority],
                flexShrink: 0,
              }}
            />
            {card.priority}
          </span>
        )}
      </div>

      {/* Title */}
      <div
        style={{
          fontWeight: 600,
          fontSize: '14px',
          lineHeight: '1.3',
          color: 'var(--text-primary))',
        }}
      >
        {card.title}
      </div>

      {/* Description */}
      {card.description && (
        <div
          style={{
            fontSize: '12px',
            lineHeight: '1.4',
            color: 'var(--text-secondary))',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {card.description}
        </div>
      )}

      {/* Tags */}
      {card.tags && card.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {card.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: '10px',
                fontWeight: 500,
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--surface-subtle))',
                color: 'var(--text-secondary))',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer: assignee + due date */}
      {(card.assignee || card.dueDate) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '4px',
          }}
        >
          {card.assignee && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'var(--surface-subtle))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: 'var(--text-secondary))',
                }}
              >
                {card.assignee.charAt(0).toUpperCase()}
              </div>
              <span
                style={{
                  fontSize: '11px',
                  color: 'var(--text-secondary))',
                }}
              >
                {card.assignee}
              </span>
            </div>
          )}
          {card.dueDate && (
            <span
              style={{
                fontSize: '11px',
                fontWeight: 500,
                color: isOverdue
                  ? 'var(--color-error))'
                  : 'var(--text-tertiary))',
              }}
            >
              {formatDueDate(new Date(card.dueDate))}
            </span>
          )}
        </div>
      )}
    </>
  );
};

/* ------------------------------------------------------------------ */
/*  KanbanCard — public component                                      */
/* ------------------------------------------------------------------ */

export const KanbanCard: React.FC<KanbanCardProps> = ({
  card,
  onClick,
  onDragStart,
  onDragEnd,
  isDragging = false,
  useDndKit: useDndKitProp = false,
}) => {
  const handleClick = () => onClick?.(card);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(card);
    }
  };

  /* ---- @dnd-kit path ---- */
  if (useDndKitProp) {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- condition is stable
    const sortable = useSortableCard(card.id);

    return (
      <div
        ref={sortable.ref}
        role="button"
        tabIndex={0}
        aria-label={`Card: ${card.title}`}
        aria-roledescription="sortable card"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        style={{
          ...cardBaseStyle(sortable.isDragging),
          ...sortable.style,
        }}
        {...sortable.attributes}
        {...sortable.listeners}
        onMouseEnter={(e) => {
          if (!sortable.isDragging) {
            (e.currentTarget as HTMLElement).style.boxShadow =
              '0 2px 8px rgba(0,0,0,0.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (!sortable.isDragging) {
            (e.currentTarget as HTMLElement).style.boxShadow =
              '0 1px 2px rgba(0,0,0,0.05)';
          }
        }}
      >
        <CardContent card={card} />
      </div>
    );
  }

  /* ---- HTML5 DnD path (original) ---- */

  const handleDragStart = (e: DragEvent<HTMLElement>) => {
    onDragStart?.(e, card.id, card.columnId);
  };

  return (
    <div
      draggable
      role="button"
      tabIndex={0}
      aria-label={`Card: ${card.title}`}
      aria-grabbed={isDragging}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={cardBaseStyle(isDragging)}
      onMouseEnter={(e) => {
        if (!isDragging) {
          (e.currentTarget as HTMLElement).style.boxShadow =
            '0 2px 8px rgba(0,0,0,0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isDragging) {
          (e.currentTarget as HTMLElement).style.boxShadow =
            '0 1px 2px rgba(0,0,0,0.05)';
        }
      }}
    >
      <CardContent card={card} />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Shared styles                                                      */
/* ------------------------------------------------------------------ */

function cardBaseStyle(isDragging: boolean): React.CSSProperties {
  return {
    background: 'var(--surface-default))',
    border: '1px solid var(--border-subtle))',
    borderRadius: 'var(--radius-md)',
    padding: '12px',
    cursor: 'grab',
    transition: 'box-shadow 0.15s ease, opacity 0.15s ease, transform 0.15s ease',
    opacity: isDragging ? 0.5 : 1,
    transform: isDragging ? 'rotate(2deg)' : 'none',
    boxShadow: isDragging
      ? '0 4px 12px rgba(0,0,0,0.15)'
      : '0 1px 2px rgba(0,0,0,0.05)',
    userSelect: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };
}
