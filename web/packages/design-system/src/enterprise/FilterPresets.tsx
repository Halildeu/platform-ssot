import React, { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '../utils/cn';
import { resolveAccessState, accessStyles, type AccessControlledProps } from '../internal/access-controller';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FilterPreset {
  id: string;
  name: string;
  filters: Record<string, unknown>;
  isDefault?: boolean;
  isShared?: boolean;
}

export interface FilterPresetsProps extends AccessControlledProps {
  presets: FilterPreset[];
  activePresetId?: string | null;
  onSelect: (preset: FilterPreset) => void;
  onSave?: (name: string, filters: Record<string, unknown>) => void;
  onDelete?: (presetId: string) => void;
  onSetDefault?: (presetId: string) => void;
  currentFilters?: Record<string, unknown>;
  className?: string;
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill={filled ? '#f59e0b' : 'none'}
      stroke={filled ? '#f59e0b' : 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Save popover
// ---------------------------------------------------------------------------

function SavePopover({
  onSave,
  onCancel,
}: {
  onSave: (name: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = name.trim();
    if (trimmed) onSave(trimmed);
  }, [name, onSave]);

  return (
    <div className="absolute top-full left-0 z-20 mt-1 flex items-center gap-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--surface-primary)] p-2 shadow-lg">
      <input
        ref={inputRef}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit();
          if (e.key === 'Escape') onCancel();
        }}
        placeholder="Preset ad\u0131..."
        className="rounded border border-[var(--border-default)] bg-[var(--surface-primary)] px-2 py-1 text-xs text-[var(--text-primary)] outline-none focus:border-blue-400 w-36"
      />
      <button
        type="button"
        className="rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
        onClick={handleSubmit}
      >
        Kaydet
      </button>
      <button
        type="button"
        className="rounded px-2 py-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        onClick={onCancel}
      >
        \u0130ptal
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Delete confirmation
// ---------------------------------------------------------------------------

function DeleteConfirmation({
  presetName,
  onConfirm,
  onCancel,
}: {
  presetName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="absolute top-full right-0 z-20 mt-1 rounded-lg border border-[var(--border-default)] bg-[var(--surface-primary)] p-3 shadow-lg min-w-[200px]">
      <p className="text-xs text-[var(--text-primary)] mb-2">
        <strong>&quot;{presetName}&quot;</strong> silinsin mi?
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700 transition-colors"
          onClick={onConfirm}
        >
          Sil
        </button>
        <button
          type="button"
          className="rounded px-2 py-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          onClick={onCancel}
        >
          Vazge\u00e7
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FilterPresets component
// ---------------------------------------------------------------------------

export function FilterPresets({
  presets,
  activePresetId,
  onSelect,
  onSave,
  onDelete,
  onSetDefault,
  currentFilters = {},
  access,
  accessReason,
  className,
}: FilterPresetsProps) {
  const { state, isHidden, isDisabled } = resolveAccessState(access);
  const [showSave, setShowSave] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSave = useCallback(
    (name: string) => {
      onSave?.(name, currentFilters);
      setShowSave(false);
    },
    [onSave, currentFilters],
  );

  const handleDelete = useCallback(
    (id: string) => {
      onDelete?.(id);
      setDeletingId(null);
    },
    [onDelete],
  );

  if (isHidden) return null;

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex flex-wrap items-center gap-1.5',
        accessStyles(state),
        className,
      )}
      role="toolbar"
      aria-label="Filter presets"
      title={accessReason}
    >
      {presets.map((preset) => {
        const isActive = preset.id === activePresetId;
        return (
          <div key={preset.id} className="group relative flex items-center">
            <button
              type="button"
              className={cn(
                'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                isActive
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-primary)] hover:bg-[var(--surface-muted)]',
              )}
              disabled={isDisabled}
              onClick={() => onSelect(preset)}
            >
              {preset.isDefault && <StarIcon filled />}
              {preset.isShared && <LockIcon />}
              {preset.name}
            </button>

            {/* Delete button on hover */}
            {onDelete && !preset.isShared && (
              <button
                type="button"
                className="invisible group-hover:visible ml-0.5 inline-flex items-center justify-center rounded-full p-0.5 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 transition-colors"
                disabled={isDisabled}
                aria-label={`Delete preset ${preset.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setDeletingId(preset.id);
                }}
              >
                <TrashIcon />
              </button>
            )}

            {/* Set default on hover */}
            {onSetDefault && !preset.isDefault && (
              <button
                type="button"
                className="invisible group-hover:visible ml-0.5 inline-flex items-center justify-center rounded-full p-0.5 text-[var(--text-secondary)] hover:text-yellow-500 transition-colors"
                disabled={isDisabled}
                aria-label={`Set ${preset.name} as default`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSetDefault(preset.id);
                }}
              >
                <StarIcon filled={false} />
              </button>
            )}

            {/* Delete confirmation popover */}
            {deletingId === preset.id && (
              <DeleteConfirmation
                presetName={preset.name}
                onConfirm={() => handleDelete(preset.id)}
                onCancel={() => setDeletingId(null)}
              />
            )}
          </div>
        );
      })}

      {/* Save current button */}
      {onSave && (
        <div className="relative">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full border border-dashed border-[var(--border-default)] px-3 py-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors"
            disabled={isDisabled}
            onClick={() => setShowSave(true)}
          >
            <PlusIcon />
            Kaydet
          </button>
          {showSave && (
            <SavePopover onSave={handleSave} onCancel={() => setShowSave(false)} />
          )}
        </div>
      )}
    </div>
  );
}
