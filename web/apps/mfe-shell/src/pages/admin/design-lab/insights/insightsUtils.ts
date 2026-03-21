/* ------------------------------------------------------------------ */
/*  insightsUtils — Adoption data derived from doc entries' whereUsed  */
/*                                                                     */
/*  Derives REAL adoption data from DesignLab index items.             */
/*  Each item's whereUsed[] tracks actual consumer apps/modules.       */
/*  No simulated or mock data — everything comes from doc entries.     */
/* ------------------------------------------------------------------ */

import type { DesignLabIndexItem, DesignLabComponentDocEntry } from "../DesignLabProvider";

export type AdoptionEntry = {
  component: string;
  apps: Record<string, boolean>; // appName → isUsed
  whereUsedCount: number;        // actual whereUsed.length
  status: "adopted" | "unused";  // binary: has usage or not
  documented: boolean;           // has doc entry with apiItem
  priority: number;              // 0-100
};

/**
 * Derive the set of consumer apps from all whereUsed arrays across all items.
 * This is REAL data — not a hardcoded list.
 */
export function deriveConsumerApps(items: DesignLabIndexItem[]): string[] {
  const appSet = new Set<string>();
  for (const item of items) {
    if (item.whereUsed) {
      for (const app of item.whereUsed) {
        appSet.add(app);
      }
    }
  }
  const sorted = Array.from(appSet).sort();
  return sorted.length > 0 ? sorted : ["(veri yok)"];
}

/**
 * Build adoption data from real DesignLab index items and doc entries.
 * No mock data — derived entirely from doc entries' whereUsed field.
 */
export function getAdoptionData(
  items: DesignLabIndexItem[],
  docEntryMap: Map<string, DesignLabComponentDocEntry>,
  consumerApps: string[],
): AdoptionEntry[] {
  return items.map((item) => {
    const whereUsed = item.whereUsed ?? [];
    const usedSet = new Set(whereUsed);

    const apps: Record<string, boolean> = {};
    for (const app of consumerApps) {
      apps[app] = usedSet.has(app);
    }

    const docEntry = docEntryMap.get(item.name);
    const hasApiItem = docEntry?.apiItem != null;

    const status: "adopted" | "unused" = whereUsed.length > 0 ? "adopted" : "unused";

    return {
      component: item.name,
      apps,
      whereUsedCount: whereUsed.length,
      status,
      documented: hasApiItem,
      priority: calcPriority(whereUsed.length, hasApiItem, consumerApps.length),
    };
  });
}

function calcPriority(usageCount: number, documented: boolean, totalApps: number): number {
  let score = 0;
  // More apps using = higher importance
  score += Math.min((usageCount / Math.max(totalApps, 1)) * 50, 50);
  // Undocumented components with high usage need attention
  if (!documented && usageCount > 0) score += 30;
  // Unused gets low priority
  if (usageCount === 0) score = Math.max(score - 20, 0);
  return Math.min(100, Math.max(0, Math.round(score)));
}

export function getMostUsed(data: AdoptionEntry[], limit = 5): AdoptionEntry[] {
  return [...data]
    .sort((a, b) => b.whereUsedCount - a.whereUsedCount)
    .slice(0, limit);
}

export function getLeastUsed(data: AdoptionEntry[], limit = 5): AdoptionEntry[] {
  return [...data]
    .filter((d) => d.whereUsedCount === 0)
    .sort((a, b) => a.component.localeCompare(b.component))
    .slice(0, limit);
}

export function getUndocumentedBacklog(data: AdoptionEntry[]): AdoptionEntry[] {
  return data
    .filter((d) => !d.documented)
    .sort((a, b) => b.priority - a.priority);
}

/**
 * Calculate overall adoption rate: items with whereUsed.length > 0 / total.
 */
export function getAdoptionRate(data: AdoptionEntry[]): number {
  if (data.length === 0) return 0;
  const adopted = data.filter((d) => d.whereUsedCount > 0).length;
  return Math.round((adopted / data.length) * 100);
}
