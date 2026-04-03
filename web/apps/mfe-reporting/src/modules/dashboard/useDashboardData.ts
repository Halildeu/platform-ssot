import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  fetchDashboardMetadata,
  fetchDashboardKpis,
  fetchDashboardCharts,
} from './api';
import type { DashboardMetadata, KpiResult, ChartResult } from './types';

export type CrossFilter = {
  /** Which chart/kpi triggered this filter */
  sourceChartId: string;
  /** Backend filter key (department, company, collarType, gender) */
  filterKey: string;
  /** The selected value */
  filterValue: string;
  /** Display label shown in the chip */
  displayLabel: string;
};

/**
 * Maps chart IDs to the backend filter key they should toggle.
 * Only charts listed here participate in cross-filtering.
 */
const CHART_FILTER_MAP: Record<string, string> = {
  // department-based charts
  'dept-headcount-cost': 'department',
  'dept-salary': 'department',
  'dept-salary-comparison': 'department',
  'dept-cost-top5': 'department',
  'gender-by-dept': 'department',
  'new-vs-existing-dept': 'department',
  'flight-risk-dept': 'department',
  'internal-equity-spread': 'department',
  'overtime-by-dept': 'department',
  // company-based charts
  'company-cost-split': 'company',
  'company-payroll': 'company',
  'company-salary': 'company',
  // collar-type charts
  'collar-headcount-salary': 'collarType',
  'collar-salary': 'collarType',
  'collar-equity': 'collarType',
  'collar-benefit': 'collarType',
  'collar-cost': 'collarType',
};

/** Resolve the collar type label → numeric value for backend */
const resolveFilterValue = (filterKey: string, label: string): string => {
  if (filterKey === 'collarType') {
    if (label === 'Beyaz Yaka') return '1';
    if (label === 'Mavi Yaka') return '2';
  }
  return label;
};

type DashboardData = {
  metadata: DashboardMetadata | null;
  kpis: KpiResult[];
  charts: ChartResult[];
  loading: boolean;
  error: string | null;
  timeRange: string;
  setTimeRange: (range: string) => void;
  refresh: () => void;
  crossFilters: CrossFilter[];
  toggleChartFilter: (chartId: string, label: string) => void;
  removeFilter: (filter: CrossFilter) => void;
  clearAllFilters: () => void;
};

export function useDashboardData(dashboardKey: string): DashboardData {
  const [metadata, setMetadata] = useState<DashboardMetadata | null>(null);
  const [kpis, setKpis] = useState<KpiResult[]>([]);
  const [charts, setCharts] = useState<ChartResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('90d');
  const [refreshKey, setRefreshKey] = useState(0);
  const [crossFilters, setCrossFilters] = useState<CrossFilter[]>([]);

  const activeFilterParams = useMemo(() => {
    const params: Record<string, string> = {};
    for (const cf of crossFilters) {
      params[cf.filterKey] = cf.filterValue;
    }
    return params;
  }, [crossFilters]);

  const filterParamsKey = useMemo(() => JSON.stringify(activeFilterParams), [activeFilterParams]);

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

  // Load KPIs and charts when timeRange, filters or refreshKey changes
  useEffect(() => {
    if (!metadata) return;
    let active = true;

    const timer = setTimeout(() => {
      setLoading(true);
      setError(null);

      const filters = Object.keys(activeFilterParams).length > 0 ? activeFilterParams : undefined;

      Promise.all([
        fetchDashboardKpis(dashboardKey, timeRange, filters),
        fetchDashboardCharts(dashboardKey, timeRange, filters),
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
    }, crossFilters.length > 0 ? 300 : 0);

    return () => { active = false; clearTimeout(timer); };
  }, [dashboardKey, metadata, timeRange, refreshKey, filterParamsKey]);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const toggleChartFilter = useCallback((chartId: string, label: string) => {
    const filterKey = CHART_FILTER_MAP[chartId];
    if (!filterKey) return;

    const filterValue = resolveFilterValue(filterKey, label);

    setCrossFilters((prev) => {
      const existingIdx = prev.findIndex((f) => f.filterKey === filterKey && f.filterValue === filterValue);
      if (existingIdx >= 0) {
        // Toggle off — same value clicked again
        return prev.filter((_, i) => i !== existingIdx);
      }
      // Replace same filterKey or add new
      return [
        ...prev.filter((f) => f.filterKey !== filterKey),
        { sourceChartId: chartId, filterKey, filterValue, displayLabel: `${filterKey}: ${label}` },
      ];
    });
  }, []);

  const removeFilter = useCallback((filter: CrossFilter) => {
    setCrossFilters((prev) => prev.filter((f) => !(f.filterKey === filter.filterKey && f.filterValue === filter.filterValue)));
  }, []);

  const clearAllFilters = useCallback(() => {
    setCrossFilters([]);
  }, []);

  return {
    metadata, kpis, charts, loading, error, timeRange, setTimeRange, refresh,
    crossFilters, toggleChartFilter, removeFilter, clearAllFilters,
  };
}
