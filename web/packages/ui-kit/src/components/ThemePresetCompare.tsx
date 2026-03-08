import React from 'react';
import { Empty } from './Empty';
import { Text } from './Text';
import { ThemePreviewCard } from './theme/ThemePreviewCard';
import { type ThemePresetGalleryItem } from './ThemePresetGallery';
import { resolveAccessState, type AccessControlledProps } from '../runtime/access-controller';

export interface ThemePresetCompareProps extends AccessControlledProps {
  leftPreset?: ThemePresetGalleryItem | null;
  rightPreset?: ThemePresetGalleryItem | null;
  title?: React.ReactNode;
  description?: React.ReactNode;
  axes?: string[];
  className?: string;
}

const normalizeAxisValue = (preset: ThemePresetGalleryItem, axis: string) => {
  switch (axis) {
    case 'appearance':
      return preset.appearance ?? '—';
    case 'density':
      return preset.density ?? '—';
    case 'intent':
      return preset.intent ?? '—';
    case 'contrast':
      return preset.isHighContrast ? 'high' : 'standard';
    case 'mode':
    case 'themeMode':
      return preset.themeMode ?? '—';
    default:
      return '—';
  }
};

export const ThemePresetCompare: React.FC<ThemePresetCompareProps> = ({
  leftPreset,
  rightPreset,
  title = 'Theme preset compare',
  description = 'Presetler appearance, density, contrast ve intent eksenlerinde ayni compare matrisiyle okunur.',
  axes = ['appearance', 'density', 'intent', 'contrast'],
  className = '',
  access = 'full',
  accessReason,
}) => {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) {
    return null;
  }

  if (!leftPreset || !rightPreset) {
    return (
      <section
        className={`rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm ${className}`.trim()}
        data-access-state={accessState.state}
        data-component="theme-preset-compare"
        title={accessReason}
      >
        <Text as="div" className="text-base font-semibold text-text-primary">
          {title}
        </Text>
        <Text variant="secondary" className="mt-1 block text-sm leading-6">
          {description}
        </Text>
        <div className="mt-4 rounded-[24px] border border-border-subtle bg-surface-default p-4">
          <Empty description="Karsilastirma icin iki preset gerekli." />
        </div>
      </section>
    );
  }

  return (
    <section
      className={`rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm ${className}`.trim()}
      data-access-state={accessState.state}
      data-component="theme-preset-compare"
      title={accessReason}
    >
      <Text as="div" className="text-base font-semibold text-text-primary">
        {title}
      </Text>
      <Text variant="secondary" className="mt-1 block text-sm leading-6">
        {description}
      </Text>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-1">
          {[leftPreset, rightPreset].map((preset, index) => (
            <div key={preset.presetId} className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
              <div className="grid grid-cols-[140px_minmax(0,1fr)] gap-4">
                <div className="rounded-[20px] border border-border-subtle bg-surface-panel p-3">
                  <ThemePreviewCard selected={index === 0 ? leftPreset.isDefaultMode : rightPreset.isDefaultMode} />
                </div>
                <div>
                  <Text as="div" className="text-sm font-semibold text-text-primary">
                    {preset.label}
                  </Text>
                  <Text variant="secondary" className="mt-1 block text-sm leading-6">
                    {preset.intent ?? 'Preset intent belirtilmedi.'}
                  </Text>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
          <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 border-b border-border-subtle pb-3">
            <Text variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.16em]">
              Axis
            </Text>
            <Text variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.16em]">
              {leftPreset.label}
            </Text>
            <Text variant="secondary" className="text-[11px] font-semibold uppercase tracking-[0.16em]">
              {rightPreset.label}
            </Text>
          </div>
          <div className="mt-3 space-y-3">
            {axes.map((axis) => (
              <div key={axis} className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 rounded-2xl border border-border-subtle bg-surface-panel px-3 py-3">
                <Text as="div" className="text-sm font-semibold capitalize text-text-primary">
                  {axis}
                </Text>
                <Text variant="secondary" className="text-sm leading-6">
                  {normalizeAxisValue(leftPreset, axis)}
                </Text>
                <Text variant="secondary" className="text-sm leading-6">
                  {normalizeAxisValue(rightPreset, axis)}
                </Text>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThemePresetCompare;
