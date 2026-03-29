// @vitest-environment jsdom
import { test, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  permissionRegistry,
  permissionRegistryGeneratedAt,
  permissionRegistryVersion,
} from '../../data/permissionRegistry.generated';
import PermissionRegistryPanel from './PermissionRegistryPanel.ui';

test('PermissionRegistryPanel canonical badge ve ozet sayilarini surdurur', async () => {
  const activeCount = permissionRegistry.filter((entry) => entry.status === 'active').length;
  const deprecatedCount = permissionRegistry.filter((entry) => entry.status === 'deprecated').length;

  const { container } = render(
    <PermissionRegistryPanel
      t={(key, values) => {
        if (key === 'access.registry.subtitle') {
          return `${key}:${String(values?.version ?? '')}`;
        }
        if (key === 'access.registry.legend') {
          return `${key}:${String(values?.generatedAt ?? '')}`;
        }
        return key;
      }}
      formatDate={(value) => new Date(value).toISOString()}
    />,
  );

  const section = screen.getByTestId('access-permission-registry');
  expect(section).toBeTruthy();

  expect(screen.getByText(activeCount)).toBeTruthy();
  expect(screen.getByText(deprecatedCount)).toBeTruthy();
  expect(screen.getByText(`access.registry.subtitle:${permissionRegistryVersion}`)).toBeTruthy();
  expect(screen.getByText(
    `access.registry.legend:${new Date(permissionRegistryGeneratedAt).toISOString()}`,
  )).toBeTruthy();

  const activeLabels = container.querySelectorAll('span');
  const activeStatusSpans = Array.from(activeLabels).filter(
    (el) => el.textContent === 'access.registry.status.active',
  );
  expect(activeStatusSpans.length).toBe(activeCount);

  const deprecatedStatusSpans = Array.from(activeLabels).filter(
    (el) => el.textContent === 'access.registry.status.deprecated',
  );
  expect(deprecatedStatusSpans.length).toBe(deprecatedCount);

  expect(screen.getByText(permissionRegistry[0]?.key)).toBeTruthy();
});
