import axios, { type AxiosError } from 'axios';
import { api, type ApiInstance } from '@mfe/shared-http';
import { getShellServices } from '../../app/services/shell-services';
import type { GridRequest, GridResponse } from '../../grid';
import type { WeeklyAuditFilters, WeeklyAuditRow } from './types';

type ApiAuditEvent = {
  id?: string | number;
  timestamp?: string | null;
  userEmail?: string | null;
  service?: string | null;
  action?: string | null;
  level?: string | null;
  details?: string | null;
  correlationId?: string | null;
};

type AuditEventsApiResponse = {
  events?: ApiAuditEvent[];
  total?: number;
};

const resolveHttpClient = (): ApiInstance => {
  try {
    return getShellServices().http;
  } catch {
    return api;
  }
};

const toLevel = (level?: string | null): WeeklyAuditRow['level'] => {
  const normalized = (level ?? '').toUpperCase();
  if (normalized === 'WARN' || normalized === 'ERROR') {
    return normalized;
  }
  return 'INFO';
};

const normalizeRows = (events: ApiAuditEvent[]): WeeklyAuditRow[] =>
  events.map((event) => ({
    id: String(event.id ?? ''),
    userEmail: event.userEmail ?? '\u2014',
    service: event.service ?? '\u2014',
    action: event.action ?? '\u2014',
    level: toLevel(event.level),
    timestamp: event.timestamp ?? new Date().toISOString(),
    details: event.details ?? null,
    correlationId: event.correlationId ?? null,
  }));

const mapSortField = (field?: string) => {
  switch ((field ?? '').toString()) {
    case 'timestamp':
      return 'occurredAt';
    case 'userEmail':
    case 'service':
    case 'level':
    case 'action':
      return field;
    default:
      return 'occurredAt';
  }
};

const buildQueryString = (filters: WeeklyAuditFilters, request: GridRequest) => {
  const params = new URLSearchParams();
  const searchInput = filters.search?.trim() || '';
  const quickFilter = request.quickFilter?.trim() || '';
  const search = quickFilter || searchInput;

  params.set('page', String(request.page ?? 1));
  params.set('pageSize', String(request.pageSize ?? 50));

  if (search) {
    params.set('search', search);
  }
  if (filters.level && filters.level !== 'ALL') {
    params.set('level', filters.level);
  }

  const firstSort = Array.isArray(request.sortModel) ? request.sortModel[0] : undefined;
  if (firstSort?.colId && firstSort.sort) {
    params.set('sort', `${mapSortField(firstSort.colId)},${firstSort.sort}`);
  } else {
    params.set('sort', 'occurredAt,desc');
  }

  return params.toString();
};

export const fetchWeeklyAuditReport = async (
  filters: WeeklyAuditFilters,
  request: GridRequest,
): Promise<GridResponse<WeeklyAuditRow>> => {
  try {
    const client = resolveHttpClient();
    const response = await client.get<AuditEventsApiResponse>(
      `/audit/events?${buildQueryString(filters, request)}`,
    );
    const events = Array.isArray(response.data?.events) ? response.data.events : [];
    const pageSize = request.pageSize ?? 50;
    const apiTotal = typeof response.data?.total === 'number' ? response.data.total : events.length;
    /* Backend may report inflated total — cap to actual rows when page is not full */
    const total = events.length < pageSize ? events.length : apiTotal;

    return {
      rows: normalizeRows(events),
      total,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const response = error as AxiosError<{ meta?: { traceId?: string } }>;
      const status = response.response?.status;
      const traceId = response.response?.data?.meta?.traceId;
      if (traceId && process.env.NODE_ENV !== 'production') {
        console.warn('[mfe-reporting/weekly-audit] traceId', traceId);
      }
      if (status === 401 || status === 403) {
        throw new Error('Haftalık denetim özeti için yetki bulunmuyor');
      }
      throw new Error(`Haftalık denetim verileri alınamadı (HTTP ${status ?? '??'})`);
    }
    throw new Error('Haftalık denetim verileri alınamadı');
  }
};
