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
};

export type FetchAuditEventsResponse = {
  events: AuditEvent[];
  total: number;
  page: number;
  fallback?: boolean;
};

type AuditEventsApiResponse = {
  events: ApiAuditEvent[];
  total?: number;
  page?: number;
};

export const resolveHttpClient = (): ApiInstance => {
  try {
    return getShellServices().http;
  } catch {
    return api;
  }
};

export async function fetchAuditEvents(params: FetchAuditEventsParams): Promise<FetchAuditEventsResponse> {
  const query = new URLSearchParams();
  query.set('page', params.page.toString());
  query.set('size', params.pageSize.toString());
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
    const start = params.page * params.pageSize;
    const fallbackSlice = fallbackAuditEvents.slice(start, start + params.pageSize);
    return {
      events: fallbackSlice,
      total: fallbackAuditEvents.length,
      page: params.page,
      fallback: true,
    };
  }

  const endpoint = `/audit/events?${query.toString()}`;
  const client = resolveHttpClient();

  try {
    const response = await client.get<AuditEventsApiResponse>(endpoint);
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
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[audit] Falling back to mock audit events', error);
    }
    const start = params.page * params.pageSize;
    const fallbackSlice = fallbackAuditEvents.slice(start, start + params.pageSize);
    return {
      events: fallbackSlice,
      total: fallbackAuditEvents.length,
      page: params.page,
      fallback: true,
    };
  }
}
