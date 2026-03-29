import { describe, expect, it } from 'vitest';
import { normaliseAuditEvent, ApiAuditEvent } from './normalise-audit-event';

describe('normaliseAuditEvent', () => {
  const fullEvent: ApiAuditEvent = {
    id: 101,
    timestamp: '2024-06-15T10:30:00Z',
    userEmail: 'admin@example.com',
    service: 'auth-service',
    level: 'WARN',
    action: 'SESSION_EXPIRED',
    details: 'Session timed out after 30m',
    correlationId: 'corr-abc-123',
    metadata: { browser: 'Chrome', os: 'macOS' },
    before: { active: true },
    after: { active: false },
  };

  it('converts numeric id to string', () => {
    const result = normaliseAuditEvent(fullEvent);
    expect(result.id).toBe('101');
  });

  it('passes through string id unchanged', () => {
    const result = normaliseAuditEvent({ ...fullEvent, id: 'abc-42' });
    expect(result.id).toBe('abc-42');
  });

  it('preserves all fields from a complete event', () => {
    const result = normaliseAuditEvent(fullEvent);
    expect(result).toEqual({
      id: '101',
      timestamp: '2024-06-15T10:30:00Z',
      userEmail: 'admin@example.com',
      service: 'auth-service',
      level: 'WARN',
      action: 'SESSION_EXPIRED',
      details: 'Session timed out after 30m',
      correlationId: 'corr-abc-123',
      metadata: { browser: 'Chrome', os: 'macOS' },
      before: { active: true },
      after: { active: false },
    });
  });

  it('uses default dash for missing userEmail', () => {
    const result = normaliseAuditEvent({ ...fullEvent, userEmail: null });
    expect(result.userEmail).toBe('—');
  });

  it('uses default dash for missing service', () => {
    const result = normaliseAuditEvent({ ...fullEvent, service: undefined });
    expect(result.service).toBe('—');
  });

  it('uses default dash for missing action', () => {
    const result = normaliseAuditEvent({ ...fullEvent, action: null });
    expect(result.action).toBe('—');
  });

  it('defaults level to INFO when level is null', () => {
    const result = normaliseAuditEvent({ ...fullEvent, level: null });
    expect(result.level).toBe('INFO');
  });

  it('defaults level to INFO when level is undefined', () => {
    const result = normaliseAuditEvent({ ...fullEvent, level: undefined });
    expect(result.level).toBe('INFO');
  });

  it('normalises lowercase warn to WARN', () => {
    const result = normaliseAuditEvent({ ...fullEvent, level: 'warn' });
    expect(result.level).toBe('WARN');
  });

  it('normalises lowercase error to ERROR', () => {
    const result = normaliseAuditEvent({ ...fullEvent, level: 'error' });
    expect(result.level).toBe('ERROR');
  });

  it('maps unknown level to INFO', () => {
    const result = normaliseAuditEvent({ ...fullEvent, level: 'DEBUG' });
    expect(result.level).toBe('INFO');
  });

  it('generates a timestamp when timestamp is null', () => {
    const result = normaliseAuditEvent({ ...fullEvent, timestamp: null });
    expect(typeof result.timestamp).toBe('string');
    // Should be a valid ISO date
    expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
  });

  it('sets details to null when missing', () => {
    const result = normaliseAuditEvent({ ...fullEvent, details: null });
    expect(result.details).toBeNull();
  });

  it('sets metadata to undefined when missing', () => {
    const result = normaliseAuditEvent({ ...fullEvent, metadata: null });
    expect(result.metadata).toBeUndefined();
  });

  it('sets before/after to null when missing', () => {
    const result = normaliseAuditEvent({ ...fullEvent, before: null, after: null });
    expect(result.before).toBeNull();
    expect(result.after).toBeNull();
  });

  it('sets correlationId to undefined when missing', () => {
    const result = normaliseAuditEvent({ ...fullEvent, correlationId: null });
    expect(result.correlationId).toBeUndefined();
  });
});
