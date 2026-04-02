import { api, type ApiInstance } from '@mfe/shared-http';
import { AuditEvent } from '../types/audit-event';
import { ApiAuditEvent, normaliseAuditEvent } from '../utils/normalise-audit-event';
import { fallbackAuditEvents } from '../../mocks/fallback-events';
import { getShellServices } from './shell-services';

declare global {
  interface Window {
    __AUDIT_USE_MOCK__?: boolean;
  }
}

export type FetchAuditEventsParams = {
  page: number;
  pageSize: number;
  filters?: Record<string, string>;
  sort?: string;
  auditId?: string;
  signal?: AbortSignal;
};

export type FetchAuditEventsResponse = {
  events: AuditEvent[];
  total: number;
  page: number;
  fallback?: boolean;
};

export type AuditExportJob = {
  id: string;
  status: string;
  format: 'csv' | 'json';
  filename: string | null;
  contentType: string | null;
  eventCount: number | null;
  requestedBy: string | null;
  createdAt: string | null;
  completedAt: string | null;
  errorMessage: string | null;
  downloadPath: string | null;
};

export type CreateAuditExportJobParams = {
  format: 'csv' | 'json';
  limit?: number;
  sort?: string;
  filters?: Record<string, string>;
};

type AuditEventsApiResponse = {
  events: ApiAuditEvent[];
  total?: number;
  page?: number;
};

type AuditExportJobApiResponse = {
  id: string;
  status: string;
  format: string;
  filename?: string | null;
  contentType?: string | null;
  eventCount?: number | null;
  requestedBy?: string | null;
  createdAt?: string | null;
  completedAt?: string | null;
  errorMessage?: string | null;
  downloadPath?: string | null;
};

const filterFallbackEvents = (
  events: AuditEvent[],
  params: FetchAuditEventsParams,
): AuditEvent[] => {
  const filteredById = params.auditId
    ? events.filter((event) => event.id === params.auditId)
    : events;

  if (!params.filters) {
    return filteredById;
  }

  return filteredById.filter((event) => {
    return Object.entries(params.filters ?? {}).every(([key, value]) => {
      if (!value) {
        return true;
      }
      const candidate = (event as Record<string, unknown>)[key];
      return String(candidate ?? '').toLowerCase().includes(value.toLowerCase());
    });
  });
};

export const resolveHttpClient = (): ApiInstance => {
  try {
    return getShellServices().http;
  } catch {
    return api;
  }
};

const normaliseExportJob = (job: AuditExportJobApiResponse): AuditExportJob => ({
  id: job.id,
  status: job.status,
  format: job.format === 'csv' ? 'csv' : 'json',
  filename: job.filename ?? null,
  contentType: job.contentType ?? null,
  eventCount: typeof job.eventCount === 'number' ? job.eventCount : null,
  requestedBy: job.requestedBy ?? null,
  createdAt: job.createdAt ?? null,
  completedAt: job.completedAt ?? null,
  errorMessage: job.errorMessage ?? null,
  downloadPath: job.downloadPath ?? null,
});

export async function fetchAuditEvents(params: FetchAuditEventsParams): Promise<FetchAuditEventsResponse> {
  const query = new URLSearchParams();
  query.set('page', params.page.toString());
  query.set('size', params.pageSize.toString());
  if (params.auditId) {
    query.set('id', params.auditId);
  }
  if (params.sort) {
    query.set('sort', params.sort);
  }
  if (params.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      if (value) {
        query.set(`filter[${key}]`, value);
      }
    });
  }

  const shouldUseMock = typeof window !== 'undefined' && window.__AUDIT_USE_MOCK__ === true;

  if (shouldUseMock) {
    const filteredFallbackEvents = filterFallbackEvents(fallbackAuditEvents, params);
    const start = params.page * params.pageSize;
    const fallbackSlice = filteredFallbackEvents.slice(start, start + params.pageSize);
    return {
      events: fallbackSlice,
      total: filteredFallbackEvents.length,
      page: params.page,
      fallback: true,
    };
  }

  const endpoint = `/audit/events?${query.toString()}`;
  const client = resolveHttpClient();

  try {
    const response = await client.get<AuditEventsApiResponse>(endpoint, { signal: params.signal });
    const payload = response.data ?? {};
    const events = Array.isArray(payload.events)
      ? payload.events.map(normaliseAuditEvent)
      : [];
    return {
      events,
      total: typeof payload.total === 'number' ? payload.total : events.length,
      page: typeof payload.page === 'number' ? payload.page : params.page,
      fallback: false,
    };
  } catch (error: unknown) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[audit] Falling back to mock audit events', error);
    }
    const filteredFallbackEvents = filterFallbackEvents(fallbackAuditEvents, params);
    const start = params.page * params.pageSize;
    const fallbackSlice = filteredFallbackEvents.slice(start, start + params.pageSize);
    return {
      events: fallbackSlice,
      total: filteredFallbackEvents.length,
      page: params.page,
      fallback: true,
    };
  }
}

export async function createAuditExportJob(params: CreateAuditExportJobParams): Promise<AuditExportJob> {
  const client = resolveHttpClient();
  const response = await client.post<AuditExportJobApiResponse>('/audit/events/export-jobs', {
    format: params.format,
    limit: params.limit,
    sort: params.sort,
    filters: params.filters ?? {},
  });
  return normaliseExportJob(response.data);
}

export async function fetchAuditExportJob(jobId: string): Promise<AuditExportJob> {
  const client = resolveHttpClient();
  const response = await client.get<AuditExportJobApiResponse>(`/audit/events/export-jobs/${encodeURIComponent(jobId)}`);
  return normaliseExportJob(response.data);
}

export async function waitForAuditExportJob(
  jobId: string,
  options?: {
    attempts?: number;
    intervalMs?: number;
  },
): Promise<AuditExportJob> {
  const attempts = options?.attempts ?? 8;
  const intervalMs = options?.intervalMs ?? 600;

  let currentJob = await fetchAuditExportJob(jobId);
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (currentJob.status !== 'PROCESSING') {
      return currentJob;
    }
    await new Promise((resolve) => window.setTimeout(resolve, intervalMs));
    currentJob = await fetchAuditExportJob(jobId);
  }
  return currentJob;
}

export async function downloadAuditExportJob(jobId: string): Promise<{ blob: Blob; filename: string }> {
  const client = resolveHttpClient();
  const response = await client.get<Blob>(`/audit/events/export-jobs/${encodeURIComponent(jobId)}/download`, {
    responseType: 'blob',
  });
  const disposition = response.headers?.['content-disposition'];
  const filenameMatch = disposition?.match(/filename="?([^"]+)"?/i);
  const filename = filenameMatch?.[1] ?? `audit-events-${jobId}.json`;
  return {
    blob: response.data,
    filename,
  };
}
