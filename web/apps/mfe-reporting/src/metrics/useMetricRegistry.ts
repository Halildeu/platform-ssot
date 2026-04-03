/**
 * useMetricRegistry — Fetches and caches metric definitions.
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { MetricDefinition } from './types';

const STALE_TIME = 30 * 60 * 1000; // 30 min

async function fetchMetrics(): Promise<MetricDefinition[]> {
  const res = await fetch('/v1/metrics');
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : data.items ?? [];
}

export function useMetricRegistry() {
  const { data, isLoading } = useQuery<MetricDefinition[]>({
    queryKey: ['metric-registry'],
    queryFn: fetchMetrics,
    staleTime: STALE_TIME,
    retry: 1,
  });

  const metrics = data ?? [];

  const certified = useMemo(
    () => metrics.filter((m) => m.certified),
    [metrics],
  );

  const byCategory = useMemo(() => {
    const map = new Map<string, MetricDefinition[]>();
    for (const m of metrics) {
      const cat = m.category || 'Genel';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(m);
    }
    return map;
  }, [metrics]);

  return { metrics, certified, byCategory, isLoading };
}
