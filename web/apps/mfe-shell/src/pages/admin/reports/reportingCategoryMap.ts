import type { ReactNode } from "react";
import { BarChart3, Briefcase, ShieldCheck, Calendar } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Top-level reporting categories (collapsed sidebar icon strip)      */
/* ------------------------------------------------------------------ */

export type TopCategoryId = "executive" | "business" | "system" | "periodic";

export interface TopCategory {
  id: TopCategoryId;
  label: string;
  icon: typeof BarChart3;
}

export const TOP_CATEGORIES: TopCategory[] = [
  { id: "executive", label: "Yönetici Paneli", icon: BarChart3 },
  { id: "business", label: "İş Raporları", icon: Briefcase },
  { id: "system", label: "Sistem Sağlığı", icon: ShieldCheck },
  { id: "periodic", label: "Periyodik", icon: Calendar },
];

export const TOP_CATEGORY_IDS = TOP_CATEGORIES.map((c) => c.id);

/* ------------------------------------------------------------------ */
/*  Sub-group category → top category mapping                          */
/* ------------------------------------------------------------------ */

export const CATEGORY_TO_TOP: Record<string, TopCategoryId> = {
  "İnsan Kaynakları": "business",
  Finans: "business",
  Satış: "business",
  Operasyon: "business",
  Denetim: "system",
  "Erişim & Güvenlik": "system",
  "Erisim & Guvenlik": "system",
  IT: "system",
  Diğer: "business",
  Diger: "business",
  Genel: "business",
  /* Periyodik raporlar — backend schedule/periodic tag ile eşleşir */
  Periyodik: "periodic",
  "Zamanlanmış": "periodic",
  Scheduled: "periodic",
  Periodic: "periodic",
};

/* Default: unmapped categories fall into "business" */
const DEFAULT_TOP: TopCategoryId = "business";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

export interface CatalogItemLike {
  id: string;
  title: string;
  description?: string;
  category: string;
  route: string;
  type: "grid" | "dashboard" | "mixed";
  source: "static" | "dynamic" | "dashboard";
  icon?: string;
  tags?: string[];
  badge?: { label: string; tone: string };
  group?: string;
}

export function resolveTopCategory(item: CatalogItemLike): TopCategoryId {
  /* Dashboard type/source → Yönetici Paneli */
  if (item.type === "dashboard" || item.source === "dashboard") {
    return "executive";
  }
  /* Tags-based: "periodic"/"scheduled" tag → Periyodik */
  if (item.tags?.some((t) => t === "periodic" || t === "scheduled")) {
    return "periodic";
  }
  return CATEGORY_TO_TOP[item.category] ?? DEFAULT_TOP;
}

export interface SubGroup {
  label: string;
  items: CatalogItemLike[];
}

export interface GroupedCategory {
  id: TopCategoryId;
  label: string;
  icon: typeof BarChart3;
  subGroups: SubGroup[];
  totalCount: number;
}

/**
 * Groups catalog items into top categories → sub groups.
 * Returns a map keyed by TopCategoryId.
 */
export function groupItemsByCategory(
  items: CatalogItemLike[],
): Map<TopCategoryId, GroupedCategory> {
  const result = new Map<TopCategoryId, GroupedCategory>();

  /* Initialize all top categories */
  for (const cat of TOP_CATEGORIES) {
    result.set(cat.id, {
      id: cat.id,
      label: cat.label,
      icon: cat.icon,
      subGroups: [],
      totalCount: 0,
    });
  }

  /* Group items into sub-groups */
  const subGroupMap = new Map<TopCategoryId, Map<string, CatalogItemLike[]>>();
  for (const id of TOP_CATEGORY_IDS) {
    subGroupMap.set(id, new Map());
  }

  for (const item of items) {
    const topId = resolveTopCategory(item);
    const map = subGroupMap.get(topId)!;
    const subLabel = item.category || "Genel";
    if (!map.has(subLabel)) map.set(subLabel, []);
    map.get(subLabel)!.push(item);
  }

  /* Build sub-groups array per top category */
  for (const [topId, subs] of subGroupMap) {
    const cat = result.get(topId)!;
    let total = 0;
    for (const [label, subItems] of subs) {
      cat.subGroups.push({ label, items: subItems });
      total += subItems.length;
    }
    cat.totalCount = total;
  }

  return result;
}
