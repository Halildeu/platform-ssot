import React, { useState } from 'react';
import type { KanbanCard as KanbanCardType, KanbanColumn as KanbanColumnType } from './types';

const PRIORITY_OPTIONS: KanbanCardType['priority'][] = ['low', 'medium', 'high', 'critical'];

const PRIORITY_COLORS: Record<string, string> = {
  low: 'var(--color-success, #22c55e)',
  medium: 'var(--color-warning, #f59e0b)',
  high: 'var(--color-orange, #f97316)',
  critical: 'var(--color-error, #ef4444)',
};

export interface KanbanCardDetailProps {
  card: KanbanCardType;
  columns: KanbanColumnType[];
  onUpdate: (card: KanbanCardType) => void;
  onClose: () => void;
  onDelete?: (cardId: string) => void;
  className?: string;
}

export const KanbanCardDetail: React.FC<KanbanCardDetailProps> = ({
  card,
  columns,
  onUpdate,
  onClose,
  onDelete,
  className,
}) => {
  const [draft, setDraft] = useState<KanbanCardType>({ ...card });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleFieldChange = <K extends keyof KanbanCardType>(
    key: K,
    value: KanbanCardType[K],
  ) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onUpdate(draft);
    onClose();
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.currentTarget;
      const tag = input.value.trim();
      if (tag && !(draft.tags ?? []).includes(tag)) {
        handleFieldChange('tags', [...(draft.tags ?? []), tag]);
        input.value = '';
      }
    }
  };

  const removeTag = (tag: string) => {
    handleFieldChange(
      'tags',
      (draft.tags ?? []).filter((t) => t !== tag),
    );
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '36px',
    padding: '0 10px',
    fontSize: '13px',
    border: '1px solid var(--border-subtle, #e5e7eb)',
    borderRadius: 'var(--radius-md, 8px)',
    background: 'var(--surface-default, #fff)',
    color: 'var(--text-primary, #111827)',
    outline: 'none',
    boxSizing: 'border-box' as const,
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-secondary, #6b7280)',
    marginBottom: '4px',
  };

  return (
    <div
      className={className}
      role="dialog"
      aria-label={`Card detail: ${card.title}`}
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--surface-overlay, rgba(0, 0, 0, 0.4))',
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--surface-default, #fff)',
          borderRadius: 'var(--radius-lg, 12px)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle, #e5e7eb)',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--text-primary, #111827)',
            }}
          >
            Card Detail
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close detail"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              border: 'none',
              background: 'transparent',
              borderRadius: 'var(--radius-sm, 4px)',
              cursor: 'pointer',
              fontSize: '18px',
              color: 'var(--text-tertiary, #9ca3af)',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--surface-subtle, #f3f4f6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Title */}
          <div>
            <label style={labelStyle}>Title</label>
            <input
              type="text"
              value={draft.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={draft.description ?? ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              rows={3}
              style={{
                ...inputStyle,
                height: 'auto',
                padding: '8px 10px',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Column / Status */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Column</label>
              <select
                value={draft.columnId}
                onChange={(e) => handleFieldChange('columnId', e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {columns.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.title}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Priority</label>
              <select
                value={draft.priority ?? ''}
                onChange={(e) =>
                  handleFieldChange(
                    'priority',
                    (e.target.value || undefined) as KanbanCardType['priority'],
                  )
                }
                style={{
                  ...inputStyle,
                  cursor: 'pointer',
                  color: draft.priority
                    ? PRIORITY_COLORS[draft.priority]
                    : 'var(--text-primary, #111827)',
                }}
              >
                <option value="">None</option>
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p!.charAt(0).toUpperCase() + p!.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Assignee + Due Date */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Assignee</label>
              <input
                type="text"
                value={draft.assignee ?? ''}
                onChange={(e) =>
                  handleFieldChange('assignee', e.target.value || undefined)
                }
                placeholder="Unassigned"
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Due Date</label>
              <input
                type="date"
                value={
                  draft.dueDate
                    ? new Date(draft.dueDate).toISOString().split('T')[0]
                    : ''
                }
                onChange={(e) =>
                  handleFieldChange(
                    'dueDate',
                    e.target.value ? new Date(e.target.value) : undefined,
                  )
                }
                style={inputStyle}
              />
            </div>
          </div>

          {/* Estimate + Type */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Estimate</label>
              <input
                type="number"
                min={0}
                value={draft.estimate ?? ''}
                onChange={(e) =>
                  handleFieldChange(
                    'estimate',
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
                placeholder="Story points"
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Type</label>
              <input
                type="text"
                value={draft.type ?? ''}
                onChange={(e) =>
                  handleFieldChange('type', e.target.value || undefined)
                }
                placeholder="e.g. bug, feature"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label style={labelStyle}>Tags</label>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px',
                marginBottom: '6px',
              }}
            >
              {(draft.tags ?? []).map((tag) => (
                <span
                  key={tag}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: 500,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-sm, 4px)',
                    background: 'var(--surface-subtle, #f3f4f6)',
                    color: 'var(--text-secondary, #6b7280)',
                  }}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    aria-label={`Remove tag ${tag}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '14px',
                      height: '14px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: '12px',
                      color: 'var(--text-tertiary, #9ca3af)',
                      padding: 0,
                    }}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Type and press Enter to add tag"
              onKeyDown={handleTagInput}
              style={inputStyle}
            />
          </div>

          {/* Activity log placeholder */}
          <div>
            <label style={labelStyle}>Activity</label>
            <div
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md, 8px)',
                background: 'var(--surface-subtle, #f3f4f6)',
                color: 'var(--text-tertiary, #9ca3af)',
                fontSize: '12px',
                textAlign: 'center',
              }}
            >
              Activity log coming soon
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 20px',
            borderTop: '1px solid var(--border-subtle, #e5e7eb)',
          }}
        >
          {/* Delete */}
          <div>
            {onDelete && !showDeleteConfirm && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                style={{
                  height: '34px',
                  padding: '0 12px',
                  fontSize: '13px',
                  fontWeight: 500,
                  border: '1px solid var(--color-error, #ef4444)',
                  borderRadius: 'var(--radius-md, 8px)',
                  background: 'transparent',
                  color: 'var(--color-error, #ef4444)',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--color-error, #ef4444)';
                  e.currentTarget.style.color = 'var(--text-inverse, #fff)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--color-error, #ef4444)';
                }}
              >
                Delete
              </button>
            )}
            {onDelete && showDeleteConfirm && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '12px',
                    color: 'var(--color-error, #ef4444)',
                    fontWeight: 500,
                  }}
                >
                  Are you sure?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onDelete(card.id);
                    onClose();
                  }}
                  style={{
                    height: '30px',
                    padding: '0 10px',
                    fontSize: '12px',
                    fontWeight: 600,
                    border: 'none',
                    borderRadius: 'var(--radius-sm, 4px)',
                    background: 'var(--color-error, #ef4444)',
                    color: 'var(--text-inverse, #fff)',
                    cursor: 'pointer',
                  }}
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{
                    height: '30px',
                    padding: '0 10px',
                    fontSize: '12px',
                    fontWeight: 500,
                    border: '1px solid var(--border-subtle, #e5e7eb)',
                    borderRadius: 'var(--radius-sm, 4px)',
                    background: 'transparent',
                    color: 'var(--text-secondary, #6b7280)',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Save / Cancel */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                height: '34px',
                padding: '0 14px',
                fontSize: '13px',
                fontWeight: 500,
                border: '1px solid var(--border-subtle, #e5e7eb)',
                borderRadius: 'var(--radius-md, 8px)',
                background: 'var(--surface-default, #fff)',
                color: 'var(--text-primary, #111827)',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--surface-hover, #f9fafb)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--surface-default, #fff)';
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              style={{
                height: '34px',
                padding: '0 14px',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                borderRadius: 'var(--radius-md, 8px)',
                background: 'var(--color-primary, #3b82f6)',
                color: 'var(--text-inverse, #fff)',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-primary-hover, #2563eb)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--color-primary, #3b82f6)';
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
