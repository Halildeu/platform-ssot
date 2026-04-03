/**
 * useTableDiscovery — Schema API hooks for wizard table/column discovery.
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { SchemaSnapshot, SchemaTableInfo, SchemaRelationship } from '@mfe/shared-types';

const SCHEMA_API_BASE = '/api/v1/schema';
const STALE_TIME = 60 * 60 * 1000;

async function fetchSnapshot(schema?: string): Promise<SchemaSnapshot> {
  const params = schema ? `?schema=${encodeURIComponent(schema)}` : '';
  const res = await fetch(`${SCHEMA_API_BASE}/snapshot${params}`);
  if (!res.ok) throw new Error(`Schema fetch failed: ${res.status}`);
  return res.json();
}

async function fetchSchemas(): Promise<string[]> {
  const res = await fetch(`${SCHEMA_API_BASE}/schemas`);
  if (!res.ok) return [];
  const data = await res.json();
  /* API returns [{name, tableCount}] or {schemas: [{name, tableCount}]} */
  const list = Array.isArray(data) ? data : Array.isArray(data.schemas) ? data.schemas : [];
  return list.map((s: string | { name: string }) => typeof s === 'string' ? s : s.name);
}

export function useAvailableSchemas() {
  return useQuery<string[]>({
    queryKey: ['schema-list'],
    queryFn: fetchSchemas,
    staleTime: STALE_TIME,
    retry: 1,
  });
}

export function useSchemaSnapshot(schema?: string) {
  return useQuery<SchemaSnapshot>({
    queryKey: ['schema-snapshot', schema ?? 'default'],
    queryFn: () => fetchSnapshot(schema),
    enabled: Boolean(schema),
    staleTime: STALE_TIME,
    retry: 1,
  });
}

/**
 * Returns tables grouped by domain for the wizard's table selector.
 */
export function useTableList(schema?: string) {
  const { data: snapshot, isLoading } = useSchemaSnapshot(schema);

  const tables = useMemo(() => {
    if (!snapshot) return [];
    return Object.values(snapshot.tables).sort((a, b) => a.name.localeCompare(b.name));
  }, [snapshot]);

  const domains = useMemo(() => {
    if (!snapshot) return {};
    return snapshot.domains;
  }, [snapshot]);

  return { tables, domains, isLoading, snapshot };
}

/**
 * Returns FK relationships for a given table.
 */
export function useTableRelationships(tableName: string, snapshot: SchemaSnapshot | null) {
  return useMemo(() => {
    if (!snapshot || !tableName) return { outgoing: [], incoming: [] };
    const upper = tableName.toUpperCase();
    const outgoing = snapshot.relationships.filter((r) => r.fromTable.toUpperCase() === upper);
    const incoming = snapshot.relationships.filter((r) => r.toTable.toUpperCase() === upper);
    return { outgoing, incoming };
  }, [snapshot, tableName]);
}
