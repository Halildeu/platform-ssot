/**
 * FK Lookup Resolver — Resolves foreign key IDs to human-readable display names.
 *
 * Identifies which columns need lookup (via schemaLineage.isForeignKey),
 * batches unique IDs per target table, and fetches display values.
 *
 * Display column heuristic: first column named NAME, TITLE, DESCRIPTION, or LABEL.
 */

import type { ColumnMeta } from '@mfe/design-system/advanced/data-grid';
import type { SchemaTableInfo, SchemaRelationship } from '@mfe/shared-types';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface FkLookupConfig {
  /** Field name in the report row */
  field: string;
  /** Target table to look up */
  lookupTable: string;
  /** Target PK column */
  lookupPkColumn: string;
  /** Display column in target table */
  displayColumn: string;
}

export type FkLookupMap = Map<string, Map<string, string>>; // field → (id → displayValue)

/* ------------------------------------------------------------------ */
/*  Display column heuristic                                           */
/* ------------------------------------------------------------------ */

const DISPLAY_COLUMN_CANDIDATES = ['NAME', 'TITLE', 'DESCRIPTION', 'LABEL', 'AD', 'BASLIK', 'TANIM'];

/**
 * Finds the best display column in a table (for showing instead of ID).
 * Falls back to the first non-PK text column.
 */
export function findDisplayColumn(
  table: SchemaTableInfo,
): string | undefined {
  /* Try heuristic names first */
  for (const candidate of DISPLAY_COLUMN_CANDIDATES) {
    const col = table.columns.find(
      (c) => c.name.toUpperCase() === candidate || c.name.toUpperCase().endsWith(`_${candidate}`),
    );
    if (col) return col.name;
  }

  /* Fallback: first non-PK text-like column */
  const textCol = table.columns.find(
    (c) => !c.pk && (c.dataType.toLowerCase().includes('varchar') || c.dataType.toLowerCase().includes('char')),
  );
  return textCol?.name;
}

/* ------------------------------------------------------------------ */
/*  Build lookup config                                                */
/* ------------------------------------------------------------------ */

/**
 * Analyzes columns to determine which need FK lookup.
 * Returns config for each FK column that has a resolvable display column.
 */
export function buildFkLookupConfigs(
  columns: ColumnMeta[],
  allTables: Record<string, SchemaTableInfo>,
): FkLookupConfig[] {
  const configs: FkLookupConfig[] = [];

  for (const col of columns) {
    const lineage = col.schemaLineage;
    if (!lineage?.isForeignKey || !lineage.referencedTable) continue;

    /* Find referenced table in snapshot */
    const refTable = allTables[lineage.referencedTable] ?? allTables[lineage.referencedTable.toUpperCase()];
    if (!refTable) continue;

    /* Find display column */
    const displayCol = findDisplayColumn(refTable);
    if (!displayCol) continue;

    /* Find PK column in referenced table */
    const pkCol = lineage.referencedColumn ?? refTable.columns.find((c) => c.pk)?.name;
    if (!pkCol) continue;

    configs.push({
      field: col.field,
      lookupTable: lineage.referencedTable,
      lookupPkColumn: pkCol,
      displayColumn: displayCol,
    });
  }

  return configs;
}

/* ------------------------------------------------------------------ */
/*  Batch ID collection                                                */
/* ------------------------------------------------------------------ */

/**
 * Collects unique IDs from row data for each FK column that needs lookup.
 */
export function collectLookupIds(
  configs: FkLookupConfig[],
  rows: Record<string, unknown>[],
): Map<string, Set<string>> {
  /* Map: lookupTable → Set of IDs */
  const tableIds = new Map<string, Set<string>>();

  for (const config of configs) {
    if (!tableIds.has(config.lookupTable)) {
      tableIds.set(config.lookupTable, new Set());
    }
    const idSet = tableIds.get(config.lookupTable)!;

    for (const row of rows) {
      const value = row[config.field];
      if (value != null && value !== '') {
        idSet.add(String(value));
      }
    }
  }

  return tableIds;
}

/* ------------------------------------------------------------------ */
/*  API fetch (placeholder — requires backend endpoint)                */
/* ------------------------------------------------------------------ */

const SCHEMA_API_BASE = '/api/v1/schema';

/**
 * Fetches display values for a batch of IDs from a table.
 * Calls: GET /api/v1/schema/lookup?table=X&ids=1,2,3&displayCol=NAME&schema=Y
 *
 * Returns null on error (graceful degradation — IDs shown as-is).
 */
export async function fetchLookupValues(
  table: string,
  ids: string[],
  displayColumn: string,
  schema?: string,
): Promise<Record<string, string> | null> {
  if (!ids.length) return {};

  try {
    const params = new URLSearchParams({
      table,
      ids: ids.join(','),
      displayCol: displayColumn,
    });
    if (schema) params.set('schema', schema);

    const res = await fetch(`${SCHEMA_API_BASE}/lookup?${params}`);
    if (!res.ok) return null;

    return res.json();
  } catch {
    return null;
  }
}
