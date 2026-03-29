// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import {
  resolveDesignLabPageShellDetailContentKind,
  resolveDesignLabPageShellOverviewSupplementalMetadataKind,
} from "./designLabPageShellContentResolver";

describe("designLabPageShellContentResolver", () => {
  it("katman bazli detail content kind dondurur", () => {
    expect(resolveDesignLabPageShellDetailContentKind("foundations")).toBe("foundations");
    expect(resolveDesignLabPageShellDetailContentKind("components")).toBe("components");
    expect(resolveDesignLabPageShellDetailContentKind("recipes")).toBe("recipes");
    expect(resolveDesignLabPageShellDetailContentKind("pages")).toBe("pages");
  });

  it("overview supplemental metadata panellerini yalniz components katmaninda acar", () => {
    expect(
      resolveDesignLabPageShellOverviewSupplementalMetadataKind({
        layerId: "components",
        detailTab: "overview",
        activeOverviewPanel: "release",
      }),
    ).toBe("release");

    expect(
      resolveDesignLabPageShellOverviewSupplementalMetadataKind({
        layerId: "components",
        detailTab: "overview",
        activeOverviewPanel: "adoption",
      }),
    ).toBe("adoption");

    expect(
      resolveDesignLabPageShellOverviewSupplementalMetadataKind({
        layerId: "components",
        detailTab: "overview",
        activeOverviewPanel: "migration",
      }),
    ).toBe("migration");

    expect(
      resolveDesignLabPageShellOverviewSupplementalMetadataKind({
        layerId: "foundations",
        detailTab: "overview",
        activeOverviewPanel: "release",
      }),
    ).toBeNull();

    expect(
      resolveDesignLabPageShellOverviewSupplementalMetadataKind({
        layerId: "pages",
        detailTab: "overview",
        activeOverviewPanel: "release",
      }),
    ).toBeNull();

    expect(
      resolveDesignLabPageShellOverviewSupplementalMetadataKind({
        layerId: "recipes",
        detailTab: "overview",
        activeOverviewPanel: "release",
      }),
    ).toBeNull();

    expect(
      resolveDesignLabPageShellOverviewSupplementalMetadataKind({
        layerId: "components",
        detailTab: "api",
        activeOverviewPanel: "release",
      }),
    ).toBeNull();
  });
});
