/**
 * MCP (Model Context Protocol) Export
 *
 * Exports Design Lab catalog as machine-readable data
 * for consumption by AI tools, IDE plugins, and automation.
 *
 * Format: JSON following MCP resource pattern
 */

import type {
  DesignLabIndex,
  DesignLabIndexItem,
  DesignLabApiItem,
} from "../DesignLabProvider";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export interface MCPResource {
  uri: string;
  name: string;
  description: string;
  mimeType: "application/json";
}

export interface MCPComponentData {
  name: string;
  group: string;
  subgroup: string;
  lifecycle: string;
  availability: string;
  description: string;
  importStatement: string;
  whereUsed: string[];
  tags: string[];
  props?: Array<{
    name: string;
    type: string;
    required: boolean;
    default: string;
    description: string;
  }>;
  variantAxes?: string[];
  stateModel?: string[];
}

export interface MCPTokenData {
  name: string;
  group: string;
  description: string;
}

export interface MCPQualityData {
  name: string;
  lifecycle: string;
  qualityGates: string[];
  consumerCount: number;
  hasDocs: boolean;
  hasApi: boolean;
}

export interface MCPManifest {
  version: string;
  generatedAt: string;
  resources: MCPResource[];
  components: MCPComponentData[];
  tokens: MCPTokenData[];
  quality: MCPQualityData[];
}

/* ------------------------------------------------------------------ */
/*  Export functions                                                     */
/* ------------------------------------------------------------------ */

function itemToMCPComponent(
  item: DesignLabIndexItem,
  apiItemMap?: Map<string, DesignLabApiItem>,
): MCPComponentData {
  const api = apiItemMap?.get(item.name);

  return {
    name: item.name,
    group: item.group,
    subgroup: item.subgroup,
    lifecycle: item.lifecycle,
    availability: item.availability,
    description: item.description,
    importStatement: item.importStatement,
    whereUsed: item.whereUsed ?? [],
    tags: item.tags ?? [],
    props: api?.props?.map((p) => ({
      name: p.name,
      type: p.type,
      required: p.required,
      default: p.default,
      description: p.description,
    })),
    variantAxes: api?.variantAxes,
    stateModel: api?.stateModel,
  };
}

function itemToMCPQuality(item: DesignLabIndexItem): MCPQualityData {
  return {
    name: item.name,
    lifecycle: item.lifecycle,
    qualityGates: item.qualityGates ?? [],
    consumerCount: item.whereUsed?.length ?? 0,
    hasDocs: item.description.length > 0,
    hasApi: item.sectionIds?.includes("api") ?? false,
  };
}

export function exportCatalogAsMCP(
  index: DesignLabIndex,
  apiItemMap?: Map<string, DesignLabApiItem>,
): {
  resources: MCPResource[];
  components: MCPComponentData[];
  tokens: MCPTokenData[];
  quality: MCPQualityData[];
} {
  const components = index.items.map((item) =>
    itemToMCPComponent(item, apiItemMap),
  );

  const quality = index.items.map(itemToMCPQuality);

  // Extract token-like items (foundations / design layer)
  const tokens: MCPTokenData[] = index.items
    .filter(
      (item) =>
        item.group === "foundations" ||
        item.taxonomyGroupId === "design_tokens",
    )
    .map((item) => ({
      name: item.name,
      group: item.group,
      description: item.description,
    }));

  const resources: MCPResource[] = [
    {
      uri: "design-lab://catalog/components",
      name: "Design System Components",
      description: `Full component catalog with ${components.length} entries`,
      mimeType: "application/json",
    },
    {
      uri: "design-lab://catalog/tokens",
      name: "Design Tokens",
      description: `Design token definitions with ${tokens.length} entries`,
      mimeType: "application/json",
    },
    {
      uri: "design-lab://catalog/quality",
      name: "Quality Metrics",
      description: `Quality data for ${quality.length} components`,
      mimeType: "application/json",
    },
  ];

  return { resources, components, tokens, quality };
}

export function generateMCPManifest(
  index: DesignLabIndex,
  apiItemMap?: Map<string, DesignLabApiItem>,
): string {
  const { resources, components, tokens, quality } = exportCatalogAsMCP(
    index,
    apiItemMap,
  );

  const manifest: MCPManifest = {
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    resources,
    components,
    tokens,
    quality,
  };

  return JSON.stringify(manifest, null, 2);
}
