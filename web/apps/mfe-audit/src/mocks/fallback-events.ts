import { AuditEvent } from '../types/audit-event';

export const fallbackAuditEvents: AuditEvent[] = Array.from({ length: 25 }).map((_, index) => {
  const id = `fallback-${index + 1}`;
  const timestamp = new Date(Date.now() - index * 60_000).toISOString();
  return {
    id,
    timestamp,
    userEmail: `user${(index % 5) + 1}@example.com`,
    service: index % 2 === 0 ? 'permission-service' : 'auth-service',
    level: index % 3 === 0 ? 'ERROR' : index % 3 === 1 ? 'WARN' : 'INFO',
    action: index % 2 === 0 ? 'ROLE_ASSIGNED' : 'ROLE_REVOKED',
    details: 'Mock audit event generated for UI fallback.',
    metadata: {
      scope: index % 2 === 0 ? 'global' : 'project',
      actorId: 1000 + index
    },
    before: index % 2 === 0 ? null : { permissions: ['VIEW_USERS'] },
    after: index % 2 === 0 ? { permissions: ['VIEW_USERS', 'MANAGE_USERS'] } : null,
    correlationId: `corr-${Math.floor(index / 5)}`
  };
});
