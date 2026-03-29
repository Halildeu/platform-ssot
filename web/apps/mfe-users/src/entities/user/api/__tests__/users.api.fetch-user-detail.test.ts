// @vitest-environment node
import { afterAll, beforeEach, expect, test } from 'vitest';
import { fetchUserDetail } from '../users.api';
import { registerTokenResolver } from '../../lib/token-resolver.lib';

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

beforeEach(() => {
  const localStorage = new LocalStorageMock();
  (globalThis as any).window = { localStorage };
  (globalThis as any).localStorage = localStorage;
  registerTokenResolver();
});

afterAll(() => {
  (globalThis as any).fetch = originalFetch;
  (globalThis as any).window = originalWindow;
  if (originalLocalStorage !== undefined) {
    (globalThis as any).localStorage = originalLocalStorage;
  }
  registerTokenResolver();
});

test('fetchUserDetail tüm modülleri normalize eder', async () => {
  const userResponse = {
    ok: true,
    json: async () => ({
      id: '10',
      email: 'multi@example.com',
      name: 'Multi User',
      status: 'ACTIVE',
    }),
  } as Response;

  const permissionResponse = {
    ok: true,
    json: async () => ([
      {
        assignmentId: 1,
        moduleKey: 'USER_MANAGEMENT',
        moduleLabel: 'Kullanıcı Modülü',
        permissions: ['VIEW_USERS'],
        roleName: 'USER_VIEWER',
        companyId: 123,
      },
      {
        assignmentId: 2,
        moduleKey: 'WAREHOUSE',
        moduleLabel: 'Depo Modülü',
        permissions: ['MANAGE_WAREHOUSE'],
        roleName: 'WAREHOUSE_OPERATOR',
        companyId: 123,
      },
    ]),
  } as Response;

  (globalThis as any).fetch = async (url: string) => {
    if (url.includes('/api/v1/users')) {
      return userResponse;
    }
    if (url.includes('/api/v1/permissions/assignments')) {
      return permissionResponse;
    }
    return {
      ok: false,
      status: 404,
    } as Response;
  };

  const result = await fetchUserDetail({ id: '10', email: 'multi@example.com' });

  expect(result.modulePermissions.length >= 2).toBe(true);
  const userModule = result.modulePermissions.find((item) => item.moduleKey === 'USER_MANAGEMENT');
  const warehouseModule = result.modulePermissions.find((item) => item.moduleKey === 'WAREHOUSE');
  const purchaseModule = result.modulePermissions.find((item) => item.moduleKey === 'PURCHASE');
  expect(userModule).toBeTruthy();
  expect(warehouseModule).toBeTruthy();
  expect(purchaseModule).toBeTruthy();
  expect(userModule?.level).toBe('VIEW');
  expect(warehouseModule?.level).toBe('MANAGE');
  expect(purchaseModule?.level).toBe('NONE');
});
