import { describe, expect, it } from "vitest";
import {
  resolveDesignLabPageShellDetailTabs,
  resolveDesignLabPageShellHeroCopy,
  resolveDesignLabPageShellLayerId,
  resolveDesignLabPageShellWorkspaceLabel,
} from "./designLabPageShellLayerResolver";

const translate = (key: string) =>
  (
    {
      "designlab.workspace.catalog.pages": "Pages workspace",
      "designlab.tabs.demo.label": "Preview",
      "designlab.tabs.demo.description.pages": "Pages demo",
      "designlab.tabs.api.label": "API",
      "designlab.tabs.api.description.foundations": "Foundations api",
      "designlab.hero.placeholder.foundations": "Select foundation family",
      "designlab.hero.placeholder.description.foundations":
        "Foundation placeholder",
    } as Record<string, string>
  )[key] ?? key;

describe("designLabPageShellLayerResolver", () => {
  it("canonical layer id cozumunu 4 katmanda sabitler", () => {
    expect(resolveDesignLabPageShellLayerId("foundations")).toBe("foundations");
    expect(resolveDesignLabPageShellLayerId("components")).toBe("components");
    expect(resolveDesignLabPageShellLayerId("recipes")).toBe("recipes");
    expect(resolveDesignLabPageShellLayerId("pages")).toBe("pages");
    expect(resolveDesignLabPageShellLayerId("visualization")).toBe("components");
    expect(resolveDesignLabPageShellLayerId("ai_ux")).toBe("recipes");
  });

  it("workspace label ve detail tab aciklamalarini katman bazli cozer", () => {
    expect(
      resolveDesignLabPageShellWorkspaceLabel("pages", translate),
    ).toBe("Pages workspace");

    const pageTabs = resolveDesignLabPageShellDetailTabs("pages", translate);
    const foundationTabs = resolveDesignLabPageShellDetailTabs(
      "foundations",
      translate,
    );

    expect(pageTabs.find((tab) => tab.id === "demo")?.description).toBe("Pages demo");
    expect(foundationTabs.find((tab) => tab.id === "api")?.description).toBe("Foundations api");
  });

  it("her katman kendi tab setini gorur — katmanlar arasi tab karmasi olmaz", () => {
    const foundationTabs = resolveDesignLabPageShellDetailTabs("foundations", translate);
    const componentTabs = resolveDesignLabPageShellDetailTabs("components", translate);
    const recipeTabs = resolveDesignLabPageShellDetailTabs("recipes", translate);
    const pageTabs = resolveDesignLabPageShellDetailTabs("pages", translate);

    // Foundations: overview, demo, api, quality (no general, no ux)
    const foundationTabIds = foundationTabs.map((tab) => tab.id);
    expect(foundationTabIds).toEqual(["overview", "demo", "api", "quality"]);
    expect(foundationTabIds).not.toContain("general");
    expect(foundationTabIds).not.toContain("ux");

    // Components: full set (general, demo, overview, api, ux, quality)
    expect(componentTabs.map((tab) => tab.id)).toEqual([
      "general", "demo", "overview", "api", "ux", "quality",
    ]);

    // Recipes: no ux tab
    const recipeTabIds = recipeTabs.map((tab) => tab.id);
    expect(recipeTabIds).toContain("general");
    expect(recipeTabIds).not.toContain("ux");

    // Pages: no ux tab
    const pageTabIds = pageTabs.map((tab) => tab.id);
    expect(pageTabIds).toContain("general");
    expect(pageTabIds).not.toContain("ux");
  });

  it("hero copy kararlarini katman bazli ayirir", () => {
    const foundationHero = resolveDesignLabPageShellHeroCopy(
      {
        layerId: "foundations",
        lensLabel: "Foundations",
      },
      translate,
    );
    const pageHero = resolveDesignLabPageShellHeroCopy(
      {
        layerId: "pages",
        lensLabel: "Pages",
        familyTitle: "Dashboard Template",
        familyIntent: "Layout shell",
      },
      translate,
    );

    expect(foundationHero.title).toBe("Select foundation family");
    expect(foundationHero.description).toBe("Foundation placeholder");
    expect(pageHero.title).toBe("Dashboard Template");
    expect(pageHero.description).toBe("Layout shell");
  });
});
