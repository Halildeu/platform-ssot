import React, { useState } from 'react';
import { Segmented, ThemePreviewCard, createSegmentedPreset } from '@mfe/design-system';

import { resolveThemeAttr, type ThemeAdminRow, type ThemeDetails, type ThemeMetaState, type ThemeSummary } from './ThemeAdminPage.shared';
import { useThemeAdminI18n } from './useThemeAdminI18n';

type PreviewViewport = 'desktop' | 'tablet' | 'mobile';
const viewportWidths: Record<PreviewViewport, string> = { desktop: '100%', tablet: '768px', mobile: '375px' };

type ThemeAdminPreviewPanelProps = {
  previewRef: React.RefObject<HTMLDivElement | null>;
  paletteThemes: ThemeSummary[];
  selectedThemeId: string | null;
  selectedTheme: ThemeDetails | null;
  themeMeta: ThemeMetaState | null;
  previewThemeAttr: string;
  previewStyle: React.CSSProperties;
  rowsByGroup: Array<{ id: string; rows: ThemeAdminRow[] }>;
  overrides: Record<string, string>;
  resolvedPreviewDisplayCssVars: Record<string, string>;
  onSelectTheme: (themeId: string) => void;
  onToggleAppearance?: () => void;
};

const renderCssVarSwatch = (groupId: string, cssVar: string) => {
  if (groupId === 'text') {
    return (
      <div
        key={cssVar}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-border-subtle bg-surface-default text-[11px] font-bold"
        style={{ color: `var(${cssVar})` }}
        title={cssVar}
      >
        Aa
      </div>
    );
  }
  if (groupId === 'border') {
    return (
      <div
        key={cssVar}
        className="h-7 w-7 rounded-md border-2 bg-surface-default"
        style={{ borderColor: `var(${cssVar})` }}
        title={cssVar}
      />
    );
  }
  return (
    <div
      key={cssVar}
      className="h-7 w-7 rounded-md border border-border-subtle"
      style={{ backgroundColor: `var(${cssVar})` }}
      title={cssVar}
    />
  );
};

