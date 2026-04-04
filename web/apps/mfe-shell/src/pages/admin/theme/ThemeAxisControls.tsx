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

        {/* Accent swatch grid (Phase 5) */}
        <div className="text-[11px] font-semibold text-text-secondary">
          {t('themeadmin.meta.accent')}
          <div className="mt-1 flex flex-wrap gap-1.5">
            {accentOptions.map((option) => {
              const isSelected = themeMeta?.axes.accent === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={disabled}
                  title={option.label}
                  onClick={() => updateAxis('accent', option.value)}
                  className={`flex h-8 items-center gap-1.5 rounded-lg border px-2 text-[10px] font-semibold transition-all ${
                    isSelected
                      ? 'border-action-primary bg-action-primary/10 text-action-primary ring-1 ring-action-primary'
                      : 'border-border-subtle bg-surface-default text-text-secondary hover:border-text-secondary'
                  } disabled:cursor-not-allowed disabled:opacity-50`}
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

        {/* Surface tone visual grid (Phase 5) */}
        <div className="col-span-full text-[11px] font-semibold text-text-secondary">
          {t('themeadmin.meta.surfaceTone')}
          <div className="mt-1 flex flex-wrap gap-1">
            <button
              type="button"
              disabled={disabled}
              onClick={() => onThemeMetaChange((prev) => (prev ? { ...prev, surfaceTone: null } : prev))}
              className={`rounded-md border px-2 py-1 text-[10px] font-semibold transition-colors ${
                !themeMeta?.surfaceTone
                  ? 'border-action-primary bg-action-primary/10 text-action-primary ring-1 ring-action-primary'
                  : 'border-border-subtle bg-surface-default text-text-secondary hover:border-text-secondary'
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {t('themeadmin.meta.surfaceTone.default')}
            </button>
            {['ultra', 'mid', 'deep'].map((band) => (
              <React.Fragment key={band}>
                {Array.from({ length: 6 }, (_, i) => {
                  const tone = `${band}-${i + 1}`;
                  const isSelected = themeMeta?.surfaceTone === tone;
                  return (
                    <button
                      key={tone}
                      type="button"
                      disabled={disabled}
                      title={tone}
                      onClick={() => onThemeMetaChange((prev) => (prev ? { ...prev, surfaceTone: tone } : prev))}
                      className={`h-7 w-7 rounded-md border text-[8px] font-bold transition-colors ${
                        isSelected
                          ? 'border-action-primary ring-1 ring-action-primary'
                          : 'border-border-subtle hover:border-text-secondary'
                      } disabled:cursor-not-allowed disabled:opacity-50`}
                      style={{
                        backgroundColor: band === 'ultra' ? `hsl(0 0% ${95 - i * 3}%)` : band === 'mid' ? `hsl(0 0% ${75 - i * 5}%)` : `hsl(0 0% ${50 - i * 6}%)`,
                        color: (band === 'deep') || (band === 'mid' && i > 3) ? '#fff' : '#333',
                      }}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Density with mini preview (Phase 5) */}
        <div className="text-[11px] font-semibold text-text-secondary">
          {t('themeadmin.meta.density')}
          <div className="mt-1 flex gap-2">
            {densitySegmentedItems.map((item) => {
              const isSelected = themeMeta?.axes.density === item.value;
              const gap = item.value === 'compact' ? 'gap-0.5' : 'gap-1.5';
              return (
                <button
                  key={item.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => updateAxis('density', item.value)}
                  className={`flex flex-1 flex-col items-center rounded-lg border p-2 transition-colors ${
                    isSelected
                      ? 'border-action-primary bg-action-primary/10 ring-1 ring-action-primary'
                      : 'border-border-subtle bg-surface-default hover:border-text-secondary'
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  <div className={`flex w-full flex-col ${gap}`}>
                    <div className="h-1 w-full rounded-full bg-text-subtle/30" />
                    <div className="h-1 w-3/4 rounded-full bg-text-subtle/30" />
                    <div className="h-1 w-full rounded-full bg-text-subtle/30" />
                  </div>
                  <span className="mt-1 text-[9px]">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Radius with visual corner preview (Phase 5) */}
        <div className="text-[11px] font-semibold text-text-secondary">
          {t('themeadmin.meta.radius')}
          <div className="mt-1 flex gap-2">
            {radiusSegmentedItems.map((item) => {
              const isSelected = themeMeta?.axes.radius === item.value;
              const radius = item.value === 'sharp' ? '2px' : '8px';
              return (
                <button
                  key={item.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => updateAxis('radius', item.value)}
                  className={`flex flex-1 flex-col items-center rounded-lg border p-2 transition-colors ${
                    isSelected
                      ? 'border-action-primary bg-action-primary/10 ring-1 ring-action-primary'
                      : 'border-border-subtle bg-surface-default hover:border-text-secondary'
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  <div className="h-8 w-full border-2 border-text-subtle/40" style={{ borderRadius: radius }} />
                  <span className="mt-1 text-[9px]">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Elevation with shadow preview (Phase 5) */}
        <div className="text-[11px] font-semibold text-text-secondary">
          {t('themeadmin.meta.elevation')}
          <div className="mt-1 flex gap-2">
            {elevationSegmentedItems.map((item) => {
              const isSelected = themeMeta?.axes.elevation === item.value;
              const shadow = item.value === 'raised' ? '0 2px 8px rgba(0,0,0,0.12)' : 'none';
              return (
                <button
                  key={item.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => updateAxis('elevation', item.value)}
                  className={`flex flex-1 flex-col items-center rounded-lg border p-2 transition-colors ${
                    isSelected
                      ? 'border-action-primary bg-action-primary/10 ring-1 ring-action-primary'
                      : 'border-border-subtle bg-surface-default hover:border-text-secondary'
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  <div className="h-8 w-full rounded-md bg-surface-panel" style={{ boxShadow: shadow }} />
                  <span className="mt-1 text-[9px]">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Motion with speed label (Phase 5) */}
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
