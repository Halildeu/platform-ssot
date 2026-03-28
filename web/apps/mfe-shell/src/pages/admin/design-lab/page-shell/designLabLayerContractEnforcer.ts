import type { DesignLabPageShellLayerId } from "./designLabPageShellLayerResolver";

/**
 * Runtime layer contract enforcer.
 *
 * Encodes the rules from design-lab.layer-contract-matrix.v1.json
 * so that each layer only renders surfaces it owns and never leaks
 * content from another layer.
 */

type LayerContractRule = {
  sidebar: {
    mustContain: readonly string[];
    mustNotContain: readonly string[];
  };
  hero: {
    subject: string;
    mustContain: readonly string[];
  };
  preview: {
    mustContain: readonly string[];
    mustNotContain: readonly string[];
  };
};

const layerContracts: Record<DesignLabPageShellLayerId, LayerContractRule> = {
  foundations: {
    sidebar: {
      mustContain: ["system_family_context", "token_theme_runtime_tree", "foundation_search"],
      mustNotContain: ["recipe_cluster_list", "page_template_cards", "component_import_cta"],
    },
    hero: {
      subject: "foundation_family",
      mustContain: ["foundation_title", "foundation_description", "foundation_governance_badges"],
    },
    preview: {
      mustContain: ["theme_preview", "token_preview", "reference_surfaces"],
      mustNotContain: ["component_demo_gallery", "recipe_showcase"],
    },
  },
  components: {
    sidebar: {
      mustContain: ["component_family_context", "component_tree", "component_search"],
      mustNotContain: ["recipe_cluster_cards", "page_template_list", "workflow_sidebar_copy"],
    },
    hero: {
      subject: "component",
      mustContain: ["component_title", "import_action", "catalog_family"],
    },
    preview: {
      mustContain: ["live_component_showcase", "reference_notes"],
      mustNotContain: ["recipe_preview_tab", "page_template_gallery"],
    },
  },
  recipes: {
    sidebar: {
      mustContain: ["recipe_cluster_list", "recipe_context_card", "recipe_search"],
      mustNotContain: ["component_tree", "foundation_token_tree", "page_template_gallery"],
    },
    hero: {
      subject: "recipe",
      mustContain: ["recipe_title", "workflow_intent", "owner_blocks"],
    },
    preview: {
      mustContain: ["recipe_showcase", "live_reference_surfaces"],
      mustNotContain: ["component_only_preview", "page_template_cards"],
    },
  },
  pages: {
    sidebar: {
      mustContain: ["page_family_list", "page_context_card", "page_search"],
      mustNotContain: ["recipe_wording_primary", "component_tree", "token_governance_tree"],
    },
    hero: {
      subject: "page_template",
      mustContain: ["page_title", "layout_intent", "template_family"],
    },
    preview: {
      mustContain: ["page_preview", "template_gallery", "layout_reference"],
      mustNotContain: ["recipe_first_preview", "component_import_action"],
    },
  },
  ecosystem: {
    sidebar: {
      mustContain: ["extension_catalog", "enterprise_context_card", "enterprise_search"],
      mustNotContain: ["foundation_token_tree", "recipe_cluster_list", "page_template_gallery"],
    },
    hero: {
      subject: "enterprise_extension",
      mustContain: ["extension_title", "pro_lane_badge", "data_surface_family"],
    },
    preview: {
      mustContain: ["enterprise_preview", "data_surface_showcase", "pro_demo"],
      mustNotContain: ["foundation_token_preview", "recipe_first_preview"],
    },
  },
};

/**
 * Returns the contract rules for a given layer.
 */
export const getLayerContract = (
  layerId: DesignLabPageShellLayerId,
): LayerContractRule => layerContracts[layerId];

/**
 * Checks if a surface element is allowed in the given layer.
 *
 * @param layerId - The active layer
 * @param zone - Which zone to check ("sidebar" | "preview")
 * @param surfaceId - The surface element identifier
 * @returns true if the surface is NOT in the mustNotContain list
 */
export const isLayerSurfaceAllowed = (
  layerId: DesignLabPageShellLayerId,
  zone: "sidebar" | "preview",
  surfaceId: string,
): boolean => {
  const contract = layerContracts[layerId];
  const zoneContract = contract[zone];
  return !zoneContract.mustNotContain.includes(surfaceId);
};

/**
 * Validates whether all required surfaces are present for a given layer/zone.
 *
 * Useful for development-time diagnostics and test assertions.
 *
 * @param layerId - The active layer
 * @param zone - Which zone to check
 * @param presentSurfaceIds - The surface IDs currently rendered
 * @returns List of missing required surface IDs (empty = all good)
 */
export const validateLayerSurfaceCoverage = (
  layerId: DesignLabPageShellLayerId,
  zone: "sidebar" | "preview",
  presentSurfaceIds: readonly string[],
): string[] => {
  const contract = layerContracts[layerId];
  const zoneContract = contract[zone];
  const presentSet = new Set(presentSurfaceIds);

  return zoneContract.mustContain.filter((id) => !presentSet.has(id));
};

/**
 * Validates that no forbidden surfaces are present for a given layer/zone.
 *
 * @param layerId - The active layer
 * @param zone - Which zone to check
 * @param presentSurfaceIds - The surface IDs currently rendered
 * @returns List of forbidden surface IDs that are present (empty = all good)
 */
export const validateLayerSurfaceExclusions = (
  layerId: DesignLabPageShellLayerId,
  zone: "sidebar" | "preview",
  presentSurfaceIds: readonly string[],
): string[] => {
  const contract = layerContracts[layerId];
  const zoneContract = contract[zone];
  const presentSet = new Set(presentSurfaceIds);

  return zoneContract.mustNotContain.filter((id) => presentSet.has(id));
};
