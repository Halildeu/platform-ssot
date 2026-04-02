import axios from 'axios';
import type {
  SchemaColumnInfo,
  SchemaTableInfo,
  SchemaRelationship,
  SchemaSnapshot,
  SchemaColumnSearchResult,
  SchemaImpactResult,
} from '@mfe/shared-types';

const BASE_URL = import.meta.env.VITE_SCHEMA_API_URL || '/api/v1/schema';

const api = axios.create({ baseURL: BASE_URL });

/* Re-export shared types for backward compatibility within this MFE */
export type ColumnInfo = SchemaColumnInfo;
export type TableInfo = SchemaTableInfo;
export type Relationship = SchemaRelationship;
export type { SchemaSnapshot };
export type ColumnSearchResult = SchemaColumnSearchResult;
export type ImpactResult = SchemaImpactResult;

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
