import axios from 'axios';

const BASE_URL = import.meta.env.VITE_SCHEMA_API_URL || '/api/v1/schema';

const api = axios.create({ baseURL: BASE_URL });

export interface ColumnInfo {
  name: string;
  dataType: string;
  maxLength: number;
  nullable: boolean;
  identity: boolean;
  pk: boolean;
  ordinal: number;
}

export interface TableInfo {
  name: string;
  schema: string;
  columns: ColumnInfo[];
  rowCount: number | null;
  columnCount: number;
}

export interface Relationship {
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  confidence: number;
  source: string;
  multiSource: boolean;
}

export interface SchemaSnapshot {
  version: string;
  metadata: {
    dbType: string;
    host: string;
    database: string;
    schema: string;
    extractedAt: string;
    tableCount: number;
    columnCount: number;
    relationshipCount: number;
    domainCount: number;
  };
  tables: Record<string, TableInfo>;
  relationships: Relationship[];
  domains: Record<string, string[]>;
  analysis: {
    deadTables: { table: string; reason: string; rowCount: number | null }[];
    hubTables: { table: string; incomingRefs: number }[];
  };
}

export interface ColumnSearchResult {
  query: string;
  totalMatches: number;
  results: {
    column: string;
    tableCount: number;
    tables: { table: string; column: string; type: string; pk: boolean }[];
  }[];
}

export interface ImpactResult {
  table: string;
  hops: number;
  affectedCount: number;
  affectedTables: string[];
}

export const schemaApi = {
  getSnapshot: (schema?: string) =>
    api.get<SchemaSnapshot>('/snapshot', { params: { schema } }).then(r => r.data),

  getTable: (tableName: string, schema?: string) =>
    api.get<{ table: TableInfo; outgoingFks: Relationship[]; incomingRefs: Relationship[]; domain: string }>(
      `/tables/${tableName}`, { params: { schema } }
    ).then(r => r.data),

  searchColumns: (q: string, schema?: string) =>
    api.get<ColumnSearchResult>('/search/columns', { params: { q, schema } }).then(r => r.data),

  getImpact: (tableName: string, hops = 2, schema?: string) =>
    api.get<ImpactResult>(`/impact/${tableName}`, { params: { hops, schema } }).then(r => r.data),

  getDomains: (schema?: string) =>
    api.get<{ domainCount: number; domains: { name: string; tableCount: number; tables: string[] }[] }>(
      '/domains', { params: { schema } }
    ).then(r => r.data),
};
