export const designLabReplaceableSectionAliasMap = {
  patterns: 'recipes',
  templates: 'pages',
  content_language: 'foundations',
  governance: 'foundations',
} as const;

export const designLabAdapterSectionAliasMap = {
  visualization: 'components',
  ai_ux: 'recipes',
  enterprise: 'ecosystem',
  pro: 'ecosystem',
  extensions: 'ecosystem',
} as const;

export const designLabLegacySectionAliasMap = {
  ...designLabReplaceableSectionAliasMap,
  ...designLabAdapterSectionAliasMap,
} as const;

export type DesignLabLegacySectionId = keyof typeof designLabLegacySectionAliasMap;

const legacyAdapterAliasesByCanonicalSection = new Map<string, string[]>(
  Object.entries(designLabAdapterSectionAliasMap).reduce<Array<[string, string[]]>>((entries, [legacySectionId, canonicalSectionId]) => {
    const currentAliases = entries.find(([sectionId]) => sectionId === canonicalSectionId)?.[1] ?? [];
    const nextAliases = [...currentAliases, legacySectionId];
    const filteredEntries = entries.filter(([sectionId]) => sectionId !== canonicalSectionId);
    filteredEntries.push([canonicalSectionId, nextAliases]);
    return filteredEntries;
  }, []),
);

export const normalizeDesignLabSectionId = (
  sectionId: string | null | undefined,
): string | null => {
  if (!sectionId) {
    return null;
  }

  return designLabLegacySectionAliasMap[sectionId as DesignLabLegacySectionId] ?? sectionId;
};

export const isReplaceableLegacyDesignLabSectionId = (
  sectionId: string | null | undefined,
): boolean =>
  Boolean(
    sectionId
    && Object.prototype.hasOwnProperty.call(designLabReplaceableSectionAliasMap, sectionId),
  );

export const isLegacyDesignLabSectionId = (
  sectionId: string | null | undefined,
): boolean =>
  Boolean(
    sectionId
    && Object.prototype.hasOwnProperty.call(designLabLegacySectionAliasMap, sectionId),
  );

export const isAdapterLegacyDesignLabSectionId = (
  sectionId: string | null | undefined,
): boolean =>
  Boolean(
    sectionId
    && Object.prototype.hasOwnProperty.call(designLabAdapterSectionAliasMap, sectionId),
  );

export const resolveLegacySectionPreferredComponentGroupId = (
  sectionId: string | null | undefined,
): string | null => {
  switch (sectionId) {
    case 'visualization':
      return 'data_display';
    default:
      return null;
  }
};

export const resolveLegacySectionPreferredRecipeId = (
  sectionId: string | null | undefined,
): string | null => {
  switch (sectionId) {
    case 'ai_ux':
      return 'ai_guided_authoring';
    default:
      return null;
  }
};

export const resolveLegacySectionComponentFallbackGroupId = ({
  sectionId,
  groupParam,
  subgroupParam,
  itemParam,
}: {
  sectionId: string | null | undefined;
  groupParam?: string | null;
  subgroupParam?: string | null;
  itemParam?: string | null;
}): string | null => {
  if (groupParam || subgroupParam || itemParam) {
    return null;
  }

  return resolveLegacySectionPreferredComponentGroupId(sectionId);
};

export const resolveLegacySectionRecipeFallbackId = ({
  sectionId,
  recipeParam,
}: {
  sectionId: string | null | undefined;
  recipeParam?: string | null;
}): string | null => {
  if (recipeParam) {
    return null;
  }

  return resolveLegacySectionPreferredRecipeId(sectionId);
};

export const getLegacyAdapterSectionAliasesForCanonicalSection = (
  sectionId: string | null | undefined,
): string[] => {
  if (!sectionId) {
    return [];
  }

  return legacyAdapterAliasesByCanonicalSection.get(sectionId) ?? [];
};
