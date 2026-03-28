import type {
  DesignLabPageShellDetailTab,
  DesignLabPageShellLayerId,
} from "./designLabPageShellLayerResolver";

type RightRailTabItem = {
  id: string;
  label: string;
};

type ResolveSidebarStatsArgs = {
  layerId: DesignLabPageShellLayerId;
  activeWorkspaceLabel: string;
  activeLensLabel: string;
  selectedTaxonomySectionTitle?: string | null;
  foundationFamilyTitle?: string | null;
  pageFamilyTitle?: string | null;
  familyClusterTitle?: string | null;
  componentVisibleCount: number;
  componentFilteredCount: number;
  componentStableCount: number;
  visibleFamilyCount: number;
  totalFamilyCount: number;
  ownerBlocksCount: number;
  boundComponentsCount: number;
};

type ResolveRightRailTabsArgs = {
  layerId: DesignLabPageShellLayerId;
  detailTab: DesignLabPageShellDetailTab;
  detailTabMeta: RightRailTabItem[];
  overviewPanelItems: RightRailTabItem[];
  recipeOverviewPanelItems: RightRailTabItem[];
  pageOverviewPanelItems: RightRailTabItem[];
  componentApiPanelItems: RightRailTabItem[];
  recipeApiPanelItems: RightRailTabItem[];
  pageApiPanelItems: RightRailTabItem[];
  componentQualityPanelItems: RightRailTabItem[];
  recipeQualityPanelItems: RightRailTabItem[];
  pageQualityPanelItems: RightRailTabItem[];
  componentPreviewPanelItems: RightRailTabItem[];
  recipePreviewPanelItems: RightRailTabItem[];
  pagePreviewPanelItems: RightRailTabItem[];
};

export type DesignLabRightRailSelectionKind =
  | "detail-tab"
  | "component-overview"
  | "recipe-overview"
  | "page-overview"
  | "component-preview"
  | "recipe-preview"
  | "page-preview"
  | "component-api"
  | "recipe-api"
  | "page-api"
  | "component-quality"
  | "recipe-quality"
  | "page-quality";

export const resolveDesignLabPageShellSidebarStats = ({
  layerId,
  activeWorkspaceLabel,
  activeLensLabel,
  selectedTaxonomySectionTitle,
  foundationFamilyTitle,
  pageFamilyTitle,
  familyClusterTitle,
  componentVisibleCount,
  componentFilteredCount,
  componentStableCount,
  visibleFamilyCount,
  totalFamilyCount,
  ownerBlocksCount,
  boundComponentsCount,
}: ResolveSidebarStatsArgs): Array<{ label: string; value: string | number }> => {
  const lensValue = selectedTaxonomySectionTitle ?? activeLensLabel;

  switch (layerId) {
    case "foundations":
      return [
        { label: "Workspace", value: activeWorkspaceLabel },
        { label: "Lens", value: lensValue },
        { label: "Foundation family", value: foundationFamilyTitle ?? "All foundations" },
        { label: "Visible", value: componentVisibleCount },
        { label: "Filtered", value: componentFilteredCount },
        { label: "Stable", value: componentStableCount },
      ];
    case "pages":
      return [
        { label: "Workspace", value: activeWorkspaceLabel },
        { label: "Lens", value: lensValue },
        { label: "Page family", value: pageFamilyTitle ?? familyClusterTitle ?? "All page families" },
        { label: "Visible templates", value: visibleFamilyCount },
        { label: "Total templates", value: totalFamilyCount },
        { label: "Building blocks", value: ownerBlocksCount },
        { label: "Linked components", value: boundComponentsCount },
      ];
    case "recipes":
      return [
        { label: "Workspace", value: activeWorkspaceLabel },
        { label: "Lens", value: lensValue },
        { label: "Cluster", value: familyClusterTitle ?? "All clusters" },
        { label: "Visible recipes", value: visibleFamilyCount },
        { label: "Total recipes", value: totalFamilyCount },
        { label: "Owner blocks", value: ownerBlocksCount },
        { label: "Bound components", value: boundComponentsCount },
      ];
    case "components":
    default:
      return [
        { label: "Workspace", value: activeWorkspaceLabel },
        { label: "Lens", value: lensValue },
        { label: "Visible", value: componentVisibleCount },
        { label: "Filtered", value: componentFilteredCount },
        { label: "Stable", value: componentStableCount },
      ];
  }
};

