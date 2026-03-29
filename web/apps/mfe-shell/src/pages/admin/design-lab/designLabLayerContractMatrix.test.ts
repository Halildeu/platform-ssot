// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import layerContractMatrixRaw from "../design-lab.layer-contract-matrix.v1.json";

type LayerContractMatrix = {
  layers: Array<{
    layerId: string;
    sidebar: {
      primaryNavigation: string;
      selectionModel: string[];
      mustContain: string[];
      mustNotContain: string[];
    };
    hero: {
      subject: string;
      mustContain: string[];
    };
    overview: {
      mustContain: string[];
    };
    preview: {
      mustContain: string[];
      mustNotContain: string[];
    };
    api: {
      mustContain: string[];
    };
    quality: {
      mustContain: string[];
    };
    crossReferences: {
      allow: string[];
      displayMode: string;
    };
    urlState: {
      required: string[];
      optional: string[];
    };
  }>;
};

const layerContractMatrix = layerContractMatrixRaw as LayerContractMatrix;

describe("designLabLayerContractMatrix", () => {
  it("4 canonical katman icin ayrik kontrat tanimlar", () => {
    const layerIds = layerContractMatrix.layers.map((layer) => layer.layerId);

    expect(layerIds).toEqual([
      "foundations",
      "components",
      "recipes",
      "pages",
    ]);
  });

  it("her katman icin sidebar ve page shell zorunlu alanlarini tanimlar", () => {
    layerContractMatrix.layers.forEach((layer) => {
      expect(layer.sidebar.primaryNavigation).not.toHaveLength(0);
      expect(layer.sidebar.selectionModel.length).toBeGreaterThan(0);
      expect(layer.sidebar.mustContain.length).toBeGreaterThan(0);
      expect(layer.hero.subject).not.toHaveLength(0);
      expect(layer.overview.mustContain.length).toBeGreaterThan(0);
      expect(layer.preview.mustContain.length).toBeGreaterThan(0);
      expect(layer.api.mustContain.length).toBeGreaterThan(0);
      expect(layer.quality.mustContain.length).toBeGreaterThan(0);
      expect(layer.crossReferences.allow.length).toBeGreaterThan(0);
      expect(layer.urlState.required).toContain("dl_section");
    });
  });
});
