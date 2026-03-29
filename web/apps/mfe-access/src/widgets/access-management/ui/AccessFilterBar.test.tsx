import { test, expect } from 'vitest';
import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import type { AccessFilters } from '../../../features/access-management/model/access.types';
import AccessFilterBar from './AccessFilterBar.ui';

test('AccessFilterBar level filtresini Segmented uzerinden surdurur', async () => {
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

  expect(changes.length).toBe(1);
  expect(changes[0]).toEqual({
    search: '',
    moduleKey: 'ALL',
    level: 'VIEW',
  });

  const resetButton = root.findByProps({ children: 'access.filter.reset' });

  act(() => {
    resetButton.props.onClick();
  });

  expect(changes.length).toBe(2);
  expect(changes[1]).toEqual({
    search: '',
    moduleKey: 'ALL',
    level: 'ALL',
  });
});
