import React, { useMemo } from 'react';
import type { KanbanColumn as KanbanColumnType, KanbanCard as KanbanCardType } from './types';

export interface KanbanMetricsProps {
  columns: KanbanColumnType[];
  cards: KanbanCardType[];
  className?: string;
}

interface ColumnMetric {
  id: string;
  title: string;
  count: number;
  limit: number | null;
  utilization: number; // 0-100 when limit exists, 0 otherwise
}

export const KanbanMetrics: React.FC<KanbanMetricsProps> = ({
  columns,
  cards,
  className,
}) => {
  const metrics = useMemo(() => {
    const now = new Date();

    const columnMetrics: ColumnMetric[] = columns.map((col) => {
      const colCards = cards.filter((c) => c.columnId === col.id);
      const limit = col.policy?.wipLimit ?? col.limit ?? null;
      return {
        id: col.id,
        title: col.title,
        count: colCards.length,
        limit,
        utilization: limit ? Math.round((colCards.length / limit) * 100) : 0,
      };
    });

    const totalCards = cards.length;

    const overdueCount = cards.filter(
      (c) => c.dueDate && new Date(c.dueDate) < now,
    ).length;

    const maxCount = Math.max(...columnMetrics.map((m) => m.count), 1);

    const wipViolations = columnMetrics.filter(
      (m) => m.limit !== null && m.count > m.limit,
    ).length;

    return { columnMetrics, totalCards, overdueCount, maxCount, wipViolations };
  }, [columns, cards]);

  const statBoxStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '12px 8px',
    borderRadius: 'var(--radius-md, 8px)',
    background: 'var(--surface-subtle, #f3f4f6)',
  };

  const statValueStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--text-primary, #111827)',
    lineHeight: 1,
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--text-tertiary, #9ca3af)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  return (
    <div
      className={className}
      role="region"
      aria-label="Board metrics"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '16px',
        borderRadius: 'var(--radius-lg, 12px)',
        border: '1px solid var(--border-subtle, #e5e7eb)',
        background: 'var(--surface-default, #fff)',
      }}
    >
      {/* Summary stats */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={statBoxStyle}>
          <span style={statValueStyle}>{metrics.totalCards}</span>
          <span style={statLabelStyle}>Total</span>
        </div>
        <div style={statBoxStyle}>
          <span
            style={{
              ...statValueStyle,
              color:
                metrics.overdueCount > 0
                  ? 'var(--color-error, #ef4444)'
                  : 'var(--text-primary, #111827)',
            }}
          >
            {metrics.overdueCount}
          </span>
          <span style={statLabelStyle}>Overdue</span>
        </div>
        <div style={statBoxStyle}>
          <span
            style={{
              ...statValueStyle,
              color:
                metrics.wipViolations > 0
                  ? 'var(--color-warning, #f59e0b)'
                  : 'var(--text-primary, #111827)',
            }}
          >
            {metrics.wipViolations}
          </span>
          <span style={statLabelStyle}>WIP Violations</span>
        </div>
      </div>

      {/* Per-column bar chart */}
      <div>
        <div
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-secondary, #6b7280)',
            marginBottom: '10px',
          }}
        >
          Cards per Column
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {metrics.columnMetrics.map((col) => {
            const barWidth =
              metrics.maxCount > 0
                ? Math.round((col.count / metrics.maxCount) * 100)
                : 0;
            const isOver = col.limit !== null && col.count > col.limit;

            return (
              <div
                key={col.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span
                  style={{
                    width: '80px',
                    fontSize: '11px',
                    fontWeight: 500,
                    color: 'var(--text-secondary, #6b7280)',
                    textAlign: 'right',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                  title={col.title}
                >
                  {col.title}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: '16px',
                    background: 'var(--surface-subtle, #f3f4f6)',
                    borderRadius: 'var(--radius-sm, 4px)',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: `${barWidth}%`,
                      height: '100%',
                      background: isOver
                        ? 'var(--color-error, #ef4444)'
                        : 'var(--color-primary, #3b82f6)',
                      borderRadius: 'var(--radius-sm, 4px)',
                      transition: 'width 0.3s ease',
                    }}
                  />
                  {/* WIP limit marker */}
                  {col.limit !== null && metrics.maxCount > 0 && (
                    <div
                      aria-label={`WIP limit: ${col.limit}`}
                      style={{
                        position: 'absolute',
                        left: `${Math.round((col.limit / metrics.maxCount) * 100)}%`,
                        top: 0,
                        bottom: 0,
                        width: '2px',
                        background: 'var(--color-warning, #f59e0b)',
                      }}
                    />
                  )}
                </div>
                <span
                  style={{
                    width: '40px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: isOver
                      ? 'var(--color-error, #ef4444)'
                      : 'var(--text-secondary, #6b7280)',
                    flexShrink: 0,
                  }}
                >
                  {col.count}
                  {col.limit !== null && `/${col.limit}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