const ThemeAdminPreviewPanel: React.FC<ThemeAdminPreviewPanelProps> = ({
  previewRef,
  paletteThemes,
  selectedThemeId,
  selectedTheme,
  themeMeta,
  previewThemeAttr,
  previewStyle,
  rowsByGroup,
  overrides,
  resolvedPreviewDisplayCssVars,
  onSelectTheme,
  onToggleAppearance,
}) => {
  const { t } = useThemeAdminI18n();
  const [viewport, setViewport] = useState<PreviewViewport>('desktop');
  const surfacePreviewCards = React.useMemo(
    () => [
      { label: t('themeadmin.preview.surface.default'), className: 'bg-surface-default text-text-primary' },
      { label: t('themeadmin.preview.surface.raised'), className: 'bg-surface-raised text-text-primary' },
      { label: t('themeadmin.preview.surface.muted'), className: 'bg-surface-muted text-text-primary' },
      { label: t('themeadmin.preview.surface.panel'), className: 'bg-surface-panel text-text-primary' },
      { label: t('themeadmin.preview.surface.header'), className: 'bg-surface-header text-text-primary' },
      { label: t('themeadmin.preview.surface.overlay'), className: 'bg-surface-overlay text-text-inverse' },
    ],
    [t],
  );
  const shellNavLabels = React.useMemo(
    () => [
      t('themeadmin.preview.nav.home'),
      t('themeadmin.preview.nav.recommendations'),
      t('themeadmin.preview.nav.ethics'),
      t('themeadmin.preview.nav.access'),
      t('themeadmin.preview.nav.audit'),
    ],
    [t],
  );
  const themePreviewCardLocaleText = React.useMemo(
    () => ({
      titleText: t('themeadmin.preview.themeCard.titleText'),
      secondaryText: t('themeadmin.preview.themeCard.secondaryText'),
      saveLabel: t('themeadmin.preview.themeCard.saveLabel'),
      selectedLabel: t('themeadmin.preview.themeCard.selectedLabel'),
    }),
    [t],
  );
  const themePalettePreset = React.useMemo(() => createSegmentedPreset('toolbar'), []);
  const paletteThemeItems = React.useMemo(
    () =>
      paletteThemes.map((theme) => {
        const label = theme.name.replace(/^Global\s+/i, '');
        return {
          value: theme.id,
          dataTestId: `theme-preview-${theme.id}`,
          itemClassName: 'min-h-0 flex-[1_1_calc(33.333%-0.5rem)] basis-[calc(33.333%-0.5rem)] px-0 py-0',
          label: (
            <div className="rounded-2xl border p-2 transition text-left" title={theme.name}>
              <span className="mb-1 block truncate text-[11px] font-semibold text-text-secondary">{label}</span>
              <div
                data-theme-scope
                data-theme={resolveThemeAttr(theme.appearance, theme.axes?.density)}
                data-accent={theme.axes?.accent ?? 'neutral'}
                data-density={theme.axes?.density}
                data-radius={theme.axes?.radius}
                data-elevation={theme.axes?.elevation}
                data-motion={theme.axes?.motion}
                data-surface-tone={theme.surfaceTone ?? undefined}
                className="mt-1"
              >
                <ThemePreviewCard selected={theme.id === selectedThemeId} localeText={themePreviewCardLocaleText} />
              </div>
            </div>
          ),
        };
      }),
    [paletteThemes, selectedThemeId, themePreviewCardLocaleText],
  );

  return (
    <aside className="self-start overflow-auto lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)]">
    <details open data-theme-preview className="rounded-2xl border border-border-subtle bg-surface-panel px-3 py-2">
      <summary className="cursor-pointer select-none text-xs font-semibold uppercase tracking-wide text-text-secondary">
        {t('themeadmin.preview.sectionTitle')}
      </summary>
      <div className="mt-3 flex flex-col gap-4">
        {/* Dark/Light toggle + Responsive viewport (Phase 4) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleAppearance}
            className="rounded-md border border-border-subtle bg-surface-default px-2 py-1 text-[10px] font-semibold text-text-secondary hover:border-text-secondary"
            title={themeMeta?.appearance === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          >
            {themeMeta?.appearance === 'dark' ? '☀ Light' : '🌙 Dark'}
          </button>
          <div className="flex-1" />
          {(['desktop', 'tablet', 'mobile'] as const).map((vp) => (
            <button
              key={vp}
              type="button"
              onClick={() => setViewport(vp)}
              className={`rounded-md px-2 py-1 text-[10px] font-semibold transition-colors ${
                viewport === vp
                  ? 'bg-action-primary text-action-primary-text'
                  : 'border border-border-subtle bg-surface-default text-text-secondary hover:border-text-secondary'
              }`}
            >
              {vp === 'desktop' ? '🖥' : vp === 'tablet' ? '📱' : '📲'} {vp.charAt(0).toUpperCase() + vp.slice(1)}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-border-subtle bg-surface-default p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">{t('themeadmin.preview.paletteTitle')}</span>
              <span className="text-[10px] text-text-subtle">{t('themeadmin.preview.paletteDescription')}</span>
            </div>
            <span className="text-[10px] font-semibold text-text-secondary">{selectedTheme?.name ?? '—'}</span>
          </div>
          <Segmented
            items={paletteThemeItems}
            value={selectedThemeId ?? ''}
            onValueChange={(nextValue) => onSelectTheme(nextValue as string)}
            ariaLabel={t('themeadmin.preview.paletteTitle')}
            variant={themePalettePreset.variant}
            shape={themePalettePreset.shape}
            size={themePalettePreset.size}
            iconPosition={themePalettePreset.iconPosition}
            className="mt-2 w-full border-0 bg-transparent p-0"
            classes={{
              root: 'border-0 bg-transparent p-0',
              list: 'w-full flex-wrap gap-2',
              item: 'border-border-subtle bg-transparent text-left shadow-none',
              activeItem: 'border-action-primary-border bg-transparent shadow-xs',
              content: 'w-full',
              label: 'w-full',
            }}
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] text-text-subtle">{t('themeadmin.preview.changesHint')}</span>
          <span className="text-[10px] font-semibold text-text-secondary">{selectedTheme?.name ?? '—'}</span>
        </div>

        <div
          ref={previewRef as React.LegacyRef<HTMLDivElement>}
          className="mx-auto overflow-hidden rounded-2xl border border-border-subtle bg-surface-page transition-all duration-300"
          style={{ ...previewStyle, maxWidth: viewportWidths[viewport] }}
          data-theme-scope
          data-theme={previewThemeAttr}
          data-accent={themeMeta?.axes.accent ?? selectedTheme?.axes?.accent}
          data-density={themeMeta?.axes.density ?? selectedTheme?.axes?.density}
          data-radius={themeMeta?.axes.radius ?? selectedTheme?.axes?.radius}
          data-elevation={themeMeta?.axes.elevation ?? selectedTheme?.axes?.elevation}
          data-motion={themeMeta?.axes.motion ?? selectedTheme?.axes?.motion}
          data-surface-tone={(themeMeta?.surfaceTone ?? selectedTheme?.surfaceTone) || undefined}
        >
          <div className="border-b border-border-subtle bg-surface-header px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-xl bg-accent-primary" aria-hidden />
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] font-semibold text-text-primary">{t('themeadmin.preview.shellTitle')}</span>
                  <span className="text-[10px] text-text-subtle">/admin/themes</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-flex items-center rounded-full bg-surface-panel px-2 py-1 text-[10px] font-semibold text-text-secondary">
                  {t('themeadmin.preview.notificationLabel')}
                </span>
                <span className="inline-flex items-center rounded-full bg-surface-panel px-2 py-1 text-[10px] font-semibold text-text-secondary">
                  {t('themeadmin.preview.profileLabel')}
                </span>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {shellNavLabels.map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center rounded-full border border-border-subtle bg-surface-panel px-2 py-1 text-[10px] font-semibold text-text-secondary"
                >
                  {label}
                </span>
              ))}
              <span className="inline-flex items-center rounded-full bg-accent-soft px-2 py-1 text-[10px] font-semibold text-accent-primary">
                {t('themeadmin.preview.nav.themes')}
              </span>
            </div>
          </div>

          <div className="p-3">
            <div className="grid gap-3">
              <div className="grid grid-cols-3 gap-2">
                {surfacePreviewCards.map((surface) => (
                  <div key={surface.label} className={`rounded-xl border border-border-subtle p-2 ${surface.className}`}>
                    <div className="text-[10px] font-semibold">{surface.label}</div>
                    <div className="mt-1 h-4 rounded-md border border-border-subtle bg-transparent" aria-hidden />
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-0.5">
                    <div className="text-[12px] font-semibold text-text-primary">{t('themeadmin.preview.themeCard.title')}</div>
                    <div className="text-[11px] text-text-secondary">{t('themeadmin.preview.themeCard.description')}</div>
                  </div>
                  <ThemePreviewCard selected={true} className="w-28 shrink-0" localeText={themePreviewCardLocaleText} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" className="inline-flex items-center rounded-md bg-accent-primary px-3 py-1.5 text-[11px] font-semibold text-text-inverse">
                    {t('themeadmin.preview.primaryButton')}
                  </button>
                  <button type="button" className="inline-flex items-center rounded-md bg-accent-primary-hover px-3 py-1.5 text-[11px] font-semibold text-text-inverse">
                    {t('themeadmin.preview.hoverButton')}
                  </button>
                  <button type="button" className="inline-flex items-center rounded-md border border-border-default bg-surface-default px-3 py-1.5 text-[11px] font-semibold text-text-primary">
                    {t('themeadmin.preview.secondaryButton')}
                  </button>
                  <span className="inline-flex items-center rounded-full bg-accent-soft px-2 py-1 text-[10px] font-semibold text-accent-primary">
                    {t('themeadmin.preview.accentSoft')}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-accent-focus px-2 py-1 text-[10px] font-semibold text-text-primary">
                    {t('themeadmin.preview.accentFocus')}
                  </span>
                </div>
                <div className="mt-3 grid gap-2">
                  <div className="rounded-xl border border-border-subtle bg-surface-default px-3 py-2">
                    <div className="text-[11px] font-semibold text-text-primary">{t('themeadmin.preview.headingLabel')}</div>
                    <div className="mt-1 text-[11px] text-text-secondary">{t('themeadmin.preview.secondaryTextExample')}</div>
                    <div className="mt-1 text-[11px] text-text-subtle">{t('themeadmin.preview.subtleTextExample')}</div>
                  </div>
                  <div className="rounded-xl border border-border-subtle bg-surface-default px-3 py-2">
                    <div className="text-[10px] font-semibold text-text-secondary">{t('themeadmin.preview.formFieldLabel')}</div>
                    <input
                      className="mt-1 h-8 w-full rounded-md border border-border-default bg-surface-default px-2 text-[11px] text-text-primary placeholder:text-text-subtle focus:outline-hidden focus:ring-2 focus:ring-[var(--accent-focus)] focus:ring-offset-1"
                      placeholder={t('themeadmin.preview.inputPlaceholder')}
                    />
                  </div>
                  <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface-default">
                    <div className="grid grid-cols-3 gap-2 border-b border-border-subtle bg-surface-muted px-3 py-2 text-[10px] font-semibold text-text-secondary">
                      <span>{t('themeadmin.preview.table.column')}</span>
                      <span>{t('themeadmin.preview.table.status')}</span>
                      <span className="text-right">{t('themeadmin.preview.table.amount')}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 border-b border-border-subtle px-3 py-2 text-[11px] text-text-primary">
                      <span>{t('themeadmin.preview.table.rowA')}</span>
                      <span className="text-text-secondary">{t('themeadmin.preview.table.active')}</span>
                      <span className="text-right font-semibold">1.234,56</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 px-3 py-2 text-[11px] text-text-primary">
                      <span>{t('themeadmin.preview.table.rowB')}</span>
                      <span className="text-text-secondary">{t('themeadmin.preview.table.pending')}</span>
                      <span className="text-right font-semibold">987,00</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
                <div className="text-[11px] font-semibold text-text-primary">{t('themeadmin.preview.surface.overlay')} (modal/backdrop)</div>
                <div className="relative mt-2 h-24 overflow-hidden rounded-xl border border-border-subtle bg-surface-default">
                  <div className="absolute inset-0 bg-surface-overlay opacity-70" aria-hidden />
                  <div className="absolute inset-0 flex items-center justify-center p-2">
                    <div className="w-full max-w-[260px] rounded-xl border border-border-subtle bg-surface-panel p-3 shadow-xs">
                      <div className="text-[11px] font-semibold text-text-primary">{t('themeadmin.preview.overlayTitle')}</div>
                      <div className="mt-1 text-[10px] text-text-secondary">{t('themeadmin.preview.overlayDescription')}</div>
                      <div className="mt-2 flex justify-end gap-2">
                        <span className="inline-flex items-center rounded-md border border-border-default bg-surface-default px-2 py-1 text-[10px] font-semibold text-text-primary">
                          {t('themeadmin.preview.cancel')}
                        </span>
                        <span className="inline-flex items-center rounded-md bg-accent-primary px-2 py-1 text-[10px] font-semibold text-text-inverse">
                          {t('themeadmin.preview.confirm')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col gap-0.5">
                    <div className="text-[11px] font-semibold text-text-primary">{t('themeadmin.preview.tokenSwatchesTitle')}</div>
                    <div className="text-[10px] text-text-subtle">{t('themeadmin.preview.tokenSwatchesDescription')}</div>
                  </div>
                  <span className="text-[10px] font-semibold text-text-secondary">{t('themeadmin.preview.overrideCount', { count: Object.keys(overrides).length })}</span>
                </div>
                <div className="mt-2 flex flex-col gap-2">
                  {rowsByGroup.map((group) => (
                    <details key={group.id} open className="rounded-xl border border-border-subtle bg-surface-default px-2 py-2">
                      <summary className="cursor-pointer select-none text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                        {group.id}
                      </summary>
                      <div className="mt-2 flex flex-col gap-1">
                        {group.rows.map((row) => {
                          const cssVars = Array.isArray(row.cssVars) ? row.cssVars : [];
                          const isOverridden = Boolean(row.value?.trim());
                          const resolvedValue = cssVars.length > 0 ? resolvedPreviewDisplayCssVars[cssVars[0]] : '';
                          return (
                            <div
                              key={row.id}
                              className={`flex items-center justify-between gap-2 rounded-lg border px-2 py-2 ${
                                isOverridden ? 'border-accent-primary bg-accent-soft' : 'border-border-subtle bg-surface-panel'
                              }`}
                            >
                              <div className="flex min-w-0 items-center gap-2">
                                <div className="flex items-center gap-1">
                                  {cssVars.length > 0
                                    ? cssVars.map((cssVar) => renderCssVarSwatch(group.id, cssVar))
                                    : <div className="h-7 w-7 rounded-md border border-border-subtle bg-surface-default" />}
                                </div>
                                <div className="min-w-0">
                                  <div className="truncate text-[11px] font-semibold text-text-primary">{row.label}</div>
                                  <div className="truncate text-[10px] text-text-subtle">{row.key}</div>
                                  {cssVars.length > 1 ? (
                                    <div className="truncate text-[10px] text-text-subtle">{cssVars.join(', ')}</div>
                                  ) : null}
                                </div>
                              </div>
                              <span className="shrink-0 font-mono text-[10px] text-text-secondary">
                                {resolvedValue || row.value?.trim() || '—'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </details>
  </aside>
  );
};

export default ThemeAdminPreviewPanel;
