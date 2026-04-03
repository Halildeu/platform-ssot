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

export type DashboardFilters = Partial<Pick<HrCompensationFilters, 'department' | 'gender' | 'collarType' | 'education'>>;

const _cache = new Map<string, { kpis: DashboardKPI[] | null; charts: DashboardChart[] | null }>();
const _pending = new Map<string, Promise<void>>();

function filterCacheKey(filters?: DashboardFilters): string {
  if (!filters) return '';
  const parts: string[] = [];
  if (filters.department && filters.department !== 'all') parts.push(`d=${filters.department}`);
  if (filters.gender && filters.gender !== 'all') parts.push(`g=${filters.gender}`);
  if (filters.collarType && filters.collarType !== 'all') parts.push(`c=${filters.collarType}`);
  if (filters.education && filters.education !== 'all') parts.push(`e=${filters.education}`);
  return parts.sort().join('&');
}

function buildDashboardFilterParams(filters?: DashboardFilters): string {
  if (!filters) return '';
  const params = new URLSearchParams();
  if (filters.department && filters.department !== 'all') params.set('department', filters.department);
  if (filters.gender && filters.gender !== 'all') params.set('gender', filters.gender);
  if (filters.collarType && filters.collarType !== 'all') params.set('collarType', filters.collarType);
  if (filters.education && filters.education !== 'all') params.set('education', filters.education);
  const str = params.toString();
  return str ? `&${str}` : '';
}

async function fetchDashboardData(timeRange = 'ytd', filters?: DashboardFilters): Promise<void> {
  const key = filterCacheKey(filters);
  if (_cache.has(key)) return;
  if (_pending.has(key)) return _pending.get(key);

  const promise = (async () => {
    try {
      const client = resolveHttp();
      const filterQs = buildDashboardFilterParams(filters);
      const [kpiRes, chartRes] = await Promise.all([
        client.get<DashboardKPI[]>(`/v1/dashboards/${DASHBOARD_KEY}/kpis?timeRange=${timeRange}${filterQs}`),
        client.get<DashboardChart[]>(`/v1/dashboards/${DASHBOARD_KEY}/charts?timeRange=${timeRange}${filterQs}`),
      ]);
      const kpis = kpiRes.data && Array.isArray(kpiRes.data) ? kpiRes.data : null;
      const charts = chartRes.data && Array.isArray(chartRes.data) ? chartRes.data : null;
      _cache.set(key, { kpis, charts });
    } catch (err) {
      console.warn('[hr-compensation] Dashboard fetch failed:', err);
      _cache.set(key, { kpis: null, charts: null });
    } finally {
      _pending.delete(key);
    }
  })();

  _pending.set(key, promise);
  return promise;
}

export const getLiveKPIs = async (filters?: DashboardFilters): Promise<DashboardKPI[] | null> => {
  await fetchDashboardData('ytd', filters);
  return _cache.get(filterCacheKey(filters))?.kpis ?? null;
};

export const getLiveCharts = async (filters?: DashboardFilters): Promise<DashboardChart[] | null> => {
  await fetchDashboardData('ytd', filters);
  return _cache.get(filterCacheKey(filters))?.charts ?? null;
};

export const refreshDashboardData = (): void => {
  _cache.clear();
  _pending.clear();
};

/* ------------------------------------------------------------------ */
/*  Grid API — dynamic report data                                     */
/* ------------------------------------------------------------------ */

/**
 * Build the AG Grid advancedFilter object from sidebar filters + grid filterModel.
 *
 * Backend ReportController accepts `advancedFilter` as JSON — it passes it through
 * FilterTranslator which understands AG Grid's filter model format
 * (e.g., { FULL_NAME: { filterType: "text", type: "contains", filter: "halil" } }).
 *
 * Sidebar dropdown filters (department, collarType, etc.) are converted to the same
 * AG Grid filter format so the backend handles them uniformly.
 */
const buildAdvancedFilter = (
  filters: HrCompensationFilters,
  gridFilterModel?: Record<string, unknown>,
): Record<string, unknown> => {
  const merged: Record<string, unknown> = { ...(gridFilterModel ?? {}) };

  // Sidebar search → FULL_NAME contains filter
  if (filters.search?.trim()) {
    merged.FULL_NAME = { filterType: 'text', type: 'contains', filter: filters.search.trim() };
  }

  // Sidebar dropdown filters → AG Grid set/number format
  if (filters.department && filters.department !== 'all') {
    merged.DEPARTMENT_NAME = { filterType: 'text', type: 'contains', filter: filters.department };
  }
  if (filters.collarType && filters.collarType !== 'all') {
    merged.COLLAR_TYPE = { filterType: 'number', type: 'equals', filter: Number(filters.collarType) };
  }
  if (filters.gender && filters.gender !== 'all') {
    merged.GENDER = { filterType: 'number', type: 'equals', filter: Number(filters.gender) };
  }
  if (filters.education && filters.education !== 'all') {
    merged.EDUCATION = { filterType: 'text', type: 'equals', filter: filters.education };
  }

  return merged;
};

const buildQueryString = (filters: HrCompensationFilters, request: GridRequest) => {
  const params = new URLSearchParams();

  // Quick filter (grid toolbar search) → FULL_NAME contains
  const quickSearch = request.quickFilter?.trim() || '';
  const advFilter = buildAdvancedFilter(
    quickSearch ? { ...filters, search: quickSearch } : filters,
    request.filterModel,
  );

  if (Object.keys(advFilter).length > 0) {
    params.set('advancedFilter', JSON.stringify(advFilter));
  }

  params.set('page', String(request.page ?? 1));
  params.set('pageSize', String(request.pageSize ?? 50));

  const firstSort = Array.isArray(request.sortModel) ? request.sortModel[0] : undefined;
  if (firstSort?.colId && firstSort.sort) {
    params.set('sort', JSON.stringify([{ colId: firstSort.colId, sort: firstSort.sort }]));
  } else {
    params.set('sort', JSON.stringify([{ colId: 'GROSS_SALARY', sort: 'desc' }]));
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
