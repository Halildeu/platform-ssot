// @ts-nocheck — design-lab showcase, component API alignment pending
import React from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Badge, Popover, Text } from '@mfe/design-system';
import { useShellCommonI18n } from '../i18n';
import { useDesignLabI18n } from '../../pages/admin/design-lab/useDesignLabI18n';
import {
  getLegacyAdapterSectionAliasesForCanonicalSection,
  normalizeDesignLabSectionId,
} from '../../pages/admin/design-lab/page-shell/designLabSectionRouting';
import { DesignLabTaxonomyNavigator, type DesignLabTaxonomyNavigatorItem } from '../../pages/admin/design-lab/shared/DesignLabTaxonomyNavigator';
import { resolveWorkspaceModeForSection } from '../../pages/admin/design-lab/page-shell/designLabWorkspaceState';
import designLabIndexRaw from '../../pages/admin/design-lab.index.json';
import designLabTaxonomyRaw from '../../pages/admin/design-lab.taxonomy.v1.json';
import { designLabIndexItems } from '../../../../../packages/design-system/src/catalog/component-docs';

type DesignLabTaxonomySection = {
  id: string;
  title: string;
  description?: string;
  groupIds: string[];
};

type DesignLabTaxonomyIndexItem = {
  name: string;
  taxonomyGroupId: string;
};

type DesignLabRecipeFamily = {
  recipeId: string;
  ownerBlocks: string[];
  intent: string;
};

type DesignLabIndex = {
  recipes?: {
    currentFamilies: DesignLabRecipeFamily[];
  };
};

type DesignLabHeaderMenuProps = {
  className?: string;
  onNavigate?: () => void;
};

const designLabTaxonomy = designLabTaxonomyRaw as {
  sections: DesignLabTaxonomySection[];
  defaults?: {
    defaultSection?: string;
  };
};

const designLabIndex = {
  ...(designLabIndexRaw as DesignLabIndex),
  items: designLabIndexItems as DesignLabTaxonomyIndexItem[],
};

const designLabTaxonomySectionIds = designLabTaxonomy.sections.map((section) => section.id);
const designLabTaxonomyGroupSectionMap = new Map(
  designLabTaxonomy.sections.flatMap((section) => section.groupIds.map((groupId) => [groupId, section.id] as const)),
);
const designLabRecipePrimarySectionById: Record<string, string> = {
  search_filter_listing: 'recipes',
  detail_summary: 'pages',
  approval_review: 'foundations',
  empty_error_loading: 'recipes',
  ai_guided_authoring: 'recipes',
};
const designLabIndexItemMap = new Map(designLabIndex.items.map((item) => [item.name, item] as const));

const toTestIdSuffix = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const resolveTaxonomySectionForGroup = (groupId: string | null | undefined) => {
  if (!groupId) {
    return null;
  }
  return designLabTaxonomyGroupSectionMap.get(groupId) ?? null;
};

const normalizeTaxonomySectionId = (sectionId: string | null | undefined) => {
  const normalizedSectionId = normalizeDesignLabSectionId(sectionId);
  if (!normalizedSectionId) {
    return null;
  }

  return designLabTaxonomySectionIds.includes(normalizedSectionId) ? normalizedSectionId : null;
};

const resolveRecipeSemanticSectionIds = (recipe: DesignLabRecipeFamily) => {
  const haystack = `${recipe.recipeId} ${recipe.intent}`.toLowerCase();
  const sectionIds = new Set<string>();
  const explicitSectionId = designLabRecipePrimarySectionById[recipe.recipeId];

  if (explicitSectionId) {
    sectionIds.add(explicitSectionId);
  }

  if (haystack.includes('ai') || haystack.includes('authoring')) {
    sectionIds.add('recipes');
  }

  if (
    haystack.includes('onay') ||
    haystack.includes('audit') ||
    haystack.includes('karar') ||
    haystack.includes('governance')
  ) {
    sectionIds.add('foundations');
  }

  if (
    haystack.includes('detay') ||
    haystack.includes('summary') ||
    haystack.includes('ozet') ||
    haystack.includes('shell') ||
    haystack.includes('page')
  ) {
    sectionIds.add('pages');
  }

  if (
    haystack.includes('liste') ||
    haystack.includes('filtre') ||
    haystack.includes('pattern') ||
    haystack.includes('bos') ||
    haystack.includes('hata') ||
    haystack.includes('yukleniyor')
  ) {
    sectionIds.add('recipes');
  }

  return Array.from(sectionIds).filter(
    (sectionId): sectionId is string => Boolean(normalizeTaxonomySectionId(sectionId)),
  );
};

