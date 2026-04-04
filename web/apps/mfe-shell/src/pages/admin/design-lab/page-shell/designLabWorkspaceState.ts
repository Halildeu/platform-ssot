import { normalizeDesignLabSectionId } from './designLabSectionRouting';
import type { DesignLabPageShellLayerId } from './designLabPageShellLayerResolver';

export type DesignLabWorkspaceMode = 'foundations' | 'components' | 'recipes' | 'pages' | 'ecosystem' | 'charts';
export type DesignLabFamilySelectionKind = 'recipes' | 'pages';
export type DesignLabFamilySelectionState = {
  recipes: string | null;
  pages: string | null;
};
export type DesignLabPanelUrlState = {
  foundations: {
    overview: string | null;
    api: string | null;
    quality: string | null;
    preview: string | null;
  };
  components: {
    overview: string | null;
    api: string | null;
    quality: string | null;
    preview: string | null;
  };
  recipes: {
    overview: string | null;
    api: string | null;
    quality: string | null;
    preview: string | null;
  };
  pages: {
    overview: string | null;
    api: string | null;
    quality: string | null;
    preview: string | null;
  };
  ecosystem: {
    overview: string | null;
    api: string | null;
    quality: string | null;
    preview: string | null;
  };
  charts: {
    overview: string | null;
    api: string | null;
    quality: string | null;
    preview: string | null;
  };
};

type DesignLabRecipeLikeFamily = {
  recipeId: string;
};

const FOUNDATION_URL_KEYS = ['dl_foundation_track', 'dl_foundation_group', 'dl_foundation_subgroup', 'dl_foundation_item'] as const;
const COMPONENT_URL_KEYS = ['dl_track', 'dl_group', 'dl_subgroup', 'dl_item'] as const;
const RECIPE_URL_KEYS = ['dl_recipe'] as const;
const PAGE_URL_KEYS = ['dl_template'] as const;
const FOUNDATION_PANEL_URL_KEYS = ['dl_foundation_overview', 'dl_foundation_api', 'dl_foundation_quality', 'dl_foundation_preview'] as const;
const COMPONENT_PANEL_URL_KEYS = ['dl_overview', 'dl_component_api', 'dl_component_quality', 'dl_component_preview'] as const;
const RECIPE_PANEL_URL_KEYS = ['dl_recipe_overview', 'dl_recipe_api', 'dl_recipe_quality', 'dl_recipe_preview'] as const;
const PAGE_PANEL_URL_KEYS = ['dl_template_overview', 'dl_template_api', 'dl_template_quality', 'dl_template_preview'] as const;
const ECOSYSTEM_URL_KEYS = ['dl_ecosystem'] as const;
const ECOSYSTEM_PANEL_URL_KEYS = ['dl_ecosystem_overview', 'dl_ecosystem_api', 'dl_ecosystem_quality', 'dl_ecosystem_preview'] as const;
const CHARTS_URL_KEYS = ['dl_charts'] as const;
const CHARTS_PANEL_URL_KEYS = ['dl_charts_overview', 'dl_charts_api', 'dl_charts_quality', 'dl_charts_preview'] as const;

export const resolveWorkspaceModeForSection = (
  sectionId: string | null | undefined,
): DesignLabWorkspaceMode => {
  const normalizedSectionId = normalizeDesignLabSectionId(sectionId);

  if (normalizedSectionId === 'foundations') {
    return 'foundations';
  }

  if (normalizedSectionId === 'pages') {
    return 'pages';
  }

  if (normalizedSectionId === 'ecosystem') {
    return 'ecosystem';
  }

  if (normalizedSectionId === 'charts') {
    return 'charts';
  }

  return normalizedSectionId === 'recipes' ? 'recipes' : 'components';
};

export const resolvePreferredSectionId = (
  sectionIds: readonly string[],
  preferredSectionId: string,
  hasContent: (sectionId: string) => boolean,
): string => {
  if (preferredSectionId && hasContent(preferredSectionId)) {
    return preferredSectionId;
  }

  return sectionIds.find((sectionId) => hasContent(sectionId)) ?? preferredSectionId;
};

export const resolveActiveFamilySelectionId = ({
  layerId,
  selectedRecipeId,
  selectedPageTemplateId,
}: {
  layerId: DesignLabPageShellLayerId;
  selectedRecipeId: string | null;
  selectedPageTemplateId: string | null;
}): string | null =>
  layerId === 'pages' ? selectedPageTemplateId : selectedRecipeId;

