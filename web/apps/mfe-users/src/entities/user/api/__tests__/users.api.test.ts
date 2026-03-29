// @vitest-environment node
import { afterAll, beforeEach, expect, test } from 'vitest';
import { fetchUsers, fetchUserDetail } from '../users.api';
import { registerTokenResolver } from '../../lib/token-resolver.lib';
import { configureShellServices } from '../../../../app/services/shell-services';
import type { UsersQueryParams } from '../../../../features/user-management/model/user-management.types';

class LocalStorageMock {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return key in this.store ? this.store[key] : null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

const originalFetch = globalThis.fetch;
const originalWindow = (globalThis as any).window;
const originalLocalStorage = (globalThis as any).localStorage;

const params: UsersQueryParams = {
  page: 1,
  pageSize: 25,
};

beforeEach(() => {
  const localStorage = new LocalStorageMock();
  (globalThis as any).window = { localStorage, __env__: {}, __ENV__: {} };
  (globalThis as any).localStorage = localStorage;
  configureShellServices({
    auth: {
      getToken: () => null,
      getUser: () => null,
    },
  });
  registerTokenResolver();
});

afterAll(() => {
  (globalThis as any).fetch = originalFetch;
  (globalThis as any).window = originalWindow;
  if (originalLocalStorage !== undefined) {
    (globalThis as any).localStorage = originalLocalStorage;
  }
  configureShellServices({
    auth: {
      getToken: () => null,
      getUser: () => null,
    },
  });
  registerTokenResolver();
});

test('fetchUsers 403 dönerse boş liste ve varsayılan sayfalama ile döner', async () => {
  (globalThis as any).fetch = async () =>
    ({
      ok: false,
      status: 403,
    }) as Response;

  const result = await fetchUsers(params);
  expect(result.items.length).toBe(0);
  expect(result.total).toBe(0);
  expect(result.page).toBe(1);
  expect(result.pageSize).toBe(25);
  expect(result.meta?.reason).toBe('unauthorized');
});

test('fetchUsers ağ hatasında boş liste döndürür', async () => {
  (globalThis as any).fetch = async () => {
    throw new Error('Network down');
  };

  const result = await fetchUsers({ page: 3, pageSize: 50 });
  expect(result.items.length).toBe(0);
  expect(result.page).toBe(3);
  expect(result.pageSize).toBe(50);
  expect(result.meta?.reason).toBe('network-error');
});

test('fetchUserDetail 403 dönerse fallback kullanıcı bilgisi sağlar', async () => {
  (globalThis as any).fetch = async () =>
    ({
      ok: false,
      status: 403,
    }) as Response;

  const result = await fetchUserDetail({ id: '1', email: 'demo@example.com' });
  expect(result.id).toBe('1');
  expect(result.email).toBe('demo@example.com');
  expect(result.fullName).toBe('demo@example.com');
  expect(result.modulePermissions.length).toBe(0);
});

test('fetchUserDetail ağ hatasında fallback kullanıcı bilgisi sağlar', async () => {
  (globalThis as any).fetch = async () => {
    throw new Error('Network down');
  };

  const result = await fetchUserDetail({ id: '2', email: 'offline@example.com' });
  expect(result.id).toBe('2');
  expect(result.email).toBe('offline@example.com');
  expect(result.status).toBe('ACTIVE');
});

test('fetchUsers sorgu parametrelerini ve başlıklarını doğru gönderir', async () => {
  const requestLog: Array<{ input: RequestInfo | URL; init?: RequestInit }> = [];
  (globalThis as any).fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    requestLog.push({ input, init });
    return {
      ok: true,
      json: async () => ({
        items: [],
        total: 0,
        page: 2,
        pageSize: 50,
      }),
    } as Response;
  };

  const localStorage = (globalThis as any).window.localStorage as LocalStorageMock;
  localStorage.setItem('token', 'dummy-token');
  localStorage.setItem('internalApiKey', 'internal-key');

  await fetchUsers({
    page: 2,
    pageSize: 50,
    role: 'ADMIN',
    status: 'ACTIVE',
    search: 'demo',
  });

  expect(requestLog.length).toBe(1);
  const [{ input, init }] = requestLog;
  const url = new URL(input.toString());
  expect(url.pathname).toBe('/api/v1/users');
  expect(url.searchParams.toString()).toBe('search=demo&status=ACTIVE&role=ADMIN&page=2&pageSize=50');
  const headers = (init?.headers ?? {}) as Record<string, string>;
  expect(headers.Authorization).toBe('Bearer dummy-token');
  expect(headers['Content-Type']).toBe('application/json');
  expect(headers['X-Internal-Api-Key']).toBe('internal-key');
});

test('fetchUsers auth header kurarken shell tokenini localStorage tokenine tercih eder', async () => {
  const requestLog: Array<{ input: RequestInfo | URL; init?: RequestInit }> = [];
  (globalThis as any).fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    requestLog.push({ input, init });
    return {
      ok: true,
      json: async () => ({
        items: [],
        total: 0,
        page: 1,
        pageSize: 25,
      }),
    } as Response;
  };

  const localStorage = (globalThis as any).window.localStorage as LocalStorageMock;
  localStorage.setItem('token', 'stale-localstorage-token');

  configureShellServices({
    auth: {
      getToken: () => 'fresh-shell-token',
      getUser: () => null,
    },
  });

  await fetchUsers({ page: 1, pageSize: 25 });

  expect(requestLog.length).toBe(1);
  const headers = (requestLog[0]?.init?.headers ?? {}) as Record<string, string>;
  expect(headers.Authorization).toBe('Bearer fresh-shell-token');
});

