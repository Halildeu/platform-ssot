import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { GridVariant } from '@mfe/shared-types';
import { toggleVariantDefault } from '../toggle-variant-default';

const buildVariant = (overrides: Partial<GridVariant>): GridVariant => ({
  id: 'variant-1',
  gridId: 'grid',
  name: 'Test',
  isDefault: false,
  isGlobal: false,
  isGlobalDefault: false,
  isUserDefault: false,
  isUserSelected: false,
  state: { columnState: [] },
  schemaVersion: 1,
  isCompatible: true,
  sortOrder: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

test('toggleVariantDefault kişisel varyant için updateVariant çağırır', async () => {
  const variant = buildVariant({ isGlobal: false });
  const calls: string[] = [];

  const updated = await toggleVariantDefault(variant, true, {
    updateVariant: async (payload) => {
      calls.push(`updateVariant:${JSON.stringify(payload)}`);
      return buildVariant({ ...variant, ...payload, isDefault: payload.isDefault ?? false });
    },
    updatePreference: async (payload) => {
      calls.push(`updatePreference:${JSON.stringify(payload)}`);
      return buildVariant({ ...variant, isUserDefault: Boolean(payload.isDefault) });
    },
  });

  assert.equal(calls.length, 1, 'Sadece updateVariant çağrılmalı');
  assert.ok(calls[0].startsWith('updateVariant:'), 'İlk çağrı updateVariant olmalı');
  assert.equal(updated.isDefault, true);
});

test('toggleVariantDefault global varyant için preference servisini çağırır', async () => {
  const variant = buildVariant({ isGlobal: true });
  const calls: string[] = [];

  const updated = await toggleVariantDefault(variant, true, {
    updateVariant: async (payload) => {
      calls.push(`updateVariant:${JSON.stringify(payload)}`);
      return buildVariant({ ...variant, ...payload, isDefault: payload.isDefault ?? false });
    },
    updatePreference: async (payload) => {
      calls.push(`updatePreference:${JSON.stringify(payload)}`);
      return buildVariant({ ...variant, isUserDefault: Boolean(payload.isDefault) });
    },
  });

  assert.equal(calls.length, 1, 'Sadece updatePreference çağrılmalı');
  assert.ok(calls[0].startsWith('updatePreference:'), 'Çağrı preference servisine gitmeli');
  assert.equal(updated.isUserDefault, true);
});

test('toggleVariantDefault kişisel varyantta updateVariant hatasını yukarı fırlatır', async () => {
  const variant = buildVariant({ isGlobal: false });
  const error = new Error('update failed');

  await assert.rejects(
    () =>
      toggleVariantDefault(variant, true, {
        updateVariant: async () => {
          throw error;
        },
        updatePreference: async () => buildVariant(variant),
      }),
    error,
  );
});