export const resolveDesignLabPageShellRightRailTabs = ({
  layerId,
  detailTab,
  detailTabMeta,
  overviewPanelItems,
  recipeOverviewPanelItems,
  pageOverviewPanelItems,
  componentApiPanelItems,
  recipeApiPanelItems,
  pageApiPanelItems,
  componentQualityPanelItems,
  recipeQualityPanelItems,
  pageQualityPanelItems,
  componentPreviewPanelItems,
  recipePreviewPanelItems,
  pagePreviewPanelItems,
}: ResolveRightRailTabsArgs): RightRailTabItem[] => {
  if (layerId === "foundations") {
    return [];
  }

  if (detailTab === "overview") {
    if (layerId === "pages") {
      return pageOverviewPanelItems;
    }

    return layerId === "components" && overviewPanelItems.length
      ? overviewPanelItems
      : recipeOverviewPanelItems;
  }

  if (detailTab === "api") {
    if (layerId === "pages") {
      return pageApiPanelItems;
    }

    return layerId === "components"
      ? componentApiPanelItems
      : recipeApiPanelItems;
  }

  if (detailTab === "quality") {
    if (layerId === "pages") {
      return pageQualityPanelItems;
    }

    return layerId === "components"
      ? componentQualityPanelItems
      : recipeQualityPanelItems;
  }

  if (detailTab === "demo") {
    if (layerId === "pages") {
      return pagePreviewPanelItems;
    }

    return layerId === "components"
      ? componentPreviewPanelItems
      : recipePreviewPanelItems;
  }

  return detailTabMeta;
};

export const resolveDesignLabPageShellRightRailActiveId = ({
  layerId,
  detailTab,
  effectiveOverviewPanel,
  activeRecipeOverviewPanel,
  activePageOverviewPanel,
  activeComponentPreviewPanel,
  activeRecipePreviewPanel,
  activePagePreviewPanel,
  activeComponentApiPanel,
  activeRecipeApiPanel,
  activePageApiPanel,
  activeComponentQualityPanel,
  activeRecipeQualityPanel,
  activePageQualityPanel,
  overviewPanelItemsLength,
}: {
  layerId: DesignLabPageShellLayerId;
  detailTab: DesignLabPageShellDetailTab;
  effectiveOverviewPanel: string;
  activeRecipeOverviewPanel: string;
  activePageOverviewPanel: string;
  activeComponentPreviewPanel: string;
  activeRecipePreviewPanel: string;
  activePagePreviewPanel: string;
  activeComponentApiPanel: string;
  activeRecipeApiPanel: string;
  activePageApiPanel: string;
  activeComponentQualityPanel: string;
  activeRecipeQualityPanel: string;
  activePageQualityPanel: string;
  overviewPanelItemsLength: number;
}): string => {
  if (layerId === "foundations") {
    return detailTab;
  }

  if (detailTab === "overview") {
    if (layerId === "pages") {
      return activePageOverviewPanel;
    }

    return layerId === "components" && overviewPanelItemsLength
      ? effectiveOverviewPanel
      : activeRecipeOverviewPanel;
  }

  if (detailTab === "demo") {
    if (layerId === "pages") {
      return activePagePreviewPanel;
    }

    return layerId === "components"
      ? activeComponentPreviewPanel
      : activeRecipePreviewPanel;
  }

  if (detailTab === "api") {
    if (layerId === "pages") {
      return activePageApiPanel;
    }

    return layerId === "components"
      ? activeComponentApiPanel
      : activeRecipeApiPanel;
  }

  if (detailTab === "quality") {
    if (layerId === "pages") {
      return activePageQualityPanel;
    }

    return layerId === "components"
      ? activeComponentQualityPanel
      : activeRecipeQualityPanel;
  }

  return detailTab;
};

export const resolveDesignLabPageShellRightRailSelectionKind = ({
  layerId,
  detailTab,
  overviewPanelItemsLength,
}: {
  layerId: DesignLabPageShellLayerId;
  detailTab: DesignLabPageShellDetailTab;
  overviewPanelItemsLength: number;
}): DesignLabRightRailSelectionKind => {
  if (layerId === "foundations") {
    return "detail-tab";
  }

  if (detailTab === "overview") {
    if (layerId === "pages") {
      return "page-overview";
    }

    return layerId === "components" && overviewPanelItemsLength
      ? "component-overview"
      : "recipe-overview";
  }

  if (detailTab === "demo") {
    if (layerId === "pages") {
      return "page-preview";
    }

    return layerId === "components"
      ? "component-preview"
      : "recipe-preview";
  }

  if (detailTab === "api") {
    if (layerId === "pages") {
      return "page-api";
    }

    return layerId === "components"
      ? "component-api"
      : "recipe-api";
  }

  if (detailTab === "quality") {
    if (layerId === "pages") {
      return "page-quality";
    }

    return layerId === "components"
      ? "component-quality"
      : "recipe-quality";
  }

  return "detail-tab";
};
