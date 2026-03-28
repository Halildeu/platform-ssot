/**
 * Blast-radius analysis — when a component changes, what breaks?
 *
 * Builds a dependency graph from:
 * - doc entry whereUsed[] metadata
 * - recipe/pattern composition relationships
 * - import analysis from barrel exports
 *
 * Returns: affected apps, pages, recipes, owners
 */

import { useMemo } from "react";
import { useDesignLab } from "../DesignLabProvider";
import type { DesignLabIndexItem, DesignLabIndex } from "../DesignLabProvider";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export interface Consumer {
  name: string;
  type: "app" | "recipe" | "pattern" | "component";
  path: string;
}

export interface BlastRadius {
  component: string;
  directConsumers: Consumer[];
  transitiveConsumers: Consumer[];
  affectedApps: string[];
  affectedRecipes: string[];
  affectedOwners: string[];
  riskScore: "low" | "medium" | "high" | "critical";
  totalImpact: number;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

const KNOWN_APPS = ["mfe-shell", "mfe-suggestions", "mfe-reports", "mfe-settings", "mfe-crm"];

function classifyConsumer(usedByEntry: string): Consumer {
  const lower = usedByEntry.toLowerCase();

  // Check if it's an app reference
  for (const app of KNOWN_APPS) {
    if (lower.includes(app)) {
      return { name: app, type: "app", path: usedByEntry };
    }
  }

  // Check if it's a recipe
  if (lower.includes("recipe") || lower.includes("Recipe")) {
    return { name: usedByEntry, type: "recipe", path: usedByEntry };
  }

  // Check if it's a pattern/page
  if (lower.includes("page") || lower.includes("pattern") || lower.includes("template")) {
    return { name: usedByEntry, type: "pattern", path: usedByEntry };
  }

  // Default: component
  return { name: usedByEntry, type: "component", path: usedByEntry };
}

function calculateRiskScore(
  directCount: number,
  appCount: number,
): BlastRadius["riskScore"] {
  if (directCount > 10 || appCount > 3) return "critical";
  if (directCount > 5 || appCount > 2) return "high";
  if (directCount > 2) return "medium";
  return "low";
}

function findTransitiveConsumers(
  componentName: string,
  index: DesignLabIndex,
  visited: Set<string>,
): Consumer[] {
  if (visited.has(componentName)) return [];
  visited.add(componentName);

  const transitive: Consumer[] = [];

  for (const item of index.items) {
    if (item.name === componentName) continue;

    const usesTarget = item.whereUsed?.some((w) =>
      w.toLowerCase().includes(componentName.toLowerCase()),
    );

    if (usesTarget) {
      transitive.push(classifyConsumer(item.name));

      // Recurse: find items that depend on this dependent
      const deeper = findTransitiveConsumers(item.name, index, visited);
      transitive.push(...deeper);
    }
  }

  // Also check recipes
  for (const recipe of index.recipes?.currentFamilies ?? []) {
    if (recipe.ownerBlocks?.some((b) => b.includes(componentName))) {
      transitive.push({
        name: recipe.title,
        type: "recipe",
        path: `/admin/design-lab/recipes/${recipe.recipeId}`,
      });
    }
  }

  return transitive;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                                */
/* ------------------------------------------------------------------ */

export function useBlastRadius(componentName: string): BlastRadius | null {
  const { index } = useDesignLab();

  return useMemo(() => {
    if (!componentName) return null;

    // Find the component in the index
    const target = index.items.find(
      (i) => i.name.toLowerCase() === componentName.toLowerCase(),
    );
    if (!target) return null;

    // Build direct consumers from whereUsed
    const directConsumers: Consumer[] = (target.whereUsed ?? []).map(
      classifyConsumer,
    );

    // Find transitive consumers via graph walk
    const visited = new Set<string>();
    visited.add(componentName);
    const transitiveConsumers = findTransitiveConsumers(
      componentName,
      index,
      visited,
    );

    // Deduplicate transitive (exclude directs)
    const directNames = new Set(directConsumers.map((c) => c.name));
    const uniqueTransitive = transitiveConsumers.filter(
      (c) => !directNames.has(c.name),
    );

    // Extract affected sets
    const allConsumers = [...directConsumers, ...uniqueTransitive];
    const affectedApps = [
      ...new Set(
        allConsumers.filter((c) => c.type === "app").map((c) => c.name),
      ),
    ];
    const affectedRecipes = [
      ...new Set(
        allConsumers.filter((c) => c.type === "recipe").map((c) => c.name),
      ),
    ];

    // Owners: from recipe ownerBlocks that reference this component
    const affectedOwners: string[] = [];
    for (const recipe of index.recipes?.currentFamilies ?? []) {
      if (recipe.ownerBlocks?.some((b) => b.includes(componentName))) {
        affectedOwners.push(...recipe.ownerBlocks);
      }
    }
    const uniqueOwners = [...new Set(affectedOwners)];

    const riskScore = calculateRiskScore(
      directConsumers.length,
      affectedApps.length,
    );

    return {
      component: componentName,
      directConsumers,
      transitiveConsumers: uniqueTransitive,
      affectedApps,
      affectedRecipes,
      affectedOwners: uniqueOwners,
      riskScore,
      totalImpact: allConsumers.length,
    };
  }, [componentName, index]);
}
