import type { MonthlyLoginFilters, MonthlyLoginRow } from './types';
import type { GridRequest, GridResponse } from '../../grid';
import type { PaginatedResponse } from '@mfe/shared-types';
import { isAxiosError, type AxiosError } from 'axios';
import { api, type ApiInstance } from '@mfe/shared-http';
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
      return 'lastLogin';
  }
};

const buildSortParam = (request: GridRequest) => {
  if (!Array.isArray(request.sortModel) || request.sortModel.length === 0) {
    return 'lastLogin,desc';
  }
  return request.sortModel
    .filter((entry) => entry?.colId && entry.sort)
    .map((entry) => `${mapSortField(entry.colId)},${entry.sort}`)
    .join(';');
};

const buildQueryString = (filters: MonthlyLoginFilters, request: GridRequest) => {
  const params = new URLSearchParams();
  const searchInput = filters.search?.trim() || '';
  const quickFilter = request.quickFilter?.trim() || '';
  const search = quickFilter || searchInput;
  if (search) {
    params.set('search', search);
  }
  /* Only return active users with recent logins */
  params.set('status', 'ACTIVE');
  params.set('page', String(request.page ?? 1));
  params.set('pageSize', String(request.pageSize ?? 50));
  params.set('sort', buildSortParam(request));
  return params.toString();
};

const resolveHttpClient = (): ApiInstance => {
  try {
    return getShellServices().http;
  } catch {
    return api;
  }
};

export const fetchMonthlyLoginReport = async (
  filters: MonthlyLoginFilters,
  request: GridRequest,
): Promise<GridResponse<MonthlyLoginRow>> => {
  const qs = buildQueryString(filters, request);
  try {
    const client = resolveHttpClient();
    const { data } = await client.get<PaginatedResponse<MonthlyLoginRow>>(`${USERS_ENDPOINT}?${qs}`);
    const rawItems = Array.isArray(data?.items) ? data.items : [];
    const items = rawItems.map((item) => {
      const raw = item as unknown as Record<string, unknown>;
      return {
        ...item,
        fullName: item.fullName || (raw.name as string) || item.email || '-',
        status: typeof item.status === 'string' ? item.status.toUpperCase() : (item.status ?? 'ACTIVE'),
      } as MonthlyLoginRow;
    });
    return {
      rows: items,
      total: typeof data?.total === 'number' ? data.total : items.length,
    };
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const status = (error as AxiosError).response?.status;
      if (status === 401 || status === 403) {
        throw new Error('Yetki bulunmuyor');
      }
      throw new Error(`Aylık giriş verileri alınamadı (HTTP ${status ?? '??'})`);
    }
    throw new Error('Aylık giriş verileri alınamadı');
  }
};
