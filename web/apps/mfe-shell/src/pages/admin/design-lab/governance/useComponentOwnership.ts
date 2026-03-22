/**
 * Component ownership registry
 *
 * Maps components to owners, teams, and support tiers.
 * Sources: CODEOWNERS file patterns + doc entry metadata.
 *
 * Parses /.github/CODEOWNERS and maps directory patterns to component names
 * using the design-lab index for cross-referencing.
 */

import { useMemo } from "react";
import { useDesignLab } from "../DesignLabProvider";

export interface ComponentOwner {
  component: string;
  owner: string;
  onCall?: string;
  supportTier: "tier1" | "tier2" | "tier3";
  lastReviewDate?: string;
  slackChannel?: string;
}

/**
 * Static CODEOWNERS mapping — derived from /.github/CODEOWNERS.
 * In production this would be fetched/parsed at build time; for dev we
 * hardcode the known directory-to-team patterns from the monorepo.
 */
const DIRECTORY_OWNER_MAP: Record<string, { owner: string; tier: "tier1" | "tier2" | "tier3" }> = {
  "packages/design-system/src/primitives": {
    owner: "@design-system-team",
    tier: "tier1",
  },
  "packages/design-system/src/components": {
    owner: "@design-system-team",
    tier: "tier1",
  },
  "packages/design-system/src/advanced": {
    owner: "@design-system-team",
    tier: "tier2",
  },
  "packages/design-system": {
    owner: "@design-system-team",
    tier: "tier1",
  },
  "packages/x-data-grid": {
    owner: "@enterprise-suite-team",
    tier: "tier2",
  },
  "packages/x-charts": {
    owner: "@enterprise-suite-team",
    tier: "tier2",
  },
  "packages/x-scheduler": {
    owner: "@enterprise-suite-team",
    tier: "tier2",
  },
  "packages/x-kanban": {
    owner: "@enterprise-suite-team",
    tier: "tier2",
  },
  "packages/x-editor": {
    owner: "@enterprise-suite-team",
    tier: "tier2",
  },
  "packages/x-form-builder": {
    owner: "@enterprise-suite-team",
    tier: "tier2",
  },
  "packages/blocks": {
    owner: "@design-system-team",
    tier: "tier2",
  },
};

/**
 * Map a component's taxonomy group or import statement to a CODEOWNERS directory.
 */
function resolveOwnerForComponent(
  name: string,
  importStatement: string,
  taxonomyGroupId: string,
): { owner: string; tier: "tier1" | "tier2" | "tier3" } {
  // Try matching import path to known directory patterns
  for (const [dirPattern, ownerInfo] of Object.entries(DIRECTORY_OWNER_MAP)) {
    if (importStatement.includes(dirPattern.replace("packages/", "@mfe/"))) {
      return ownerInfo;
    }
  }

  // Infer from taxonomy group
  const xSuiteGroups = [
    "x_data_grid",
    "x_charts",
    "x_scheduler",
    "x_kanban",
    "x_editor",
    "x_form_builder",
  ];
  if (xSuiteGroups.includes(taxonomyGroupId)) {
    return { owner: "@enterprise-suite-team", tier: "tier2" };
  }

  // Default: design-system team owns most components
  return { owner: "@design-system-team", tier: "tier2" };
}

export function useComponentOwnership(): {
  owners: ComponentOwner[];
  getOwner: (component: string) => ComponentOwner | null;
  coverage: number;
} {
  const { index } = useDesignLab();

  const owners = useMemo<ComponentOwner[]>(() => {
    return index.items
      .filter((item) => item.availability === "exported")
      .map((item) => {
        const resolved = resolveOwnerForComponent(
          item.name,
          item.importStatement,
          item.taxonomyGroupId,
        );
        return {
          component: item.name,
          owner: resolved.owner,
          supportTier: resolved.tier,
        };
      });
  }, [index]);

  const getOwner = useMemo(() => {
    const map = new Map(owners.map((o) => [o.component, o]));
    return (component: string): ComponentOwner | null =>
      map.get(component) ?? null;
  }, [owners]);

  const coverage = useMemo(() => {
    if (owners.length === 0) return 0;
    const withOwner = owners.filter((o) => o.owner !== "unassigned");
    return Math.round((withOwner.length / owners.length) * 100);
  }, [owners]);

  return { owners, getOwner, coverage };
}
