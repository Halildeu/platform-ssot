import React, { useEffect, useRef } from 'react';
import type { MentionItem } from './types';

export interface MentionListProps {
  items: MentionItem[];
  isOpen: boolean;
  position: { top: number; left: number };
  selectedIndex: number;
  onSelect: (item: MentionItem) => void;
  onClose: () => void;
  className?: string;
}

/* ---------- styles ---------- */

const menuStyles: React.CSSProperties = {
  position: 'absolute',
  minWidth: '200px',
  maxWidth: '280px',
  maxHeight: '260px',
  overflowY: 'auto',
  backgroundColor: 'var(--surface-default, #ffffff)',
  border: '1px solid var(--border-subtle, #e2e8f0)',
  borderRadius: '8px',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
  zIndex: 60,
  padding: '4px 0',
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
};

const selectedItemStyles: React.CSSProperties = {
  ...itemStyles,
  backgroundColor: 'var(--surface-active, #f1f5f9)',
};

const avatarStyles: React.CSSProperties = {
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  objectFit: 'cover',
  flexShrink: 0,
};

const avatarPlaceholderStyles: React.CSSProperties = {
  ...avatarStyles,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'var(--surface-active, #e2e8f0)',
  color: 'var(--text-muted, #94a3b8)',
  fontSize: '11px',
  fontWeight: 600,
};

const labelStyles: React.CSSProperties = {
  fontWeight: 500,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const typeTagStyles: React.CSSProperties = {
  marginLeft: 'auto',
  fontSize: '11px',
  color: 'var(--text-muted, #94a3b8)',
  flexShrink: 0,
};

const emptyStyles: React.CSSProperties = {
  padding: '16px 12px',
  fontSize: '13px',
  color: 'var(--text-muted, #94a3b8)',
  textAlign: 'center',
};

/* ---------- helpers ---------- */

function getInitials(label: string): string {
  return label
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

/* ---------- component ---------- */

export const MentionList: React.FC<MentionListProps> = ({
  items,
  isOpen,
  position,
  selectedIndex,
  onSelect,
  onClose,
  className,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  // Scroll selected item into view
  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: 'nearest' });
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

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      role="listbox"
      aria-label="Mentions"
      className={className}
      style={{
        ...menuStyles,
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {items.length === 0 ? (
        <div style={emptyStyles}>No results found</div>
      ) : (
        items.map((item, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <button
              key={item.id}
              ref={isSelected ? selectedRef : undefined}
              type="button"
              role="option"
              aria-selected={isSelected}
              style={isSelected ? selectedItemStyles : itemStyles}
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(item);
              }}
            >
              {item.avatar ? (
                <img
                  src={item.avatar}
                  alt=""
                  style={avatarStyles}
                  aria-hidden="true"
                />
              ) : (
                <div style={avatarPlaceholderStyles} aria-hidden="true">
                  {getInitials(item.label)}
                </div>
              )}
              <span style={labelStyles}>{item.label}</span>
              {item.type && <span style={typeTagStyles}>{item.type}</span>}
            </button>
          );
        })
      )}
    </div>
  );
};
