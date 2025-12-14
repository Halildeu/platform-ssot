import { test, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import {
  createGridVariant,
  fetchGridVariants,
  updateVariantPreference,
} from '../variants.api';
import { registerTokenResolver } from '../../auth/token-resolver';

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

const failingFetch = async () =>
  ({
    ok: false,
    status: 503,
    text: async () => 'Service unavailable',
  }) as any;

beforeEach(() => {
  const localStorage = new LocalStorageMock();
  (globalThis as any).window = {
    localStorage,
    crypto: webcrypto,
  };
  (globalThis as any).localStorage = localStorage;
  (globalThis as any).fetch = failingFetch;
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

test('sunucu erişilemediğinde varyantlar yerelde saklanır ve okunur', async () => {
  const gridId = 'test-grid';
  const payload = {
    gridId,
    name: 'Test Varyantı',
    isDefault: false,
    isGlobal: false,
    isGlobalDefault: false,
    schemaVersion: 1,
    state: {
      columnState: [{ colId: 'fullName', width: 200 }],
      filterModel: null,
    },
  };

  const created = await createGridVariant(payload);

  assert.equal(created.name, payload.name);
  assert.equal(created.gridId, gridId);
  assert.equal(created.schemaVersion, payload.schemaVersion);
  assert.equal(created.isGlobal, payload.isGlobal);
  assert.equal(created.isGlobalDefault, payload.isGlobalDefault);

  const storedRaw = (globalThis as any).window.localStorage.getItem('grid-variants');
  assert.ok(storedRaw, 'localStorage boş olmamalı');

  const parsed = JSON.parse(storedRaw!) as Record<string, any[]>;
  assert.ok(Array.isArray(parsed[gridId]), 'Yerel varyant dizisi bulunamadı');
  assert.equal(parsed[gridId][0].id, created.id);

  const variants = await fetchGridVariants(gridId);
  assert.equal(variants.length, 1);
  assert.equal(variants[0].id, created.id);
  assert.equal(variants[0].name, payload.name);
  assert.equal(variants[0].isGlobal, payload.isGlobal);
  assert.equal(variants[0].isGlobalDefault, payload.isGlobalDefault);
  assert.deepEqual(variants[0].state.columnState, payload.state.columnState);
});

test('yerel kayıt isCompatible alanı yoksa uyumlu kabul edilir', async () => {
  const gridId = 'legacy-grid';
  const legacyVariant = {
    id: 'legacy-1',
    gridId,
    name: 'Legacy',
    isDefault: false,
    isGlobal: false,
    isGlobalDefault: false,
    state: { columnState: [] },
    schemaVersion: 1,
    sortOrder: 0,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  const store = {
    [gridId]: [legacyVariant],
  };

  (globalThis as any).window.localStorage.setItem('grid-variants', JSON.stringify(store));

  const variants = await fetchGridVariants(gridId);
  assert.equal(variants.length, 1);
  assert.equal(variants[0].id, legacyVariant.id);
  assert.equal(variants[0].isCompatible, true);
});

test('sunucudan gelen geçersiz state güvenli şekilde normalize edilir', async () => {
  const gridId = 'bad-state-grid';
  (globalThis as any).fetch = async () => ({
    ok: true,
    json: async () => [
      {
        id: 'remote-1',
        gridId,
        name: null,
        isDefault: false,
        isGlobal: false,
        isGlobalDefault: false,
        state: 'not-an-object',
        schemaVersion: 1,
        sortOrder: 0,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ],
  }) as any;

  const variants = await fetchGridVariants(gridId);
  assert.equal(variants.length, 1);
  assert.equal(variants[0].id, 'remote-1');
  assert.equal(variants[0].name, 'Adsız Varyant');
  assert.deepEqual(variants[0].state, {});

  (globalThis as any).fetch = failingFetch;
});

test('JSON string olarak gelen state çözümlenir', async () => {
  const gridId = 'string-state-grid';
  (globalThis as any).fetch = async () => ({
    ok: true,
    json: async () => [
      {
        id: 'remote-2',
        gridId,
        name: 'String State',
        isDefault: false,
        isGlobal: false,
        isGlobalDefault: false,
        state: JSON.stringify({
          quickFilterText: 'abc',
          columnState: [{ colId: 'email', width: 250 }],
        }),
        schemaVersion: 1,
        sortOrder: 0,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ],
  }) as any;

  const variants = await fetchGridVariants(gridId);
  assert.equal(variants.length, 1);
  assert.equal(variants[0].state.quickFilterText, 'abc');
  assert.equal(variants[0].state.columnState?.[0]?.colId, 'email');

  (globalThis as any).fetch = failingFetch;
});

test('metin olarak gelen boolean alanları doğru normalize eder', async () => {
  const gridId = 'string-bool-grid';
  (globalThis as any).fetch = async () => ({
    ok: true,
    json: async () => [
      {
        id: 'global-1',
        gridId,
        name: 'Global',
        isDefault: '0',
        isGlobal: '1',
        isGlobalDefault: 'false',
        isUserDefault: 'false',
        isUserSelected: '0',
        isCompatible: '1',
        state: { columnState: [] },
        schemaVersion: 1,
        sortOrder: 0,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ],
  }) as any;

  const variants = await fetchGridVariants(gridId);
  assert.equal(variants.length, 1);
  assert.equal(variants[0].isGlobal, true);
  assert.equal(variants[0].isGlobalDefault, false);
  assert.equal(variants[0].isUserDefault, false);
  assert.equal(variants[0].isUserSelected, false);
  assert.equal(variants[0].isCompatible, true);

  (globalThis as any).fetch = failingFetch;
});

test('updateVariantPreference string boolean yanıtlarını normalize eder', async () => {
  const gridId = 'preference-grid';
  const variantId = 'global-2';
  (globalThis as any).fetch = async () => ({
    ok: true,
    json: async () => ({
      id: variantId,
      gridId,
      name: 'Global Pref',
      isDefault: 'false',
      isGlobal: 'true',
      isGlobalDefault: '0',
      isUserDefault: '1',
      isUserSelected: '1',
      isCompatible: '1',
      state: { columnState: [] },
      schemaVersion: 1,
      sortOrder: 0,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    }),
  }) as any;

  const updated = await updateVariantPreference({ variantId, isDefault: true });
  assert.equal(updated.isGlobal, true);
  assert.equal(updated.isUserDefault, true);
  assert.equal(updated.isUserSelected, true);
  assert.equal(updated.isGlobalDefault, false);
  assert.equal(updated.isCompatible, true);

  (globalThis as any).fetch = failingFetch;
});

test('updateVariantPreference sadece tek kişisel varsayılan bırakır', async () => {
  const gridId = 'single-default-grid';
  const personal = {
    id: 'personal-1',
    gridId,
    name: 'Kişisel',
    isDefault: true,
    isGlobal: false,
    isGlobalDefault: false,
    isUserDefault: true,
    isUserSelected: true,
    state: { columnState: [] },
    schemaVersion: 1,
    sortOrder: 0,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    isCompatible: true,
  };
  const globalVariant = {
    id: 'global-1',
    gridId,
    name: 'Global',
    isDefault: false,
    isGlobal: true,
    isGlobalDefault: false,
    isUserDefault: false,
    isUserSelected: false,
    state: { columnState: [] },
    schemaVersion: 1,
    sortOrder: 1,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    isCompatible: true,
  };

  const store = {
    [gridId]: [personal, globalVariant],
  };

  (globalThis as any).window.localStorage.setItem('grid-variants', JSON.stringify(store));

  const updatedGlobal = {
    ...globalVariant,
    isUserDefault: true,
    isUserSelected: true,
    updatedAt: '2024-01-01T00:01:00.000Z',
  };
  const updatedPersonal = {
    ...personal,
    isDefault: false,
    isUserDefault: false,
    isUserSelected: false,
    updatedAt: '2024-01-01T00:01:00.000Z',
  };

  const previousFetch = (globalThis as any).fetch;
  (globalThis as any).fetch = async (url: string, options?: RequestInit) => {
    if (url.includes('/preference') && options?.method === 'PATCH') {
      return {
        ok: true,
        json: async () => updatedGlobal,
      } as any;
    }
    if (url.includes('/api/v1/variants') && url.includes('gridId=')) {
      return {
        ok: true,
        json: async () => [updatedPersonal, updatedGlobal],
      } as any;
    }
    return failingFetch();
  };

  try {
    await updateVariantPreference({
      variantId: globalVariant.id,
      isDefault: true,
      isSelected: true,
    });

    const storedRaw = (globalThis as any).window.localStorage.getItem('grid-variants');
    assert.ok(storedRaw, 'localStorage boş olmamalı');
    const parsed = JSON.parse(storedRaw!) as Record<string, any[]>;
    const storedPersonal = parsed[gridId].find((item) => item.id === personal.id);
    const storedGlobal = parsed[gridId].find((item) => item.id === globalVariant.id);

    assert.equal(storedPersonal?.isUserDefault, false);
    assert.equal(storedGlobal?.isUserDefault, true);

    const variants = await fetchGridVariants(gridId);
    const userDefaults = variants.filter((variant) => variant.isUserDefault);
    assert.equal(userDefaults.length, 1);
    assert.equal(userDefaults[0].id, globalVariant.id);
    const personalVariant = variants.find((variant) => variant.id === personal.id);
    assert.equal(personalVariant?.isUserDefault, false);
    assert.equal(personalVariant?.isDefault, false);
  } finally {
    (globalThis as any).fetch = previousFetch;
  }
});

test('updateVariantPreference istek gövdesi sadece varyant kimliğine göre değişir', async () => {
  const capturedBodies: any[] = [];
  (globalThis as any).fetch = async (_url: string, init?: RequestInit) => {
    capturedBodies.push(init?.body ? JSON.parse(init.body as string) : null);
    return {
      ok: true,
      json: async () => ({
        id: init?.body ? JSON.parse(init.body as string).variantId : 'unknown',
        gridId: 'grid',
        name: 'Any',
        isDefault: false,
        isGlobal: true,
        isGlobalDefault: false,
        isUserDefault: false,
        isUserSelected: false,
        isCompatible: true,
        state: { columnState: [] },
        schemaVersion: 1,
        sortOrder: 0,
      }),
    } as any;
  };

  await updateVariantPreference({ variantId: 'first', isDefault: true });
  await updateVariantPreference({ variantId: 'second', isDefault: true });

  assert.equal(capturedBodies.length, 2);
  assert.deepEqual(
    { ...capturedBodies[0], variantId: 'normalized' },
    { ...capturedBodies[1], variantId: 'normalized' },
  );
  (globalThis as any).fetch = failingFetch;
});

test('updateVariantPreference token resolver ile Authorization başlığını gönderir', async () => {
  const capturedHeaders: Record<string, string>[] = [];
  registerTokenResolver(() => 'resolver-token');
  (globalThis as any).fetch = async (_url: string, init?: RequestInit) => {
    capturedHeaders.push((init?.headers as Record<string, string>) ?? {});
    return {
      ok: true,
      json: async () => ({
        id: 'auth-test',
        gridId: 'grid',
        name: 'Auth Test',
        isDefault: false,
        isGlobal: true,
        isGlobalDefault: false,
        isUserDefault: true,
        isUserSelected: true,
        isCompatible: true,
        state: { columnState: [] },
        schemaVersion: 1,
        sortOrder: 0,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      }),
    } as any;
  };

  await updateVariantPreference({ variantId: 'auth-test', isDefault: true });

  assert.equal(capturedHeaders.length, 1);
  assert.equal(capturedHeaders[0]?.Authorization, 'Bearer resolver-token');

  (globalThis as any).fetch = failingFetch;
  registerTokenResolver();
});
