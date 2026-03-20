export type AuditEventRecord = {
  id: string;
  timestamp: string;
  userEmail: string | null;
  service: string;
  level: string;
  action: string;
  details: string;
  correlationId: string;
  metadata: Record<string, unknown>;
  before: Record<string, unknown>;
  after: Record<string, unknown>;
};

export type AuditEventPageResponse = {
  events: AuditEventRecord[];
  page: number;
  total: number;
};

export type AuditPreviewQuery = {
  action?: string;
  page?: number;
  pageSize?: number;
  service?: string;
};
