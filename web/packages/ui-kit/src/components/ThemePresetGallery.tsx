import React from 'react';
import { Badge } from './Badge';
import { Empty } from './Empty';
import { Text } from './Text';
import { ThemePreviewCard } from './theme/ThemePreviewCard';
import {
  resolveAccessState,
  withAccessGuard,
  type AccessControlledProps,
  type AccessLevel,
} from '../runtime/access-controller';

export interface ThemePresetGalleryItem {
  presetId: string;
  label: React.ReactNode;
  themeMode?: React.ReactNode;
  appearance?: React.ReactNode;
  density?: React.ReactNode;
  intent?: React.ReactNode;
  isHighContrast?: boolean;
  isDefaultMode?: boolean;
  badges?: React.ReactNode[];
}

export interface ThemePresetGalleryProps extends AccessControlledProps {
  presets: ThemePresetGalleryItem[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  compareAxes?: React.ReactNode[];
  selectedPresetId?: string | null;
  defaultSelectedPresetId?: string | null;
  onSelectPreset?: (presetId: string, preset: ThemePresetGalleryItem) => void;
  className?: string;
}

export const ThemePresetGallery: React.FC<ThemePresetGalleryProps> = ({
  presets,
  title = 'Theme preset gallery',
  description = 'Resmi preset ailesi docs, runtime ve release diliyle ayni preset kimlikleri uzerinden okunur.',
  compareAxes = [],
  selectedPresetId,
  defaultSelectedPresetId = null,
  onSelectPreset,
  className = '',
  access = 'full',
  accessReason,
}) => {
  const accessState = resolveAccessState(access);
  const [internalSelectedPresetId, setInternalSelectedPresetId] = React.useState<string | null>(
    defaultSelectedPresetId ?? presets[0]?.presetId ?? null,
  );

  if (accessState.isHidden) {
    return null;
  }

  const currentSelectedPresetId = selectedPresetId ?? internalSelectedPresetId;
  const interactionState: AccessLevel = accessState.isDisabled
    ? 'disabled'
    : accessState.isReadonly
      ? 'readonly'
      : accessState.state;

  return (
    <section
      className={`rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm ${className}`.trim()}
      data-access-state={accessState.state}
      data-component="theme-preset-gallery"
      title={accessReason}
    >
      <Text as="div" className="text-base font-semibold text-text-primary">
        {title}
      </Text>
      <Text variant="secondary" className="mt-1 block text-sm leading-6">
        {description}
      </Text>

      {compareAxes.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {compareAxes.map((axis, index) => (
            <Badge key={`theme-axis-${index}`} tone="muted">
              {axis}
            </Badge>
          ))}
        </div>
      ) : null}

      {presets.length === 0 ? (
        <div className="mt-4 rounded-[24px] border border-border-subtle bg-surface-default p-4">
          <Empty description="Theme preset bulunamadi." />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
          {presets.map((preset) => {
            const selected = preset.presetId === currentSelectedPresetId;
            const blocked = accessState.isDisabled || accessState.isReadonly;

            return (
              <button
                key={preset.presetId}
                type="button"
                className={`w-full rounded-[26px] border px-4 py-4 text-left transition ${
                  selected
                    ? 'border-action-primary-border bg-action-primary-soft'
                    : 'border-border-subtle bg-surface-default hover:bg-surface-muted'
                } ${blocked ? 'cursor-not-allowed opacity-75' : ''}`}
                aria-current={selected ? 'true' : undefined}
                onClick={withAccessGuard<React.MouseEvent<HTMLButtonElement>>(
                  interactionState,
                  () => {
                    if (selectedPresetId === undefined) {
                      setInternalSelectedPresetId(preset.presetId);
                    }
                    onSelectPreset?.(preset.presetId, preset);
                  },
                  accessState.isDisabled,
                )}
                title={accessReason}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Text as="div" className="text-sm font-semibold text-text-primary">
                      {preset.label}
                    </Text>
                    {preset.intent ? (
                      <Text variant="secondary" className="mt-1 block text-sm leading-6">
                        {preset.intent}
                      </Text>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {preset.isDefaultMode ? <Badge tone="success">Default</Badge> : null}
                    {preset.isHighContrast ? <Badge tone="warning">High contrast</Badge> : null}
                    {preset.badges?.map((badge, index) => (
                      <React.Fragment key={`${preset.presetId}-badge-${index}`}>{badge}</React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[160px_minmax(0,1fr)]">
                  <div className="rounded-[20px] border border-border-subtle bg-surface-panel p-3">
                    <ThemePreviewCard selected={selected} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-border-subtle bg-surface-panel px-3 py-3">
                      <Text variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                        Mode
                      </Text>
                      <Text as="div" className="mt-2 text-sm font-semibold text-text-primary">
                        {preset.themeMode ?? '—'}
                      </Text>
                    </div>
                    <div className="rounded-2xl border border-border-subtle bg-surface-panel px-3 py-3">
                      <Text variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                        Appearance
                      </Text>
                      <Text as="div" className="mt-2 text-sm font-semibold text-text-primary">
                        {preset.appearance ?? '—'}
                      </Text>
                    </div>
                    <div className="rounded-2xl border border-border-subtle bg-surface-panel px-3 py-3">
                      <Text variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                        Density
                      </Text>
                      <Text as="div" className="mt-2 text-sm font-semibold text-text-primary">
                        {preset.density ?? '—'}
                      </Text>
                    </div>
                    <div className="rounded-2xl border border-border-subtle bg-surface-panel px-3 py-3">
                      <Text variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                        Contrast
                      </Text>
                      <Text as="div" className="mt-2 text-sm font-semibold text-text-primary">
                        {preset.isHighContrast ? 'high' : 'standard'}
                      </Text>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ThemePresetGallery;
