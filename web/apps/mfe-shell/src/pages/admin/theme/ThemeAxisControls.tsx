import React from 'react';
import { Segmented } from '@mfe/design-system';
import type { ThemeMetaState, ThemeOption, ThemeAdminTranslator } from '../ThemeAdminPage.shared';

type SegmentedItem = { value: string; label: string; dataTestId: string };

type ThemeAxisControlsProps = {
  t: ThemeAdminTranslator;
  themeMeta: ThemeMetaState | null;
  onThemeMetaChange: (updater: (prev: ThemeMetaState | null) => ThemeMetaState | null) => void;
  accentOptions: ThemeOption[];
  surfaceToneOptions: string[];
  themeAxisSegmentedPreset: {
    variant?: 'default' | 'outline' | 'ghost';
    shape?: 'rounded' | 'pill';
    size: 'sm';
    iconPosition?: 'start' | 'end' | 'top';
    fullWidth: boolean;
  };
  densitySegmentedItems: SegmentedItem[];
  radiusSegmentedItems: SegmentedItem[];
  elevationSegmentedItems: SegmentedItem[];
  motionSegmentedItems: SegmentedItem[];
};

const AxisSegmented: React.FC<{
  label: string;
  items: SegmentedItem[];
  value: string;
  disabled: boolean;
  preset: ThemeAxisControlsProps['themeAxisSegmentedPreset'];
  onChange: (value: string) => void;
}> = ({ label, items, value, disabled, preset, onChange }) => (
  <div className="text-[11px] font-semibold text-text-secondary">
    {label}
    <Segmented
      items={items}
      value={value}
      access={disabled ? 'disabled' : 'full'}
      ariaLabel={label}
      onValueChange={(v) => onChange(v as string)}
      variant={preset.variant}
      shape={preset.shape}
      size={preset.size}
      iconPosition={preset.iconPosition}
      fullWidth={preset.fullWidth}
      className="mt-1 w-full"
      classes={{ list: 'w-full', item: 'min-w-0 flex-1', content: 'w-full' }}
    />
  </div>
);

const ThemeAxisControls: React.FC<ThemeAxisControlsProps> = ({
  t,
  themeMeta,
  onThemeMetaChange,
  accentOptions,
  surfaceToneOptions,
  themeAxisSegmentedPreset,
  densitySegmentedItems,
  radiusSegmentedItems,
  elevationSegmentedItems,
  motionSegmentedItems,
}) => {
  const disabled = !themeMeta;

  const updateAxis = (axis: keyof ThemeMetaState['axes'], value: string) => {
    onThemeMetaChange((prev) => (prev ? { ...prev, axes: { ...prev.axes, [axis]: value } } : prev));
  };

  return (
    <details open className="rounded-2xl border border-border-subtle bg-surface-panel px-3 py-2">
      <summary className="cursor-pointer select-none text-xs font-semibold uppercase tracking-wide text-text-secondary">
        {t('themeadmin.meta.title')}
      </summary>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {/* Appearance (read-only display) */}
        <div className="text-[11px] font-semibold text-text-secondary">
          {t('themeadmin.meta.appearance')}
          <div className="mt-1 flex h-8 items-center rounded-md border border-border-subtle bg-surface-muted px-2 text-[11px] text-text-primary">
            {themeMeta?.appearance ? themeMeta.appearance : '—'}
          </div>
        </div>

        {/* Accent dropdown */}
        <label className="text-[11px] font-semibold text-text-secondary">
          {t('themeadmin.meta.accent')}
          <select
            className="mt-1 h-8 w-full rounded-md border border-border-subtle bg-surface-default px-2 text-[11px] text-text-primary focus:outline-hidden focus:ring-2 focus:ring-selection-outline focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-subtle"
            value={themeMeta?.axes.accent ?? ''}
            disabled={disabled}
            onChange={(event) => updateAxis('accent', event.target.value)}
          >
            {accentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        {/* Surface tone dropdown */}
        <label className="text-[11px] font-semibold text-text-secondary">
          {t('themeadmin.meta.surfaceTone')}
          <select
            className="mt-1 h-8 w-full rounded-md border border-border-subtle bg-surface-default px-2 text-[11px] text-text-primary focus:outline-hidden focus:ring-2 focus:ring-selection-outline focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-subtle"
            value={themeMeta?.surfaceTone ?? ''}
            disabled={disabled}
            onChange={(event) => {
              const next = event.target.value;
              onThemeMetaChange((prev) => (prev ? { ...prev, surfaceTone: next || null } : prev));
            }}
          >
            <option value="">{t('themeadmin.meta.surfaceTone.default')}</option>
            {surfaceToneOptions.map((tone) => (
              <option key={tone} value={tone}>
                {tone}
              </option>
            ))}
          </select>
        </label>

        {/* Density */}
        <AxisSegmented
          label={t('themeadmin.meta.density')}
          items={densitySegmentedItems}
          value={themeMeta?.axes.density ?? ''}
          disabled={disabled}
          preset={themeAxisSegmentedPreset}
          onChange={(v) => updateAxis('density', v)}
        />

        {/* Radius */}
        <AxisSegmented
          label={t('themeadmin.meta.radius')}
          items={radiusSegmentedItems}
          value={themeMeta?.axes.radius ?? ''}
          disabled={disabled}
          preset={themeAxisSegmentedPreset}
          onChange={(v) => updateAxis('radius', v)}
        />

        {/* Elevation */}
        <AxisSegmented
          label={t('themeadmin.meta.elevation')}
          items={elevationSegmentedItems}
          value={themeMeta?.axes.elevation ?? ''}
          disabled={disabled}
          preset={themeAxisSegmentedPreset}
          onChange={(v) => updateAxis('elevation', v)}
        />

        {/* Motion */}
        <AxisSegmented
          label={t('themeadmin.meta.motion')}
          items={motionSegmentedItems}
          value={themeMeta?.axes.motion ?? ''}
          disabled={disabled}
          preset={themeAxisSegmentedPreset}
          onChange={(v) => updateAxis('motion', v)}
        />
      </div>
      <div className="mt-2 text-[10px] text-text-subtle">
        {t('themeadmin.meta.previewHint')}
      </div>
    </details>
  );
};

export default ThemeAxisControls;
