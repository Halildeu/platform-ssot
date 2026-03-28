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

const resolveHttpClient = (): ApiInstance => {
  try {
    return getShellServices().http;
  } catch {
    return api;
  }
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
  const { data } = await client.get<ReportMetadata>(`${REPORTS_BASE}/${reportKey}/metadata`);
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
    { responseType: 'blob' },
  );
  const extension = format === 'csv' ? 'csv' : 'xlsx';
  return { blob: data, filename: `${reportKey}.${extension}` };
};
