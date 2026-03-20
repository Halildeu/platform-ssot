import React from 'react';
import { Badge, Text } from '@mfe/design-system';
import { useDesignLabI18n } from '../../useDesignLabI18n';
import {
  buildMenuBarShowcaseSections,
  getMenuBarShowcaseDescriptor,
  resolveMenuBarShowcaseVariantIds,
  type MenuBarShowcaseItemName,
} from './menu-bar';
import { getMenuBarVariantDescriptor } from '../../../../../../../../packages/design-system/src/catalog/menu-bar-variant-catalog';

type DesignLabMenuBarShowcaseProps = {
  itemName?: MenuBarShowcaseItemName;
};

export const DesignLabMenuBarShowcase: React.FC<DesignLabMenuBarShowcaseProps> = ({
  itemName = 'MenuBar',
}) => {
  const { t, locale } = useDesignLabI18n();
  const descriptor = React.useMemo(() => getMenuBarShowcaseDescriptor(itemName), [itemName]);
  const showcaseVariantIds = React.useMemo(
    () => resolveMenuBarShowcaseVariantIds(descriptor.variantIds),
    [descriptor.variantIds],
  );
  const variantLabels = React.useMemo(
    () =>
      showcaseVariantIds.map((variantId) => ({
        id: variantId,
        label: getMenuBarVariantDescriptor(variantId).name,
      })),
    [showcaseVariantIds],
  );

  const qualityProfiles = React.useMemo(
    () =>
      showcaseVariantIds.map((variantId) => {
        const variant = getMenuBarVariantDescriptor(variantId);
        const qualityScore =
          variant.modes.length +
          variant.badges.length +
          variant.benchmarkPrimary.length +
          variant.benchmarkSecondary.length +
          variant.variantAxes.length +
          variant.previewFocus.length +
          variant.regressionFocus.length;

        return {
          id: variantId,
          label: variant.name,
          modes: variant.modes.length,
          benchmarks: variant.benchmarkPrimary.length + variant.benchmarkSecondary.length,
          axes: variant.variantAxes.length,
          stateSignals: variant.stateModel.length,
          previews: variant.previewFocus.length,
          regressions: variant.regressionFocus.length,
          score: qualityScore,
        };
      }),
    [showcaseVariantIds],
  );

  const sections = React.useMemo(
    () =>
      buildMenuBarShowcaseSections({
        ariaLabel: t('designlab.showcase.component.menuBar.aria'),
        locale,
        itemName,
      }),
    [itemName, locale, t],
  );

  return (
    <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap gap-2">
        {variantLabels.map((entry) => (
          <Badge key={entry.id} tone="info" className="rounded-full">
            {entry.label}
          </Badge>
        ))}
      </div>
      <div className="mb-6 rounded-2xl border border-border-subtle/80 bg-surface-default p-4">
        <Text as="div" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
          Menubar kalite vektörleri
        </Text>
        <Text variant="secondary" className="mt-1 text-xs leading-6">
          Varyant karşılaştırmaları hızlı görsellik için metrik yoğunluk profilleri.
        </Text>
        <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
          {qualityProfiles.map((profile) => (
            <div key={profile.id} className="rounded-xl border border-border-subtle bg-surface-panel p-3">
              <div className="mb-2 flex items-start justify-between gap-2">
                <Text as="div" className="text-xs font-semibold text-text-primary">
                  {profile.label}
                </Text>
                <Badge tone={profile.score >= 30 ? 'success' : profile.score >= 24 ? 'warning' : 'muted'} className="rounded-full">
                  Skor {profile.score}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <div>
                  <Text as="div" className="font-semibold text-text-secondary uppercase tracking-[0.16em]">
                    Modlar
                  </Text>
                  <Text as="div" className="mt-1 text-text-primary">
                    {profile.modes}
                  </Text>
                </div>
                <div>
                  <Text as="div" className="font-semibold text-text-secondary uppercase tracking-[0.16em]">
                    Eksen
                  </Text>
                  <Text as="div" className="mt-1 text-text-primary">
                    {profile.axes}
                  </Text>
                </div>
                <div>
                  <Text as="div" className="font-semibold text-text-secondary uppercase tracking-[0.16em]">
                    Bench.
                  </Text>
                  <Text as="div" className="mt-1 text-text-primary">
                    {profile.benchmarks}
                  </Text>
                </div>
                <div>
                  <Text as="div" className="font-semibold text-text-secondary uppercase tracking-[0.16em]">
                    State
                  </Text>
                  <Text as="div" className="mt-1 text-text-primary">
                    {profile.stateSignals}
                  </Text>
                </div>
                <div>
                  <Text as="div" className="font-semibold text-text-secondary uppercase tracking-[0.16em]">
                    Focus
                  </Text>
                  <Text as="div" className="mt-1 text-text-primary">
                    {profile.previews}
                  </Text>
                </div>
                <div>
                  <Text as="div" className="font-semibold text-text-secondary uppercase tracking-[0.16em]">
                    Regr.
                  </Text>
                  <Text as="div" className="mt-1 text-text-primary">
                    {profile.regressions}
                  </Text>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <Text as="div" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
            {descriptor.title}
          </Text>
          <Text as="div" preset="body-sm" className="mt-1 text-sm font-semibold text-text-primary">
            {sections.length} variant
          </Text>
          <Text variant="secondary" className="mt-1 block text-xs leading-6">
            {descriptor.description}
          </Text>
        </div>
        <Badge tone="info" className="rounded-full">
          {sections.length} variant
        </Badge>
      </div>
      <div className="grid grid-cols-1 gap-5 2xl:grid-cols-2">
        {sections.map((section) => (
          <div key={section.id} data-testid={`design-lab-menubar-panel-${section.id}`} className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                {section.eyebrow ? (
                  <Text as="div" className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
                    {section.eyebrow}
                  </Text>
                ) : null}
                <Text as="div" preset="body-sm" className="text-sm font-semibold text-text-primary">
                  {section.title}
                </Text>
                {section.description ? (
                  <Text variant="secondary" className="mt-1 block text-xs leading-6">
                    {section.description}
                  </Text>
                ) : null}
              </div>
              {section.badges?.length ? (
                <div className="flex flex-wrap justify-end gap-1.5">
                  {section.badges.map((badge) => (
                    <Badge key={`${section.id}-${badge}`} tone="muted" className="rounded-full">
                      {badge}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
            {section.content}
          </div>
        ))}
      </div>
    </div>
  );
};
