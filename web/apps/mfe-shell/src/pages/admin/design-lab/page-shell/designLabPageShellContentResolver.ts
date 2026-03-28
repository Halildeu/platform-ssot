import type {
  DesignLabPageShellDetailTab,
  DesignLabPageShellLayerId,
} from "./designLabPageShellLayerResolver";

export type DesignLabPageShellDetailContentKind =
  | "foundations"
  | "components"
  | "recipes"
  | "pages"
  | "ecosystem";

export type DesignLabPageShellOverviewSupplementalMetadataKind =
  | "release"
  | "adoption"
  | "migration"
  | null;

export const resolveDesignLabPageShellDetailContentKind = (
  layerId: DesignLabPageShellLayerId,
): DesignLabPageShellDetailContentKind => layerId;

export const resolveDesignLabPageShellOverviewSupplementalMetadataKind = ({
  layerId,
  detailTab,
  activeOverviewPanel,
}: {
  layerId: DesignLabPageShellLayerId;
  detailTab: DesignLabPageShellDetailTab;
  activeOverviewPanel: string;
}): DesignLabPageShellOverviewSupplementalMetadataKind => {
  if (layerId !== "components" || detailTab !== "overview") {
    return null;
  }

  if (
    activeOverviewPanel === "release"
    || activeOverviewPanel === "adoption"
    || activeOverviewPanel === "migration"
  ) {
    return activeOverviewPanel;
  }

  return null;
};
