import type { HrCompensationFilters, HrCompensationRow } from './types';
import type { GridRequest, GridResponse } from '../../grid';
import { api, type ApiInstance } from '@mfe/shared-http';
import { getShellServices } from '../../app/services/shell-services';

const DASHBOARD_KEY = 'hr-compensation';
const REPORT_KEY = 'hr-compensation-detay';

const resolveHttp = (): ApiInstance => {
  try {
    return getShellServices().http;
  } catch {
    return api;
  }
};

/* ------------------------------------------------------------------ */
/*  Dashboard API — KPIs & Charts                                      */
/* ------------------------------------------------------------------ */

export interface DashboardKPI {
  id: string;
  title: string;
  value: number | null;
  formattedValue: string;
  format?: string;
  tone?: string;
  trend?: { direction: string; percentage: number } | null;
  benchmark?: { label: string; value: number | null } | null;
}

export interface DashboardChartItem {
  label: string;
  value: number;
  value2?: number;
  min_val?: number;
  max_val?: number;
  [key: string]: unknown;
}

export interface DashboardChart {
  id: string;
  title: string;
  chartType: string;
  size?: string;
  data: DashboardChartItem[];
  chartConfig?: Record<string, unknown>;
}

let _kpiCache: DashboardKPI[] | null = null;
let _chartCache: DashboardChart[] | null = null;
let _fetchPromise: Promise<void> | null = null;

async function fetchDashboardData(timeRange = 'ytd'): Promise<void> {
  if (_kpiCache && _chartCache) return;
  if (_fetchPromise) return _fetchPromise;

  _fetchPromise = (async () => {
    try {
      const client = resolveHttp();
      const [kpiRes, chartRes] = await Promise.all([
        client.get<DashboardKPI[]>(`/v1/dashboards/${DASHBOARD_KEY}/kpis?timeRange=${timeRange}`),
        client.get<DashboardChart[]>(`/v1/dashboards/${DASHBOARD_KEY}/charts?timeRange=${timeRange}`),
      ]);
      if (kpiRes.data) _kpiCache = Array.isArray(kpiRes.data) ? kpiRes.data : null;
      if (chartRes.data) _chartCache = Array.isArray(chartRes.data) ? chartRes.data : null;
    } catch (err) {
      console.warn('[hr-compensation] Dashboard fetch failed:', err);
    }
  })();

  return _fetchPromise;
}

export const getLiveKPIs = async (): Promise<DashboardKPI[] | null> => {
  await fetchDashboardData();
  return _kpiCache;
};

export const getLiveCharts = async (): Promise<DashboardChart[] | null> => {
  await fetchDashboardData();
  return _chartCache;
};

export const refreshDashboardData = (): void => {
  _kpiCache = null;
  _chartCache = null;
  _fetchPromise = null;
};

/* ------------------------------------------------------------------ */
/*  Grid API — dynamic report data                                     */
/* ------------------------------------------------------------------ */

const extractFilterModelSearch = (filterModel?: Record<string, unknown>): string => {
  if (!filterModel) return '';
  // AG Grid column filters — extract text filter values as search terms
  const terms: string[] = [];
  for (const [, value] of Object.entries(filterModel)) {
    const v = value as Record<string, unknown> | undefined;
    if (v?.filter && typeof v.filter === 'string') {
      terms.push(v.filter.trim());
    }
  }
  return terms.join(' ').trim();
};

const buildQueryString = (filters: HrCompensationFilters, request: GridRequest) => {
  const params = new URLSearchParams();
  const filterModelSearch = extractFilterModelSearch(request.filterModel);
  const search = (request.quickFilter?.trim() || filterModelSearch || filters.search?.trim() || '');
  if (search) params.set('search', search);

  if (filters.department && filters.department !== 'all') params.set('department', filters.department);
  if (filters.company && filters.company !== 'all') params.set('company', filters.company);
  if (filters.collarType && filters.collarType !== 'all') params.set('collarType', filters.collarType);
  if (filters.gender && filters.gender !== 'all') params.set('gender', filters.gender);
  if (filters.education && filters.education !== 'all') params.set('education', filters.education);

  params.set('page', String(request.page ?? 1));
  params.set('pageSize', String(request.pageSize ?? 50));

  const firstSort = Array.isArray(request.sortModel) ? request.sortModel[0] : undefined;
  if (firstSort?.colId && firstSort.sort) {
    params.set('sort', `${firstSort.colId},${firstSort.sort}`);
  } else {
    params.set('sort', 'GROSS_SALARY,desc');
  }

  return params.toString();
};

export const fetchCompensationRows = async (
  filters: HrCompensationFilters,
  request: GridRequest,
): Promise<GridResponse<HrCompensationRow>> => {
  try {
    const client = resolveHttp();
    const response = await client.get<{ items?: HrCompensationRow[]; data?: HrCompensationRow[]; rows?: HrCompensationRow[]; total: number }>(
      `/v1/reports/${REPORT_KEY}/data?${buildQueryString(filters, request)}`,
    );
    const rawData = response.data;
    const rows = Array.isArray(rawData?.items) ? rawData.items
      : Array.isArray(rawData?.data) ? rawData.data
      : Array.isArray(rawData?.rows) ? rawData.rows
      : [];
    const apiTotal = typeof rawData?.total === 'number' ? rawData.total : rows.length;
    const pageSize = request.pageSize ?? 50;
    const total = rows.length < pageSize ? rows.length : apiTotal;

    return { rows, total };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Ücret verileri alınamadı';
    throw new Error(msg);
  }
};
