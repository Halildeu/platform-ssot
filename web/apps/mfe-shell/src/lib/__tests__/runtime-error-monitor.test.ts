// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

const telemetryEmit = vi.fn();

vi.mock('../../app/telemetry/telemetry-client', () => ({
  default: {
    emit: telemetryEmit,
    trackPageView: vi.fn(),
  },
}));

describe('runtime-error-monitor', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    window.__earlyErrors = [];
    window.__shellRuntimeErrors = [];
    window.__shellRuntimeMonitorInstalled = false;
    window.history.replaceState({}, '', '/home');
  });

  it('flushes early bootstrap errors into the runtime buffer', async () => {
    window.__earlyErrors = [
      {
        msg: 'early boom',
        file: 'https://testai.acik.com/assets/index.js',
        line: 12,
        col: 5,
      },
    ];

    const { initRuntimeErrorMonitor } = await import('../../app/telemetry/runtime-error-monitor');
    initRuntimeErrorMonitor();

    expect(window.__shellRuntimeErrors).toHaveLength(1);
    expect(window.__shellRuntimeErrors?.[0]).toEqual(
      expect.objectContaining({
        source: 'early-window-error',
        message: 'early boom',
        filename: 'https://testai.acik.com/assets/index.js',
        lineno: 12,
        colno: 5,
      }),
    );
    expect(telemetryEmit).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'browser_early-window-error',
      }),
    );
  });

  it('captures deduplicated console.error records', async () => {
    const originalConsoleError = console.error;
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { initRuntimeErrorMonitor } = await import('../../app/telemetry/runtime-error-monitor');
    initRuntimeErrorMonitor();

    console.error('same boom');
    console.error('same boom');

    expect(window.__shellRuntimeErrors).toHaveLength(1);
    expect(window.__shellRuntimeErrors?.[0]).toEqual(
      expect.objectContaining({
        source: 'console-error',
        message: 'same boom',
        occurrences: 2,
      }),
    );

    spy.mockRestore();
    console.error = originalConsoleError;
  });

  it('captures unhandled promise rejections', async () => {
    const { initRuntimeErrorMonitor } = await import('../../app/telemetry/runtime-error-monitor');
    initRuntimeErrorMonitor();

    const rejectionEvent = new Event('unhandledrejection') as PromiseRejectionEvent;
    Object.defineProperty(rejectionEvent, 'reason', {
      configurable: true,
      value: new Error('rejected promise'),
    });
    window.dispatchEvent(rejectionEvent);

    expect(window.__shellRuntimeErrors).toHaveLength(1);
    expect(window.__shellRuntimeErrors?.[0]).toEqual(
      expect.objectContaining({
        source: 'unhandledrejection',
        message: 'rejected promise',
      }),
    );
  });
});