export const resolveActiveFamilySelectionIdFromState = ({
  layerId,
  selectionState,
}: {
  layerId: DesignLabPageShellLayerId;
  selectionState: DesignLabFamilySelectionState;
}): string | null =>
  resolveActiveFamilySelectionId({
    layerId,
    selectedRecipeId: selectionState.recipes,
    selectedPageTemplateId: selectionState.pages,
  });

export const readFamilySelectionUrlParams = (search: URLSearchParams): {
  recipeParam: string | null;
  templateParam: string | null;
} => ({
  recipeParam: search.get('dl_recipe'),
  templateParam: search.get('dl_template'),
});

export const readLayerPanelUrlParams = (search: URLSearchParams): DesignLabPanelUrlState => ({
  foundations: {
    overview: search.get('dl_foundation_overview'),
    api: search.get('dl_foundation_api'),
    quality: search.get('dl_foundation_quality'),
    preview: search.get('dl_foundation_preview'),
  },
  components: {
    overview: search.get('dl_overview'),
    api: search.get('dl_component_api'),
    quality: search.get('dl_component_quality'),
    preview: search.get('dl_component_preview'),
  },
  recipes: {
    overview: search.get('dl_recipe_overview'),
    api: search.get('dl_recipe_api'),
    quality: search.get('dl_recipe_quality'),
    preview: search.get('dl_recipe_preview'),
  },
  pages: {
    overview: search.get('dl_template_overview'),
    api: search.get('dl_template_api'),
    quality: search.get('dl_template_quality'),
    preview: search.get('dl_template_preview'),
  },
  ecosystem: {
    overview: search.get('dl_ecosystem_overview'),
    api: search.get('dl_ecosystem_api'),
    quality: search.get('dl_ecosystem_quality'),
    preview: search.get('dl_ecosystem_preview'),
  },
});

export const resolveHydratedFamilySelection = ({
  workspaceMode,
  layerId,
  templateParam,
  recipeParam,
  legacyRecipeFallbackId,
  sectionId,
  resolveFamilySelectionForSection,
}: {
  workspaceMode: DesignLabWorkspaceMode;
  layerId: DesignLabPageShellLayerId;
  templateParam: string | null;
  recipeParam: string | null;
  legacyRecipeFallbackId: string | null;
  sectionId: string;
  resolveFamilySelectionForSection: (sectionId: string) => string | null;
}): {
  selectionKind: DesignLabFamilySelectionKind;
  selectionId: string | null;
} | null => {
  if (workspaceMode !== 'recipes' && workspaceMode !== 'pages') {
    // foundations and components modes do not use family selection
    return null;
  }

  const selectionKind: DesignLabFamilySelectionKind =
    workspaceMode === 'pages' || layerId === 'pages' ? 'pages' : 'recipes';
  const fallbackSelectionId = resolveFamilySelectionForSection(sectionId);

  return {
    selectionKind,
    selectionId:
      selectionKind === 'pages'
        ? templateParam ?? recipeParam ?? legacyRecipeFallbackId ?? fallbackSelectionId
        : recipeParam ?? legacyRecipeFallbackId ?? fallbackSelectionId,
  };
};

export const resolveFallbackFamilySelection = <T extends DesignLabRecipeLikeFamily>({
  layerId,
  selectedFamilyId,
  familyItems,
}: {
  layerId: DesignLabPageShellLayerId;
  selectedFamilyId: string | null;
  familyItems: readonly T[];
}): {
  selectionKind: DesignLabFamilySelectionKind;
  selectionId: string;
} | null => {
  if ((layerId !== 'recipes' && layerId !== 'pages') || selectedFamilyId || !familyItems.length) {
    return null;
  }

  return {
    selectionKind: layerId,
    selectionId: familyItems[0].recipeId,
  };
};

export const resolveSectionChangeFamilySelection = ({
  layerId,
  selectedRecipeId,
  selectedPageTemplateId,
  resolveFamilySelectionForSection,
}: {
  layerId: DesignLabPageShellLayerId;
  selectedRecipeId: string | null;
  selectedPageTemplateId: string | null;
  resolveFamilySelectionForSection: (sectionId: DesignLabFamilySelectionKind) => string | null;
}): {
  selectionKind: DesignLabFamilySelectionKind;
  selectionId: string | null;
} | null => {
  if (layerId !== 'recipes' && layerId !== 'pages') {
    return null;
  }

  const selectedFamilyId = resolveActiveFamilySelectionId({
    layerId,
    selectedRecipeId,
    selectedPageTemplateId,
  });

  if (selectedFamilyId) {
    return null;
  }

  return {
    selectionKind: layerId,
    selectionId: resolveFamilySelectionForSection(layerId),
  };
};

