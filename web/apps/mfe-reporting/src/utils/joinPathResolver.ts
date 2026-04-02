/**
 * Join Path Resolver — Fetches shortest join path between two tables.
 *
 * Calls Schema Explorer's /api/v1/schema/path endpoint.
 * Returns null on any error (graceful degradation).
 */

import type { SchemaJoinPathSegment } from '@mfe/shared-types';

const SCHEMA_API_BASE = '/api/v1/schema';

export interface JoinPathResult {
  from: string;
  to: string;
  path: SchemaJoinPathSegment[];
  hops: number;
  joinSql?: string;
}

/**
 * Fetches the shortest join path between two tables.
 * Returns null on any error — never throws.
 */
export async function fetchJoinPath(
  fromTable: string,
  toTable: string,
  schema?: string,
): Promise<JoinPathResult | null> {
  try {
    const params = new URLSearchParams({ from: fromTable, to: toTable });
    if (schema) params.set('schema', schema);

    const res = await fetch(`${SCHEMA_API_BASE}/path?${params}`);
    if (!res.ok) return null;

    const data = await res.json();
    return {
      from: fromTable,
      to: toTable,
      path: Array.isArray(data.path) ? data.path : [],
      hops: data.hops ?? 0,
      joinSql: data.joinSql,
    };
  } catch {
    return null;
  }
}

/**
 * Resolves the target report route for a FK drill-down.
 * Looks up the referenced table in the report table index to find a matching report.
 */
export function resolveDrillDownRoute(
  referencedTable: string,
  reportIndex: Array<{ route: string; sourceTables: string[] }>,
): string | null {
  const upper = referencedTable.toUpperCase();
  const match = reportIndex.find((r) =>
    r.sourceTables.some((t) => t.toUpperCase() === upper),
  );
  return match?.route ?? null;
}

/**
 * Builds a drill-down URL with filter parameters.
 */
export function buildDrillDownUrl(
  baseRoute: string,
  filterColumn: string,
  filterValue: unknown,
): string {
  const params = new URLSearchParams();
  params.set('filter', `${filterColumn}=${String(filterValue)}`);
  return `/admin/reports/${baseRoute}?${params}`;
}
