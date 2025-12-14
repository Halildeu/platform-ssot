import { describe, it, expect, vi, afterEach } from 'vitest';
import type { AxiosError } from 'axios';

type ModuleExports = typeof import('./index');

const loadModule = async (): Promise<{
  mod: ModuleExports;
  locationReplace: ReturnType<typeof vi.fn>;
  dispatchEvent: ReturnType<typeof vi.fn>;
}> => {
  vi.resetModules();

  const localStorageMock = {
    getItem: vi.fn(),
    removeItem: vi.fn(),
    setItem: vi.fn(),
  };
  const locationReplace = vi.fn();
  const dispatchEvent = vi.fn();

  class FakeCustomEvent<T> extends Event {
    detail: T | undefined;
    constructor(type: string, init?: CustomEventInit<T>) {
      super(type, init);
      this.detail = init?.detail;
    }
  }

  const windowMock: any = {
    localStorage: localStorageMock,
    location: {
      pathname: '/admin/users',
      search: '',
      hash: '',
      replace: locationReplace,
    },
    dispatchEvent,
  };

  vi.stubGlobal('window', windowMock);
  vi.stubGlobal('CustomEvent', FakeCustomEvent);

  const mod = await import('./index');
  return { mod, locationReplace, dispatchEvent };
};

const getResponseInterceptor = (api: ModuleExports['api']) => {
  const handlers = (api.interceptors.response as any).handlers ?? [];
  const last = handlers[handlers.length - 1];
  return last?.rejected;
};

const getRequestInterceptor = (api: ModuleExports['api']) => {
  const handlers = (api.interceptors.request as any).handlers ?? [];
  const last = handlers[handlers.length - 1];
  return last?.fulfilled;
};

describe('shared-http interceptors', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('redirects to login and triggers unauthorized handler on 401', async () => {
    const { mod, locationReplace, dispatchEvent } = await loadModule();
    const unauthorizedHandler = vi.fn();
    mod.registerUnauthorizedHandler(unauthorizedHandler);
    const rejected = getResponseInterceptor(mod.api);
    const error = { response: { status: 401 } } as AxiosError;

    await expect(rejected?.(error)).rejects.toBe(error);

    expect(unauthorizedHandler).toHaveBeenCalledWith(error);
    expect(locationReplace).toHaveBeenCalledWith('/login?redirect=%2Fadmin%2Fusers');
    expect(dispatchEvent).not.toHaveBeenCalled();
  });

  it('shows forbidden toast without logout on 403', async () => {
    const { mod, locationReplace, dispatchEvent } = await loadModule();
    const unauthorizedHandler = vi.fn();
    mod.registerUnauthorizedHandler(unauthorizedHandler);
    const rejected = getResponseInterceptor(mod.api);
    const error = { response: { status: 403 } } as AxiosError;

    await expect(rejected?.(error)).rejects.toBe(error);

    expect(unauthorizedHandler).not.toHaveBeenCalled();
    expect(locationReplace).not.toHaveBeenCalled();
    expect(dispatchEvent).toHaveBeenCalledTimes(1);
    expect(dispatchEvent.mock.calls[0][0].detail.text).toBe('Bu işlem için yetkiniz bulunmuyor.');
  });

  it('shows profile missing toast without redirect on 403 PROFILE_MISSING', async () => {
    const { mod, locationReplace, dispatchEvent } = await loadModule();
    const unauthorizedHandler = vi.fn();
    mod.registerUnauthorizedHandler(unauthorizedHandler);
    const rejected = getResponseInterceptor(mod.api);
    const error = { response: { status: 403, data: { message: 'PROFILE_MISSING' } } } as AxiosError;

    await expect(rejected?.(error)).rejects.toBe(error);

    expect(unauthorizedHandler).not.toHaveBeenCalled();
    expect(locationReplace).not.toHaveBeenCalled();
    expect(dispatchEvent).toHaveBeenCalledTimes(1);
    expect(dispatchEvent.mock.calls[0][0].detail.text).toBe(
      'Profiliniz henüz oluşturulmamış. Lütfen sistem yöneticisiyle iletişime geçin.',
    );
  });

  it('skips auth header and redirect in permitAll mode', async () => {
    const { mod, locationReplace } = await loadModule();
    const handler = getRequestInterceptor(mod.api);
    mod.registerAuthTokenResolver(() => 'token-from-store');
    mod.configureSharedHttp({ authMode: 'permitAll' });
    const config = await handler?.({ headers: {} });
    expect(config?.headers?.Authorization).toBeUndefined();

    const unauthorizedHandler = vi.fn();
    mod.registerUnauthorizedHandler(unauthorizedHandler);
    const rejected = getResponseInterceptor(mod.api);
    const error = { response: { status: 401 } } as AxiosError;
    await expect(rejected?.(error)).rejects.toBe(error);
    expect(locationReplace).not.toHaveBeenCalled();
    expect(unauthorizedHandler).not.toHaveBeenCalled();
  });
});
