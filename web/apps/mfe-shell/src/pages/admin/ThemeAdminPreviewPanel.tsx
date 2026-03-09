import React from 'react';
import { ThemePreviewCard } from 'mfe-ui-kit';

import { resolveThemeAttr, type ThemeAdminRow, type ThemeDetails, type ThemeMetaState, type ThemeSummary } from './ThemeAdminPage.shared';

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
};

const surfacePreviewCards = [
  { label: 'Default', className: 'bg-surface-default text-text-primary' },
  { label: 'Raised', className: 'bg-surface-raised text-text-primary' },
  { label: 'Muted', className: 'bg-surface-muted text-text-primary' },
  { label: 'Panel', className: 'bg-surface-panel text-text-primary' },
  { label: 'Header', className: 'bg-surface-header text-text-primary' },
  { label: 'Overlay', className: 'bg-surface-overlay text-text-inverse' },
];

const shellNavLabels = ['Ana Sayfa', 'Öneriler', 'Etik', 'Erişim', 'Denetim'];

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
}) => (
  <aside className="self-start overflow-auto lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)]">
    <details open data-theme-preview className="rounded-2xl border border-border-subtle bg-surface-panel px-3 py-2">
      <summary className="cursor-pointer select-none text-xs font-semibold uppercase tracking-wide text-text-secondary">
        Önizleme
      </summary>
      <div className="mt-3 flex flex-col gap-4">
        <div className="rounded-2xl border border-border-subtle bg-surface-default p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">Tema paleti</span>
              <span className="text-[10px] text-text-subtle">Seçip düzenleyin.</span>
            </div>
            <span className="text-[10px] font-semibold text-text-secondary">{selectedTheme?.name ?? '—'}</span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2" role="list">
            {paletteThemes.map((theme) => {
              const isActive = theme.id === selectedThemeId;
              const label = theme.name.replace(/^Global\s+/i, '');
              return (
                <button
                  key={theme.id}
                  type="button"
                  role="listitem"
                  aria-pressed={isActive}
                  onClick={() => onSelectTheme(theme.id)}
                  className={`rounded-2xl border p-2 transition focus:outline-none focus:ring-2 focus:ring-selection-outline focus:ring-offset-1 ${
                    isActive ? 'border-action-primary-border shadow-sm' : 'border-border-subtle hover:border-text-secondary'
                  }`}
                  title={theme.name}
                >
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
                    <ThemePreviewCard selected={isActive} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] text-text-subtle">Değişiklikler yalnız bu alanda anlık uygulanır.</span>
          <span className="text-[10px] font-semibold text-text-secondary">{selectedTheme?.name ?? '—'}</span>
        </div>

        <div
          ref={previewRef}
          className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-page"
          data-theme-scope
          data-theme={previewThemeAttr}
          data-accent={themeMeta?.axes.accent ?? selectedTheme?.axes?.accent}
          data-density={themeMeta?.axes.density ?? selectedTheme?.axes?.density}
          data-radius={themeMeta?.axes.radius ?? selectedTheme?.axes?.radius}
          data-elevation={themeMeta?.axes.elevation ?? selectedTheme?.axes?.elevation}
          data-motion={themeMeta?.axes.motion ?? selectedTheme?.axes?.motion}
          data-surface-tone={(themeMeta?.surfaceTone ?? selectedTheme?.surfaceTone) || undefined}
          style={previewStyle}
        >
          <div className="border-b border-border-subtle bg-surface-header px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-xl bg-accent-primary" aria-hidden />
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] font-semibold text-text-primary">Shell</span>
                  <span className="text-[10px] text-text-subtle">/admin/themes</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-flex items-center rounded-full bg-surface-panel px-2 py-1 text-[10px] font-semibold text-text-secondary">
                  Bildirim
                </span>
                <span className="inline-flex items-center rounded-full bg-surface-panel px-2 py-1 text-[10px] font-semibold text-text-secondary">
                  Profil
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
                shell.nav.themes
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
                    <div className="text-[12px] font-semibold text-text-primary">Tema önizleme</div>
                    <div className="text-[11px] text-text-secondary">Metin, border, accent ve overlay örnekleri</div>
                  </div>
                  <ThemePreviewCard selected className="w-28 shrink-0" />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" className="inline-flex items-center rounded-md bg-accent-primary px-3 py-1.5 text-[11px] font-semibold text-text-inverse">
                    Primary
                  </button>
                  <button type="button" className="inline-flex items-center rounded-md bg-accent-primary-hover px-3 py-1.5 text-[11px] font-semibold text-text-inverse">
                    Hover
                  </button>
                  <button type="button" className="inline-flex items-center rounded-md border border-border-default bg-surface-default px-3 py-1.5 text-[11px] font-semibold text-text-primary">
                    Secondary
                  </button>
                  <span className="inline-flex items-center rounded-full bg-accent-soft px-2 py-1 text-[10px] font-semibold text-accent-primary">
                    Accent soft
                  </span>
                  <span className="inline-flex items-center rounded-full bg-accent-focus px-2 py-1 text-[10px] font-semibold text-text-primary">
                    Accent focus
                  </span>
                </div>
                <div className="mt-3 grid gap-2">
                  <div className="rounded-xl border border-border-subtle bg-surface-default px-3 py-2">
                    <div className="text-[11px] font-semibold text-text-primary">Başlık</div>
                    <div className="mt-1 text-[11px] text-text-secondary">İkincil metin ve açıklama örneği</div>
                    <div className="mt-1 text-[11px] text-text-subtle">Subtle metin örneği</div>
                  </div>
                  <div className="rounded-xl border border-border-subtle bg-surface-default px-3 py-2">
                    <div className="text-[10px] font-semibold text-text-secondary">Form alanı</div>
                    <input
                      className="mt-1 h-8 w-full rounded-md border border-border-default bg-surface-default px-2 text-[11px] text-text-primary placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-[var(--accent-focus)] focus:ring-offset-1"
                      placeholder="Input placeholder"
                    />
                  </div>
                  <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface-default">
                    <div className="grid grid-cols-3 gap-2 border-b border-border-subtle bg-surface-muted px-3 py-2 text-[10px] font-semibold text-text-secondary">
                      <span>Kolon</span>
                      <span>Durum</span>
                      <span className="text-right">Tutar</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 border-b border-border-subtle px-3 py-2 text-[11px] text-text-primary">
                      <span>Satır A</span>
                      <span className="text-text-secondary">Aktif</span>
                      <span className="text-right font-semibold">1.234,56</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 px-3 py-2 text-[11px] text-text-primary">
                      <span>Satır B</span>
                      <span className="text-text-secondary">Beklemede</span>
                      <span className="text-right font-semibold">987,00</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
                <div className="text-[11px] font-semibold text-text-primary">Overlay (modal/backdrop)</div>
                <div className="relative mt-2 h-24 overflow-hidden rounded-xl border border-border-subtle bg-surface-default">
                  <div className="absolute inset-0 bg-surface-overlay opacity-70" aria-hidden />
                  <div className="absolute inset-0 flex items-center justify-center p-2">
                    <div className="w-full max-w-[260px] rounded-xl border border-border-subtle bg-surface-panel p-3 shadow-sm">
                      <div className="text-[11px] font-semibold text-text-primary">Modal başlığı</div>
                      <div className="mt-1 text-[10px] text-text-secondary">Overlay arka planı ve panel yüzeyi örneği</div>
                      <div className="mt-2 flex justify-end gap-2">
                        <span className="inline-flex items-center rounded-md border border-border-default bg-surface-default px-2 py-1 text-[10px] font-semibold text-text-primary">
                          İptal
                        </span>
                        <span className="inline-flex items-center rounded-md bg-accent-primary px-2 py-1 text-[10px] font-semibold text-text-inverse">
                          Onayla
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border-subtle bg-surface-panel p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col gap-0.5">
                    <div className="text-[11px] font-semibold text-text-primary">Token swatch’leri</div>
                    <div className="text-[10px] text-text-subtle">Registry alanlarının tamamı (override varsa vurgulu).</div>
                  </div>
                  <span className="text-[10px] font-semibold text-text-secondary">{Object.keys(overrides).length} override</span>
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

export default ThemeAdminPreviewPanel;
