import React from 'react';
import type { DesignLabTaxonomyNavigatorItem } from './DesignLabTaxonomyNavigator';
import type { DesignLabFamilyIdentity } from './designLabFamilyModel';

type DesignLabWorkspaceMode = 'components' | 'recipes' | 'pages';

type DesignLabTaxonomySection = {
  id: string;
  title: string;
  description?: string;
  groupIds: string[];
};

type DesignLabTaxonomyIndexItem = {
  name: string;
  taxonomyGroupId: string;
  taxonomySubgroup: string;
  lifecycle?: string;
};

type DesignLabFamilyItem = DesignLabFamilyIdentity & {
  ownerBlocks: string[];
  intent: string;
};

type DesignLabTreeSelection = {
  trackId: string;
  groupId: string;
  subgroupId: string;
  itemId: string;
};

type UseDesignLabTaxonomyNavigatorModelArgs = {
  sections: DesignLabTaxonomySection[];
  workspaceMode: DesignLabWorkspaceMode;
  setActiveTaxonomySectionId: (sectionId: string) => void;
  filteredTrackItems: DesignLabTaxonomyIndexItem[];
  itemsForTrack: DesignLabTaxonomyIndexItem[];
  allItems: DesignLabTaxonomyIndexItem[];
  activeTrack: string;
  resolveItemTrack: (item: DesignLabTaxonomyIndexItem) => string;
  setTreeSelection: (selection: DesignLabTreeSelection) => void;
  sectionMap: Map<string, DesignLabTaxonomySection>;
  resolveTaxonomySectionForGroup: (groupId: string | null | undefined) => string | null;
  getTaxonomySectionTitle: (sectionId: string, fallbackTitle: string) => string;
  getTaxonomySectionDescription: (sectionId: string, fallbackDescription?: string | null) => string | null;
  familyItemsMatchingQuery: DesignLabFamilyItem[];
  getFamilySectionIds: (family: DesignLabFamilyItem) => string[];
  setSelectedFamilyId: (familyId: string | null) => void;
};

type UseDesignLabTaxonomyNavigatorModelResult = {
  taxonomySectionItems: DesignLabTaxonomyNavigatorItem[];
  handleTaxonomySectionChange: (sectionId: string) => void;
};

const initializeSectionCounts = (sections: DesignLabTaxonomySection[]) =>
  new Map<string, number>(sections.map((section) => [section.id, 0] as const));

export const useDesignLabTaxonomyNavigatorModel = ({
  sections,
  workspaceMode,
  setActiveTaxonomySectionId,
  filteredTrackItems,
  itemsForTrack,
  allItems,
  activeTrack,
  resolveItemTrack,
  setTreeSelection,
  sectionMap,
  resolveTaxonomySectionForGroup,
  getTaxonomySectionTitle,
  getTaxonomySectionDescription,
  familyItemsMatchingQuery,
  getFamilySectionIds,
  setSelectedFamilyId,
}: UseDesignLabTaxonomyNavigatorModelArgs): UseDesignLabTaxonomyNavigatorModelResult => {
  const componentCountBySectionId = React.useMemo(() => {
    const counts = initializeSectionCounts(sections);
    filteredTrackItems.forEach((item) => {
      const sectionId = resolveTaxonomySectionForGroup(item.taxonomyGroupId);
      if (!sectionId) {
        return;
      }
      counts.set(sectionId, (counts.get(sectionId) ?? 0) + 1);
    });
    return counts;
  }, [filteredTrackItems, resolveTaxonomySectionForGroup, sections]);

  const familyCountBySectionId = React.useMemo(() => {
    const counts = initializeSectionCounts(sections);

    familyItemsMatchingQuery.forEach((family) => {
      const familySectionIds = getFamilySectionIds(family);
      if (!familySectionIds.length) {
        sections.forEach((section) => {
          counts.set(section.id, (counts.get(section.id) ?? 0) + 1);
        });
        return;
      }

      familySectionIds.forEach((sectionId) => {
        counts.set(sectionId, (counts.get(sectionId) ?? 0) + 1);
      });
    });

    return counts;
  }, [familyItemsMatchingQuery, getFamilySectionIds, sections]);

  const componentTaxonomySectionItems = React.useMemo(
    () =>
      sections.map((section) => ({
        id: section.id,
        title: getTaxonomySectionTitle(section.id, section.title),
        description: getTaxonomySectionDescription(section.id, section.description),
        count: componentCountBySectionId.get(section.id) ?? 0,
      })),
    [componentCountBySectionId, getTaxonomySectionDescription, getTaxonomySectionTitle, sections],
  );

  const taxonomySectionItems = React.useMemo(
    () =>
      workspaceMode === 'recipes' || workspaceMode === 'pages'
        ? sections.map((section) => ({
            id: section.id,
            title: getTaxonomySectionTitle(section.id, section.title),
            description: getTaxonomySectionDescription(section.id, section.description),
            count: familyCountBySectionId.get(section.id) ?? 0,
          }))
        : componentTaxonomySectionItems,
    [
      componentTaxonomySectionItems,
      familyCountBySectionId,
      getTaxonomySectionDescription,
      getTaxonomySectionTitle,
      sections,
      workspaceMode,
    ],
  );

  const handleComponentTaxonomySectionChange = React.useCallback(
    (sectionId: string) => {
      const section = sectionMap.get(sectionId);
      if (!section) {
        return;
      }

      const groupIds = new Set(section.groupIds);
      const nextItem =
        filteredTrackItems.find((item) => groupIds.has(item.taxonomyGroupId)) ??
        itemsForTrack.find((item) => groupIds.has(item.taxonomyGroupId)) ??
        allItems.find((item) => resolveItemTrack(item) === activeTrack && groupIds.has(item.taxonomyGroupId)) ??
        allItems.find((item) => groupIds.has(item.taxonomyGroupId)) ??
        null;

      if (!nextItem) {
        return;
      }

      setTreeSelection({
        trackId: resolveItemTrack(nextItem),
        groupId: nextItem.taxonomyGroupId,
        subgroupId: nextItem.taxonomySubgroup,
        itemId: nextItem.name,
      });
    },
    [activeTrack, allItems, filteredTrackItems, itemsForTrack, resolveItemTrack, sectionMap, setTreeSelection],
  );

  const handleTaxonomySectionChange = React.useCallback(
    (sectionId: string) => {
      setActiveTaxonomySectionId(sectionId);

      if (workspaceMode === 'recipes' || workspaceMode === 'pages') {
        const nextFamily =
          familyItemsMatchingQuery.find((family) => {
            const familySectionIds = getFamilySectionIds(family);
            return !familySectionIds.length || familySectionIds.includes(sectionId);
          }) ?? null;
        setSelectedFamilyId(nextFamily?.familyId ?? null);
        return;
      }

      handleComponentTaxonomySectionChange(sectionId);
    },
    [
      familyItemsMatchingQuery,
      getFamilySectionIds,
      handleComponentTaxonomySectionChange,
      setActiveTaxonomySectionId,
      setSelectedFamilyId,
      workspaceMode,
    ],
  );

  return {
    taxonomySectionItems,
    handleTaxonomySectionChange,
  };
};
