import type { UsersReportFilters, UsersReportRow } from './types';
import type { GridRequest, GridResponse } from '../../grid';
import type { PaginatedResponse } from '@mfe/shared-types';
import { AxiosError, isAxiosError } from 'axios';
import { api } from '@mfe/shared-http';
import type { ApiInstance } from '@mfe/shared-http';
import { getShellServices } from '../../app/services/shell-services';

const USERS_ENDPOINT = '/v1/users';

const mapSortField = (field?: string) => {
  switch ((field ?? '').toString()) {
    case 'fullName':
      return 'name';
    case 'createdAt':
      return 'createDate';
    case 'lastLoginAt':
      return 'lastLogin';
    case 'email':
    case 'role':
    case 'status':
      return field;
    default:
      return field ?? 'name';
  }
};

const buildSortParam = (request: GridRequest) => {
  if (!Array.isArray(request.sortModel) || request.sortModel.length === 0) {
    return '';
  }
  return request.sortModel
    .filter((entry) => entry?.colId && entry.sort)
    .map((entry) => `${mapSortField(entry.colId)},${entry.sort}`)
    .join(';');
};

const buildQueryString = (filters: UsersReportFilters, request: GridRequest) => {
  const params = new URLSearchParams();
  const searchInput = filters.search?.trim() || '';
  const quickFilter = request.quickFilter?.trim() || '';
  const search = quickFilter || searchInput;
  if (search) {
    params.set('search', search);
  }
  if (filters.status && filters.status !== 'ALL') {
    params.set('status', filters.status);
  }
  params.set('page', String(request.page ?? 1));
  params.set('pageSize', String(request.pageSize ?? 50));
  const sort = buildSortParam(request);
  if (sort) {
    params.set('sort', sort);
  }
  return params.toString();
};

const resolveHttpClient = (): ApiInstance => {
  try {
    return getShellServices().http;
  } catch {
    return api;
  }
};

export const fetchUsersReport = async (
  filters: UsersReportFilters,
  request: GridRequest,
): Promise<GridResponse<UsersReportRow>> => {
  const qs = buildQueryString(filters, request);
  try {
    const client = resolveHttpClient();
    const { data } = await client.get<PaginatedResponse<UsersReportRow>>(`${USERS_ENDPOINT}?${qs}`);
    const items = Array.isArray(data?.items) ? data.items : [];
    return {
      rows: items,
      total: typeof data?.total === 'number' ? data.total : items.length,
    };
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        throw new Error('Yetki bulunmuyor');
      }
      const traceId = (error as AxiosError<{ meta?: { traceId?: string } }>).response?.data?.meta?.traceId;
      if (traceId && process.env.NODE_ENV !== 'production') {
        console.warn('[mfe-reporting] traceId', traceId);
      }
      throw new Error(`Kullanıcı verileri alınamadı (HTTP ${status ?? '??'})`);
    }
    throw new Error('Kullanıcı verileri alınamadı');
  }
};
