/**
 * Schema Types — Database-agnostic schema metadata.
 *
 * Used by Schema Explorer, Report Builder, and any MFE that needs
 * database structure information. Mirrors schema-service REST API responses.
 *
 * @since 1.0.0
 */

/* ------------------------------------------------------------------ */
/*  Column                                                             */
/* ------------------------------------------------------------------ */

export interface SchemaColumnInfo {
  /** Column name (e.g., "COMPANY_ID") */
  name: string;
  /** SQL data type (e.g., "int", "nvarchar", "datetime2") */
  dataType: string;
  /** Maximum character/byte length (-1 for MAX) */
  maxLength: number;
  /** Whether column accepts NULL values */
  nullable: boolean;
  /** Whether column is an identity/auto-increment column */
  identity: boolean;
  /** Whether column is part of the primary key */
  pk: boolean;
  /** Ordinal position in the table (1-based) */
  ordinal: number;
  /** Referenced table name if this is a foreign key (discovered by relationship engine) */
  referencedTable?: string;
  /** Referenced column name */
  referencedColumn?: string;
}

/* ------------------------------------------------------------------ */
/*  Table                                                              */
/* ------------------------------------------------------------------ */

export interface SchemaTableInfo {
  /** Table name (e.g., "INVOICE") */
  name: string;
  /** Database schema (e.g., "dbo", "public") */
  schema: string;
  /** All columns in the table */
  columns: SchemaColumnInfo[];
  /** Approximate row count (null if not extracted) */
  rowCount: number | null;
  /** Number of columns */
  columnCount: number;
  /** Business domain tag (e.g., "Finance", "HR") — assigned by domain clustering */
  domainTag?: string;
}

/* ------------------------------------------------------------------ */
/*  Relationship (FK / inferred join)                                  */
/* ------------------------------------------------------------------ */

export interface SchemaRelationship {
  /** Source table name */
  fromTable: string;
  /** Source column name */
  fromColumn: string;
  /** Target table name */
  toTable: string;
  /** Target column name */
  toColumn: string;
  /** Confidence score (0.0 - 1.0) */
  confidence: number;
  /** Discovery source: "name_match_exact", "alias_pattern", "common_fk", "view_parse:VIEW_NAME" */
  source: string;
  /** Whether discovered by multiple techniques (higher reliability) */
  multiSource: boolean;
}

/* ------------------------------------------------------------------ */
/*  Schema Snapshot (full database metadata)                           */
/* ------------------------------------------------------------------ */

export interface SchemaSnapshotMetadata {
  /** Database type: "mssql", "postgresql", "mysql", "oracle" */
  dbType: string;
  /** Database host */
  host: string;
  /** Database name */
  database: string;
  /** Schema name (e.g., "dbo", "workcube_mikrolink") */
  schema: string;
  /** ISO timestamp of extraction */
  extractedAt: string;
  /** Total table count */
  tableCount: number;
  /** Total column count */
  columnCount: number;
  /** Total relationship count */
  relationshipCount: number;
  /** Total domain count */
  domainCount: number;
}

export interface SchemaDeadTable {
  table: string;
  reason: string;
  rowCount: number | null;
}

export interface SchemaHubTable {
  table: string;
  incomingRefs: number;
}

export interface SchemaAnalysis {
  /** Tables with no relationships (isolated) */
  deadTables: SchemaDeadTable[];
  /** Most-referenced tables (top 30) */
  hubTables: SchemaHubTable[];
}

export interface SchemaSnapshot {
  /** Snapshot version */
  version: string;
  /** Extraction metadata */
  metadata: SchemaSnapshotMetadata;
  /** All tables keyed by table name */
  tables: Record<string, SchemaTableInfo>;
  /** All discovered relationships */
  relationships: SchemaRelationship[];
  /** Business domains — domain name → table names */
  domains: Record<string, string[]>;
  /** Schema analysis (dead tables, hub tables) */
  analysis: SchemaAnalysis;
}

/* ------------------------------------------------------------------ */
/*  Column Search                                                      */
/* ------------------------------------------------------------------ */

export interface SchemaColumnSearchMatch {
  table: string;
  column: string;
  type: string;
  pk: boolean;
}

export interface SchemaColumnSearchGroup {
  column: string;
  tableCount: number;
  tables: SchemaColumnSearchMatch[];
}

export interface SchemaColumnSearchResult {
  query: string;
  totalMatches: number;
  results: SchemaColumnSearchGroup[];
}

/* ------------------------------------------------------------------ */
/*  Impact Analysis                                                    */
/* ------------------------------------------------------------------ */

export interface SchemaImpactResult {
  table: string;
  hops: number;
  affectedCount: number;
  affectedTables: string[];
}

/* ------------------------------------------------------------------ */
/*  Join Path                                                          */
/* ------------------------------------------------------------------ */

export interface SchemaJoinPathSegment {
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
}

export type SchemaJoinPath = SchemaJoinPathSegment[];

/* ------------------------------------------------------------------ */
/*  Domain                                                             */
/* ------------------------------------------------------------------ */

export interface SchemaDomain {
  /** Domain identifier */
  id: string;
  /** Human-readable domain name (e.g., "Finans", "İnsan Kaynakları") */
  name: string;
  /** Tables belonging to this domain */
  tables: string[];
}

/* ------------------------------------------------------------------ */
/*  Data Source (database connection)                                   */
/* ------------------------------------------------------------------ */

export type DataSourceType =
  | 'mssql'
  | 'postgresql'
  | 'mysql'
  | 'oracle'
  | 'clickhouse'
  | 'api'
  | 'csv';

export interface DataSourceConnectionConfig {
  host: string;
  port: number;
  database: string;
  schema?: string;
  /** Username — stored in Vault, never in frontend */
  username?: string;
  /** SSL enabled */
  sslEnabled?: boolean;
  /** Read-only connection (default: true) */
  readOnly?: boolean;
  /** Max connection pool size */
  maxPoolSize?: number;
}

export interface DataSource {
  id: string;
  type: DataSourceType;
  name: string;
  description?: string;
  connectionConfig: DataSourceConnectionConfig;
  status: 'active' | 'testing' | 'inactive' | 'error';
  /** Available schemas within this data source */
  schemas?: string[];
  /** Last successful connection test */
  lastTestedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/* ------------------------------------------------------------------ */
/*  Schema Drift                                                       */
/* ------------------------------------------------------------------ */

export interface SchemaDriftEntry {
  type: 'added' | 'removed' | 'modified';
  objectType: 'table' | 'column' | 'relationship';
  name: string;
  details?: string;
}

export interface SchemaDriftResult {
  fromVersion: string;
  toVersion: string;
  changes: SchemaDriftEntry[];
  changeCount: number;
}
