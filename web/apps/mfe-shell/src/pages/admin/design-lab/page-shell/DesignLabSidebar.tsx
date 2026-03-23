import React from "react";
import { CircleHelp, Search } from "lucide-react";
import { IconButton, Text, Tooltip } from "@mfe/design-system";
import { useDesignLabI18n } from "../useDesignLabI18n";
import { normalizeDesignLabSectionId } from "./designLabSectionRouting";
import type { DesignLabFamilyIdentity } from "./designLabFamilyModel";
import {
  FoundationsSidebarRenderer,
  ComponentsSidebarRenderer,
  RecipesSidebarRenderer,
  PagesSidebarRenderer,
  EcosystemSidebarRenderer,
} from "./sidebar";

type DesignLabSidebarFamily = DesignLabFamilyIdentity & {
  title?: string;
  clusterTitle?: string;
  clusterDescription?: string;
  intent: string;
  ownerBlocks: string[];
  primarySectionTitle?: string | null;
};

type DesignLabSidebarProps = {
  activeLayerId: string;
  sidebarHelpText: string;
  sidebarSearchValue: string;
  sidebarSearchPlaceholder: string;
  activeTaxonomySectionTitle?: string | null;
  componentFamilyTitle?: string | null;
  componentFamilyDescription?: string | null;
  componentFamilyBadges?: string[];
  foundationFamilyTitle?: string | null;
  foundationFamilyDescription?: string | null;
  foundationFamilyBadges?: string[];
  familyItems: DesignLabSidebarFamily[];
  selectedFamilyId: string | null;
  onFamilySelect: (familyId: string) => void;
  onSearchChange: (value: string) => void;
  treeTracks: any[];
  treeSelection: any;
  onTreeSelectionChange: (selection: any) => void;
  ProductTreeComponent: React.ComponentType<any>;
  SectionBadgeComponent: React.ComponentType<any>;
};

type DesignLabSidebarLayerId =
  | "foundations"
  | "components"
  | "recipes"
  | "pages"
  | "ecosystem";

