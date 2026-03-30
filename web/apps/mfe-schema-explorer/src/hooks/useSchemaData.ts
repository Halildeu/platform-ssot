import { useQuery } from '@tanstack/react-query';
import { schemaApi, type SchemaSnapshot } from '../api/schemaApi';

export function useSchemaSnapshot(schema?: string) {
  return useQuery<SchemaSnapshot>({
    queryKey: ['schema-snapshot', schema],
    queryFn: () => schemaApi.getSnapshot(schema),
  });
}

export function useColumnSearch(query: string, schema?: string) {
  return useQuery({
    queryKey: ['column-search', query, schema],
    queryFn: () => schemaApi.searchColumns(query, schema),
    enabled: query.length >= 2,
  });
}

export function useImpactAnalysis(tableName: string | null, hops = 2, schema?: string) {
  return useQuery({
    queryKey: ['impact', tableName, hops, schema],
    queryFn: () => schemaApi.getImpact(tableName!, hops, schema),
    enabled: !!tableName,
  });
}
