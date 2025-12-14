import { test, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import { fetchUsers, fetchUserDetail } from '../users.api';
import { registerTokenResolver } from '../../lib/token-resolver.lib';
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
  (globalThis as any).window = { localStorage };
  (globalThis as any).localStorage = localStorage;
  registerTokenResolver();
});

after(() => {
  (globalThis as any).fetch = originalFetch;
  (globalThis as any).window = originalWindow;
  if (originalLocalStorage !== undefined) {
    (globalThis as any).localStorage = originalLocalStorage;
  }
  registerTokenResolver();
});

test('fetchUsers 403 dönerse boş liste ve varsayılan sayfalama ile döner', async () => {
  (globalThis as any).fetch = async () =>
    ({
      ok: false,
      status: 403,
    }) as Response;

  const result = await fetchUsers(params);
  assert.equal(result.items.length, 0);
  assert.equal(result.total, 0);
  assert.equal(result.page, 1);
  assert.equal(result.pageSize, 25);
  assert.equal(result.meta?.reason, 'unauthorized');
});

test('fetchUsers ağ hatasında boş liste döndürür', async () => {
  (globalThis as any).fetch = async () => {
    throw new Error('Network down');
  };

  const result = await fetchUsers({ page: 3, pageSize: 50 });
  assert.equal(result.items.length, 0);
  assert.equal(result.page, 3);
  assert.equal(result.pageSize, 50);
  assert.equal(result.meta?.reason, 'network-error');
});

test('fetchUserDetail 403 dönerse fallback kullanıcı bilgisi sağlar', async () => {
  (globalThis as any).fetch = async () =>
    ({
      ok: false,
      status: 403,
    }) as Response;

  const result = await fetchUserDetail({ id: '1', email: 'demo@example.com' });
  assert.equal(result.id, '1');
  assert.equal(result.email, 'demo@example.com');
  assert.equal(result.fullName, 'demo@example.com');
  assert.equal(result.modulePermissions.length, 0);
});

test('fetchUserDetail ağ hatasında fallback kullanıcı bilgisi sağlar', async () => {
  (globalThis as any).fetch = async () => {
    throw new Error('Network down');
  };

  const result = await fetchUserDetail({ id: '2', email: 'offline@example.com' });
  assert.equal(result.id, '2');
  assert.equal(result.email, 'offline@example.com');
  assert.equal(result.status, 'ACTIVE');
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

  assert.equal(requestLog.length, 1, 'fetch çağrısı yapılmalı');
  const [{ input, init }] = requestLog;
  const url = new URL(input.toString());
  assert.equal(url.pathname, '/api/v1/users', 'Path /api/v1/users olmalı');
  assert.equal(
    url.searchParams.toString(),
    'search=demo&status=ACTIVE&role=ADMIN&page=2&pageSize=50',
    'Sorgu parametreleri beklenen sıralama ile gönderilmeli',
  );
  const headers = (init?.headers ?? {}) as Record<string, string>;
  assert.equal(headers.Authorization, 'Bearer dummy-token');
  assert.equal(headers['Content-Type'], 'application/json');
  assert.equal(headers['X-Internal-Api-Key'], 'internal-key');
});
