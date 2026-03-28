import React, { createContext, useContext, useMemo } from "react";
import designLabIndexRaw from "../design-lab.index.json";
import designLabGeneratedMetaRaw from "../design-lab.generated-meta.v1.json";
import designLabTaxonomyRaw from "../design-lab.taxonomy.v1.json";
import {
  designLabApiCatalogMeta,
  designLabApiItems,
  designLabIndexItems,
  designLabComponentDocMap,
} from "../../../../../../packages/design-system/src/catalog/component-docs";
import type { DesignLabComponentDocEntry } from "../../../../../../packages/design-system/src/catalog/component-docs/types";
export type { DesignLabComponentDocEntry };
import { useDesignLabI18n } from "./useDesignLabI18n";

/* ------------------------------------------------------------------ */
/*  Shared types (extracted from monolithic DesignLabPage)             */
/* ------------------------------------------------------------------ */

export type DesignLabLifecycle = "stable" | "beta" | "planned";
export type DesignLabAvailability = "exported" | "planned";
export type DesignLabDemoMode = "live" | "inspector" | "planned";
export type DesignLabTrack = "new_packages" | "current_system" | "roadmap";

export type DesignLabIndexItem = {
  name: string;
  kind: "component" | "hook" | "function" | "const";
  importStatement: string;
  whereUsed: string[];
  group: string;
  subgroup: string;
  tags?: string[];
  availability: DesignLabAvailability;
  lifecycle: DesignLabLifecycle;
  taxonomyGroupId: string;
  taxonomySubgroup: string;
  demoMode: DesignLabDemoMode;
  description: string;
  sectionIds: string[];
  qualityGates: string[];
  uxPrimaryThemeId?: string;
  uxPrimarySubthemeId?: string;
  roadmapWaveId?: string;
  acceptanceContractId?: string;
};

export type DesignLabApiProp = {
  name: string;
  type: string;
  default: string;
  required: boolean;
  description: string;
};

export type DesignLabApiItem = {
  name: string;
  variantAxes: string[];
  stateModel: string[];
  props: DesignLabApiProp[];
  previewFocus: string[];
  regressionFocus: string[];
};

export type DesignLabApiCatalog = {
  version: string;
  subject_id: string;
  wave_id: string;
  items: DesignLabApiItem[];
};

export type DesignLabTaxonomySection = {
  id: string;
  groupIds: string[];
};

export type DesignLabTaxonomyGroup = {
  id: string;
  label: string;
  subgroups: Array<{
    label: string;
    items: string[];
  }>;
};

export type DesignLabTaxonomy = {
  defaults: {
    defaultSection: string;
    defaultTrack?: string;
  };
  sections: DesignLabTaxonomySection[];
  groups: DesignLabTaxonomyGroup[];
};

export type DesignLabIndex = {
  version?: number;
  generatedAt?: string;
  summary?: {
    total: number;
    exported: number;
    planned: number;
    liveDemo: number;
    inspector: number;
  };
  release?: Record<string, unknown>;
  adoption?: Record<string, unknown>;
  migration?: Record<string, unknown>;
  items: DesignLabIndexItem[];
  recipes?: {
    currentFamilies: Array<{
      recipeId: string;
      title: string;
      intent: string;
      sectionIds?: string[];
      ownerBlocks: string[];
    }>;
  };
  pages?: {
    currentFamilies: Array<{
      pageId: string;
      title: string;
      intent: string;
      sectionIds?: string[];
      ownerBlocks: string[];
      clusterTitle?: string;
      clusterDescription?: string;
    }>;
  };
  ecosystem?: {
    currentFamilies: Array<{
      extensionId: string;
      title: string;
      intent: string;
      sectionIds?: string[];
      ownerBlocks: string[];
    }>;
  };
};

export type DesignLabTranslate = (
  key: string,
  variables?: Record<string, string | number>,
) => string;

/* ------------------------------------------------------------------ */
/*  Static data (parsed once at module scope)                          */
/* ------------------------------------------------------------------ */

const designLabIndex = {
  ...(designLabGeneratedMetaRaw as Record<string, unknown>),
  ...(designLabIndexRaw as Record<string, unknown>),
  items: designLabIndexItems as DesignLabIndexItem[],
} as unknown as DesignLabIndex;

/**
 * Transform raw taxonomy JSON into the shape expected by DesignLabTaxonomyGroup.
 * Raw JSON has `title` (not `label`) and `subgroups` as flat string[].
 * We convert each string subgroup into {label, items} by cross-referencing
 * designLabIndexItems where each item has taxonomyGroupId + taxonomySubgroup.
 */
const designLabTaxonomy = (() => {
  const raw = designLabTaxonomyRaw as Record<string, unknown>;
  const rawGroups = (raw as { groups: Array<{ id: string; title: string; subgroups: string[] }> }).groups;

  // Build lookup: groupId → subgroupLabel → item names
  const groupSubgroupItems = new Map<string, Map<string, string[]>>();
  for (const item of designLabIndexItems as DesignLabIndexItem[]) {
    const gid = item.taxonomyGroupId;
    const sg = item.taxonomySubgroup;
    if (!gid || !sg) continue;
    if (!groupSubgroupItems.has(gid)) groupSubgroupItems.set(gid, new Map());
    const sgMap = groupSubgroupItems.get(gid)!;
    if (!sgMap.has(sg)) sgMap.set(sg, []);
    sgMap.get(sg)!.push(item.name);
  }

  const groups: DesignLabTaxonomyGroup[] = rawGroups.map((g) => ({
    id: g.id,
    label: g.title, // JSON uses "title", type expects "label"
    subgroups: g.subgroups.map((sgLabel) => ({
      label: sgLabel,
      items: groupSubgroupItems.get(g.id)?.get(sgLabel) ?? [],
    })),
  }));

  return {
    ...raw,
    groups,
  } as unknown as DesignLabTaxonomy;
})();

