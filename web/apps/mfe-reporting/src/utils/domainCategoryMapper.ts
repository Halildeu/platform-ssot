/**
 * Domain Category Mapper — Maps Schema Explorer domains to reporting categories.
 *
 * Schema Explorer discovers business domains (Finance, HR, IT, etc.) via
 * table name clustering. This mapper aligns those domains with the reporting
 * sidebar's top-level categories.
 */

/** Top-level reporting category IDs — mirrors shell reportingCategoryMap */
type TopCategoryId = 'executive' | 'business' | 'system' | 'periodic';

/**
 * Static mapping from schema domain names to reporting category IDs.
 * Unknown domains are silently ignored (returns undefined).
 */
const DOMAIN_TO_CATEGORY: Record<string, TopCategoryId> = {
  // Business
  finance: 'business',
  finans: 'business',
  accounting: 'business',
  muhasebe: 'business',
  sales: 'business',
  satis: 'business',
  hr: 'business',
  'human resources': 'business',
  'insan kaynaklari': 'business',
  operations: 'business',
  operasyon: 'business',
  inventory: 'business',
  stok: 'business',
  purchasing: 'business',
  satin_alma: 'business',
  production: 'business',
  uretim: 'business',
  logistics: 'business',
  lojistik: 'business',
  crm: 'business',

  // System
  audit: 'system',
  denetim: 'system',
  security: 'system',
  guvenlik: 'system',
  access: 'system',
  erisim: 'system',
  it: 'system',
  infrastructure: 'system',
  altyapi: 'system',
  monitoring: 'system',
  izleme: 'system',
  logging: 'system',

  // Executive
  dashboard: 'executive',
  kpi: 'executive',
  analytics: 'executive',
  analitik: 'executive',
  reporting: 'executive',

  // Periodic
  monthly: 'periodic',
  weekly: 'periodic',
  yearly: 'periodic',
  daily: 'periodic',
};

/**
 * Suggests a reporting category based on which schema domains the report's
 * source tables belong to. Returns the category with the most table overlap.
 *
 * @param sourceTables - Report's source table names
 * @param domains - Schema domain mapping (domain name → table names)
 * @returns Suggested category ID, or undefined if no match
 */
export function suggestCategoryFromDomains(
  sourceTables: string[],
  domains: Record<string, string[]>,
): TopCategoryId | undefined {
  if (!sourceTables.length || !Object.keys(domains).length) return undefined;

  const tableSet = new Set(sourceTables.map((t) => t.toUpperCase()));
  const scores = new Map<TopCategoryId, number>();

  for (const [domainName, domainTables] of Object.entries(domains)) {
    const categoryId = DOMAIN_TO_CATEGORY[domainName.toLowerCase().trim()];
    if (!categoryId) continue;

    const overlap = domainTables.filter((t) => tableSet.has(t.toUpperCase())).length;
    if (overlap > 0) {
      scores.set(categoryId, (scores.get(categoryId) ?? 0) + overlap);
    }
  }

  if (scores.size === 0) return undefined;

  /* Return category with highest score */
  let best: TopCategoryId | undefined;
  let bestScore = 0;
  for (const [cat, score] of scores) {
    if (score > bestScore) {
      best = cat;
      bestScore = score;
    }
  }

  return best;
}
