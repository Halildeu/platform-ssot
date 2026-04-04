import React, { useCallback } from 'react';
import { updateThemeAxes } from '@mfe/design-system';
import type { ThemeOption, ThemeAdminTranslator } from '../ThemeAdminPage.shared';
import type { UseThemeAdminReturn } from './useThemeAdmin';
import ThemeDrawerTabs from './ThemeDrawerTabs';

type ThemeDrawerPanelProps = {
  admin: UseThemeAdminReturn;
};

/* ------------------------------------------------------------------ */
/*  Critical Controls — always visible above tabs                      */
/* ------------------------------------------------------------------ */

const ModeToggle: React.FC<{
  t: ThemeAdminTranslator;
  appearance: string;
  onToggle: () => void;
}> = ({ t, appearance, onToggle }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-semibold uppercase tracking-wide text-text-subtle">
      {t('themeadmin.meta.appearance')}
    </span>
    <div className="flex gap-1">
      {(['light', 'dark'] as const).map((mode) => (
        <button
          key={mode}
          type="button"
          onClick={mode !== appearance ? onToggle : undefined}
          className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
            appearance === mode
              ? 'bg-action-primary text-action-primary-text shadow-xs'
              : 'bg-surface-muted text-text-secondary hover:bg-surface-default'
          }`}
        >
          {mode === 'light' ? '☀️' : '🌙'} {mode === 'light' ? 'Light' : 'Dark'}
        </button>
      ))}
    </div>
  </div>
);

const AccentGrid: React.FC<{
  t: ThemeAdminTranslator;
  options: ThemeOption[];
  selected: string;
  onSelect: (value: string) => void;
}> = ({ t, options, selected, onSelect }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-semibold uppercase tracking-wide text-text-subtle">
      {t('themeadmin.meta.accent')}
    </span>
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const isSelected = selected === option.value;
        return (
          <button
            key={option.value}
            type="button"
            title={option.label}
            onClick={() => onSelect(option.value)}
            className={`flex h-8 items-center gap-1.5 rounded-lg border px-2 text-[10px] font-semibold transition-all ${
              isSelected
                ? 'border-action-primary bg-action-primary/10 text-action-primary ring-1 ring-action-primary'
                : 'border-border-subtle bg-surface-default text-text-secondary hover:border-text-secondary'
            }`}
          >
            <span
              className="inline-block h-3.5 w-3.5 rounded-full border border-black/10"
              style={{ backgroundColor: `var(--color-accent-${option.value}, var(--color-action-primary))` }}
            />
            {option.label}
          </button>
        );
      })}
    </div>
  </div>
);

const DensityToggle: React.FC<{
  t: ThemeAdminTranslator;
  selected: string;
  onSelect: (value: string) => void;
}> = ({ t, selected, onSelect }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-semibold uppercase tracking-wide text-text-subtle">
      {t('themeadmin.meta.density')}
    </span>
    <div className="flex gap-1">
      {[
        { value: 'comfortable', label: 'Comfortable', gap: 'gap-1.5' },
        { value: 'compact', label: 'Compact', gap: 'gap-0.5' },
      ].map((item) => {
        const isSelected = selected === item.value;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onSelect(item.value)}
            className={`flex flex-1 flex-col items-center rounded-lg border p-2 transition-all ${
              isSelected
                ? 'border-action-primary bg-action-primary/10 ring-1 ring-action-primary'
                : 'border-border-subtle bg-surface-default hover:border-text-secondary'
            }`}
          >
            <div className={`flex w-full flex-col ${item.gap}`}>
              <div className="h-1 w-full rounded-full bg-text-subtle/30" />
              <div className="h-1 w-3/4 rounded-full bg-text-subtle/30" />
              <div className="h-1 w-full rounded-full bg-text-subtle/30" />
            </div>
            <span className="mt-1 text-[9px] font-semibold text-text-secondary">{item.label}</span>
          </button>
        );
      })}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Main Panel                                                         */
/* ------------------------------------------------------------------ */

const ThemeDrawerPanel: React.FC<ThemeDrawerPanelProps> = ({ admin }) => {
  const { t } = admin;
  /* --- live context bridge: updateThemeAxes directly patches DOM + CSS vars --- */
  const handleAccentChange = useCallback((value: string) => {
    admin.setThemeMeta((prev) => (prev ? { ...prev, axes: { ...prev.axes, accent: value } } : prev));
    updateThemeAxes({ accent: value });
  }, [admin]);

  const handleModeToggle = useCallback(() => {
    const next = admin.themeMeta?.appearance === 'dark' ? 'light' : 'dark';
    admin.toggleAppearance();
    updateThemeAxes({ appearance: next });
  }, [admin]);

  const handleDensityChange = useCallback((value: string) => {
    admin.setThemeMeta((prev) => (prev ? { ...prev, axes: { ...prev.axes, density: value } } : prev));
    updateThemeAxes({ density: value });
  }, [admin]);

  return (
    <div className="flex h-full flex-col">
      {/* Critical controls — always visible */}
      <div className="flex flex-col gap-3 border-b border-border-subtle px-4 pb-4">
        <ModeToggle
          t={t}
          appearance={admin.themeMeta?.appearance ?? 'light'}
          onToggle={handleModeToggle}
        />
        <AccentGrid
          t={t}
          options={admin.accentOptions}
          selected={admin.themeMeta?.axes.accent ?? 'neutral'}
          onSelect={handleAccentChange}
        />
        <DensityToggle
          t={t}
          selected={admin.themeMeta?.axes.density ?? 'comfortable'}
          onSelect={handleDensityChange}
        />
      </div>

      {/* Tabs — scrollable content */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <ThemeDrawerTabs admin={admin} />
      </div>

      {/* Footer — always visible */}
      <div className="flex items-center gap-2 border-t border-border-subtle px-4 py-3">
        {admin.isDirty ? (
          <span className="rounded-full bg-status-warning px-2 py-0.5 text-[10px] font-semibold text-status-warning-text">
            ●
          </span>
        ) : null}
        <button
          type="button"
          title="Undo (Cmd+Z)"
          className="rounded-md border border-border-subtle bg-surface-default px-2 py-1 text-[11px] font-semibold text-text-secondary hover:border-text-secondary disabled:cursor-not-allowed disabled:text-text-subtle"
          onClick={admin.undo}
          disabled={!admin.canUndo}
        >
          ↩
        </button>
        <button
          type="button"
          title="Redo (Cmd+Shift+Z)"
          className="rounded-md border border-border-subtle bg-surface-default px-2 py-1 text-[11px] font-semibold text-text-secondary hover:border-text-secondary disabled:cursor-not-allowed disabled:text-text-subtle"
          onClick={admin.redo}
          disabled={!admin.canRedo}
        >
          ↪
        </button>
        <div className="flex-1" />
        <button
          type="button"
          className="inline-flex items-center rounded-md border border-action-primary-border bg-action-primary px-4 py-1.5 text-xs font-semibold text-action-primary-text hover:opacity-90 disabled:cursor-not-allowed disabled:border-border-subtle disabled:bg-surface-muted disabled:text-text-subtle"
          onClick={() => void admin.handleSave()}
          disabled={admin.saving || !admin.selectedThemeId || !admin.themeMeta}
        >
          {admin.saving ? '...' : t('themeadmin.selection.save')}
        </button>
      </div>
    </div>
  );
};

export default ThemeDrawerPanel;
