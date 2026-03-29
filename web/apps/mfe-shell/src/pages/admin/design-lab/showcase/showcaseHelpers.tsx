import React from 'react';
import {
  Badge,
  Tabs,
} from '@mfe/design-system';
import {
  LibraryDetailLabel as DetailLabel,
  _LibraryPreviewPanel,
  LibrarySectionBadge as SectionBadge,
} from '../../../../../../../packages/design-system/src/catalog/design-lab-internals';
import { useDesignLabI18n } from '../useDesignLabI18n';
import type {
  ComponentShowcaseSection,
  DemoSurfaceKind,
  DesignLabPreviewPanelId,
  DesignLabTranslate,
  PreviewPanelProps,
} from './showcaseTypes';

export const designLabPreviewPanelIds: DesignLabPreviewPanelId[] = ['live', 'reference', 'recipe'];

export const getDesignLabPreviewPanelItems = (
  mode: 'components' | 'recipes' | 'pages' | 'foundations' | 'ecosystem',
  t: DesignLabTranslate,
): Array<{
  id: DesignLabPreviewPanelId;
  label: string;
  note: string;
}> => {
  const sharedPanels = [
    {
      id: 'live',
      label: t('designlab.showcase.previewPanels.live.label'),
      note: t('designlab.showcase.previewPanels.live.note'),
    },
    {
      id: 'reference',
      label: t('designlab.showcase.previewPanels.reference.label'),
      note: t('designlab.showcase.previewPanels.reference.note'),
    },
  ] satisfies Array<{
    id: Exclude<DesignLabPreviewPanelId, 'recipe'>;
    label: string;
    note: string;
  }>;

  return mode === 'components' || mode === 'foundations'
    ? sharedPanels
    : [
        ...sharedPanels,
        {
          id: 'recipe',
          label: mode === 'pages' ? 'Template' : mode === 'ecosystem' ? 'Extension' : t('designlab.showcase.previewPanels.recipe.label'),
          note: mode === 'pages' ? 'Page template handoff surface' : mode === 'ecosystem' ? 'Enterprise extension preview' : t('designlab.showcase.previewPanels.recipe.note'),
        },
      ];
};

export const filterDesignLabShowcaseSectionsForMode = (
  mode: 'components' | 'recipes' | 'pages' | 'foundations' | 'ecosystem',
  sections: ComponentShowcaseSection[],
): ComponentShowcaseSection[] =>
  mode === 'components' || mode === 'foundations'
    ? sections.filter((section) => (section.kind ?? 'live') !== 'recipe')
    : sections;

export const demoSurfaceMeta: Record<
  DemoSurfaceKind,
  {
    label: string;
    badgeClassName: string;
    panelClassName: string;
  }
> = {
  live: {
    label: 'LIVE',
    badgeClassName:
      'border-state-success-border/60 bg-[var(--surface-card))] text-state-success-text ring-1 ring-[color-mix(in_oklab,var(--border-subtle)_20%,transparent)] shadow-[0_14px_28px_-22px_var(--shadow-color))]',
    panelClassName:
      'border-state-success-border/30 bg-[var(--surface-card),rgba(243,253,247,0.92)))] shadow-[0_20px_42px_-28px_var(--shadow-color))] ring-1 ring-[color-mix(in_oklab,var(--border-subtle)_20%,transparent)]',
  },
  reference: {
    label: 'REFERENCE',
    badgeClassName:
      'border-border-subtle bg-[var(--surface-card))] text-text-secondary ring-1 ring-[color-mix(in_oklab,var(--border-subtle)_20%,transparent)] shadow-[0_14px_28px_-22px_var(--shadow-color))]',
    panelClassName:
      'border-border-subtle bg-[var(--surface-card),rgba(244,243,250,0.9)))] shadow-[0_20px_42px_-28px_var(--shadow-color))] ring-1 ring-[color-mix(in_oklab,var(--border-subtle)_20%,transparent)]',
  },
  recipe: {
    label: 'RECIPE',
    badgeClassName:
      'border-state-warning-border/60 bg-[var(--surface-card))] text-state-warning-text ring-1 ring-[color-mix(in_oklab,var(--border-subtle)_20%,transparent)] shadow-[0_14px_28px_-22px_var(--shadow-color))]',
    panelClassName:
      'border-state-warning-border/30 bg-[var(--surface-card),rgba(255,248,239,0.92)))] shadow-[0_20px_42px_-28px_var(--shadow-color))] ring-1 ring-[color-mix(in_oklab,var(--border-subtle)_20%,transparent)]',
  },
};

const normalizeDemoSurfaceText = (value: string) =>
  value
    .trim()
    .toLocaleLowerCase('tr-TR')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ');

