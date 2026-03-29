// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import {
  resolveDesignLabPageShellRightRailActiveId,
  resolveDesignLabPageShellRightRailSelectionKind,
  resolveDesignLabPageShellRightRailTabs,
  resolveDesignLabPageShellSidebarStats,
} from "./designLabPageShellRightRailResolver";

describe("designLabPageShellRightRailResolver", () => {
  it("foundations ve pages icin katman-bazli sidebar stats uretir", () => {
    const foundationStats = resolveDesignLabPageShellSidebarStats({
      layerId: "foundations",
      activeWorkspaceLabel: "Foundations workspace",
      activeLensLabel: "Foundations",
      selectedTaxonomySectionTitle: "Foundations",
      foundationFamilyTitle: "Theme, Tokens & Appearance",
      componentVisibleCount: 12,
      componentFilteredCount: 8,
      componentStableCount: 6,
      visibleFamilyCount: 0,
      totalFamilyCount: 0,
      ownerBlocksCount: 0,
      boundComponentsCount: 0,
    });
    const pageStats = resolveDesignLabPageShellSidebarStats({
      layerId: "pages",
      activeWorkspaceLabel: "Pages workspace",
      activeLensLabel: "Pages",
      selectedTaxonomySectionTitle: "Pages",
      pageFamilyTitle: "Dashboard templates",
      componentVisibleCount: 0,
      componentFilteredCount: 0,
      componentStableCount: 0,
      visibleFamilyCount: 4,
      totalFamilyCount: 9,
      ownerBlocksCount: 12,
      boundComponentsCount: 7,
    });

    expect(foundationStats[2]).toEqual({
      label: "Foundation family",
      value: "Theme, Tokens & Appearance",
    });
    expect(pageStats[2]).toEqual({
      label: "Page family",
      value: "Dashboard templates",
    });
    expect(pageStats[3]).toEqual({
      label: "Visible templates",
      value: 4,
    });
  });

  it("foundations icin bos, pages icin page-first right rail tablarini dondurur", () => {
    const detailTabs = [{ id: "general", label: "General" }];

    expect(
      resolveDesignLabPageShellRightRailTabs({
        layerId: "foundations",
        detailTab: "overview",
        detailTabMeta: detailTabs,
        overviewPanelItems: [{ id: "release", label: "Release" }],
        recipeOverviewPanelItems: [{ id: "summary", label: "Summary" }],
        pageOverviewPanelItems: [{ id: "regions", label: "Regions" }],
        componentApiPanelItems: [],
        recipeApiPanelItems: [],
        pageApiPanelItems: [],
        componentQualityPanelItems: [],
        recipeQualityPanelItems: [],
        pageQualityPanelItems: [],
        componentPreviewPanelItems: [],
        recipePreviewPanelItems: [],
        pagePreviewPanelItems: [],
      }),
    ).toEqual([]);

    expect(
      resolveDesignLabPageShellRightRailTabs({
        layerId: "pages",
        detailTab: "api",
        detailTabMeta: detailTabs,
        overviewPanelItems: [],
        recipeOverviewPanelItems: [],
        pageOverviewPanelItems: [],
        componentApiPanelItems: [],
        recipeApiPanelItems: [],
        pageApiPanelItems: [{ id: "dependencies", label: "Dependencies" }],
        componentQualityPanelItems: [],
        recipeQualityPanelItems: [],
        pageQualityPanelItems: [],
        componentPreviewPanelItems: [],
        recipePreviewPanelItems: [],
        pagePreviewPanelItems: [],
      }),
    ).toEqual([{ id: "dependencies", label: "Dependencies" }]);
  });

  it("components, recipes ve pages icin aktif kimlik ve selection kind kararini cozer", () => {
    expect(
      resolveDesignLabPageShellRightRailActiveId({
        layerId: "components",
        detailTab: "overview",
        effectiveOverviewPanel: "release",
        activeRecipeOverviewPanel: "summary",
        activePageOverviewPanel: "regions",
        activeComponentPreviewPanel: "live",
        activeRecipePreviewPanel: "live",
        activePagePreviewPanel: "recipe",
        activeComponentApiPanel: "contract",
        activeRecipeApiPanel: "contract",
        activePageApiPanel: "regions",
        activeComponentQualityPanel: "gates",
        activeRecipeQualityPanel: "gates",
        activePageQualityPanel: "readiness",
        overviewPanelItemsLength: 3,
      }),
    ).toBe("release");

    expect(
      resolveDesignLabPageShellRightRailActiveId({
        layerId: "pages",
        detailTab: "quality",
        effectiveOverviewPanel: "release",
        activeRecipeOverviewPanel: "summary",
        activePageOverviewPanel: "regions",
        activeComponentPreviewPanel: "live",
        activeRecipePreviewPanel: "live",
        activePagePreviewPanel: "recipe",
        activeComponentApiPanel: "contract",
        activeRecipeApiPanel: "contract",
        activePageApiPanel: "dependencies",
        activeComponentQualityPanel: "gates",
        activeRecipeQualityPanel: "gates",
        activePageQualityPanel: "readiness",
        overviewPanelItemsLength: 0,
      }),
    ).toBe("readiness");

    expect(
      resolveDesignLabPageShellRightRailSelectionKind({
        layerId: "recipes",
        detailTab: "api",
        overviewPanelItemsLength: 0,
      }),
    ).toBe("recipe-api");

    expect(
      resolveDesignLabPageShellRightRailSelectionKind({
        layerId: "pages",
        detailTab: "api",
        overviewPanelItemsLength: 0,
      }),
    ).toBe("page-api");

    expect(
      resolveDesignLabPageShellRightRailSelectionKind({
        layerId: "pages",
        detailTab: "demo",
        overviewPanelItemsLength: 0,
      }),
    ).toBe("page-preview");
  });
});
