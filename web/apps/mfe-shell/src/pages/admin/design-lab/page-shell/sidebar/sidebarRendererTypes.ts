import type React from "react";
import type { DesignLabFamilyIdentity } from "../designLabFamilyModel";

export type DesignLabSidebarFamily = DesignLabFamilyIdentity & {
  title?: string;
  clusterTitle?: string;
  clusterDescription?: string;
  intent: string;
  ownerBlocks: string[];
  primarySectionTitle?: string | null;
};

/**
 * Shared props contract for all 4 layer-specific sidebar renderers.
 *
 * Each renderer picks only what it needs from this union.
 * - Foundations + Components use: tree*, *FamilyTitle/Description/Badges
 * - Recipes + Pages use: familyItems, selectedFamilyId, onFamilySelect
 */
export type DesignLabSidebarRendererProps = {
  layerTitle: string;
  sidebarSearchValue: string;

  // Foundations-specific props
  foundationFamilyTitle?: string | null;
  foundationFamilyDescription?: string | null;
  foundationFamilyBadges?: string[];

  // Components-specific props
  componentFamilyTitle?: string | null;
  componentFamilyDescription?: string | null;
  componentFamilyBadges?: string[];

  // Recipe/Page family props
  familyItems: DesignLabSidebarFamily[];
  selectedFamilyId: string | null;
  onFamilySelect: (familyId: string) => void;

  // Tree props (foundations + components)
  treeTracks: any[];
  treeSelection: any;
  onTreeSelectionChange: (selection: any) => void;

  // Shared render components
  ProductTreeComponent: React.ComponentType<any>;
  SectionBadgeComponent: React.ComponentType<any>;

  // i18n
  t: (key: string, params?: Record<string, unknown>) => string;
};
