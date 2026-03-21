import React, { useState, useCallback } from 'react';
import type { TableOptions } from './types';

export interface EditorTableMenuProps {
  onInsertTable: (options: TableOptions) => void;
  onAddRowBefore: () => void;
  onAddRowAfter: () => void;
  onAddColBefore: () => void;
  onAddColAfter: () => void;
  onDeleteRow: () => void;
  onDeleteCol: () => void;
  onDeleteTable: () => void;
  onMergeCells: () => void;
  onSplitCell: () => void;
  className?: string;
}

/* ---------- constants ---------- */

const MAX_GRID = 8;

/* ---------- styles ---------- */

const wrapperStyles: React.CSSProperties = {
  display: 'inline-flex',
  flexDirection: 'column',
  backgroundColor: 'var(--surface-default, #ffffff)',
  border: '1px solid var(--border-subtle, #e2e8f0)',
  borderRadius: '8px',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
  padding: '8px',
  gap: '8px',
};

const gridStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: `repeat(${MAX_GRID}, 20px)`,
  gap: '2px',
};

const cellStyles: React.CSSProperties = {
  width: '20px',
  height: '20px',
  border: '1px solid var(--border-subtle, #e2e8f0)',
  borderRadius: '2px',
  backgroundColor: 'transparent',
  padding: 0,
  cursor: 'pointer',
  transition: 'background-color 0.1s, border-color 0.1s',
};

const cellActiveStyles: React.CSSProperties = {
  ...cellStyles,
  backgroundColor: 'var(--surface-active, #dbeafe)',
  borderColor: 'var(--border-accent, #3b82f6)',
};

const gridLabelStyles: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--text-muted, #94a3b8)',
  textAlign: 'center',
  userSelect: 'none',
  height: '18px',
  lineHeight: '18px',
};

const dividerStyles: React.CSSProperties = {
  width: '100%',
  height: '1px',
  backgroundColor: 'var(--border-subtle, #e2e8f0)',
};

const actionButtonStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  width: '100%',
  padding: '6px 8px',
  border: 'none',
  borderRadius: '4px',
  backgroundColor: 'transparent',
  color: 'var(--text-primary, #1e293b)',
  fontSize: '12px',
  textAlign: 'left',
  cursor: 'pointer',
  transition: 'background-color 0.1s',
};

const destructiveButtonStyles: React.CSSProperties = {
  ...actionButtonStyles,
  color: 'var(--text-danger, #ef4444)',
};

/* ---------- component ---------- */

export const EditorTableMenu: React.FC<EditorTableMenuProps> = ({
  onInsertTable,
  onAddRowBefore,
  onAddRowAfter,
  onAddColBefore,
  onAddColAfter,
  onDeleteRow,
  onDeleteCol,
  onDeleteTable,
  onMergeCells,
  onSplitCell,
  className,
}) => {
  const [hoverCell, setHoverCell] = useState<{ row: number; col: number } | null>(null);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      onInsertTable({ rows: row, cols: col, withHeaderRow: true });
    },
    [onInsertTable],
  );

  return (
    <div className={className} style={wrapperStyles} role="group" aria-label="Table operations">
      {/* Grid selector */}
      <div>
        <div style={gridStyles} role="grid" aria-label="Select table size">
          {Array.from({ length: MAX_GRID }, (_, rowIdx) =>
            Array.from({ length: MAX_GRID }, (_, colIdx) => {
              const row = rowIdx + 1;
              const col = colIdx + 1;
              const isActive =
                hoverCell !== null && row <= hoverCell.row && col <= hoverCell.col;
              return (
                <button
                  key={`${row}-${col}`}
                  type="button"
                  role="gridcell"
                  aria-label={`${row} rows by ${col} columns`}
                  style={isActive ? cellActiveStyles : cellStyles}
                  onMouseEnter={() => setHoverCell({ row, col })}
                  onMouseLeave={() => setHoverCell(null)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleCellClick(row, col);
                  }}
                />
              );
            }),
          )}
        </div>
        <div style={gridLabelStyles} aria-live="polite">
          {hoverCell ? `${hoverCell.row} x ${hoverCell.col}` : 'Select size'}
        </div>
      </div>

      <div style={dividerStyles} aria-hidden="true" />

      {/* Row operations */}
      <div role="group" aria-label="Row operations">
        <button
          type="button"
          style={actionButtonStyles}
          onMouseDown={(e) => { e.preventDefault(); onAddRowBefore(); }}
        >
          Insert row above
        </button>
        <button
          type="button"
          style={actionButtonStyles}
          onMouseDown={(e) => { e.preventDefault(); onAddRowAfter(); }}
        >
          Insert row below
        </button>
        <button
          type="button"
          style={destructiveButtonStyles}
          onMouseDown={(e) => { e.preventDefault(); onDeleteRow(); }}
        >
          Delete row
        </button>
      </div>

      <div style={dividerStyles} aria-hidden="true" />

      {/* Column operations */}
      <div role="group" aria-label="Column operations">
        <button
          type="button"
          style={actionButtonStyles}
          onMouseDown={(e) => { e.preventDefault(); onAddColBefore(); }}
        >
          Insert column left
        </button>
        <button
          type="button"
          style={actionButtonStyles}
          onMouseDown={(e) => { e.preventDefault(); onAddColAfter(); }}
        >
          Insert column right
        </button>
        <button
          type="button"
          style={destructiveButtonStyles}
          onMouseDown={(e) => { e.preventDefault(); onDeleteCol(); }}
        >
          Delete column
        </button>
      </div>

      <div style={dividerStyles} aria-hidden="true" />

      {/* Cell operations */}
      <div role="group" aria-label="Cell operations">
        <button
          type="button"
          style={actionButtonStyles}
          onMouseDown={(e) => { e.preventDefault(); onMergeCells(); }}
        >
          Merge cells
        </button>
        <button
          type="button"
          style={actionButtonStyles}
          onMouseDown={(e) => { e.preventDefault(); onSplitCell(); }}
        >
          Split cell
        </button>
      </div>

      <div style={dividerStyles} aria-hidden="true" />

      {/* Table delete */}
      <button
        type="button"
        style={destructiveButtonStyles}
        onMouseDown={(e) => { e.preventDefault(); onDeleteTable(); }}
      >
        Delete table
      </button>
    </div>
  );
};
