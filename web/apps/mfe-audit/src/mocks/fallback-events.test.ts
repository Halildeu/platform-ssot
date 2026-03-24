import { fallbackAuditEvents } from './fallback-events';

describe('fallbackAuditEvents', () => {
  it('generates exactly 25 fallback events', () => {
    expect(fallbackAuditEvents).toHaveLength(25);
  });

  it('assigns unique ids to each event', () => {
    const ids = fallbackAuditEvents.map((e) => e.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(25);
  });

  it('generates ids in fallback-N format', () => {
    expect(fallbackAuditEvents[0].id).toBe('fallback-1');
    expect(fallbackAuditEvents[24].id).toBe('fallback-25');
  });

  it('assigns valid ISO timestamps', () => {
    for (const event of fallbackAuditEvents) {
      expect(new Date(event.timestamp).toISOString()).toBe(event.timestamp);
    }
  });

  it('assigns valid level values', () => {
    const validLevels = ['INFO', 'WARN', 'ERROR'];
    for (const event of fallbackAuditEvents) {
      expect(validLevels).toContain(event.level);
    }
  });

  it('assigns valid action values', () => {
    const validActions = ['ROLE_ASSIGNED', 'ROLE_REVOKED'];
    for (const event of fallbackAuditEvents) {
      expect(validActions).toContain(event.action);
    }
  });

  it('assigns valid service values', () => {
    const validServices = ['permission-service', 'auth-service'];
    for (const event of fallbackAuditEvents) {
      expect(validServices).toContain(event.service);
    }
  });

  it('cycles user emails across 5 users', () => {
    const emails = new Set(fallbackAuditEvents.map((e) => e.userEmail));
    expect(emails.size).toBe(5);
    expect(emails).toContain('user1@example.com');
    expect(emails).toContain('user5@example.com');
  });

  it('includes metadata with scope and actorId for each event', () => {
    for (const event of fallbackAuditEvents) {
      expect(event.metadata).toBeDefined();
      expect(event.metadata).toHaveProperty('scope');
      expect(event.metadata).toHaveProperty('actorId');
    }
  });

  it('alternates before/after values based on index parity', () => {
    // Even index: before=null, after=non-null
    expect(fallbackAuditEvents[0].before).toBeNull();
    expect(fallbackAuditEvents[0].after).not.toBeNull();
    // Odd index: before=non-null, after=null
    expect(fallbackAuditEvents[1].before).not.toBeNull();
    expect(fallbackAuditEvents[1].after).toBeNull();
  });

  it('groups correlation IDs in batches of 5', () => {
    expect(fallbackAuditEvents[0].correlationId).toBe('corr-0');
    expect(fallbackAuditEvents[4].correlationId).toBe('corr-0');
    expect(fallbackAuditEvents[5].correlationId).toBe('corr-1');
  });
});
