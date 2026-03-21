import React, { type DragEvent } from 'react';
import type { KanbanCard as KanbanCardType } from './types';

const PRIORITY_COLORS: Record<string, string> = {
  low: 'var(--color-success, #22c55e)',
  medium: 'var(--color-warning, #f59e0b)',
  high: 'var(--color-orange, #f97316)',
  critical: 'var(--color-error, #ef4444)',
};

export interface KanbanCardProps {
  card: KanbanCardType;
  onClick?: (card: KanbanCardType) => void;
  onDragStart?: (e: DragEvent<HTMLElement>, cardId: string, columnId: string) => void;
  onDragEnd?: (e: DragEvent<HTMLElement>) => void;
  isDragging?: boolean;
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

export const KanbanCard: React.FC<KanbanCardProps> = ({
  card,
  onClick,
  onDragStart,
  onDragEnd,
  isDragging = false,
}) => {
  const handleClick = () => onClick?.(card);

  const handleDragStart = (e: DragEvent<HTMLElement>) => {
    onDragStart?.(e, card.id, card.columnId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(card);
    }
  };

  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();

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
      style={{
        background: 'var(--surface-default, #fff)',
        border: '1px solid var(--border-subtle, #e5e7eb)',
        borderRadius: 'var(--radius-md, 8px)',
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
      }}
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
            color: 'var(--text-tertiary, #9ca3af)',
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
          color: 'var(--text-primary, #111827)',
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
            color: 'var(--text-secondary, #6b7280)',
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
                borderRadius: 'var(--radius-sm, 4px)',
                background: 'var(--surface-subtle, #f3f4f6)',
                color: 'var(--text-secondary, #6b7280)',
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
                  background: 'var(--surface-subtle, #e5e7eb)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: 'var(--text-secondary, #6b7280)',
                }}
              >
                {card.assignee.charAt(0).toUpperCase()}
              </div>
              <span
                style={{
                  fontSize: '11px',
                  color: 'var(--text-secondary, #6b7280)',
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
                  ? 'var(--color-error, #ef4444)'
                  : 'var(--text-tertiary, #9ca3af)',
              }}
            >
              {formatDueDate(new Date(card.dueDate))}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
