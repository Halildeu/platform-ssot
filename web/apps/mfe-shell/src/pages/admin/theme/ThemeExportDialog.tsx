import React, { useMemo, useState } from 'react';
import type { ThemeMetaState, ThemeAdminTranslator } from '../ThemeAdminPage.shared';

type ExportFormat = 'css' | 'json' | 'ts';

type ThemeExportDialogProps = {
  t: ThemeAdminTranslator;
  open: boolean;
  onClose: () => void;
  overrides: Record<string, string>;
  themeMeta: ThemeMetaState | null;
  registryCssVarsByKey: Record<string, string[]>;
};

function generateCssExport(
  overrides: Record<string, string>,
  registryCssVarsByKey: Record<string, string[]>,
  meta: ThemeMetaState | null,
): string {
  const lines: string[] = [];
  lines.push(`/* Theme Export — ${meta?.appearance ?? 'light'} / ${meta?.axes.accent ?? 'neutral'} */`);
  lines.push(':root {');
  const sorted = Object.keys(overrides).sort();
  for (const key of sorted) {
    const value = overrides[key];
    if (!value) continue;
    const cssVars = registryCssVarsByKey[key] ?? [];
    for (const cssVar of cssVars) {
      lines.push(`  ${cssVar}: ${value};`);
    }
  }
  lines.push('}');
  return lines.join('\n');
}

function generateJsonExport(overrides: Record<string, string>, meta: ThemeMetaState | null): string {
  return JSON.stringify({ meta, overrides }, null, 2);
}

function generateTsExport(overrides: Record<string, string>, meta: ThemeMetaState | null): string {
  const lines: string[] = [];
  lines.push('import type { ThemeOverrides } from \'@mfe/design-system\';');
  lines.push('');
  lines.push(`export const themeMeta = ${JSON.stringify(meta, null, 2)} as const;`);
  lines.push('');
  lines.push(`export const themeOverrides: ThemeOverrides = ${JSON.stringify(overrides, null, 2)};`);
  return lines.join('\n');
}

const ThemeExportDialog: React.FC<ThemeExportDialogProps> = ({
  t,
  open,
  onClose,
  overrides,
  themeMeta,
  registryCssVarsByKey,
}) => {
  const [format, setFormat] = useState<ExportFormat>('css');
  const [copied, setCopied] = useState(false);

  const exportContent = useMemo(() => {
    switch (format) {
      case 'css': return generateCssExport(overrides, registryCssVarsByKey, themeMeta);
      case 'json': return generateJsonExport(overrides, themeMeta);
      case 'ts': return generateTsExport(overrides, themeMeta);
    }
  }, [format, overrides, themeMeta, registryCssVarsByKey]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  const handleDownload = () => {
    const ext = format === 'ts' ? 'ts' : format;
    const mime = format === 'json' ? 'application/json' : 'text/plain';
    const blob = new Blob([exportContent], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `theme-export.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={t('themeadmin.export.title')}
    >
      <div className="w-full max-w-xl rounded-2xl border border-border-subtle bg-surface-panel p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-text-primary">{t('themeadmin.export.title')}</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-xs text-text-subtle hover:text-text-primary"
          >
            ✕
          </button>
        </div>

        {/* Format selector */}
        <div className="mt-3 flex gap-2">
          {(['css', 'json', 'ts'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFormat(f)}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
                format === f
                  ? 'bg-action-primary text-action-primary-text'
                  : 'border border-border-subtle bg-surface-default text-text-secondary hover:border-text-secondary'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Code preview */}
        <pre className="mt-3 max-h-64 overflow-auto rounded-lg border border-border-subtle bg-surface-muted p-3 text-[11px] leading-relaxed text-text-primary">
          {exportContent}
        </pre>

        {/* Actions */}
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => void handleCopy()}
            className="inline-flex items-center rounded-md border border-border-subtle bg-surface-default px-3 py-1.5 text-xs font-semibold text-text-secondary hover:border-text-secondary"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center rounded-md border border-action-primary-border bg-action-primary px-3 py-1.5 text-xs font-semibold text-action-primary-text hover:opacity-90"
          >
            Download .{format}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeExportDialog;
