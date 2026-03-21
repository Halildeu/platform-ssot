import React, { useEffect, useRef, useMemo } from 'react';
import type { SlashCommand } from './types';

export interface SlashCommandMenuProps {
  commands: SlashCommand[];
  isOpen: boolean;
  position: { top: number; left: number };
  selectedIndex: number;
  onSelect: (command: SlashCommand) => void;
  onClose: () => void;
  className?: string;
}

/* ---------- styles ---------- */

const menuStyles: React.CSSProperties = {
  position: 'absolute',
  minWidth: '220px',
  maxWidth: '320px',
  maxHeight: '320px',
  overflowY: 'auto',
  backgroundColor: 'var(--surface-default, #ffffff)',
  border: '1px solid var(--border-subtle, #e2e8f0)',
  borderRadius: '8px',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
  zIndex: 60,
  padding: '4px 0',
};

const categoryStyles: React.CSSProperties = {
  padding: '6px 12px 4px',
  fontSize: '11px',
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  color: 'var(--text-muted, #94a3b8)',
  userSelect: 'none',
};

const itemStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  width: '100%',
  padding: '8px 12px',
  border: 'none',
  backgroundColor: 'transparent',
  color: 'var(--text-primary, #1e293b)',
  fontSize: '13px',
  textAlign: 'left',
  cursor: 'pointer',
  transition: 'background-color 0.1s',
  lineHeight: 1.4,
};

const selectedItemStyles: React.CSSProperties = {
  ...itemStyles,
  backgroundColor: 'var(--surface-active, #f1f5f9)',
};

const iconWrapperStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  borderRadius: '4px',
  backgroundColor: 'var(--surface-subtle, #f8fafc)',
  fontSize: '12px',
  flexShrink: 0,
};

const labelStyles: React.CSSProperties = {
  fontWeight: 500,
};

const descriptionStyles: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--text-muted, #94a3b8)',
  marginTop: '1px',
};

const emptyStyles: React.CSSProperties = {
  padding: '16px 12px',
  fontSize: '13px',
  color: 'var(--text-muted, #94a3b8)',
  textAlign: 'center',
};

/* ---------- component ---------- */

export const SlashCommandMenu: React.FC<SlashCommandMenuProps> = ({
  commands,
  isOpen,
  position,
  selectedIndex,
  onSelect,
  onClose,
  className,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  // Group commands by category
  const grouped = useMemo(() => {
    const map = new Map<string, SlashCommand[]>();
    for (const cmd of commands) {
      const cat = cmd.category ?? 'Other';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(cmd);
    }
    return map;
  }, [commands]);

  // Scroll selected item into view
  useEffect(() => {
    if (typeof selectedRef.current?.scrollIntoView === 'function') {
      selectedRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  if (!isOpen || commands.length === 0) return null;

  let flatIndex = 0;

  return (
    <div
      ref={menuRef}
      role="listbox"
      aria-label="Slash commands"
      className={className}
      style={{
        ...menuStyles,
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {commands.length === 0 ? (
        <div style={emptyStyles}>No matching commands</div>
      ) : (
        Array.from(grouped.entries()).map(([category, cmds]) => (
          <div key={category} role="group" aria-label={category}>
            <div style={categoryStyles} aria-hidden="true">
              {category}
            </div>
            {cmds.map((cmd) => {
              const idx = flatIndex++;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  ref={isSelected ? selectedRef : undefined}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  style={isSelected ? selectedItemStyles : itemStyles}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onSelect(cmd);
                  }}
                  onMouseEnter={() => {
                    // Visual hover feedback handled by CSS; selection stays keyboard-driven
                  }}
                >
                  {cmd.icon && <div style={iconWrapperStyles}>{cmd.icon}</div>}
                  <div>
                    <div style={labelStyles}>{cmd.label}</div>
                    {cmd.description && (
                      <div style={descriptionStyles}>{cmd.description}</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
};