const resolveSidebarLayerId = (
  sectionId: string | null | undefined,
): DesignLabSidebarLayerId => {
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

const resolveSidebarLayerTitle = (
  layerId: DesignLabSidebarLayerId,
  activeTaxonomySectionTitle: string | null | undefined,
  t: (key: string, params?: Record<string, unknown>) => string,
) =>
  activeTaxonomySectionTitle
  ?? t(`designlab.sidebar.title.${layerId}`);

/**
 * DesignLabSidebar - delegates to 4 layer-specific renderers.
 *
 * Each layer has its own sidebar renderer (FoundationsSidebarRenderer,
 * ComponentsSidebarRenderer, RecipesSidebarRenderer, PagesSidebarRenderer)
 * that enforces the layer-contract-matrix mustContain/mustNotContain rules.
 *
 * The outer shell (header, search, help) is shared across all layers.
 */
export const DesignLabSidebar: React.FC<DesignLabSidebarProps> = ({
  activeLayerId,
  sidebarHelpText,
  sidebarSearchValue,
  sidebarSearchPlaceholder,
  activeTaxonomySectionTitle,
  componentFamilyTitle,
  componentFamilyDescription,
  componentFamilyBadges = [],
  foundationFamilyTitle,
  foundationFamilyDescription,
  foundationFamilyBadges = [],
  familyItems,
  selectedFamilyId,
  onFamilySelect,
  onSearchChange,
  treeTracks,
  treeSelection,
  onTreeSelectionChange,
  ProductTreeComponent,
  SectionBadgeComponent,
}) => {
  const { t } = useDesignLabI18n();
  const layerId = React.useMemo(
    () => resolveSidebarLayerId(activeLayerId),
    [activeLayerId],
  );
  const layerTitle = React.useMemo(
    () => resolveSidebarLayerTitle(layerId, activeTaxonomySectionTitle, t),
    [activeTaxonomySectionTitle, layerId, t],
  );
  const sidebarLayerHelpText = React.useMemo(
    () => t(`designlab.sidebar.help.${layerId}`) || sidebarHelpText,
    [layerId, sidebarHelpText, t],
  );
  const sidebarLayerSearchPlaceholder = React.useMemo(
    () => t(`designlab.sidebar.search.${layerId}.placeholder`) || sidebarSearchPlaceholder,
    [layerId, sidebarSearchPlaceholder, t],
  );

  const headerSummaryText = React.useMemo(() => {
    switch (layerId) {
      case "recipes":
        return t("designlab.sidebar.recipe.count", { count: familyItems.length });
      case "pages":
        return t("designlab.sidebar.page.count", { count: familyItems.length });
      case "ecosystem":
        return t("designlab.sidebar.ecosystem.count", { count: familyItems.length });
      case "foundations":
        return foundationFamilyTitle ?? t("designlab.sidebar.context.empty");
      case "components":
      default:
        return componentFamilyTitle ?? t("designlab.sidebar.context.empty");
    }
  }, [layerId, familyItems.length, foundationFamilyTitle, componentFamilyTitle, t]);

  const rendererProps = {
    layerTitle,
    sidebarSearchValue,
    foundationFamilyTitle,
    foundationFamilyDescription,
    foundationFamilyBadges,
    componentFamilyTitle,
    componentFamilyDescription,
    componentFamilyBadges,
    familyItems,
    selectedFamilyId,
    onFamilySelect,
    treeTracks,
    treeSelection,
    onTreeSelectionChange,
    ProductTreeComponent,
    SectionBadgeComponent,
    t,
  };

  return (
    <aside
      data-testid="design-lab-sidebar"
      className="relative z-10 sticky top-4 flex max-h-[calc(100vh-32px)] min-h-0 flex-col overflow-hidden rounded-[28px] border border-border-subtle bg-surface-default shadow-xs"
    >
      <div className="border-b border-border-subtle px-4 py-4">
        <Text
          as="div"
          variant="secondary"
          className="sr-only text-[11px] font-semibold uppercase tracking-[0.22em]"
        >
          {t("designlab.breadcrumb.library")}
        </Text>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 pr-2">
            <Text
              as="div"
              className="text-[1.2rem] font-semibold leading-tight text-text-primary"
            >
              {layerTitle}
            </Text>
            <Text variant="secondary" className="mt-1 block text-xs leading-5">
              {headerSummaryText}
            </Text>
          </div>
          <Tooltip text={sidebarLayerHelpText}>
            <span className="shrink-0">
              <IconButton
                icon={<CircleHelp className="h-4 w-4" />}
                label={t("designlab.sidebar.context.title")}
                size="sm"
                variant="ghost"
              />
            </span>
          </Tooltip>
        </div>
        <div className="mt-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
            <input
              data-testid="design-lab-search"
              value={sidebarSearchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={sidebarLayerSearchPlaceholder}
              className="h-11 w-full rounded-2xl border border-border-subtle bg-surface-canvas pl-10 pr-3.5 text-sm text-text-primary shadow-none transition focus:border-border-default focus:outline-hidden focus:ring-2 focus:ring-[var(--accent-focus)] focus:ring-offset-1"
              aria-label={t("designlab.sidebar.search.aria")}
            />
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-3 py-4">
        {layerId === "foundations" ? (
          <FoundationsSidebarRenderer {...rendererProps} />
        ) : layerId === "recipes" ? (
          <RecipesSidebarRenderer {...rendererProps} />
        ) : layerId === "pages" ? (
          <PagesSidebarRenderer {...rendererProps} />
        ) : layerId === "ecosystem" ? (
          <EcosystemSidebarRenderer {...rendererProps} />
        ) : (
          <ComponentsSidebarRenderer {...rendererProps} />
        )}
      </div>
    </aside>
  );
};
