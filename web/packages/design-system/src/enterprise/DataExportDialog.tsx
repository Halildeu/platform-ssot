import React, { useState, useCallback } from 'react';
import { cn } from '../utils/cn';
import { resolveAccessState, accessStyles, type AccessControlledProps } from '../internal/access-controller';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ExportFormat = 'pdf' | 'excel' | 'csv' | 'png';
export type ExportScope = 'visible' | 'all' | 'selected' | 'filtered';

export interface RecordCounts {
  visible: number;
  all: number;
  selected: number;
  filtered: number;
}

export interface DataExportDialogProps extends AccessControlledProps {
  open: boolean;
  onClose: () => void;
  onExport: (options: { format: ExportFormat; scope: ExportScope; includeCharts: boolean }) => void | Promise<void>;
  recordCounts?: RecordCounts;
  formats?: ExportFormat[];
  scopes?: ExportScope[];
  defaultFormat?: ExportFormat;
  defaultScope?: ExportScope;
  className?: string;
}

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

const FORMAT_LABELS: Record<ExportFormat, { label: string; icon: string }> = {
  pdf: { label: 'PDF', icon: 'M7 2h10l4 4v16H3V2h4z' },
  excel: { label: 'Excel', icon: 'M3 3h18v18H3V3zm4 4v10h10V7H7z' },
  csv: { label: 'CSV', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z' },
  png: { label: 'PNG', icon: 'M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z' },
};

const SCOPE_LABELS: Record<ExportScope, string> = {
  visible: 'G\u00f6r\u00fcn\u00fcr kay\u0131tlar',
  all: 'T\u00fcm kay\u0131tlar',
  selected: 'Se\u00e7ili kay\u0131tlar',
  filtered: 'Filtrelenen kay\u0131tlar',
};

// ---------------------------------------------------------------------------
// Format color indicators
// ---------------------------------------------------------------------------

const FORMAT_COLORS: Record<ExportFormat, string> = {
  pdf: '#ef4444',
  excel: '#22c55e',
  csv: '#3b82f6',
  png: '#a855f7',
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function RadioOption({
  name,
  value,
  label,
  checked,
  disabled,
  onChange,
  color,
  children,
}: {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  disabled: boolean;
  onChange: (val: string) => void;
  color?: string;
  children?: React.ReactNode;
}) {
  return (
    <label
      className={cn(
        'flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer transition-colors',
        checked
          ? 'border-blue-500 bg-blue-50'
          : 'border-[var(--border-default)] hover:bg-[var(--surface-muted)]',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(value)}
        className="accent-blue-600"
      />
      {color && (
        <span
          className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
      )}
      <span className="font-medium text-[var(--text-primary)]">{label}</span>
      {children}
    </label>
  );
}

function Backdrop({ onClick }: { onClick: () => void }) {
  return (
    <div
      className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
      onClick={onClick}
      aria-hidden="true"
    />
  );
}

// ---------------------------------------------------------------------------
// DataExportDialog component
// ---------------------------------------------------------------------------

export function DataExportDialog({
  open,
  onClose,
  onExport,
  recordCounts,
  formats = ['pdf', 'excel', 'csv', 'png'],
  scopes = ['visible', 'all', 'selected', 'filtered'],
  defaultFormat = 'excel',
  defaultScope = 'visible',
  access,
  accessReason,
  className,
}: DataExportDialogProps) {
  const { state, isHidden, isDisabled } = resolveAccessState(access);

  const [format, setFormat] = useState<ExportFormat>(defaultFormat);
  const [scope, setScope] = useState<ExportScope>(defaultScope);
  const [includeCharts, setIncludeCharts] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = useCallback(async () => {
    if (exporting) return;
    setExporting(true);
    try {
      await onExport({ format, scope, includeCharts });
      onClose();
    } catch {
      // error handled by consumer
    } finally {
      setExporting(false);
    }
  }, [format, scope, includeCharts, onExport, onClose, exporting]);

  if (isHidden || !open) return null;

  // Determine record count summary
  const scopeCount = recordCounts?.[scope];
  const totalCount = recordCounts?.all;
  const countSummary =
    scopeCount !== undefined && totalCount !== undefined
      ? `${scopeCount.toLocaleString('tr-TR')} / ${totalCount.toLocaleString('tr-TR')} kay\u0131t`
      : null;

  return (
    <>
      <Backdrop onClick={onClose} />
      <div
        className={cn(
          'fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[var(--border-default)] bg-[var(--surface-primary)] shadow-2xl',
          accessStyles(state),
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Veri d\u0131\u015fa aktar"
        title={accessReason}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-default)] px-5 py-4">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">D\u0131\u015fa Aktar</h2>
          <button
            type="button"
            className="rounded p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 px-5 py-4">
          {/* Format selection */}
          <fieldset>
            <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Format
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {formats.map((f) => (
                <RadioOption
                  key={f}
                  name="export-format"
                  value={f}
                  label={FORMAT_LABELS[f].label}
                  checked={format === f}
                  disabled={isDisabled}
                  onChange={(v) => setFormat(v as ExportFormat)}
                  color={FORMAT_COLORS[f]}
                />
              ))}
            </div>
          </fieldset>

          {/* Scope selection */}
          <fieldset>
            <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Kapsam
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {scopes.map((s) => (
                <RadioOption
                  key={s}
                  name="export-scope"
                  value={s}
                  label={SCOPE_LABELS[s]}
                  checked={scope === s}
                  disabled={isDisabled}
                  onChange={(v) => setScope(v as ExportScope)}
                >
                  {recordCounts?.[s] !== undefined && (
                    <span className="ml-auto text-[10px] text-[var(--text-secondary)]">
                      ({recordCounts[s].toLocaleString('tr-TR')})
                    </span>
                  )}
                </RadioOption>
              ))}
            </div>
          </fieldset>

          {/* Include charts */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeCharts}
              onChange={(e) => setIncludeCharts(e.target.checked)}
              disabled={isDisabled}
              className="accent-blue-600 h-4 w-4"
            />
            <span className="text-sm text-[var(--text-primary)]">Grafikleri dahil et</span>
          </label>

          {/* Record count summary */}
          {countSummary && (
            <div className="rounded-md bg-[var(--surface-muted)] px-3 py-2 text-center text-sm text-[var(--text-secondary)]">
              {countSummary}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[var(--border-default)] px-5 py-3">
          <button
            type="button"
            className="rounded-md border border-[var(--border-default)] bg-[var(--surface-primary)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors"
            onClick={onClose}
          >
            Vazge\u00e7
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isDisabled || exporting}
            onClick={handleExport}
          >
            {exporting && (
              <svg width="14" height="14" viewBox="0 0 24 24" className="animate-spin" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
              </svg>
            )}
            D\u0131\u015fa Aktar
          </button>
        </div>
      </div>
    </>
  );
}