test("fetchUsers shell token literal 'undefined' ise localStorage tokenine geri düşer", async () => {
  const requestLog: Array<{ input: RequestInfo | URL; init?: RequestInit }> = [];
  (globalThis as any).fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    requestLog.push({ input, init });
    return {
      ok: true,
      json: async () => ({
        items: [],
        total: 0,
        page: 1,
        pageSize: 25,
      }),
    } as Response;
  };

  const localStorage = (globalThis as any).window.localStorage as LocalStorageMock;
  localStorage.setItem('token', 'persisted-real-token');

  configureShellServices({
    auth: {
      getToken: () => 'undefined',
      getUser: () => null,
    },
  });

  await fetchUsers({ page: 1, pageSize: 25 });

  expect(requestLog.length).toBe(1);
  const headers = (requestLog[0]?.init?.headers ?? {}) as Record<string, string>;
  expect(headers.Authorization).toBe('Bearer persisted-real-token');
});

test('permitAll fake auth modunda fetchUsers backend yerine mock veri döndürür', async () => {
  let fetchCallCount = 0;
  (globalThis as any).fetch = async () => {
    fetchCallCount += 1;
    throw new Error('fetch cagrilmamali');
  };

  (globalThis as any).window.__env__ = {
    VITE_AUTH_MODE: 'permitAll',
    VITE_ENABLE_FAKE_AUTH: '1',
  };

  const result = await fetchUsers({ page: 1, pageSize: 25, search: 'selin' });

  expect(fetchCallCount).toBe(0);
  expect(result.meta?.reason).toBe('success');
  expect(result.total).toBe(1);
  expect(result.items[0]?.email).toBe('selin.aydin@example.com');
});

test('permitAll fake auth modunda fetchUserDetail mock detay döndürür', async () => {
  let fetchCallCount = 0;
  (globalThis as any).fetch = async () => {
    fetchCallCount += 1;
    throw new Error('fetch cagrilmamali');
  };

  (globalThis as any).window.__env__ = {
    VITE_AUTH_MODE: 'permitAll',
    VITE_ENABLE_FAKE_AUTH: '1',
  };

  const result = await fetchUserDetail({ id: 'mock-user-002', email: 'emir.kara@example.com' });

  expect(fetchCallCount).toBe(0);
  expect(result.fullName).toBe('Emir Kara');
  expect(result.modulePermissions[0]?.level).toBe('EDIT');
});

test('shell auth token .shell ile bitiyorsa runtime env olmasa da mock veri döndürür', async () => {
  let fetchCallCount = 0;
  (globalThis as any).fetch = async () => {
    fetchCallCount += 1;
    throw new Error('fetch cagrilmamali');
  };

  configureShellServices({
    auth: {
      getToken: () => 'header.payload.shell',
      getUser: () => ({ email: 'runtime@example.com', role: 'ADMIN' }),
    },
  });

  const result = await fetchUsers({ page: 1, pageSize: 25 });

  expect(fetchCallCount).toBe(0);
  expect(result.meta?.reason).toBe('success');
  expect(result.total).toBe(3);
});

test('permitAll modunda fake flag olmasa da mock veri döndürür', async () => {
  let fetchCallCount = 0;
  (globalThis as any).fetch = async () => {
    fetchCallCount += 1;
    throw new Error('fetch cagrilmamali');
  };

  (globalThis as any).window.__env__ = {
    VITE_AUTH_MODE: 'permitAll',
  };

  const result = await fetchUsers({ page: 1, pageSize: 25 });

  expect(fetchCallCount).toBe(0);
  expect(result.meta?.reason).toBe('success');
  expect(result.total).toBe(3);
});

test('runtime test user profili varsa backend yerine mock veri döndürür', async () => {
  let fetchCallCount = 0;
  (globalThis as any).fetch = async () => {
    fetchCallCount += 1;
    throw new Error('fetch cagrilmamali');
  };

  const localStorage = (globalThis as any).window.localStorage as LocalStorageMock;
  localStorage.setItem('user', JSON.stringify({
    id: 'e03-runtime-user',
    fullName: 'Runtime Test User',
    email: 'runtime@test.local',
    permissions: ['VIEW_USERS'],
    role: 'ADMIN',
  }));
  localStorage.setItem('token', 'bad.invalid.token');

  const result = await fetchUsers({ page: 1, pageSize: 25 });

  expect(fetchCallCount).toBe(0);
  expect(result.meta?.reason).toBe('success');
  expect(result.total).toBe(3);
});

test('dev fallback explicit kapatıldıysa runtime test user olsa bile backend çağrısı yapar', async () => {
  let fetchCallCount = 0;
  (globalThis as any).fetch = async () => {
    fetchCallCount += 1;
    return {
      ok: true,
      json: async () => ({
        items: [],
        total: 0,
        page: 1,
        pageSize: 25,
      }),
    } as Response;
  };

  (globalThis as any).window.__env__ = {
    VITE_USERS_DISABLE_DEV_FALLBACK: '1',
  };

  const localStorage = (globalThis as any).window.localStorage as LocalStorageMock;
  localStorage.setItem('user', JSON.stringify({
    id: 'e03-runtime-user',
    fullName: 'Runtime Test User',
    email: 'runtime@test.local',
    permissions: ['VIEW_USERS'],
    role: 'ADMIN',
  }));
  localStorage.setItem('token', 'realish.token.value');

  const result = await fetchUsers({ page: 1, pageSize: 25 });

  expect(fetchCallCount).toBe(1);
  expect(result.meta?.reason).toBe('success');
  expect(result.total).toBe(0);
});
