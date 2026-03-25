import type { HrDemographicFilters, HrDemographicRow, DemographicSummary } from './types';
import { generateMockEmployees, computeSummary } from './mock-data';
import type { GridRequest, GridResponse } from '../../grid';

// ---------------------------------------------------------------------------
// Backend Dashboard API — canlı Workcube verisi
// ---------------------------------------------------------------------------

const DASHBOARD_KEY = 'hr-demografik';

interface DashboardKPI {
  id: string;
  title: string;
  value: number | null;
  formattedValue: string;
  trend?: { direction: string; percentage: number } | null;
}

interface DashboardChartItem {
  label: string;
  value: number;
  [key: string]: unknown;
}

interface DashboardChart {
  id: string;
  title: string;
  chartType: string;
  data: DashboardChartItem[];
}

let _liveKPIs: DashboardKPI[] | null = null;
let _liveCharts: DashboardChart[] | null = null;
let _liveFetchPromise: Promise<void> | null = null;

async function fetchLiveDashboardData(): Promise<void> {
  if (_liveKPIs && _liveCharts) return;
  if (_liveFetchPromise) return _liveFetchPromise;

  _liveFetchPromise = (async () => {
    try {
      const [kpiRes, chartRes] = await Promise.all([
        fetch(`/api/v1/dashboards/${DASHBOARD_KEY}/kpis?timeRange=ytd`),
        fetch(`/api/v1/dashboards/${DASHBOARD_KEY}/charts?timeRange=ytd`),
      ]);

      if (kpiRes.ok) _liveKPIs = await kpiRes.json();
      if (chartRes.ok) _liveCharts = await chartRes.json();
    } catch (err) {
      console.warn('[hr-demographic] Live dashboard fetch failed, falling back to mock:', err);
    }
  })();

  return _liveFetchPromise;
}

// ---------------------------------------------------------------------------
// Public API — tries live data first, falls back to mock
// ---------------------------------------------------------------------------

// Mock fallback
const mockRows = generateMockEmployees(2545);
const mockSummary = computeSummary(mockRows);

export const getSummary = (): DemographicSummary => mockSummary;

export const getLiveKPIs = async (): Promise<DashboardKPI[] | null> => {
  await fetchLiveDashboardData();
  return _liveKPIs;
};

export const getLiveCharts = async (): Promise<DashboardChart[] | null> => {
  await fetchLiveDashboardData();
  return _liveCharts;
};

export const isLiveDataAvailable = (): boolean => _liveKPIs !== null && _liveCharts !== null;

export const refreshLiveData = (): void => {
  _liveKPIs = null;
  _liveCharts = null;
  _liveFetchPromise = null;
};

export const fetchHrDemographicRows = async (
  filters: HrDemographicFilters,
  request: GridRequest,
): Promise<GridResponse<HrDemographicRow>> => {
  // Grid still uses mock data (individual row data not available from dashboard API)
  let filtered = [...mockRows];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.fullName.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q) ||
        r.position.toLowerCase().includes(q),
    );
  }
  if (filters.department && filters.department !== 'all') {
    filtered = filtered.filter((r) => r.department === filters.department);
  }
  if (filters.gender && filters.gender !== 'all') {
    filtered = filtered.filter((r) => r.gender === filters.gender);
  }
  if (filters.location && filters.location !== 'all') {
    filtered = filtered.filter((r) => r.location === filters.location);
  }
  if (filters.employmentType && filters.employmentType !== 'all') {
    filtered = filtered.filter((r) => r.employmentType === filters.employmentType);
  }

  if (request.sortModel && request.sortModel.length > 0) {
    const { colId, sort } = request.sortModel[0];
    const dir = sort === 'desc' ? -1 : 1;
    filtered.sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[colId];
      const bVal = (b as unknown as Record<string, unknown>)[colId];
      if (typeof aVal === 'number' && typeof bVal === 'number') return (aVal - bVal) * dir;
      return String(aVal ?? '').localeCompare(String(bVal ?? ''), 'tr') * dir;
    });
  }

  const pageSize = request.pageSize ?? 50;
  const page = request.page ?? 1;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    rows: filtered.slice(start, end),
    total: filtered.length,
  };
};
