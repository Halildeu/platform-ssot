import { FetchAuditEventsParams } from './audit-api';

// Mock external modules before imports
jest.mock('@mfe/shared-http', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

jest.mock('./shell-services', () => ({
  getShellServices: jest.fn(() => {
    throw new Error('not configured');
  }),
}));

jest.mock('../../mocks/fallback-events', () => ({
  fallbackAuditEvents: [
    {
      id: 'fb-1',
      timestamp: '2024-01-01T00:00:00Z',
      userEmail: 'user@example.com',
      service: 'auth-service',
      level: 'INFO',
      action: 'LOGIN',
      details: null,
      metadata: undefined,
      before: null,
      after: null,
    },
    {
      id: 'fb-2',
      timestamp: '2024-01-01T00:01:00Z',
      userEmail: 'admin@example.com',
      service: 'permission-service',
      level: 'WARN',
      action: 'ROLE_ASSIGNED',
      details: null,
      metadata: undefined,
      before: null,
      after: null,
    },
  ],
}));

import { api } from '@mfe/shared-http';
import { fetchAuditEvents, resolveHttpClient } from './audit-api';

const mockApi = api as jest.Mocked<typeof api>;

describe('resolveHttpClient', () => {
  it('falls back to api when shell services are not configured', () => {
    const client = resolveHttpClient();
    expect(client).toBe(api);
  });
});

describe('fetchAuditEvents', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Ensure mock mode is off
    (window as any).__AUDIT_USE_MOCK__ = undefined;
  });

  const defaultParams: FetchAuditEventsParams = {
    page: 0,
    pageSize: 10,
  };

  it('returns normalised events on successful API response', async () => {
    mockApi.get.mockResolvedValueOnce({
      data: {
        events: [
          {
            id: 1,
            timestamp: '2024-06-15T10:00:00Z',
            userEmail: 'admin@example.com',
            service: 'auth-service',
            level: 'INFO',
            action: 'LOGIN',
          },
        ],
        total: 1,
        page: 0,
      },
    });

    const result = await fetchAuditEvents(defaultParams);

    expect(result.fallback).toBe(false);
    expect(result.events).toHaveLength(1);
    expect(result.events[0].id).toBe('1');
    expect(result.total).toBe(1);
    expect(result.page).toBe(0);
  });

  it('builds query string with filters', async () => {
    mockApi.get.mockResolvedValueOnce({
      data: { events: [], total: 0, page: 0 },
    });

    await fetchAuditEvents({
      ...defaultParams,
      filters: { service: 'auth-service', level: 'ERROR' },
      sort: 'timestamp,desc',
      auditId: '42',
    });

    const calledUrl = mockApi.get.mock.calls[0][0];
    expect(calledUrl).toContain('page=0');
    expect(calledUrl).toContain('size=10');
    expect(calledUrl).toContain('id=42');
    expect(calledUrl).toContain('sort=timestamp%2Cdesc');
    expect(calledUrl).toContain('filter%5Bservice%5D=auth-service');
    expect(calledUrl).toContain('filter%5Blevel%5D=ERROR');
  });

  it('skips empty filter values in query string', async () => {
    mockApi.get.mockResolvedValueOnce({
      data: { events: [], total: 0, page: 0 },
    });

    await fetchAuditEvents({
      ...defaultParams,
      filters: { service: 'auth-service', level: '' },
    });

    const calledUrl = mockApi.get.mock.calls[0][0];
    expect(calledUrl).toContain('filter%5Bservice%5D=auth-service');
    expect(calledUrl).not.toContain('filter%5Blevel%5D');
  });

  it('falls back to mock events on API error', async () => {
    mockApi.get.mockRejectedValueOnce(new Error('Network Error'));

    const result = await fetchAuditEvents(defaultParams);

    expect(result.fallback).toBe(true);
    expect(result.events.length).toBeGreaterThan(0);
    expect(result.events[0].id).toBe('fb-1');
  });

  it('returns fallback events when __AUDIT_USE_MOCK__ is true', async () => {
    (window as any).__AUDIT_USE_MOCK__ = true;

    const result = await fetchAuditEvents(defaultParams);

    expect(result.fallback).toBe(true);
    expect(result.events.length).toBeGreaterThan(0);
    expect(mockApi.get).not.toHaveBeenCalled();
  });

  it('filters fallback events by auditId in mock mode', async () => {
    (window as any).__AUDIT_USE_MOCK__ = true;

    const result = await fetchAuditEvents({
      ...defaultParams,
      auditId: 'fb-2',
    });

    expect(result.fallback).toBe(true);
    expect(result.events).toHaveLength(1);
    expect(result.events[0].id).toBe('fb-2');
  });

  it('handles missing events array in API response', async () => {
    mockApi.get.mockResolvedValueOnce({
      data: { total: 0, page: 0 },
    });

    const result = await fetchAuditEvents(defaultParams);

    expect(result.events).toEqual([]);
    expect(result.fallback).toBe(false);
  });

  it('paginates fallback events correctly', async () => {
    (window as any).__AUDIT_USE_MOCK__ = true;

    const result = await fetchAuditEvents({
      page: 0,
      pageSize: 1,
    });

    expect(result.events).toHaveLength(1);
    expect(result.total).toBe(2);
  });
});
