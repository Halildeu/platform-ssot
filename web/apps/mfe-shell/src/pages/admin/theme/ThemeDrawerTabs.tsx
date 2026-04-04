import React, { useMemo, useState } from 'react';
import { Tabs } from '@mfe/design-system';
import type { UseThemeAdminReturn } from './useThemeAdmin';
import ThemePaletteSelector from './ThemePaletteSelector';
import ThemeAxisControls from './ThemeAxisControls';
import ThemeAdminRegistryEditor from '../ThemeAdminRegistryEditor';

type ThemeDrawerTabsProps = {
  admin: UseThemeAdminReturn;
};

/* ------------------------------------------------------------------ */
/*  Tab 1: Theme selector + palette                                    */
/* ------------------------------------------------------------------ */
const ThemeTab: React.FC<{ admin: UseThemeAdminReturn }> = ({ admin }) => {
  const { t } = admin;
  return (
    <div className="flex flex-col gap-3 p-4">
      {/* Theme selector */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-text-subtle">
          {t('themeadmin.selection.title')}
        </span>
        <div className="flex items-center gap-2">
          <select
            className="h-9 flex-1 rounded-md border border-border-subtle bg-surface-default px-2 text-xs font-semibold text-text-primary focus:outline-hidden focus:ring-2 focus:ring-selection-outline"
            value={admin.selectedThemeId ?? ''}
            onChange={(event) => admin.selectThemeManually(event.target.value || null)}
          >
            {admin.selectableThemes.map((theme) => {
              const label = theme.name.replace(/^Global\s+/i, '');
              return (
                <option key={theme.id} value={theme.id}>
                  {label}
                </option>
              );
            })}
          </select>
          <button
            type="button"
            className="rounded-md border border-border-subtle bg-surface-default px-2 py-1.5 text-[11px] font-semibold text-text-secondary hover:border-text-secondary disabled:cursor-not-allowed disabled:text-text-subtle"
            onClick={() => {
              admin.setDefaultThemeId(admin.selectedThemeId);
              void admin.handleDefaultThemeSave();
            }}
            disabled={admin.defaultThemeSaving || !admin.selectedThemeId || admin.selectedThemeId === admin.defaultThemeId}
            title={t('themeadmin.defaultTheme.description')}
          >
            ⭐
          </button>
        </div>
        {admin.defaultThemeSuccess ? (
          <span className="text-[10px] text-status-success-text">{admin.defaultThemeSuccess}</span>
        ) : null}
      </div>

      {/* Palette */}
      <ThemePaletteSelector
        t={t}
        themes={admin.themes}
        paletteDraft={admin.paletteDraft}
        onPaletteDraftChange={(id, checked) =>
          admin.setPaletteDraft((prev) => ({ ...prev, [id]: checked }))
        }
        paletteDirty={admin.paletteDirty}
        paletteSaving={admin.paletteSaving}
        paletteSelectedCount={admin.paletteSelectedCount}
        paletteError={admin.paletteError}
        paletteSuccess={admin.paletteSuccess}
        onSave={() => void admin.handlePaletteSave()}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Tab 2: Style — surface tone, radius, elevation, motion             */
/* ------------------------------------------------------------------ */
const StyleTab: React.FC<{ admin: UseThemeAdminReturn }> = ({ admin }) => (
  <div className="p-4">
    <ThemeAxisControls
      t={admin.t}
      themeMeta={admin.themeMeta}
      onThemeMetaChange={admin.setThemeMeta}
      accentOptions={admin.accentOptions}
      surfaceToneOptions={admin.surfaceToneOptions}
      themeAxisSegmentedPreset={admin.themeAxisSegmentedPreset}
      densitySegmentedItems={admin.densitySegmentedItems}
      radiusSegmentedItems={admin.radiusSegmentedItems}
      elevationSegmentedItems={admin.elevationSegmentedItems}
      motionSegmentedItems={admin.motionSegmentedItems}
    />
  </div>
);

/* ------------------------------------------------------------------ */
/*  Tab 3: Colors — registry overrides                                 */
/* ------------------------------------------------------------------ */
const ColorsTab: React.FC<{ admin: UseThemeAdminReturn }> = ({ admin }) => (
  <div className="p-4">
    <ThemeAdminRegistryEditor
      textAreaGroups={admin.textAreaGroups}
      rowsByGroup={admin.rowsByGroup}
      resolvedPreviewCssVars={admin.resolvedPreviewCssVars}
      resolvedPreviewDisplayCssVars={admin.resolvedPreviewDisplayCssVars}
      activeColorPicker={admin.activeColorPicker}
      contrastWarnings={admin.contrastWarnings}
      onValueChange={admin.handleValueChange}
      onOpenColorPicker={admin.openColorPicker}
      onCloseColorPicker={() => admin.setActiveColorPicker(null)}
      onColorPickerChange={(key, color) => {
        admin.setActiveColorPicker((prev) => (prev && prev.key === key ? { ...prev, color } : prev));
      }}
    />
  </div>
);

/* ------------------------------------------------------------------ */
/*  Tab 4: Export — inline (not modal)                                  */
/* ------------------------------------------------------------------ */
const ExportTab: React.FC<{ admin: UseThemeAdminReturn }> = ({ admin }) => {
  const [format, setFormat] = useState<'css' | 'json' | 'ts'>('css');
  const [copied, setCopied] = useState(false);

  const registryCssVarsByKey = admin.registryCssVarsByKey;

  const exportContent = useMemo(() => {
    const overrides = admin.overrides;
    const meta = admin.themeMeta;
    switch (format) {
      case 'css': {
        const lines: string[] = [];
        lines.push(`/* Theme Export — ${meta?.appearance ?? 'light'} / ${meta?.axes.accent ?? 'neutral'} */`);
        lines.push(':root {');
        for (const key of Object.keys(overrides).sort()) {
          const value = overrides[key];
          if (!value) continue;
          for (const cssVar of registryCssVarsByKey[key] ?? []) {
            lines.push(`  ${cssVar}: ${value};`);
          }
        }
        lines.push('}');
        return lines.join('\n');
      }
      case 'json':
        return JSON.stringify({ meta, overrides }, null, 2);
      case 'ts': {
        const lines: string[] = [];
        lines.push("import type { ThemeOverrides } from '@mfe/design-system';");
        lines.push('');
        lines.push(`export const themeMeta = ${JSON.stringify(meta, null, 2)} as const;`);
        lines.push('');
        lines.push(`export const themeOverrides: ThemeOverrides = ${JSON.stringify(overrides, null, 2)};`);
        return lines.join('\n');
      }
    }
  }, [format, admin.overrides, admin.themeMeta, registryCssVarsByKey]);

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

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex gap-1.5">
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
      <pre className="max-h-48 overflow-auto rounded-lg border border-border-subtle bg-surface-muted p-3 text-[10px] leading-relaxed text-text-primary">
        {exportContent}
      </pre>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => void handleCopy()}
          className="rounded-md border border-border-subtle bg-surface-default px-3 py-1.5 text-[11px] font-semibold text-text-secondary hover:border-text-secondary"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="rounded-md border border-action-primary-border bg-action-primary px-3 py-1.5 text-[11px] font-semibold text-action-primary-text hover:opacity-90"
        >
          Download .{format}
        </button>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Tabs orchestrator                                                  */
/* ------------------------------------------------------------------ */
const ThemeDrawerTabs: React.FC<ThemeDrawerTabsProps> = ({ admin }) => {
  const { t } = admin;
  const items = useMemo(
    () => [
      { key: 'theme', label: 'Tema', content: <ThemeTab admin={admin} /> },
      { key: 'style', label: 'Stil', content: <StyleTab admin={admin} /> },
      { key: 'colors', label: 'Renkler', content: <ColorsTab admin={admin} /> },
      { key: 'export', label: 'Export', content: <ExportTab admin={admin} /> },
    ],
    [t, admin],
  );

  return (
    <Tabs
      items={items}
      defaultActiveKey="theme"
      variant="enclosed"
      size="sm"
      density="compact"
      fullWidth
      className="border-b-0"
    />
  );
};

export default ThemeDrawerTabs;