const includesAnyDemoToken = (value: string, tokens: string[]) =>
  tokens.some((token) => value.includes(token));

const resolvePreviewPanelKind = (title: string, explicitKind?: DemoSurfaceKind): DemoSurfaceKind => {
  if (explicitKind) return explicitKind;

  const normalized = normalizeDemoSurfaceText(title);
  if (includesAnyDemoToken(normalized, ['recipe', 'consume contract', 'consumer handoff', 'direct recipes'])) {
    return 'recipe';
  }
  if (
    includesAnyDemoToken(normalized, [
      'guideline',
      'usage note',
      'rule of thumb',
      'contract note',
      'policy note',
      'governance note',
      'audit note',
      'reading guidance',
      'guidance',
      'interpretation',
      'why use it',
      'why this matters',
      'selected ',
      'current ',
      'summary',
      'payload summary',
      'policy snapshot',
      'contract',
      'live state',
      'panel state',
      'shared state',
      'current command state',
      'selected source',
      'selected event',
      'selected citation',
      'kullanim notu',
      'dogru kullanim notu',
    ])
  ) {
    return 'reference';
  }
  return 'live';
};

export const resolveShowcaseSectionKind = (section: ComponentShowcaseSection): DemoSurfaceKind => {
  if (section.kind) return section.kind;

  const normalized = normalizeDemoSurfaceText(
    [section.id, section.title, section.description ?? '', ...(section.badges ?? [])].join(' '),
  );

  if (includesAnyDemoToken(normalized, ['recipe', 'recipes', 'consume contract', 'consumer handoff'])) {
    return 'recipe';
  }
  if (
    includesAnyDemoToken(normalized, [
      'guideline',
      'usage note',
      'rule of thumb',
      'contract note',
      'policy note',
      'governance note',
      'audit note',
      'reading guidance',
      'guidance',
      'interpretation',
      'why use it',
      'why this matters',
    ])
  ) {
    return 'reference';
  }
  return 'live';
};

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ title, children, className, kind }) => {
  const { t } = useDesignLabI18n();
  const resolvedKind = resolvePreviewPanelKind(title, kind);
  const previewSurfaceLabels = {
    live: t('designlab.showcase.previewSurface.live'),
    reference: t('designlab.showcase.previewSurface.reference'),
    recipe: t('designlab.showcase.previewSurface.recipe'),
  } satisfies Record<DemoSurfaceKind, string>;

  return (
    <div
      data-demo-panel-kind={resolvedKind}
      className={[
        'rounded-[24px] border p-4 backdrop-blur-xs',
        demoSurfaceMeta[resolvedKind].panelClassName,
        className ?? '',
      ]
        .join(' ')
        .trim()}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <DetailLabel className="text-xs">{title}</DetailLabel>
        <SectionBadge label={previewSurfaceLabels[resolvedKind]} className={demoSurfaceMeta[resolvedKind].badgeClassName} />
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
};

export const PreviewWorkspace: React.FC<{
  mode: 'components' | 'recipes' | 'pages' | 'foundations' | 'ecosystem';
  sections: ComponentShowcaseSection[];
  activePreviewPanel: DesignLabPreviewPanelId;
  onPreviewPanelChange: (panelId: DesignLabPreviewPanelId) => void;
  testIdPrefix: string;
  emptyMessage: string;
}> = ({
  mode,
  sections,
  activePreviewPanel,
  onPreviewPanelChange,
  testIdPrefix,
  emptyMessage,
}) => {
  const { t } = useDesignLabI18n();
  const visibleSections = React.useMemo(
    () => filterDesignLabShowcaseSectionsForMode(mode, sections),
    [mode, sections],
  );
  const previewPanelItems = React.useMemo(() => getDesignLabPreviewPanelItems(mode, t), [mode, t]);
  const sectionCountByKind = React.useMemo(
    () =>
      visibleSections.reduce<Record<DesignLabPreviewPanelId, number>>(
        (accumulator, section) => {
          const kind = section.kind ?? 'live';
          accumulator[kind] += 1;
          return accumulator;
        },
        { live: 0, reference: 0, recipe: 0 },
      ),
    [visibleSections],
  );

  const firstAvailablePreviewPanel = React.useMemo(
    () => previewPanelItems.find((panel) => sectionCountByKind[panel.id] > 0)?.id ?? null,
    [previewPanelItems, sectionCountByKind],
  );

  const effectivePreviewPanel =
    sectionCountByKind[activePreviewPanel] > 0
      ? activePreviewPanel
      : firstAvailablePreviewPanel ?? activePreviewPanel;

  React.useEffect(() => {
    if (
      sectionCountByKind[activePreviewPanel] === 0 &&
      firstAvailablePreviewPanel &&
      firstAvailablePreviewPanel !== activePreviewPanel
    ) {
      onPreviewPanelChange(firstAvailablePreviewPanel);
    }
  }, [activePreviewPanel, firstAvailablePreviewPanel, onPreviewPanelChange, sectionCountByKind]);

  const renderPanelContent = (panelId: DesignLabPreviewPanelId) => {
    const panelSections = visibleSections.filter((section) => (section.kind ?? 'live') === panelId);

    return (
      <div className="flex flex-col gap-5">
        <div className="relative overflow-hidden rounded-[26px] border border-border-subtle bg-[var(--surface-card),rgba(246,244,252,0.92)))] p-4 shadow-[0_22px_48px_-30px_var(--shadow-color))] ring-1 ring-[color-mix(in_oklab,var(--border-subtle)_20%,transparent)]">
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-6 top-0 h-12 rounded-b-[28px] bg-linear-to-b from-[var(--surface-card))] to-transparent" />
          <div className="relative z-[1] flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex flex-wrap gap-2">
              {panelSections.map((section, index) => (
                <SectionBadge key={`${section.id}-header-${index}`} label={`${String(index + 1).padStart(2, '0')} · ${section.title}`} />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <SectionBadge
                label={`${previewPanelItems.find((entry) => entry.id === panelId)?.label ?? panelId} · ${panelSections.length}`}
                className={demoSurfaceMeta[panelId].badgeClassName}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {panelSections.length ? (
            panelSections.map((section, index) => (
              <div key={`${section.id}-section-${index}`} data-testid={`${testIdPrefix}-${section.id}`} data-demo-section-kind={section.kind}>
                <LibraryShowcaseCard
                  eyebrow={section.eyebrow}
                  title={section.title}
                  description={section.description}
                  badges={[
                    <SectionBadge
                      key={`${section.id}-kind`}
                      label={demoSurfaceMeta[section.kind ?? 'live'].label}
                      className={demoSurfaceMeta[section.kind ?? 'live'].badgeClassName}
                    />,
                    ...((section.badges ?? []).map((badge, badgeIndex) => (
                      <SectionBadge key={`${section.id}-badge-${badgeIndex}`} label={badge} />
                    ))),
                  ]}
                >
                  { }
                  {section.content as any}
                </LibraryShowcaseCard>
              </div>
            ))
          ) : (
            <div className="rounded-[24px] border border-border-subtle bg-[var(--surface-card),rgba(244,243,250,0.92)))] p-5 shadow-[0_18px_40px_-28px_var(--shadow-color))] ring-1 ring-[color-mix(in_oklab,var(--border-subtle)_20%,transparent)]">
              <Text variant="secondary" className="block leading-7">
                {emptyMessage}
              </Text>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative overflow-hidden rounded-[30px] border border-border-subtle bg-[var(--surface-card),rgba(244,242,250,0.92)))] p-5 shadow-[0_28px_64px_-34px_var(--shadow-color))] ring-1 ring-[color-mix(in_oklab,var(--border-subtle)_20%,transparent)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-8 top-0 h-16 rounded-b-[34px] bg-linear-to-b from-[var(--surface-card))] via-[var(--surface-card))] to-transparent" />
      <div className="relative z-[1] flex flex-col gap-4 border-b border-border-subtle/80 pb-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <DetailLabel>{t('designlab.showcase.preview.workspace.title')}</DetailLabel>
          <Text variant="secondary" className="mt-2 block max-w-3xl leading-7">
            {mode === 'components' || mode === 'foundations'
              ? t('designlab.showcase.preview.workspace.description.components')
              : mode === 'pages'
                ? t('designlab.tabs.demo.description.pages')
                : mode === 'ecosystem'
                  ? 'Enterprise extension ve data surface preview workspace'
                  : t('designlab.showcase.preview.workspace.description.recipes')}
          </Text>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="info">Tabbed</Badge>
          <SectionBadge label={t('designlab.showcase.preview.workspace.showcaseCount', { count: visibleSections.length })} />
        </div>
      </div>

      <Tabs
        activeKey={effectivePreviewPanel}
        onChange={(value) => onPreviewPanelChange(value as DesignLabPreviewPanelId)}
        variant="pill"
        className="mt-5"
        items={previewPanelItems.map((panel) => ({
          key: panel.id,
          label: panel.label,
          disabled: sectionCountByKind[panel.id] === 0,
          badge: <Badge variant={panel.id === 'live' ? 'success' : panel.id === 'recipe' ? 'warning' : 'muted'}>{sectionCountByKind[panel.id]}</Badge>,
          content: renderPanelContent(panel.id),
        }))}
      />
    </div>
  );
};
