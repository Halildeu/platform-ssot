import axios, { AxiosError } from 'axios';
import { api, type ApiInstance } from '@mfe/shared-http';
import { getShellServices } from '../../app/services/shell-services';
import type { GridRequest, GridResponse } from '../../grid';
import type {
  DynamicReportFilters,
  DynamicReportRow,
  ReportListItem,
  ReportMetadata,
  ReportCategory,
} from './types';

type PagedResultDto = {
  items: Record<string, unknown>[];
  total: number;
  page: number;
  pageSize: number;
};

type ErrorResponse = {
  error?: string;
  message?: string;
  meta?: { traceId?: string };
};

const REPORTS_BASE = '/v1/reports';
const COMPANY_ID_STORAGE_KEY = 'reporting:currentCompanyId';
const COMPANY_HEADER = 'X-Company-Id';

const resolveHttpClient = (): ApiInstance => {
  try {
    return getShellServices().http;
  } catch {
    return api;
  }
};

/**
 * Resolves the active company id for report API calls.
 *
 * Source priority:
 *   1. shellServices.getCurrentCompanyId() if exposed by the host shell
 *   2. localStorage[COMPANY_ID_STORAGE_KEY] (persisted by WorkspaceSwitcher)
 *   3. undefined → header is omitted; backend will reject for super-admin /
 *      multi-company users with 400 MissingCompanyHeaderException
 *
 * Backend contract (YearlySchemaResolver): {@code X-Company-Id} is the
 * authoritative selector for the active company schema. Single-company users
 * are auto-selected server-side, so the header is optional in that case.
 */
const resolveCompanyId = (): string | undefined => {
  try {
    const services = getShellServices();
    const fromShell = (
      services as { getCurrentCompanyId?: () => string | number | null | undefined }
    ).getCurrentCompanyId?.();
    if (fromShell !== undefined && fromShell !== null && String(fromShell).trim() !== '') {
      return String(fromShell);
    }
  } catch {
    // shell-services not registered yet (e.g. unit tests); fall through to storage
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = window.localStorage.getItem(COMPANY_ID_STORAGE_KEY);
    if (stored && stored.trim() !== '') {
      return stored;
    }
  }

  return undefined;
};

const buildCompanyHeaders = (): Record<string, string> => {
  const companyId = resolveCompanyId();
  return companyId ? { [COMPANY_HEADER]: companyId } : {};
};

export const fetchReportList = async (): Promise<ReportListItem[]> => {
  const client = resolveHttpClient();
  const { data } = await client.get<ReportListItem[]>(REPORTS_BASE);
  return Array.isArray(data) ? data : [];
};

export const fetchReportCategories = async (): Promise<ReportCategory[]> => {
  const client = resolveHttpClient();
  const { data } = await client.get<ReportCategory[]>(`${REPORTS_BASE}/categories`);
  return Array.isArray(data) ? data : [];
};

export const fetchReportMetadata = async (reportKey: string): Promise<ReportMetadata> => {
  const client = resolveHttpClient();
  const { data } = await client.get<ReportMetadata>(`${REPORTS_BASE}/${reportKey}/metadata`, {
    headers: buildCompanyHeaders(),
  });
  return data;
};

const buildSortParam = (request: GridRequest, defaultSort?: string, defaultDirection?: string) => {
  if (Array.isArray(request.sortModel) && request.sortModel.length > 0) {
    const entry = request.sortModel[0];
    if (entry?.colId && entry.sort) {
      return `${entry.colId},${entry.sort}`;
    }
  }
  if (defaultSort) {
    return `${defaultSort},${defaultDirection ?? 'desc'}`;
  }
  return '';
};

export const fetchReportData = async (
  reportKey: string,
  filters: DynamicReportFilters,
  request: GridRequest,
  defaultSort?: string,
  defaultDirection?: string,
): Promise<GridResponse<DynamicReportRow>> => {
  const params = new URLSearchParams();
  params.set('page', String(request.page ?? 1));
  params.set('pageSize', String(request.pageSize ?? 50));

  const quickFilter = request.quickFilter?.trim() || '';
  const search = quickFilter || filters.search?.trim() || '';
  if (search) {
    params.set('search', search);
  }

  const sort = buildSortParam(request, defaultSort, defaultDirection);
  if (sort) {
    params.set('sort', sort);
  }

  if (request.advancedFilter) {
    params.set('advancedFilter', JSON.stringify(request.advancedFilter));
  }

  try {
    const client = resolveHttpClient();
    const { data } = await client.get<PagedResultDto>(
      `${REPORTS_BASE}/${reportKey}/data?${params.toString()}`,
      { headers: buildCompanyHeaders() },
    );
    const items = Array.isArray(data?.items) ? data.items : [];
    return {
      rows: items,
      total: typeof data?.total === 'number' ? data.total : items.length,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const response = error as AxiosError<ErrorResponse>;
      const status = response.response?.status;
      const traceId = response.response?.data?.meta?.traceId;
      if (traceId && process.env.NODE_ENV !== 'production') {
        console.warn(`[mfe-reporting/${reportKey}] traceId`, traceId);
      }
      if (status === 401 || status === 403) {
        throw new Error('Rapor verileri için yetki bulunmuyor');
      }
      throw new Error(`Rapor verileri alınamadı (HTTP ${status ?? '??'})`);
    }
    throw new Error('Rapor verileri alınamadı');
  }
};

export const exportReportData = async (
  reportKey: string,
  filters: DynamicReportFilters,
  format: 'csv' | 'json',
): Promise<{ blob: Blob; filename: string }> => {
  const client = resolveHttpClient();
  const params = new URLSearchParams();
  const search = filters.search?.trim();
  if (search) {
    params.set('search', search);
  }
  params.set('format', format === 'json' ? 'xlsx' : 'csv');

  const { data } = await client.get<Blob>(
    `${REPORTS_BASE}/${reportKey}/export?${params.toString()}`,
    { responseType: 'blob', headers: buildCompanyHeaders() },
  );
  const extension = format === 'csv' ? 'csv' : 'xlsx';
  return { blob: data, filename: `${reportKey}.${extension}` };
};
