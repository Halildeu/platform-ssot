/**
 * Report Table Index — Maps reports to their source tables for related-report discovery.
 *
 * Builds an in-memory index of reportId → sourceTables, then finds reports
 * sharing tables with the current report.
 */

export interface ReportTableEntry {
  reportId: string;
  title: string;
  route: string;
  sourceTables: string[];
}

export interface RelatedReportEntry {
  reportId: string;
  title: string;
  route: string;
  sharedTableCount: number;
  sharedTables: string[];
}

/**
 * Builds an index of reports and their source tables.
 */
export function buildReportTableIndex(
  modules: Array<{ id: string; titleKey: string; route: string; sourceTables?: string[] }>,
): ReportTableEntry[] {
  return modules
    .filter((m) => m.sourceTables && m.sourceTables.length > 0)
    .map((m) => ({
      reportId: m.id,
      title: m.titleKey,
      route: m.route,
      sourceTables: m.sourceTables!.map((t) => t.toUpperCase()),
    }));
}

/**
 * Finds reports that share at least one source table with the given tables.
 * Excludes the current report. Sorted by shared table count (descending).
 */
export function findRelatedReports(
  currentReportId: string,
  currentTables: string[],
  index: ReportTableEntry[],
): RelatedReportEntry[] {
  if (!currentTables.length || !index.length) return [];

  const currentSet = new Set(currentTables.map((t) => t.toUpperCase()));

  return index
    .filter((entry) => entry.reportId !== currentReportId)
    .map((entry) => {
      const shared = entry.sourceTables.filter((t) => currentSet.has(t));
      return {
        reportId: entry.reportId,
        title: entry.title,
        route: entry.route,
        sharedTableCount: shared.length,
        sharedTables: shared,
      };
    })
    .filter((entry) => entry.sharedTableCount > 0)
    .sort((a, b) => b.sharedTableCount - a.sharedTableCount);
}
