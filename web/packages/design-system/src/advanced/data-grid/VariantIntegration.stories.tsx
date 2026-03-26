import type { Meta, StoryObj } from '@storybook/react';
import React, { useState, useRef } from 'react';
import { VariantIntegration } from './VariantIntegration';
import type { VariantIntegrationProps } from './VariantIntegration';

const meta: Meta<typeof VariantIntegration> = {
  component: VariantIntegration,
  title: 'Advanced/DataGrid/VariantIntegration',
  decorators: [(Story) => <div style={{ padding: '1rem', position: 'relative', minHeight: 400 }}><Story /></div>],
  argTypes: {
    gridId: { control: 'text', description: 'Unique grid identifier for variant isolation' },
    gridSchemaVersion: { control: 'number', description: 'Schema version for compatibility check' },
    canPromoteToGlobal: { control: 'boolean', description: 'Whether user can promote personal → global' },
    canDemoteToPersonal: { control: 'boolean', description: 'Whether user can demote global → personal' },
    canDeleteGlobal: { control: 'boolean', description: 'Whether user can delete global variants' },
  },
};
export default meta;
type Story = StoryObj<typeof VariantIntegration>;

// Mock GridApi for stories
const createMockGridApi = () => ({
  getColumnState: () => [
    { colId: 'name', width: 200, hide: false, pinned: null, sort: 'asc', sortIndex: 0 },
    { colId: 'email', width: 250, hide: false, pinned: null, sort: null, sortIndex: null },
    { colId: 'role', width: 120, hide: false, pinned: null, sort: null, sortIndex: null },
    { colId: 'status', width: 100, hide: false, pinned: null, sort: null, sortIndex: null },
  ],
  getFilterModel: () => ({}),
  getAdvancedFilterModel: () => null,
  isPivotMode: () => false,
  getGridOption: () => '',
  applyColumnState: () => {},
  setFilterModel: () => {},
  setAdvancedFilterModel: () => {},
  setGridOption: () => {},
});

export const Default: Story = {
  render: () => (
    <VariantIntegration
      gridId="demo/variant-showcase"
      gridSchemaVersion={1}
      gridApi={createMockGridApi() as any}
    />
  ),
  play: async ({ canvasElement }) => {
    const btn = canvasElement.querySelector('button[aria-label]');
    if (btn) (btn as HTMLElement).click();
  },
};

export const WithAdminPermissions: Story = {
  render: () => (
    <VariantIntegration
      gridId="demo/admin-showcase"
      gridSchemaVersion={1}
      gridApi={createMockGridApi() as any}
      canPromoteToGlobal
      canDemoteToPersonal
      canDeleteGlobal
    />
  ),
};

export const CustomMessages: Story = {
  render: () => (
    <VariantIntegration
      gridId="demo/i18n-showcase"
      gridSchemaVersion={1}
      gridApi={createMockGridApi() as any}
      messages={{
        variantLabel: 'Görünüm',
        variantPlaceholder: '— Görünüm seçin —',
        variantNewButtonLabel: 'Yeni Görünüm',
        variantNamePlaceholder: 'Görünüm adı girin...',
        variantModalTitle: 'Görünüm Yönetimi',
        defaultVariantName: 'Varsayılan Görünüm',
        personalVariantsTitle: 'Kişisel Görünümler',
        globalVariantsTitle: 'Paylaşılan Görünümler',
        personalVariantsEmptyLabel: 'Henüz kişisel görünüm yok',
        globalVariantsEmptyLabel: 'Henüz paylaşılan görünüm yok',
      }}
    />
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <VariantIntegration
      gridId="demo/readonly-showcase"
      gridSchemaVersion={1}
      gridApi={createMockGridApi() as any}
      access="readonly"
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <VariantIntegration
      gridId="demo/disabled-showcase"
      gridSchemaVersion={1}
      gridApi={createMockGridApi() as any}
      access="disabled"
    />
  ),
};

export const CompactInToolbar: Story = {
  render: () => (
    <div className="flex items-center gap-2 rounded-lg border border-border-default bg-surface-default p-2">
      <input className="h-8 rounded border border-border-subtle px-2 text-sm" placeholder="Ara..." />
      <span className="text-xs text-text-secondary">|</span>
      <VariantIntegration
        gridId="demo/toolbar-showcase"
        gridSchemaVersion={1}
        gridApi={createMockGridApi() as any}
      />
    </div>
  ),
};
