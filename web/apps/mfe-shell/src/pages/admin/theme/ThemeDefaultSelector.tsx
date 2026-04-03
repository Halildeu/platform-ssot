import React from 'react';
import type { ThemeSummary, ThemeAdminTranslator } from '../ThemeAdminPage.shared';

type ThemeDefaultSelectorProps = {
  t: ThemeAdminTranslator;
  themes: ThemeSummary[];
  defaultThemeId: string | null;
  onDefaultThemeIdChange: (id: string | null) => void;
  defaultThemeDirty: boolean;
  defaultThemeSaving: boolean;
  defaultThemeError: string | null;
  defaultThemeSuccess: string | null;
  onSave: () => void;
};

const ThemeDefaultSelector: React.FC<ThemeDefaultSelectorProps> = ({
  t,
  themes,
  defaultThemeId,
  onDefaultThemeIdChange,
  defaultThemeDirty,
  defaultThemeSaving,
  defaultThemeError,
  defaultThemeSuccess,
  onSave,
}) => (
  <div className="rounded-2xl border border-border-subtle bg-surface-panel px-3 py-3">
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-semibold text-text-secondary">{t('themeadmin.defaultTheme.title')}</span>
        <span className="text-[11px] text-text-subtle">{t('themeadmin.defaultTheme.description')}</span>
      </div>
      <button
        type="button"
        className="inline-flex items-center rounded-full border border-border-subtle bg-surface-default px-3 py-1 text-[11px] font-semibold text-text-secondary hover:border-text-secondary disabled:cursor-not-allowed disabled:text-text-subtle"
        onClick={onSave}
        disabled={defaultThemeSaving || !defaultThemeDirty || !defaultThemeId}
      >
        {defaultThemeSaving ? t('themeadmin.defaultTheme.saving') : t('themeadmin.defaultTheme.save')}
      </button>
    </div>
    <select
      className="mt-2 h-9 w-full rounded-md border border-border-subtle bg-surface-default px-2 text-xs font-semibold text-text-primary focus:outline-hidden focus:ring-2 focus:ring-selection-outline focus:ring-offset-1"
      value={defaultThemeId ?? ''}
      onChange={(event) => onDefaultThemeIdChange(event.target.value || null)}
    >
      {themes.map((theme) => {
        const label = theme.name.replace(/^Global\s+/i, '');
        return (
          <option key={theme.id} value={theme.id}>
            {label}
          </option>
        );
      })}
    </select>
    {defaultThemeError ? (
      <div className="mt-2 rounded-xl border border-status-danger-border bg-status-danger px-3 py-2 text-[11px] font-semibold text-status-danger-text">
        {defaultThemeError}
      </div>
    ) : null}
    {defaultThemeSuccess ? (
      <div className="mt-2 text-[11px] text-status-success-text">{defaultThemeSuccess}</div>
    ) : null}
  </div>
);

export default ThemeDefaultSelector;