const designLabTaxonomySectionIds = designLabTaxonomy.sections.map(
  (s) => s.id,
);
const designLabTaxonomySectionMap = new Map(
  designLabTaxonomy.sections.map((s) => [s.id, s] as const),
);
const designLabTaxonomyGroupMap = new Map(
  designLabTaxonomy.groups.map((g) => [g.id, g] as const),
);
const designLabTaxonomyGroupSectionMap = new Map(
  designLabTaxonomy.sections.flatMap((section) =>
    section.groupIds.map((gid) => [gid, section.id] as const),
  ),
);

const designLabIndexItemMap = new Map(
  designLabIndex.items.map((item) => [item.name, item] as const),
);

const componentApiCatalog = {
  ...designLabApiCatalogMeta,
  items: designLabApiItems as DesignLabApiItem[],
} as DesignLabApiCatalog;

const componentApiItemMap = new Map(
  componentApiCatalog.items.map((item) => [item.name, item] as const),
);

/* ------------------------------------------------------------------ */
/*  Recipe / page primary section mapping                              */
/* ------------------------------------------------------------------ */

export const designLabRecipePrimarySectionById: Record<string, string> = {
  search_filter_listing: "recipes",
  detail_summary: "recipes",
  dashboard_template: "pages",
  crud_template: "pages",
  detail_template: "pages",
  approval_review: "recipes",
  empty_error_loading: "recipes",
  ai_guided_authoring: "recipes",
  command_workspace: "pages",
  settings_template: "pages",
  app_header: "recipes",
  navigation_menu: "recipes",
  search_command_header: "recipes",
  action_header: "recipes",
  desktop_menubar: "recipes",
};

/* ------------------------------------------------------------------ */
/*  Context value type                                                 */
/* ------------------------------------------------------------------ */

type DesignLabContextValue = {
  /* Static data */
  index: DesignLabIndex;
  taxonomy: DesignLabTaxonomy;
  taxonomySectionIds: string[];
  taxonomySectionMap: Map<string, DesignLabTaxonomySection>;
  taxonomyGroupMap: Map<string, DesignLabTaxonomyGroup>;
  taxonomyGroupSectionMap: Map<string, string>;
  indexItemMap: Map<string, DesignLabIndexItem>;
  apiCatalog: DesignLabApiCatalog;
  apiItemMap: Map<string, DesignLabApiItem>;
  docEntryMap: Map<string, DesignLabComponentDocEntry>;

  /* i18n helpers */
  t: DesignLabTranslate;
  formatDate: (date: Date | number, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (num: number) => string;

  /* Taxonomy presentation helpers */
  getTaxonomySectionTitle: (sectionId: string, fallback: string) => string;
  getTaxonomySectionDescription: (
    sectionId: string,
    fallback?: string | null,
  ) => string | null;
};

const DesignLabContext = createContext<DesignLabContextValue | null>(null);

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useDesignLab(): DesignLabContextValue {
  const ctx = useContext(DesignLabContext);
  if (!ctx) {
    throw new Error(
      "useDesignLab must be used within a <DesignLabProvider>",
    );
  }
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

const isMissingTranslationValue = (val: string | undefined): boolean =>
  !val || val.startsWith("designlab.");

export function DesignLabProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t, formatDate, formatNumber } = useDesignLabI18n();

  const taxonomySectionPresentationMap = useMemo(
    () =>
      new Map(
        designLabTaxonomy.sections.map((section) => [
          section.id,
          {
            title: t(`designlab.taxonomy.sections.${section.id}.title`),
            description: t(
              `designlab.taxonomy.sections.${section.id}.description`,
            ),
          },
        ]),
      ),
    [t],
  );

  const getTaxonomySectionTitle = React.useCallback(
    (sectionId: string, fallbackTitle: string) => {
      const mapped = taxonomySectionPresentationMap.get(sectionId)?.title;
      return isMissingTranslationValue(mapped) ? fallbackTitle : (mapped ?? fallbackTitle);
    },
    [taxonomySectionPresentationMap],
  );

  const getTaxonomySectionDescription = React.useCallback(
    (sectionId: string, fallbackDescription?: string | null) => {
      const mapped = taxonomySectionPresentationMap.get(sectionId)?.description;
      return isMissingTranslationValue(mapped)
        ? (fallbackDescription ?? null)
        : (mapped ?? fallbackDescription ?? null);
    },
    [taxonomySectionPresentationMap],
  );

  const value = useMemo<DesignLabContextValue>(
    () => ({
      index: designLabIndex,
      taxonomy: designLabTaxonomy,
      taxonomySectionIds: designLabTaxonomySectionIds,
      taxonomySectionMap: designLabTaxonomySectionMap,
      taxonomyGroupMap: designLabTaxonomyGroupMap,
      taxonomyGroupSectionMap: designLabTaxonomyGroupSectionMap,
      indexItemMap: designLabIndexItemMap,
      apiCatalog: componentApiCatalog,
      apiItemMap: componentApiItemMap,
      docEntryMap: designLabComponentDocMap,
      t,
      formatDate,
      formatNumber,
      getTaxonomySectionTitle,
      getTaxonomySectionDescription,
    }),
    [t, formatDate, formatNumber, getTaxonomySectionTitle, getTaxonomySectionDescription],
  );

  return (
    <DesignLabContext.Provider value={value}>
      {children}
    </DesignLabContext.Provider>
  );
}
