// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Sentry integration', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('exports initSentry function', async () => {
    const { initSentry } = await import('../sentry');
    expect(typeof initSentry).toBe('function');
  });

  it('exports captureError function', async () => {
    const { captureError } = await import('../sentry');
    expect(typeof captureError).toBe('function');
  });

  it('exports captureMessage function', async () => {
    const { captureMessage } = await import('../sentry');
    expect(typeof captureMessage).toBe('function');
  });

  it('exports setUser function', async () => {
    const { setUser } = await import('../sentry');
    expect(typeof setUser).toBe('function');
  });

  it('captureError logs to console when not initialized', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { captureError } = await import('../sentry');
    captureError(new Error('test error'), { key: 'value' });
    expect(spy).toHaveBeenCalledWith('[Error]', 'test error', { key: 'value' });
    spy.mockRestore();
  });

  it('captureMessage logs to console when not initialized', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { captureMessage } = await import('../sentry');
    captureMessage('test message', 'warning');
    expect(spy).toHaveBeenCalledWith('[warning]', 'test message');
    spy.mockRestore();
  });

  it('initSentry is no-op without DSN', async () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
    const { initSentry } = await import('../sentry');
    initSentry(); // no DSN, should do nothing
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
