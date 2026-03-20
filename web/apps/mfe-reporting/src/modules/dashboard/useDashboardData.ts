import { useState, useEffect, useCallback } from 'react';
import {
  fetchDashboardMetadata,
  fetchDashboardKpis,
  fetchDashboardCharts,
} from './api';
import type { DashboardMetadata, KpiResult, ChartResult } from './types';

type DashboardData = {
  metadata: DashboardMetadata | null;
  kpis: KpiResult[];
  charts: ChartResult[];
  loading: boolean;
  error: string | null;
  timeRange: string;
  setTimeRange: (range: string) => void;
  refresh: () => void;
};

export function useDashboardData(dashboardKey: string): DashboardData {
  const [metadata, setMetadata] = useState<DashboardMetadata | null>(null);
  const [kpis, setKpis] = useState<KpiResult[]>([]);
  const [charts, setCharts] = useState<ChartResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('90d');
  const [refreshKey, setRefreshKey] = useState(0);

  // Load metadata once
  useEffect(() => {
    let active = true;
    fetchDashboardMetadata(dashboardKey)
      .then((meta) => {
        if (active) {
          setMetadata(meta);
          setTimeRange(meta.defaultTimeRange || '90d');
        }
      })
      .catch((err) => {
        if (active) setError(err.message || 'Dashboard metadata yüklenemedi');
      });
    return () => { active = false; };
  }, [dashboardKey]);

  // Load KPIs and charts when timeRange or refreshKey changes
  useEffect(() => {
    if (!metadata) return;
    let active = true;
    setLoading(true);
    setError(null);

    Promise.all([
      fetchDashboardKpis(dashboardKey, timeRange),
      fetchDashboardCharts(dashboardKey, timeRange),
    ])
      .then(([kpiResults, chartResults]) => {
        if (active) {
          setKpis(kpiResults);
          setCharts(chartResults);
        }
      })
      .catch((err) => {
        if (active) setError(err.message || 'Dashboard verileri yüklenemedi');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [dashboardKey, metadata, timeRange, refreshKey]);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return { metadata, kpis, charts, loading, error, timeRange, setTimeRange, refresh };
}
