import { test, expect } from 'vitest';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import {
  permissionRegistry,
  permissionRegistryGeneratedAt,
  permissionRegistryVersion,
} from '../../data/permissionRegistry.generated';
import PermissionRegistryPanel from './PermissionRegistryPanel.ui';

test('PermissionRegistryPanel canonical badge ve ozet sayilarini surdurur', async () => {
  const activeCount = permissionRegistry.filter((entry) => entry.status === 'active').length;
  const deprecatedCount = permissionRegistry.filter((entry) => entry.status === 'deprecated').length;

  const renderer = TestRenderer.create(
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

  const root = renderer.root;
  const section = root.findByProps({ 'data-testid': 'access-permission-registry' });

  expect(section).toBeTruthy();
  expect(root.findByProps({ children: activeCount })).toBeTruthy();
  expect(root.findByProps({ children: deprecatedCount })).toBeTruthy();
  expect(root.findByProps({ children: `access.registry.subtitle:${permissionRegistryVersion}` })).toBeTruthy();
  expect(root.findByProps({
    children: `access.registry.legend:${new Date(permissionRegistryGeneratedAt).toISOString()}`,
  })).toBeTruthy();
  expect(root.findAll(
    (node) => node.type === 'span' && node.props.children === 'access.registry.status.active',
  ).length).toBe(activeCount);
  expect(root.findAll(
    (node) => node.type === 'span' && node.props.children === 'access.registry.status.deprecated',
  ).length).toBe(deprecatedCount);
  expect(root.findByProps({ children: permissionRegistry[0]?.key })).toBeTruthy();
});
