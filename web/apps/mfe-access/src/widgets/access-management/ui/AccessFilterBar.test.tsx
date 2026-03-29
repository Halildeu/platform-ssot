// @vitest-environment jsdom
import { test, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import type { AccessFilters } from '../../../features/access-management/model/access.types';
import AccessFilterBar from './AccessFilterBar.ui';

test('AccessFilterBar level filtresini Segmented uzerinden surdurur', async () => {
  const changes: AccessFilters[] = [];

  render(
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

  const viewButton = screen.getByTestId('access-filter-level-view');

  act(() => {
    fireEvent.click(viewButton);
  });

  expect(changes.length).toBe(1);
  expect(changes[0]).toEqual({
    search: '',
    moduleKey: 'ALL',
    level: 'VIEW',
  });

  const resetButton = screen.getByText('access.filter.reset');

  act(() => {
    fireEvent.click(resetButton);
  });

  expect(changes.length).toBe(2);
  expect(changes[1]).toEqual({
    search: '',
    moduleKey: 'ALL',
    level: 'ALL',
  });
});
