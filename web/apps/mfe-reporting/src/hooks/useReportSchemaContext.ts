/**
 * useReportSchemaContext — Fetches schema metadata for a report's source tables.
 *
 * Calls `/api/v1/schema/snapshot` via React Query with 60-minute staleTime.
 * Filters the full snapshot to only the tables and relationships relevant
 * to the current report. Returns empty data with `isAvailable: false` on
 * any failure — zero disruption to report rendering.
 *
 * @example
 * ```ts
 * const schema = useReportSchemaContext(module.sourceTables, module.sourceSchema);
 * if (schema.isAvailable) {
 *   // Use schema.tables, schema.relationships
 * }
 * ```
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type {
  SchemaTableInfo,
  SchemaRelationship,
  SchemaSnapshot,
} from '@mfe/shared-types';

/* ------------------------------------------------------------------ */
/*  API fetch                                                          */
/* ------------------------------------------------------------------ */

const SCHEMA_API_BASE = '/api/v1/schema';
const STALE_TIME = 60 * 60 * 1000; // 60 minutes — matches backend cache TTL

async function fetchSchemaSnapshot(schema?: string): Promise<SchemaSnapshot> {
  const params = schema ? `?schema=${encodeURIComponent(schema)}` : '';
  const res = await fetch(`${SCHEMA_API_BASE}/snapshot${params}`);
  if (!res.ok) throw new Error(`Schema fetch failed: ${res.status}`);
  return res.json();
}

/* ------------------------------------------------------------------ */
/*  Return type                                                        */
/* ------------------------------------------------------------------ */

export interface ReportSchemaContext {
  /** Tables relevant to this report (filtered from snapshot) */
  tables: SchemaTableInfo[];
  /** Relationships where both endpoints are in sourceTables */
  relationships: SchemaRelationship[];
  /** All relationships touching any source table (including external) */
  allRelationships: SchemaRelationship[];
  /** Whether schema data is available (false on error or when sourceTables empty) */
  isAvailable: boolean;
  /** Whether data is currently loading */
  isLoading: boolean;
  /** Full snapshot (for advanced use — table tree, domain lookup) */
  snapshot: SchemaSnapshot | null;
}

const EMPTY_CONTEXT: ReportSchemaContext = {
  tables: [],
  relationships: [],
  allRelationships: [],
  isAvailable: false,
  isLoading: false,
  snapshot: null,
};

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useReportSchemaContext(
  sourceTables?: string[],
  sourceSchema?: string,
): ReportSchemaContext {
  const enabled = Boolean(sourceTables && sourceTables.length > 0);

  const { data: snapshot, isLoading, isError } = useQuery<SchemaSnapshot>({
    queryKey: ['schema-snapshot', sourceSchema ?? 'default'],
    queryFn: () => fetchSchemaSnapshot(sourceSchema),
    enabled,
    staleTime: STALE_TIME,
    gcTime: STALE_TIME * 2,
    retry: 1,
    retryDelay: 2000,
  });

  return useMemo<ReportSchemaContext>(() => {
    if (!enabled) return EMPTY_CONTEXT;
    if (isLoading) return { ...EMPTY_CONTEXT, isLoading: true };
    if (isError || !snapshot) return EMPTY_CONTEXT;

    const tableSet = new Set(sourceTables!.map((t) => t.toUpperCase()));

    /* Filter tables */
    const tables: SchemaTableInfo[] = [];
    for (const [name, info] of Object.entries(snapshot.tables)) {
      if (tableSet.has(name.toUpperCase())) {
        tables.push(info);
      }
    }

    /* Filter relationships — both endpoints in sourceTables */
    const relationships = snapshot.relationships.filter(
      (r) =>
        tableSet.has(r.fromTable.toUpperCase()) &&
        tableSet.has(r.toTable.toUpperCase()),
    );

    /* All relationships touching any source table */
    const allRelationships = snapshot.relationships.filter(
      (r) =>
        tableSet.has(r.fromTable.toUpperCase()) ||
        tableSet.has(r.toTable.toUpperCase()),
    );

    return {
      tables,
      relationships,
      allRelationships,
      isAvailable: true,
      isLoading: false,
      snapshot,
    };
  }, [enabled, isLoading, isError, snapshot, sourceTables]);
}
