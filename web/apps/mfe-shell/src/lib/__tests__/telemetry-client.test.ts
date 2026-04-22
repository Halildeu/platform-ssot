// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

const sendTelemetry = vi.fn();
const resolveTraceId = vi.fn(() => 'trace-test-1');

vi.mock('@mfe/shared-http', () => ({
  sendTelemetry,
  resolveTraceId,
}));

describe('telemetry-client', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    window.__env__ = {
      APP_ENVIRONMENT: 'test',
      APP_RELEASE: 'sha-123',
    };
  });

  it('maps shell telemetry events to shared telemetry payloads', async () => {
    const telemetryClient = (await import('../../app/telemetry/telemetry-client')).default;

    telemetryClient.emit({
      type: 'browser_window-error',
      payload: {
        message: 'boom',
        stack: 'stacktrace',
      },
      meta: {
        route: '/access/roles',
        source: 'window-error',
      },
      timestamp: 1_716_000_000_000,
    });

    expect(sendTelemetry).toHaveBeenCalledTimes(1);
    expect(sendTelemetry).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: 'error',
        eventName: 'browser_window-error',
        traceId: 'trace-test-1',
        context: expect.objectContaining({
          app: 'mfe-shell',
          env: 'test',
          version: 'sha-123',
          tags: expect.objectContaining({
            route: '/access/roles',
            source: 'window-error',
          }),
        }),
        payload: expect.objectContaining({
          message: 'boom',
        }),
        error: expect.objectContaining({
          message: 'boom',
          stack: 'stacktrace',
        }),
      }),
    );
  });

  it('emits page_view telemetry from route path', async () => {
    const telemetryClient = (await import('../../app/telemetry/telemetry-client')).default;

    telemetryClient.trackPageView('/reports');

    expect(sendTelemetry).toHaveBeenCalledTimes(1);
    expect(sendTelemetry).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: 'telemetry',
        eventName: 'page_view',
        traceId: 'trace-test-1',
        context: expect.objectContaining({
          tags: expect.objectContaining({
            route: '/reports',
          }),
        }),
        payload: expect.objectContaining({
          route: '/reports',
        }),
      }),
    );
  });
});