export const resolveSidebarFamilySelection = ({
  familyId,
  familySectionId,
  fallbackSectionId,
}: {
  familyId: string;
  familySectionId: string | null | undefined;
  fallbackSectionId: string;
}): {
  workspaceMode: DesignLabWorkspaceMode;
  sectionId: string;
  selectionKind: DesignLabFamilySelectionKind;
  selectionId: string;
} => {
  const sectionId = familySectionId ?? fallbackSectionId;
  const normalizedSectionId = normalizeDesignLabSectionId(sectionId) ?? sectionId;

  return {
    workspaceMode: resolveWorkspaceModeForSection(normalizedSectionId),
    sectionId,
    selectionKind: normalizedSectionId === 'pages' ? 'pages' : 'recipes',
    selectionId: familyId,
  };
};

export const applyFamilySelection = (
  selectionState: DesignLabFamilySelectionState,
  nextSelection: {
    selectionKind: DesignLabFamilySelectionKind;
    selectionId: string | null;
  } | null,
): DesignLabFamilySelectionState => {
  if (!nextSelection) {
    return selectionState;
  }

  if (nextSelection.selectionKind === 'pages') {
    return selectionState.pages === nextSelection.selectionId
      ? selectionState
      : {
          ...selectionState,
          pages: nextSelection.selectionId,
        };
  }

  return selectionState.recipes === nextSelection.selectionId
    ? selectionState
    : {
        ...selectionState,
        recipes: nextSelection.selectionId,
      };
};

export const syncFamilySelectionUrlParams = ({
  search,
  layerId,
  selectionState,
}: {
  search: URLSearchParams;
  layerId: DesignLabPageShellLayerId;
  selectionState: DesignLabFamilySelectionState;
}): URLSearchParams => {
  const activeSelectionId = resolveActiveFamilySelectionIdFromState({
    layerId,
    selectionState,
  });

  if (layerId === 'recipes') {
    if (activeSelectionId) {
      search.set('dl_recipe', activeSelectionId);
    } else {
      search.delete('dl_recipe');
    }
    search.delete('dl_template');
    return search;
  }

  if (layerId === 'pages') {
    if (activeSelectionId) {
      search.set('dl_template', activeSelectionId);
    } else {
      search.delete('dl_template');
    }
    search.delete('dl_recipe');
    return search;
  }

  search.delete('dl_recipe');
  search.delete('dl_template');
  return search;
};

export const syncLayerPanelUrlParams = ({
  search,
  layerId,
  panelState,
}: {
  search: URLSearchParams;
  layerId: DesignLabPageShellLayerId;
  panelState: DesignLabPanelUrlState;
}): URLSearchParams => {
  const setOrDelete = (key: string, value: string | null) => {
    if (value) {
      search.set(key, value);
      return;
    }

    search.delete(key);
  };

  if (layerId === 'foundations') {
    setOrDelete('dl_foundation_overview', panelState.foundations.overview);
    setOrDelete('dl_foundation_api', panelState.foundations.api);
    setOrDelete('dl_foundation_quality', panelState.foundations.quality);
    setOrDelete('dl_foundation_preview', panelState.foundations.preview);
    return search;
  }

  if (layerId === 'components') {
    setOrDelete('dl_overview', panelState.components.overview);
    setOrDelete('dl_component_api', panelState.components.api);
    setOrDelete('dl_component_quality', panelState.components.quality);
    setOrDelete('dl_component_preview', panelState.components.preview);
    return search;
  }

  if (layerId === 'recipes') {
    setOrDelete('dl_recipe_overview', panelState.recipes.overview);
    setOrDelete('dl_recipe_api', panelState.recipes.api);
    setOrDelete('dl_recipe_quality', panelState.recipes.quality);
    setOrDelete('dl_recipe_preview', panelState.recipes.preview);
    return search;
  }

  if (layerId === 'pages') {
    setOrDelete('dl_template_overview', panelState.pages.overview);
    setOrDelete('dl_template_api', panelState.pages.api);
    setOrDelete('dl_template_quality', panelState.pages.quality);
    setOrDelete('dl_template_preview', panelState.pages.preview);
    return search;
  }

  if (layerId === 'ecosystem') {
    setOrDelete('dl_ecosystem_overview', panelState.ecosystem.overview);
    setOrDelete('dl_ecosystem_api', panelState.ecosystem.api);
    setOrDelete('dl_ecosystem_quality', panelState.ecosystem.quality);
    setOrDelete('dl_ecosystem_preview', panelState.ecosystem.preview);
  }

  return search;
};

