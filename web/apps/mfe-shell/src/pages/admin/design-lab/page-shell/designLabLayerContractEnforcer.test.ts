import { describe, expect, it } from "vitest";
import {
  getLayerContract,
  isLayerSurfaceAllowed,
  validateLayerSurfaceCoverage,
  validateLayerSurfaceExclusions,
} from "./designLabLayerContractEnforcer";

describe("designLabLayerContractEnforcer", () => {
  it("her katman kendi contract kurallarini dondurur", () => {
    const foundations = getLayerContract("foundations");
    expect(foundations.hero.subject).toBe("foundation_family");
    expect(foundations.sidebar.mustNotContain).toContain("recipe_cluster_list");
    expect(foundations.sidebar.mustNotContain).toContain("page_template_cards");

    const components = getLayerContract("components");
    expect(components.hero.subject).toBe("component");
    expect(components.sidebar.mustNotContain).toContain("recipe_cluster_cards");

    const recipes = getLayerContract("recipes");
    expect(recipes.hero.subject).toBe("recipe");
    expect(recipes.sidebar.mustNotContain).toContain("component_tree");
    expect(recipes.sidebar.mustNotContain).toContain("page_template_gallery");

    const pages = getLayerContract("pages");
    expect(pages.hero.subject).toBe("page_template");
    expect(pages.sidebar.mustNotContain).toContain("component_tree");
    expect(pages.sidebar.mustNotContain).toContain("recipe_wording_primary");
  });

  it("foundations sidebar'da recipe cluster list ve page template cards gosterilmez", () => {
    expect(isLayerSurfaceAllowed("foundations", "sidebar", "recipe_cluster_list")).toBe(false);
    expect(isLayerSurfaceAllowed("foundations", "sidebar", "page_template_cards")).toBe(false);
    expect(isLayerSurfaceAllowed("foundations", "sidebar", "token_theme_runtime_tree")).toBe(true);
  });

  it("components preview'da recipe ve page template gosterilmez", () => {
    expect(isLayerSurfaceAllowed("components", "preview", "recipe_preview_tab")).toBe(false);
    expect(isLayerSurfaceAllowed("components", "preview", "page_template_gallery")).toBe(false);
    expect(isLayerSurfaceAllowed("components", "preview", "live_component_showcase")).toBe(true);
  });

  it("recipes sidebar'da component tree ve foundation tree gosterilmez", () => {
    expect(isLayerSurfaceAllowed("recipes", "sidebar", "component_tree")).toBe(false);
    expect(isLayerSurfaceAllowed("recipes", "sidebar", "foundation_token_tree")).toBe(false);
  });

  it("pages preview'da recipe-first preview gosterilmez", () => {
    expect(isLayerSurfaceAllowed("pages", "preview", "recipe_first_preview")).toBe(false);
    expect(isLayerSurfaceAllowed("pages", "preview", "template_gallery")).toBe(true);
  });

  it("eksik zorunlu yuzey raporlanir", () => {
    const missing = validateLayerSurfaceCoverage(
      "foundations",
      "sidebar",
      ["system_family_context"],
    );
    expect(missing).toContain("token_theme_runtime_tree");
    expect(missing).toContain("foundation_search");
    expect(missing).not.toContain("system_family_context");
  });

  it("yasak yuzey varligi raporlanir", () => {
    const violations = validateLayerSurfaceExclusions(
      "foundations",
      "sidebar",
      ["system_family_context", "recipe_cluster_list"],
    );
    expect(violations).toEqual(["recipe_cluster_list"]);
  });

  it("tum zorunlu yuzeyler sunulursa bos liste doner", () => {
    const missing = validateLayerSurfaceCoverage(
      "foundations",
      "sidebar",
      ["system_family_context", "token_theme_runtime_tree", "foundation_search"],
    );
    expect(missing).toEqual([]);
  });

  it("yasak yuzey yoksa bos liste doner", () => {
    const violations = validateLayerSurfaceExclusions(
      "foundations",
      "sidebar",
      ["system_family_context", "token_theme_runtime_tree"],
    );
    expect(violations).toEqual([]);
  });
});
