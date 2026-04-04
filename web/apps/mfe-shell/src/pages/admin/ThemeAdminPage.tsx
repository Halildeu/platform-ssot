import React, { useMemo, useState } from 'react';
import {
  PageLayout,
  Text,
  createPageLayoutBreadcrumbItems,
  createPageLayoutPreset,
} from '@mfe/design-system';
import ThemeAdminPreviewPanel from './ThemeAdminPreviewPanel';
import ThemeAdminRegistryEditor from './ThemeAdminRegistryEditor';
import { useThemeAdmin } from './theme/useThemeAdmin';
import ThemeDefaultSelector from './theme/ThemeDefaultSelector';
import ThemePaletteSelector from './theme/ThemePaletteSelector';
import ThemeAxisControls from './theme/ThemeAxisControls';
import ThemeExportDialog from './theme/ThemeExportDialog';

// STORY-0022: Theme Personalization v1.0
const ThemeAdminPage: React.FC = () => {
  const admin = useThemeAdmin();
  const { t } = admin;
  const [exportOpen, setExportOpen] = useState(false);

  const title = t('themeadmin.page.title');
  const description = t('themeadmin.page.description');

  const registryCssVarsByKey = useMemo(() => {
    const map: Record<string, string[]> = {};
    admin.registry.forEach((entry) => {
      map[entry.key] = Array.isArray(entry.cssVars) ? entry.cssVars : [];
    });
    return map;
  }, [admin.registry]);

  return (
    <PageLayout
      {...createPageLayoutPreset({ preset: 'ops-workspace', pageWidth: 'wide', stickyHeader: false })}
      title={title}
      description={description}
      breadcrumbItems={createPageLayoutBreadcrumbItems([
        { title: t('themeadmin.breadcrumb.shell'), path: '/' },
        { title: t('themeadmin.breadcrumb.themes'), path: '/admin/themes' },
      ])}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4" data-testid="theme-admin-page">
        {admin.loading ? (
          <Text variant="secondary">{t('themeadmin.loading')}</Text>
        ) : (
          <>
            {/* Status bar: dirty indicator + undo/redo + export */}
            <div className="flex flex-wrap items-center gap-2">
              {admin.isDirty ? (
                <span className="rounded-full bg-status-warning px-2 py-0.5 text-[10px] font-semibold text-status-warning-text">
                  {t('themeadmin.dirty.unsaved')}
                </span>
              ) : null}
              <button
                type="button"
                title="Undo (Cmd+Z)"
                className="rounded-md border border-border-subtle bg-surface-default px-2 py-1 text-[11px] font-semibold text-text-secondary hover:border-text-secondary disabled:cursor-not-allowed disabled:text-text-subtle"
                onClick={admin.undo}
                disabled={!admin.canUndo}
              >
                ↩ Undo
              </button>
              <button
                type="button"
                title="Redo (Cmd+Shift+Z)"
                className="rounded-md border border-border-subtle bg-surface-default px-2 py-1 text-[11px] font-semibold text-text-secondary hover:border-text-secondary disabled:cursor-not-allowed disabled:text-text-subtle"
                onClick={admin.redo}
                disabled={!admin.canRedo}
              >
                ↪ Redo
              </button>
              <div className="flex-1" />
              <button
                type="button"
                className="rounded-md border border-border-subtle bg-surface-default px-2 py-1 text-[11px] font-semibold text-text-secondary hover:border-text-secondary"
                onClick={() => setExportOpen(true)}
              >
                Export
              </button>
            </div>

            {admin.error ? (
              <div className="rounded-xl border border-status-danger-border bg-status-danger px-3 py-2 text-[11px] font-semibold text-status-danger-text">
                {admin.error}
              </div>
            ) : null}
            {admin.success ? <Text variant="success">{admin.success}</Text> : null}

            {/* Default Theme + Palette — side by side */}
            <div className="grid gap-4 lg:grid-cols-2">
              <ThemeDefaultSelector
                t={t}
                themes={admin.themes}
                defaultThemeId={admin.defaultThemeId}
                onDefaultThemeIdChange={admin.setDefaultThemeId}
                defaultThemeDirty={admin.defaultThemeDirty}
                defaultThemeSaving={admin.defaultThemeSaving}
                defaultThemeError={admin.defaultThemeError}
                defaultThemeSuccess={admin.defaultThemeSuccess}
                onSave={() => void admin.handleDefaultThemeSave()}
              />
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

            {/* Theme selector + save */}
            <div className="rounded-2xl border border-border-subtle bg-surface-panel px-3 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-text-secondary">{t('themeadmin.selection.title')}:</span>
                <select
                  className="h-9 rounded-md border border-border-subtle bg-surface-default px-2 text-xs font-semibold text-text-primary focus:outline-hidden focus:ring-2 focus:ring-selection-outline focus:ring-offset-1"
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
                  className="inline-flex items-center rounded-md border border-action-primary-border bg-action-primary px-3 py-1 text-xs font-semibold text-action-primary-text hover:opacity-90 disabled:cursor-not-allowed disabled:border-border-subtle disabled:bg-surface-muted disabled:text-text-subtle"
                  onClick={() => void admin.handleSave()}
                  disabled={admin.saving || !admin.selectedThemeId || !admin.themeMeta}
                >
                  {admin.saving ? t('themeadmin.selection.saving') : t('themeadmin.selection.save')}
                </button>
              </div>
              <div className="mt-2 text-[10px] text-text-subtle">
                {t('themeadmin.selection.description')}
              </div>
            </div>

            {/* Axis controls + Registry Editor | Preview Panel */}
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_520px]">
              <div className="flex flex-col gap-4">
                <ThemeAxisControls
                  t={t}
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

              <ThemeAdminPreviewPanel
                previewRef={admin.previewRef}
                paletteThemes={admin.paletteThemes}
                selectedThemeId={admin.selectedThemeId}
                selectedTheme={admin.selectedTheme}
                themeMeta={admin.themeMeta}
                previewThemeAttr={admin.previewThemeAttr}
                previewStyle={admin.previewStyle}
                rowsByGroup={admin.rowsByGroup}
                overrides={admin.overrides}
                resolvedPreviewDisplayCssVars={admin.resolvedPreviewDisplayCssVars}
                onSelectTheme={(themeId) => admin.selectThemeManually(themeId)}
              />
            </div>

            {/* Export dialog (Phase 6) */}
            <ThemeExportDialog
              t={t}
              open={exportOpen}
              onClose={() => setExportOpen(false)}
              overrides={admin.overrides}
              themeMeta={admin.themeMeta}
              registryCssVarsByKey={registryCssVarsByKey}
            />
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default ThemeAdminPage;
