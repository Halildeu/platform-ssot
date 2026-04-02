/**
 * Column Enrichment — Attaches schema lineage to column metadata.
 *
 * For each ColumnMeta, finds the matching DB column and:
 * 1. Fills schemaLineage (source table, SQL type, PK/FK/nullable)
 * 2. Infers columnType if not explicitly set (SQL type → ColumnMeta type)
 *
 * CRITICAL: Never overrides an explicitly set columnType.
 * Returns a new array — does not mutate input.
 */

import type { ColumnMeta } from '@mfe/design-system/advanced/data-grid';
import type { SchemaTableInfo, SchemaRelationship } from '@mfe/shared-types';
import { inferColumnType, findSourceColumn } from './schemaColumnMapper';

/**
 * Enriches column metadata with schema lineage information.
 *
 * @param columns - Existing column metadata from report module
 * @param tables - Source tables from schema context
 * @param relationships - Relationships for FK detection
 * @returns New array with schemaLineage attached where matched
 */
export function enrichColumnsWithSchema(
  columns: ColumnMeta[],
  tables: SchemaTableInfo[],
  relationships: SchemaRelationship[] = [],
): ColumnMeta[] {
  if (!tables.length) return columns;

  /* Build FK lookup: "TABLE.COLUMN" → { referencedTable, referencedColumn } */
  const fkMap = new Map<string, { referencedTable: string; referencedColumn: string }>();
  for (const rel of relationships) {
    const key = `${rel.fromTable.toUpperCase()}.${rel.fromColumn.toUpperCase()}`;
    fkMap.set(key, { referencedTable: rel.toTable, referencedColumn: rel.toColumn });
  }

  return columns.map((col) => {
    const source = findSourceColumn(col.field, tables);
    if (!source) return col;

    /* Check if this column is a foreign key */
    const fkKey = `${source.table.toUpperCase()}.${source.column.toUpperCase()}`;
    const fkRef = fkMap.get(fkKey);

    /* Build lineage */
    const schemaLineage = {
      sourceTable: source.table,
      sourceColumn: source.column,
      sqlDataType: source.dataType,
      isNullable: source.nullable,
      isPrimaryKey: source.pk,
      isForeignKey: Boolean(fkRef),
      referencedTable: fkRef?.referencedTable,
      referencedColumn: fkRef?.referencedColumn,
    };

    /* Infer columnType only if not explicitly set */
    const inferredType = inferColumnType(source.dataType);
    const needsInference = col.columnType === 'text' && inferredType && inferredType !== 'text';

    if (needsInference) {
      return {
        ...col,
        columnType: inferredType as ColumnMeta['columnType'],
        schemaLineage,
      } as ColumnMeta;
    }

    return { ...col, schemaLineage } as ColumnMeta;
  });
}