const getRecipeSectionIds = (recipe: DesignLabRecipeFamily) => {
  const ownerBlockSectionIds = Array.from(
    new Set(
      recipe.ownerBlocks
        .map((owner) => designLabIndexItemMap.get(owner)?.taxonomyGroupId ?? null)
        .map((groupId) => resolveTaxonomySectionForGroup(groupId))
        .filter((sectionId): sectionId is string => Boolean(sectionId)),
    ),
  );
  const sectionIds = Array.from(
    new Set([
      ...resolveRecipeSemanticSectionIds(recipe),
      ...ownerBlockSectionIds,
    ]),
  );
  const canonicalSectionIds = Array.from(
    new Set(
      sectionIds
        .map((sectionId) => normalizeTaxonomySectionId(sectionId))
        .filter((sectionId): sectionId is string => Boolean(sectionId)),
    ),
  );

  return canonicalSectionIds.some((sectionId) => sectionId !== 'components')
    ? canonicalSectionIds.filter((sectionId) => sectionId !== 'components')
    : canonicalSectionIds;
};

export const DesignLabHeaderMenu: React.FC<DesignLabHeaderMenuProps> = ({
  className,
  onNavigate,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useShellCommonI18n();
  const { t: tDesignLab } = useDesignLabI18n();
  const [open, setOpen] = React.useState(false);

  const isDesignLabRoute = location.pathname.startsWith('/admin/design-lab');
  const currentSearch = React.useMemo(() => new URLSearchParams(location.search), [location.search]);
  const defaultSectionId = designLabTaxonomy.defaults?.defaultSection ?? designLabTaxonomy.sections[0]?.id ?? 'components';
  const requestedSectionId = normalizeTaxonomySectionId(currentSearch.get('dl_section'));
  const activeSectionId =
    isDesignLabRoute && requestedSectionId
      ? requestedSectionId
      : defaultSectionId;
  const activeSectionWorkspaceMode = resolveWorkspaceModeForSection(activeSectionId);

  React.useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  const taxonomyPresentationMap = React.useMemo(
    () =>
      new Map(
        designLabTaxonomy.sections.map((section) => [
          section.id,
          {
            title: tDesignLab(`designlab.taxonomy.sections.${section.id}.title`) || section.title,
            description: tDesignLab(`designlab.taxonomy.sections.${section.id}.description`) || section.description || '',
          },
        ]),
      ),
    [tDesignLab],
  );

  const componentCountBySectionId = React.useMemo(() => {
    const counts = new Map(designLabTaxonomy.sections.map((section) => [section.id, 0] as const));
    designLabIndex.items.forEach((item) => {
      const sectionId = resolveTaxonomySectionForGroup(item.taxonomyGroupId);
      if (!sectionId) {
        return;
      }
      counts.set(sectionId, (counts.get(sectionId) ?? 0) + 1);
    });
    return counts;
  }, []);

  const recipeCountBySectionId = React.useMemo(() => {
    const counts = new Map(designLabTaxonomy.sections.map((section) => [section.id, 0] as const));
    const recipes = designLabIndex.recipes?.currentFamilies ?? [];

    recipes.forEach((recipe) => {
      const sectionIds = getRecipeSectionIds(recipe);
      if (!sectionIds.length) {
        counts.forEach((value, sectionId) => {
          counts.set(sectionId, value + 1);
        });
        return;
      }

      sectionIds.forEach((sectionId) => {
        counts.set(sectionId, (counts.get(sectionId) ?? 0) + 1);
      });
    });

    return counts;
  }, []);

  const items = React.useMemo<DesignLabTaxonomyNavigatorItem[]>(
    () =>
      designLabTaxonomy.sections.map((section) => ({
        id: section.id,
        title: taxonomyPresentationMap.get(section.id)?.title ?? section.title,
        description: taxonomyPresentationMap.get(section.id)?.description ?? section.description ?? null,
        auxiliaryBadgeLabel: getLegacyAdapterSectionAliasesForCanonicalSection(section.id).length
          ? tDesignLab('designlab.taxonomy.badges.adapter')
          : null,
        auxiliaryBadgeTone: 'warning' as const,
        count: (
          resolveWorkspaceModeForSection(section.id) === 'recipes'
            ? recipeCountBySectionId.get(section.id)
            : componentCountBySectionId.get(section.id)
        ) ?? 0,
      })),
    [componentCountBySectionId, recipeCountBySectionId, taxonomyPresentationMap],
  );
  const adapterItems = React.useMemo(
    () => items.filter((item) => Boolean(item.auxiliaryBadgeLabel)),
    [items],
  );

  const buildTargetSearch = React.useCallback((sectionId: string) => {
    const canonicalSectionId = normalizeTaxonomySectionId(sectionId) ?? defaultSectionId;
    const nextSearch = new URLSearchParams();
    nextSearch.set('dl_mode', resolveWorkspaceModeForSection(canonicalSectionId));
    nextSearch.set('dl_section', canonicalSectionId);

    if (isDesignLabRoute) {
      const tab = currentSearch.get('dl_tab');
      if (tab) {
        nextSearch.set('dl_tab', tab);
      }
    }

    return `?${nextSearch.toString()}`;
  }, [currentSearch, isDesignLabRoute]);

  const handleTriggerClick = React.useCallback(() => {
    setOpen((current) => !current);
  }, []);

  const handleSectionChange = React.useCallback((sectionId: string) => {
    onNavigate?.();
    setOpen(false);
    navigate({
      pathname: '/admin/design-lab',
      search: buildTargetSearch(sectionId),
    });
  }, [buildTargetSearch, navigate, onNavigate]);

  const activeLayerLabel =
    taxonomyPresentationMap.get(activeSectionId)?.title
    ?? tDesignLab('designlab.sidebar.section.title');
  const triggerClassName = clsx(
    'inline-flex min-h-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-focus)] focus-visible:ring-offset-2',
    isDesignLabRoute || open
      ? 'border-[var(--accent-primary-hover)] bg-[var(--accent-primary)] text-[var(--action-primary-text)] shadow-sm'
      : 'border-transparent bg-transparent text-text-primary hover:border-border-subtle hover:bg-surface-muted',
  );

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      triggerMode="hover-focus"
      side="bottom"
      align="start"
      openDelay={0}
      closeDelay={180}
      ariaLabel={t('shell.nav.designLab')}
      showArrow={false}
      panelClassName="z-[72] min-w-[22rem] shadow-[0_34px_80px_-38px_rgba(15,23,42,0.42)]"
      portalTarget={typeof document !== 'undefined' ? document.body : null}
      title={(
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <Text as="div" className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-subtle">
              {t('shell.nav.designLab')}
            </Text>
            <Text as="div" className="mt-1 text-sm font-semibold text-text-primary">
              {tDesignLab('designlab.sidebar.section.title')}
            </Text>
          </div>
          <Badge variant={activeSectionWorkspaceMode === 'recipes' ? 'warning' : 'info'}>
            {activeLayerLabel}
          </Badge>
        </div>
      )}
      content={(
        <div data-testid="design-lab-header-taxonomy-panel">
          <DesignLabTaxonomyNavigator
            items={items}
            activeId={activeSectionId}
            onChange={handleSectionChange}
            variant="sidebar"
            ariaLabel={tDesignLab('designlab.sidebar.section.title')}
            itemTestIdPrefix="design-lab-header-section"
            toTestIdSuffix={toTestIdSuffix}
          />
          {adapterItems.length ? (
            <div className="mt-3 flex flex-wrap gap-2" data-testid="design-lab-header-adapter-badges">
              {adapterItems.map((item) => (
                <Badge key={item.id} variant={item.auxiliaryBadgeTone ?? 'warning'}>
                  {`${item.title} · ${item.auxiliaryBadgeLabel}`}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      )}
      className={className}
      trigger={(
        <button
          type="button"
          data-testid="nav-design-lab"
          aria-current={isDesignLabRoute ? 'page' : undefined}
          className={triggerClassName}
          onClick={handleTriggerClick}
        >
          <span>{t('shell.nav.designLab')}</span>
          <ChevronDown className={clsx('h-3.5 w-3.5 transition', open && 'rotate-180')} aria-hidden />
        </button>
      )}
    />
  );
};
