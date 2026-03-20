import axios, { AxiosError } from 'axios';
import { api, type ApiInstance } from '@mfe/shared-http';
import { getShellServices } from '../../app/services/shell-services';
import type { GridRequest, GridResponse } from '../../grid';
import type { AuditFilters, AuditRow } from './types';

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

const toLevel = (level?: string | null): AuditRow['level'] => {
  const normalized = (level ?? '').toUpperCase();
  if (normalized === 'WARN' || normalized === 'ERROR') {
    return normalized;
  }
  return 'INFO';
};

const normalizeAuditRows = (events: ApiAuditEvent[]): AuditRow[] =>
  events.map((event) => ({
    id: String(event.id ?? ''),
    userEmail: event.userEmail ?? '—',
    service: event.service ?? '—',
    action: event.action ?? '—',
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

const buildQueryString = (filters: AuditFilters, request: GridRequest) => {
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

export const fetchAuditReport = async (
  filters: AuditFilters,
  request: GridRequest,
): Promise<GridResponse<AuditRow>> => {
  try {
    const client = resolveHttpClient();
    const response = await client.get<AuditEventsApiResponse>(`/audit/events?${buildQueryString(filters, request)}`);
    const events = Array.isArray(response.data?.events) ? response.data.events : [];

    return {
      rows: normalizeAuditRows(events),
      total: typeof response.data?.total === 'number' ? response.data.total : events.length,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const response = error as AxiosError<ErrorResponse>;
      const status = response.response?.status;
      const traceId = response.response?.data?.meta?.traceId;
      if (traceId && process.env.NODE_ENV !== 'production') {
        console.warn('[mfe-reporting/audit] traceId', traceId);
      }
      if (status === 401 || status === 403) {
        throw new Error('Audit aktivitesi raporu için yetki bulunmuyor');
      }
      throw new Error(`Audit aktivitesi alınamadı (HTTP ${status ?? '??'})`);
    }
    throw new Error('Audit aktivitesi alınamadı');
  }
};

export const exportAuditReport = async (
  filters: AuditFilters,
  format: "csv" | "json",
): Promise<{ blob: Blob; filename: string }> => {
  const client = resolveHttpClient();
  const params = new URLSearchParams();
  const search = filters.search?.trim();
  if (search) {
    params.set("search", search);
  }
  if (filters.level && filters.level !== "ALL") {
    params.set("level", filters.level);
  }
  params.set("sort", "occurredAt,desc");
  params.set("format", format);

  const response = await client.get<Blob>(`/audit/events/export?${params.toString()}`, {
    responseType: "blob",
  });
  const extension = format === "csv" ? "csv" : "json";

  return {
    blob: response.data,
    filename: `audit-events.${extension}`,
  };
};