export const stripInactiveWorkspaceParams = (
  search: URLSearchParams,
  workspaceMode: DesignLabWorkspaceMode,
): URLSearchParams => {
  const allKeysByMode: Record<DesignLabWorkspaceMode, readonly (readonly string[])[]> = {
    foundations: [COMPONENT_URL_KEYS, RECIPE_URL_KEYS, PAGE_URL_KEYS, ECOSYSTEM_URL_KEYS],
    components: [FOUNDATION_URL_KEYS, RECIPE_URL_KEYS, PAGE_URL_KEYS, ECOSYSTEM_URL_KEYS],
    recipes: [FOUNDATION_URL_KEYS, COMPONENT_URL_KEYS, PAGE_URL_KEYS, ECOSYSTEM_URL_KEYS],
    pages: [FOUNDATION_URL_KEYS, COMPONENT_URL_KEYS, RECIPE_URL_KEYS, ECOSYSTEM_URL_KEYS],
    ecosystem: [FOUNDATION_URL_KEYS, COMPONENT_URL_KEYS, RECIPE_URL_KEYS, PAGE_URL_KEYS],
  };
  const keysToDelete = allKeysByMode[workspaceMode] ?? allKeysByMode.components;
  keysToDelete.forEach((keys) => keys.forEach((key) => search.delete(key)));
  return search;
};

export const stripInactiveLayerParams = (
  search: URLSearchParams,
  layerId: DesignLabPageShellLayerId,
): URLSearchParams => {
  const deleteKeys = (...keyArrays: readonly (readonly string[])[]) => {
    keyArrays.forEach((keys) => keys.forEach((key) => search.delete(key)));
  };

  if (layerId === 'foundations') {
    deleteKeys(COMPONENT_URL_KEYS, COMPONENT_PANEL_URL_KEYS, RECIPE_URL_KEYS, RECIPE_PANEL_URL_KEYS, PAGE_URL_KEYS, PAGE_PANEL_URL_KEYS, ECOSYSTEM_URL_KEYS, ECOSYSTEM_PANEL_URL_KEYS);
    return search;
  }

  if (layerId === 'recipes') {
    deleteKeys(FOUNDATION_URL_KEYS, FOUNDATION_PANEL_URL_KEYS, COMPONENT_URL_KEYS, COMPONENT_PANEL_URL_KEYS, PAGE_URL_KEYS, PAGE_PANEL_URL_KEYS, ECOSYSTEM_URL_KEYS, ECOSYSTEM_PANEL_URL_KEYS);
    return search;
  }

  if (layerId === 'pages') {
    deleteKeys(FOUNDATION_URL_KEYS, FOUNDATION_PANEL_URL_KEYS, COMPONENT_URL_KEYS, COMPONENT_PANEL_URL_KEYS, RECIPE_URL_KEYS, RECIPE_PANEL_URL_KEYS, ECOSYSTEM_URL_KEYS, ECOSYSTEM_PANEL_URL_KEYS);
    return search;
  }

  if (layerId === 'ecosystem') {
    deleteKeys(FOUNDATION_URL_KEYS, FOUNDATION_PANEL_URL_KEYS, COMPONENT_URL_KEYS, COMPONENT_PANEL_URL_KEYS, RECIPE_URL_KEYS, RECIPE_PANEL_URL_KEYS, PAGE_URL_KEYS, PAGE_PANEL_URL_KEYS);
    return search;
  }

  // components layer
  deleteKeys(FOUNDATION_URL_KEYS, FOUNDATION_PANEL_URL_KEYS, RECIPE_URL_KEYS, RECIPE_PANEL_URL_KEYS, PAGE_URL_KEYS, PAGE_PANEL_URL_KEYS, ECOSYSTEM_URL_KEYS, ECOSYSTEM_PANEL_URL_KEYS);
  return search;
};
