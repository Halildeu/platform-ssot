import { normalizeDesignLabSectionId } from "./designLabSectionRouting";

export type DesignLabPageShellLayerId =
  | "foundations"
  | "components"
  | "recipes"
  | "pages"
  | "ecosystem";

export type DesignLabPageShellDetailTab =
  | "general"
  | "demo"
  | "overview"
  | "api"
  | "ux"
  | "quality";

type DesignLabTranslate = (
  key: string,
  variables?: Record<string, string | number>,
) => string;

type ResolvePageShellHeroCopyArgs = {
  layerId: DesignLabPageShellLayerId;
  lensLabel: string;
  foundationTitle?: string | null;
  foundationDescription?: string | null;
  componentName?: string | null;
  componentDescription?: string | null;
  familyTitle?: string | null;
  familyId?: string | null;
  familyIntent?: string | null;
};

type DesignLabPageShellHeroCopy = {
  label: string;
  title: string;
  description: string;
};

const detailTabIds: DesignLabPageShellDetailTab[] = [
  "general",
  "demo",
  "overview",
  "api",
  "ux",
  "quality",
];

/**
 * Layer-specific detail tab sets.
 *
 * Each layer shows only the tabs relevant to its information architecture:
 * - Foundations: overview (token governance), api (runtime contract), quality (a11y/theme gates), demo (theme preview)
 * - Components: general, demo, overview, api, ux, quality (full set)
 * - Recipes: general, demo (recipe showcase), overview, api (bindings), quality (workflow gates)
 * - Pages: general, demo (page preview), overview (regions/shells), api (dependencies), quality (readiness)
 * - Ecosystem: general, demo (data surface preview), overview (extensions), api (pro API), quality (enterprise gates)
 */
const layerDetailTabIds: Record<DesignLabPageShellLayerId, DesignLabPageShellDetailTab[]> = {
  foundations: ["overview", "demo", "api", "quality"],
  components: ["general", "demo", "overview", "api", "ux", "quality"],
  recipes: ["general", "demo", "overview", "api", "quality"],
  pages: ["general", "demo", "overview", "api", "quality"],
  ecosystem: ["general", "demo", "overview", "api", "quality"],
};

export const resolveDesignLabPageShellLayerId = (
  sectionId: string | null | undefined,
): DesignLabPageShellLayerId => {
  const normalizedSectionId = normalizeDesignLabSectionId(sectionId);

  if (
    normalizedSectionId === "foundations"
    || normalizedSectionId === "components"
    || normalizedSectionId === "recipes"
    || normalizedSectionId === "pages"
    || normalizedSectionId === "ecosystem"
  ) {
    return normalizedSectionId;
  }

  return "components";
};

export const resolveDesignLabPageShellWorkspaceLabel = (
  layerId: DesignLabPageShellLayerId,
  t: DesignLabTranslate,
) => t(`designlab.workspace.catalog.${layerId}`);

export const resolveDesignLabPageShellDetailTabs = (
  layerId: DesignLabPageShellLayerId,
  t: DesignLabTranslate,
): Array<{
  id: DesignLabPageShellDetailTab;
  label: string;
  description: string;
}> => {
  const tabIds = layerDetailTabIds[layerId] ?? detailTabIds;

  return tabIds.map((tabId) => {
    const layerLabelKey = `designlab.tabs.${tabId}.label.${layerId}`;
    const layerLabel = t(layerLabelKey);
    const layerDescriptionKey = `designlab.tabs.${tabId}.description.${layerId}`;
    const layerDescription = t(layerDescriptionKey);

    return {
      id: tabId,
      label:
        layerLabel === layerLabelKey
          ? t(`designlab.tabs.${tabId}.label`)
          : layerLabel,
      description:
        layerDescription === layerDescriptionKey
          ? t(`designlab.tabs.${tabId}.description`)
          : layerDescription,
    };
  });
};

export const resolveDesignLabPageShellHeroCopy = (
  {
    layerId,
    lensLabel,
    foundationTitle,
    foundationDescription,
    componentName,
    componentDescription,
    familyTitle,
    familyId,
    familyIntent,
  }: ResolvePageShellHeroCopyArgs,
  t: DesignLabTranslate,
): DesignLabPageShellHeroCopy => {
  switch (layerId) {
    case "foundations":
      return {
        label: lensLabel,
        title:
          foundationTitle ?? t("designlab.hero.placeholder.foundations"),
        description:
          foundationDescription
          ?? t("designlab.hero.placeholder.description.foundations"),
      };
    case "recipes":
      return {
        label: lensLabel,
        title:
          familyTitle ?? familyId ?? t("designlab.hero.placeholder.recipe"),
        description:
          familyIntent ?? t("designlab.hero.placeholder.description.recipe"),
      };
    case "pages":
      return {
        label: lensLabel,
        title:
          familyTitle ?? familyId ?? t("designlab.hero.placeholder.page"),
        description:
          familyIntent ?? t("designlab.hero.placeholder.description.page"),
      };
    case "ecosystem":
      return {
        label: lensLabel,
        title:
          familyTitle ?? familyId ?? t("designlab.hero.placeholder.ecosystem"),
        description:
          familyIntent ?? t("designlab.hero.placeholder.description.ecosystem"),
      };
    case "components":
    default:
      return {
        label: lensLabel,
        title: componentName ?? t("designlab.hero.placeholder.component"),
        description:
          componentDescription
          ?? t("designlab.hero.placeholder.description.component"),
      };
  }
};
