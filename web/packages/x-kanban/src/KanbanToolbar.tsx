import React from 'react';

export interface KanbanToolbarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onAddColumn?: () => void;
  filters?: React.ReactNode;
  className?: string;
}

export const KanbanToolbar: React.FC<KanbanToolbarProps> = ({
  searchValue = '',
  onSearchChange,
  onAddColumn,
  filters,
  className,
}) => {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px 0',
      }}
    >
      {/* Search Input */}
      <div style={{ position: 'relative', flex: '0 1 280px' }}>
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-tertiary, #9ca3af)',
            pointerEvents: 'none',
          }}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search cards..."
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          aria-label="Search cards"
          style={{
            width: '100%',
            height: '36px',
            padding: '0 12px 0 34px',
            fontSize: '13px',
            border: '1px solid var(--border-subtle, #e5e7eb)',
            borderRadius: 'var(--radius-md, 8px)',
            background: 'var(--surface-default, #fff)',
            color: 'var(--text-primary, #111827)',
            outline: 'none',
            transition: 'border-color 0.15s ease',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => {
            (e.target as HTMLInputElement).style.borderColor =
              'var(--border-accent, #3b82f6)';
          }}
          onBlur={(e) => {
            (e.target as HTMLInputElement).style.borderColor =
              'var(--border-subtle, #e5e7eb)';
          }}
        />
      </div>

      {/* Filter Slot */}
      {filters && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{filters}</div>}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Add Column Button */}
      {onAddColumn && (
        <button
          type="button"
          onClick={onAddColumn}
          aria-label="Add column"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            height: '36px',
            padding: '0 14px',
            fontSize: '13px',
            fontWeight: 500,
            border: '1px solid var(--border-subtle, #e5e7eb)',
            borderRadius: 'var(--radius-md, 8px)',
            background: 'var(--surface-default, #fff)',
            color: 'var(--text-primary, #111827)',
            cursor: 'pointer',
            transition: 'background 0.15s ease, border-color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              'var(--surface-hover, #f9fafb)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              'var(--surface-default, #fff)';
          }}
        >
          <span aria-hidden="true" style={{ fontSize: '16px', lineHeight: 1 }}>+</span>
          Add Column
        </button>
      )}
    </div>
  );
};
