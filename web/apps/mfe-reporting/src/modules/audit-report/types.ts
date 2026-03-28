export type AuditFilters = {
  search: string;
  level: string;
};

export type AuditRow = {
  id: string;
  userEmail: string;
  service: string;
  action: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  timestamp: string;
  details: string | null;
  correlationId: string | null;
};
