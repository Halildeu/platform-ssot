import axios, { AxiosError } from 'axios';
import { api, type ApiInstance } from '@mfe/shared-http';
import { getShellServices } from '../../app/services/shell-services';
import type { GridRequest, GridResponse } from '../../grid';
import type { AccessFilters, AccessRow } from './types';

type RolePolicyDto = {
  moduleKey?: string;
  moduleLabel?: string;
};

type RoleDto = {
  id?: string | number;
  name?: string;
  description?: string | null;
  memberCount?: number;
  lastModifiedAt?: string | null;
  policies?: RolePolicyDto[];
  permissions?: Array<string | number>;
};

type PagedResultDto<T> = {
  items?: T[];
  total?: number;
};

type ErrorResponse = {
  error?: string;
  message?: string;
  meta?: { traceId?: string };
};

const resolveHttpClient = (): ApiInstance => {
  try {
    return getShellServices().http;
  } catch {
    return api;
  }
};

const buildModuleSummary = (dto: RoleDto) => {
  const labels = Array.isArray(dto.policies)
    ? dto.policies
        .map((policy) => policy.moduleLabel ?? policy.moduleKey ?? '')
        .filter((value) => value.trim().length > 0)
    : [];
  const uniqueLabels = [...new Set(labels)];

  if (uniqueLabels.length > 0) {
    const preview = uniqueLabels.slice(0, 2).join(', ');
    const remaining = uniqueLabels.length - 2;
    return remaining > 0 ? `${preview} +${remaining}` : preview;
  }

  const permissionCount = Array.isArray(dto.permissions) ? dto.permissions.length : 0;
  return permissionCount > 0 ? `${permissionCount} izin tanimli` : 'Modul atamasi yok';
};

const normalizeRows = (items: RoleDto[]): AccessRow[] =>
  items.map((item) => ({
    id: String(item.id ?? ''),
    roleName: item.name ?? 'Bilinmeyen rol',
    description: item.description ?? null,
    memberCount: typeof item.memberCount === 'number' ? item.memberCount : 0,
    permissionCount: Array.isArray(item.permissions) ? item.permissions.length : 0,
    moduleSummary: buildModuleSummary(item),
    updatedAt: item.lastModifiedAt ?? '',
  }));

const compareValues = (left: string | number, right: string | number, direction: 'asc' | 'desc') => {
  const result =
    typeof left === 'number' && typeof right === 'number'
      ? left - right
      : String(left).localeCompare(String(right), 'tr');
  return direction === 'desc' ? result * -1 : result;
};

const sortRows = (rows: AccessRow[], request: GridRequest) => {
  const firstSort = Array.isArray(request.sortModel) ? request.sortModel[0] : undefined;
  if (!firstSort?.colId || !firstSort.sort) {
    return rows;
  }

  return [...rows].sort((left, right) => {
    switch (firstSort.colId) {
      case 'memberCount':
        return compareValues(left.memberCount, right.memberCount, firstSort.sort);
      case 'updatedAt':
        return compareValues(left.updatedAt, right.updatedAt, firstSort.sort);
      case 'moduleSummary':
        return compareValues(left.moduleSummary, right.moduleSummary, firstSort.sort);
      case 'roleName':
      default:
        return compareValues(left.roleName, right.roleName, firstSort.sort);
    }
  });
};

const filterRows = (rows: AccessRow[], filters: AccessFilters, request: GridRequest) => {
  const normalizedSearch = (request.quickFilter ?? filters.search ?? '').trim().toLowerCase();
  if (!normalizedSearch) {
    return rows;
  }

  return rows.filter((row) =>
    `${row.roleName} ${row.moduleSummary}`.toLowerCase().includes(normalizedSearch),
  );
};

export const fetchAccessReport = async (
  filters: AccessFilters,
  request: GridRequest,
): Promise<GridResponse<AccessRow>> => {
  try {
    const client = resolveHttpClient();
    const response = await client.get<PagedResultDto<RoleDto>>('/v1/roles');
    const items = Array.isArray(response.data?.items) ? response.data.items : [];
    const normalizedRows = normalizeRows(items);
    const filteredRows = filterRows(normalizedRows, filters, request);
    const sortedRows = sortRows(filteredRows, request);

    return {
      rows: sortedRows,
      total: filteredRows.length,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const response = error as AxiosError<ErrorResponse>;
      const status = response.response?.status;
      const traceId = response.response?.data?.meta?.traceId;
      if (traceId && process.env.NODE_ENV !== 'production') {
        console.warn('[mfe-reporting/access] traceId', traceId);
      }
      if (status === 401 || status === 403) {
        throw new Error('Erişim rolleri raporu için yetki bulunmuyor');
      }
      throw new Error(`Erişim rolleri alınamadı (HTTP ${status ?? '??'})`);
    }
    throw new Error('Erişim rolleri alınamadı');
  }
};
