import type { HrDemographicFilters, HrDemographicRow, DemographicSummary } from './types';
import { generateMockEmployees, computeSummary } from './mock-data';
import type { GridRequest, GridResponse } from '../../grid';
import { api } from '@mfe/shared-http';
import { getShellServices } from '../../app/services/shell-services';

// ---------------------------------------------------------------------------
// Backend Dashboard API — canlı Workcube verisi
// ---------------------------------------------------------------------------

const DASHBOARD_KEY = 'hr-demografik';

const resolveHttp = () => {
  try { return getShellServices().http; } catch { return api; }
};

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
      const client = resolveHttp();
      const [kpiRes, chartRes] = await Promise.all([
        client.get<DashboardKPI[]>(`/v1/dashboards/${DASHBOARD_KEY}/kpis?timeRange=ytd`),
        client.get<DashboardChart[]>(`/v1/dashboards/${DASHBOARD_KEY}/charts?timeRange=ytd`),
      ]);

      if (kpiRes.data) _liveKPIs = Array.isArray(kpiRes.data) ? kpiRes.data : null;
      if (chartRes.data) _liveCharts = Array.isArray(chartRes.data) ? chartRes.data : null;
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
  const client = resolveHttp();

  // Try live backend first (hr-personel-listesi report endpoint)
  try {
    const pageSize = request.pageSize ?? 50;
    const page = request.page ?? 1;

    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('pageSize', String(pageSize));

    if (request.sortModel && request.sortModel.length > 0) {
      params.set('sort', JSON.stringify(request.sortModel));
    }
    if (filters.search) {
      params.set('advancedFilter', JSON.stringify({ EMPLOYEE_NAME: { filterType: 'text', type: 'contains', filter: filters.search } }));
    }

    const { data } = await client.get<{ items: Record<string, unknown>[]; total: number }>(
      `/v1/reports/hr-personel-listesi/data?${params.toString()}`,
    );

    if (data?.items) {
      const rows: HrDemographicRow[] = data.items.map((item) => ({
        id: String(item.EMPLOYEE_ID ?? item.POSITION_ID ?? ''),
        fullName: `${item.EMPLOYEE_NAME ?? ''} ${item.EMPLOYEE_SURNAME ?? ''}`.trim(),
        department: String(item.DEPARTMENT_ID ?? ''),
        position: String(item.POSITION_NAME ?? ''),
        gender: 'Diğer' as const,
        birthDate: '',
        age: 0,
        education: '',
        maritalStatus: '',
        employmentType: Number(item.COLLAR_TYPE) === 1 ? 'Mavi Yaka' : 'Beyaz Yaka',
        hireDate: '',
        tenureYears: 0,
        location: String(item.BRANCH_ID ?? ''),
        isManager: false,
        hasDisability: false,
        militaryStatus: '',
        generation: '',
        ethicsTrainingComplete: false,
        positionLevel: String(item.TITLE_NAME ?? ''),
      }));

      return { rows, total: data.total };
    }
  } catch (err) {
    console.warn('[hr-demographic] Live grid fetch failed, falling back to mock:', err);
  }

  // Fallback to mock data
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
