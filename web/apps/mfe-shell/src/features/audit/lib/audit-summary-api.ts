import { api } from '@mfe/shared-http';

export type FetchAuditSummaryEventsParams = {
  action: string;
  page?: number;
  pageSize?: number;
  service: string;
  user: string;
};

export type AuditSummaryEvent = {
  id: string;
  timestamp: string;
};

type AuditSummaryApiResponse = {
  events?: AuditSummaryEvent[];
  total?: number;
  page?: number;
};

export async function fetchAuditSummaryEvents(
  params: FetchAuditSummaryEventsParams,
): Promise<{
  events: AuditSummaryEvent[];
  total: number;
  page: number;
}> {
  const query = new URLSearchParams();
  query.set('page', String(params.page ?? 0));
  query.set('size', String(params.pageSize ?? 3));
  query.set('filter[action]', params.action);
  query.set('filter[service]', params.service);
  query.set('filter[user]', params.user);

  const response = await api.get<AuditSummaryApiResponse>(`/audit/events?${query.toString()}`);
  const payload = response.data ?? {};
  const events = Array.isArray(payload.events) ? payload.events : [];

  return {
    events,
    total: typeof payload.total === 'number' ? payload.total : events.length,
    page: typeof payload.page === 'number' ? payload.page : params.page ?? 0,
  };
}
