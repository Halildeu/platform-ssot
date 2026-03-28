import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import type { AccessFilters } from '../../../features/access-management/model/access.types';

test('AccessFilterBar level filtresini Segmented uzerinden surdurur', async () => {
  const require = createRequire(import.meta.url);
  (require.extensions as Record<string, () => void>)['.css'] = () => {};
  const { default: AccessFilterBar } = await import('./AccessFilterBar.ui');
  const changes: AccessFilters[] = [];

  const renderer = TestRenderer.create(
    <AccessFilterBar
      filters={{
        search: '',
        moduleKey: 'ALL',
        level: 'ALL',
      }}
      modules={new Map([
        ['erp.users', 'Users'],
        ['erp.audit', 'Audit'],
      ])}
      onChange={(next) => changes.push(next)}
      t={(key) => key}
    />,
  );

  const root = renderer.root;
  const viewButton = root.findByProps({ 'data-testid': 'access-filter-level-view' });

  act(() => {
    viewButton.props.onClick();
  });

  assert.equal(changes.length, 1);
  assert.deepEqual(changes[0], {
    search: '',
    moduleKey: 'ALL',
    level: 'VIEW',
  });

  const resetButton = root.findByProps({ children: 'access.filter.reset' });

  act(() => {
    resetButton.props.onClick();
  });

  assert.equal(changes.length, 2);
  assert.deepEqual(changes[1], {
    search: '',
    moduleKey: 'ALL',
    level: 'ALL',
  });
});
