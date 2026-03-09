import React from 'react';

import UniversalColorPicker from '../../app/theme/components/UniversalColorPicker';
import { rgbaToString, type RgbaColor } from '../../app/theme/color-utils';
import {
  groupLabelMap,
  resolveTailwindHint,
  usageHintByKey,
  type ThemeAdminRow,
  type ThemeColorPickerState,
} from './ThemeAdminPage.shared';

type ThemeRowGroup = {
  id: string;
  label?: string;
  rows: ThemeAdminRow[];
};

type ThemeAdminRegistryEditorProps = {
  textAreaGroups: ThemeRowGroup[];
  rowsByGroup: ThemeRowGroup[];
  resolvedPreviewCssVars: Record<string, string>;
  resolvedPreviewDisplayCssVars: Record<string, string>;
  activeColorPicker: ThemeColorPickerState | null;
  contrastWarnings: Record<string, string>;
  onValueChange: (key: string, value: string) => void;
  onOpenColorPicker: (row: ThemeAdminRow) => void;
  onCloseColorPicker: () => void;
  onColorPickerChange: (key: string, color: RgbaColor) => void;
};

const ThemeAdminRegistryEditor: React.FC<ThemeAdminRegistryEditorProps> = ({
  textAreaGroups,
  rowsByGroup,
  resolvedPreviewCssVars,
  resolvedPreviewDisplayCssVars,
  activeColorPicker,
  contrastWarnings,
  onValueChange,
  onOpenColorPicker,
  onCloseColorPicker,
  onColorPickerChange,
}) => {
  const renderRegistryRow = (row: ThemeAdminRow) => {
    const isAdminOnly = row.editableBy === 'ADMIN_ONLY';
    const cssVars = Array.isArray(row.cssVars) ? row.cssVars : [];
    const resolvedRaw = cssVars.length > 0 ? resolvedPreviewCssVars[cssVars[0]] : '';
    const resolvedDisplay = cssVars.length > 0 ? resolvedPreviewDisplayCssVars[cssVars[0]] : '';
    const fallbackRaw = row.key === 'surface.page.bg' ? resolvedPreviewCssVars['--surface-default-bg'] ?? '' : '';
    const fallbackDisplay = row.key === 'surface.page.bg' ? resolvedPreviewDisplayCssVars['--surface-default-bg'] ?? '' : '';
    const effectiveResolvedRaw = resolvedRaw || fallbackRaw;
    const effectiveResolvedDisplay = resolvedDisplay || fallbackDisplay;
    const overrideValue = row.value?.trim() ? row.value.trim() : '';
    const swatchColor = overrideValue || effectiveResolvedRaw || 'transparent';
    const isDangerBg =
      row.key.endsWith('.bg') &&
      (
        row.key.startsWith('action.danger')
        || row.key.startsWith('status.danger')
        || row.key.startsWith('status.warning')
        || row.key.startsWith('status.success')
        || row.key.startsWith('status.info')
      );
    const contrastWarning = isDangerBg ? contrastWarnings[row.key] : undefined;
    const tailwindHint = resolveTailwindHint(row.key);
    const usageHint = usageHintByKey[row.key];

    return (
      <label
        key={row.id}
        className="flex flex-col gap-1 rounded-xl border border-border-subtle bg-surface-panel px-2 py-2 text-[11px]"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-text-primary">{row.label}</span>
          <span className="text-[10px] text-text-subtle">{row.key}</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="h-7 flex-1 rounded-md border border-border-subtle bg-surface-default px-2 text-[11px] text-text-primary focus:outline-none focus:ring-2 focus:ring-selection-outline focus:ring-offset-1"
            value={row.value ?? ''}
            onChange={(event) => onValueChange(row.key, event.target.value)}
            placeholder={row.controlType === 'COLOR' ? effectiveResolvedDisplay || '#rrggbb veya rgba(...)' : ''}
          />
          {row.controlType === 'COLOR' ? (
            <button
              type="button"
              className="h-6 w-6 rounded-md border border-border-subtle shadow-sm"
              style={{ backgroundColor: swatchColor }}
              aria-label={`${row.label} renk seç`}
              onClick={() => onOpenColorPicker(row)}
            />
          ) : (
            <span
              className="h-6 w-6 rounded-md border border-border-subtle"
              style={{ backgroundColor: swatchColor }}
              aria-hidden
            />
          )}
        </div>
        {row.controlType === 'COLOR' && !overrideValue && effectiveResolvedDisplay ? (
          <div className="text-[10px] text-text-subtle">
            Varsayılan: <span className="font-mono">{effectiveResolvedDisplay}</span>
          </div>
        ) : null}
        {row.controlType === 'COLOR' && activeColorPicker?.key === row.key ? (
          <div className="mt-2 rounded-xl border border-border-subtle bg-surface-default p-2">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold text-text-secondary">Renk seçici</span>
                <span className="text-[10px] text-text-subtle">{activeColorPicker.key}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-border-subtle bg-surface-muted px-2 py-1 text-[10px] font-semibold text-text-secondary hover:border-text-secondary"
                  onClick={() => {
                    onValueChange(row.key, '');
                    onCloseColorPicker();
                  }}
                >
                  Override’ı kaldır
                </button>
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-border-subtle bg-surface-muted px-2 py-1 text-[10px] font-semibold text-text-secondary hover:border-text-secondary"
                  onClick={onCloseColorPicker}
                >
                  Kapat
                </button>
              </div>
            </div>
            <UniversalColorPicker
              color={activeColorPicker.color}
              surfaceTone={null}
              surfaceTonePresets={[]}
              surfaceTonePalette={[]}
              onManualColorChange={(next) => {
                onColorPickerChange(row.key, next);
                onValueChange(row.key, rgbaToString(next));
              }}
              onSurfaceToneChange={() => {
                // surface tone seçici bu editörde kullanılmıyor
              }}
            />
          </div>
        ) : null}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] text-text-subtle">{row.description ?? row.groupName}</span>
          <span className={isAdminOnly ? 'text-[10px] font-semibold text-status-warning-text' : 'text-[10px] text-text-subtle'}>
            {isAdminOnly ? 'ADMIN_ONLY' : 'USER_ALLOWED'}
          </span>
        </div>
        {cssVars.length > 0 ? (
          <div className="text-[10px] text-text-subtle">
            CSS: <span className="font-mono">{cssVars.join(', ')}</span>
          </div>
        ) : null}
        {tailwindHint ? (
          <div className="text-[10px] text-text-subtle">
            Tailwind: <span className="font-mono">{tailwindHint}</span>
          </div>
        ) : null}
        {usageHint ? <div className="text-[10px] text-text-subtle">Kullanım: {usageHint}</div> : null}
        {isDangerBg ? (
          <>
            <span className="text-[10px] text-status-warning-text">
              ERP action/status arka planı – kontrast ve a11y kurallarına dikkat edin.
            </span>
            {contrastWarning ? (
              <span className="text-[10px] text-status-danger-text">{contrastWarning}</span>
            ) : null}
          </>
        ) : null}
      </label>
    );
  };

  return (
    <details open className="rounded-2xl border border-border-subtle bg-surface-panel px-3 py-2">
      <summary className="cursor-pointer select-none text-xs font-semibold uppercase tracking-wide text-text-secondary">
        Registry renkleri
      </summary>
      <div className="mt-3 flex flex-col gap-4">
        {textAreaGroups.length > 0 ? (
          <details open className="rounded-2xl border border-border-subtle bg-surface-default px-3 py-2">
            <summary className="cursor-pointer select-none text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Metin renkleri (alan bazlı)
            </summary>
            <div className="mt-2 flex flex-col gap-3">
              {textAreaGroups.map((group) => (
                <details key={group.id} className="rounded-2xl border border-border-subtle bg-surface-panel px-3 py-2">
                  <summary className="cursor-pointer select-none text-[11px] font-semibold text-text-secondary">
                    {group.label}
                  </summary>
                  <div className="mt-2 flex flex-col gap-2">{group.rows.map((row) => renderRegistryRow(row))}</div>
                </details>
              ))}
              <div className="text-[10px] text-text-subtle">
                Not: “Hepsini kırmızı yaptım ama bazı metinler farklı” durumu çoğunlukla <span className="font-semibold">action/status/accent</span> token’larından kaynaklanır.
              </div>
            </div>
          </details>
        ) : null}

        {rowsByGroup.map((group) => (
          <details key={group.id} className="rounded-2xl border border-border-subtle bg-surface-default px-3 py-2">
            <summary className="cursor-pointer select-none text-xs font-semibold uppercase tracking-wide text-text-secondary">
              {groupLabelMap[group.id] ?? group.id}
            </summary>
            <div className="mt-2 flex flex-col gap-2">{group.rows.map((row) => renderRegistryRow(row))}</div>
          </details>
        ))}
      </div>
    </details>
  );
};

export default ThemeAdminRegistryEditor;
