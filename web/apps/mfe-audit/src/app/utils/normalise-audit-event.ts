import { AuditEvent } from '../types/audit-event';

export type ApiAuditEvent = {
  id: string | number;
  timestamp?: string | null;
  userEmail?: string | null;
  service?: string | null;
  level?: string | null;
  action?: string | null;
  details?: string | null;
  correlationId?: string | null;
  metadata?: Record<string, unknown> | null;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
};

const DEFAULT_TIMESTAMP = () => new Date().toISOString();

const toAuditLevel = (level: string | null | undefined): AuditEvent['level'] => {
  if (!level) {
    return 'INFO';
  }
  const normalized = level.toUpperCase();
  if (normalized === 'WARN' || normalized === 'ERROR') {
    return normalized;
  }
  return 'INFO';
};

export const normaliseAuditEvent = (event: ApiAuditEvent): AuditEvent => ({
  id: String(event.id),
  timestamp: event.timestamp ?? DEFAULT_TIMESTAMP(),
  userEmail: event.userEmail ?? '—',
  service: event.service ?? '—',
  level: toAuditLevel(event.level),
  action: event.action ?? '—',
  details: event.details ?? null,
  metadata: event.metadata ?? undefined,
  before: event.before ?? null,
  after: event.after ?? null,
  correlationId: event.correlationId ?? undefined,
});

