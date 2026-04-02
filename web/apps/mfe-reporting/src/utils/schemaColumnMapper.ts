/**
 * Schema Column Mapper — Infers ColumnMeta columnType from SQL data types.
 *
 * Maps database-specific SQL types to universal column types.
 * Never overrides an explicitly set columnType — inference only fills gaps.
 */

type ColumnType = 'text' | 'number' | 'date' | 'boolean';

const SQL_TYPE_MAP: Record<string, ColumnType> = {
  // Number types
  int: 'number',
  bigint: 'number',
  smallint: 'number',
  tinyint: 'number',
  decimal: 'number',
  numeric: 'number',
  float: 'number',
  real: 'number',
  money: 'number',
  smallmoney: 'number',
  integer: 'number',       // PostgreSQL
  serial: 'number',        // PostgreSQL
  bigserial: 'number',     // PostgreSQL
  double: 'number',        // MySQL
  'double precision': 'number', // PostgreSQL

  // Boolean
  bit: 'boolean',
  boolean: 'boolean',      // PostgreSQL
  bool: 'boolean',         // PostgreSQL/MySQL

  // Date types
  date: 'date',
  datetime: 'date',
  datetime2: 'date',
  smalldatetime: 'date',
  datetimeoffset: 'date',
  time: 'date',
  timestamp: 'date',       // PostgreSQL
  'timestamp without time zone': 'date',
  'timestamp with time zone': 'date',

  // Text types → returns undefined (default is text)
};

/**
 * Infers the best ColumnMeta columnType for a SQL data type.
 * Returns undefined for text-like types (caller uses default 'text').
 */
export function inferColumnType(sqlType: string): ColumnType | undefined {
  const normalized = sqlType.toLowerCase().trim().replace(/\(.*\)/, '').trim();
  return SQL_TYPE_MAP[normalized];
}

/**
 * Finds the source column info for a field name across tables.
 * Case-insensitive match.
 */
export function findSourceColumn(
  fieldName: string,
  tables: Array<{ name: string; columns: Array<{ name: string; dataType: string; pk: boolean; nullable: boolean }> }>,
): { table: string; column: string; dataType: string; pk: boolean; nullable: boolean } | undefined {
  const upper = fieldName.toUpperCase();
  for (const table of tables) {
    for (const col of table.columns) {
      if (col.name.toUpperCase() === upper) {
        return { table: table.name, column: col.name, dataType: col.dataType, pk: col.pk, nullable: col.nullable };
      }
    }
  }
  return undefined;
}
