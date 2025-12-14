export type AuditEvent = {
  id: string;
  timestamp: string;
  userEmail: string;
  service: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  action: string;
  details?: string | null;
  metadata?: Record<string, unknown>;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  correlationId?: string;
};
