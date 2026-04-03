import React from 'react';
import type { ThemeSummary, ThemeAdminTranslator } from '../ThemeAdminPage.shared';

type ThemePaletteSelectorProps = {
  t: ThemeAdminTranslator;
  themes: ThemeSummary[];
  paletteDraft: Record<string, boolean>;
  onPaletteDraftChange: (id: string, checked: boolean) => void;
  paletteDirty: boolean;
  paletteSaving: boolean;
  paletteSelectedCount: number;
  paletteError: string | null;
  paletteSuccess: string | null;
  onSave: () => void;
};

const ThemePaletteSelector: React.FC<ThemePaletteSelectorProps> = ({
  t,
  themes,
  paletteDraft,
  onPaletteDraftChange,
  paletteDirty,
  paletteSaving,
  paletteSelectedCount,
  paletteError,
  paletteSuccess,
  onSave,
}) => (
  <div className="rounded-2xl border border-border-subtle bg-surface-panel px-3 py-3">
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-semibold text-text-secondary">{t('themeadmin.palette.title')}</span>
        <span className="text-[11px] text-text-subtle">
          {t('themeadmin.palette.description', {
            selectedCount: paletteSelectedCount,
            totalCount: themes.length,
          })}
        </span>
      </div>
      <button
        type="button"
        className="inline-flex items-center rounded-full border border-border-subtle bg-surface-default px-3 py-1 text-[11px] font-semibold text-text-secondary hover:border-text-secondary disabled:cursor-not-allowed disabled:text-text-subtle"
        onClick={onSave}
        disabled={paletteSaving || !paletteDirty}
      >
        {paletteSaving ? t('themeadmin.palette.saving') : t('themeadmin.palette.save')}
      </button>
    </div>
    {paletteError ? (
      <div className="mt-2 rounded-xl border border-status-danger-border bg-status-danger px-3 py-2 text-[11px] font-semibold text-status-danger-text">
        {paletteError}
      </div>
    ) : null}
    {paletteSuccess ? (
      <div className="mt-2 text-[11px] text-status-success-text">{paletteSuccess}</div>
    ) : null}
    <div className="mt-2 grid gap-2 sm:grid-cols-2">
      {themes.map((theme) => {
        const label = theme.name.replace(/^Global\s+/i, '');
        const checked = Boolean(paletteDraft[theme.id]);
        return (
          <label
            key={theme.id}
            className="flex items-center gap-2 rounded-xl border border-border-subtle bg-surface-default px-2 py-2 text-[11px]"
          >
            <input
              type="checkbox"
              className="h-4 w-4 accent-action-primary"
              checked={checked}
              onChange={(event) => onPaletteDraftChange(theme.id, event.target.checked)}
            />
            <span className="font-semibold text-text-primary">{label}</span>
          </label>
        );
      })}
    </div>
  </div>
);

export default ThemePaletteSelector;
