import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import {
  permissionRegistry,
  permissionRegistryGeneratedAt,
  permissionRegistryVersion,
} from '../../data/permissionRegistry.generated';

test('PermissionRegistryPanel canonical badge ve ozet sayilarini surdurur', async () => {
  const require = createRequire(import.meta.url);
  (require.extensions as Record<string, () => void>)['.css'] = () => {};
  const { default: PermissionRegistryPanel } = await import('./PermissionRegistryPanel.ui');

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

  assert.ok(section);
  assert.ok(root.findByProps({ children: activeCount }));
  assert.ok(root.findByProps({ children: deprecatedCount }));
  assert.ok(root.findByProps({ children: `access.registry.subtitle:${permissionRegistryVersion}` }));
  assert.ok(
    root.findByProps({
      children: `access.registry.legend:${new Date(permissionRegistryGeneratedAt).toISOString()}`,
    }),
  );
  assert.equal(
    root.findAll(
      (node) => node.type === 'span' && node.props.children === 'access.registry.status.active',
    ).length,
    activeCount,
  );
  assert.equal(
    root.findAll(
      (node) => node.type === 'span' && node.props.children === 'access.registry.status.deprecated',
    ).length,
    deprecatedCount,
  );
  assert.ok(root.findByProps({ children: permissionRegistry[0]?.key }));
});
