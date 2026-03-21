import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import {
  Segmented,
  createSegmentedItemsFromFilters,
  createSegmentedItemsFromRoutes,
  createSegmentedPreset,
} from '../packages/design-system/src/components/Segmented';
import { Text } from '../packages/design-system/src/components/Text';

const meta: Meta<typeof Segmented> = {
  title: 'UI Kit/Segmented',
  component: Segmented,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof Segmented>;

export const Overview: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
      <div className="mx-auto max-w-4xl rounded-[28px] border border-border-subtle bg-surface-default p-6 shadow-sm">
        <Segmented
          ariaLabel="Release cockpit view"
          defaultValue="overview"
          items={[
            {
              value: 'overview',
              label: 'Overview',
              description: 'Health',
              icon: <span aria-hidden="true">O</span>,
            },
            {
              value: 'audit',
              label: 'Audit',
              description: 'Log',
              icon: <span aria-hidden="true">A</span>,
            },
            {
              value: 'policy',
              label: 'Policy',
              description: 'Gates',
              icon: <span aria-hidden="true">P</span>,
            },
          ]}
        />
      </div>
    </div>
  ),
};

export const VerticalMultiple: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
      <div className="mx-auto max-w-xl rounded-[28px] border border-border-subtle bg-surface-default p-6 shadow-sm">
        <Segmented
          ariaLabel="Filter channels"
          selectionMode="multiple"
          orientation="vertical"
          fullWidth
          defaultValue={['runtime', 'policy']}
          items={[
            {
              value: 'runtime',
              label: 'Runtime',
              description: 'Live',
            },
            {
              value: 'policy',
              label: 'Policy',
              description: 'Guarded',
            },
            {
              value: 'delivery',
              label: 'Delivery',
              description: 'Release lane',
            },
          ]}
        />
        <div className="mt-4 rounded-2xl border border-border-subtle bg-surface-panel p-4">
          <Text variant="secondary">
            Segmented primitive&apos;i tekli veya çoklu navigation/filter seçimini aynı yüzeyde toplayabilir.
          </Text>
        </div>
      </div>
    </div>
  ),
};

export const SurfaceVariants: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 rounded-[28px] border border-border-subtle bg-surface-default p-6 shadow-sm">
        <Segmented
          ariaLabel="Surface variant tabs"
          defaultValue="overview"
          variant="outline"
          shape="pill"
          iconPosition="end"
          allowEmptySelection
          items={[
            {
              value: 'overview',
              label: 'Overview',
              badge: '12',
              icon: <span aria-hidden="true">O</span>,
            },
            {
              value: 'audit',
              label: 'Audit',
              badge: '3',
              icon: <span aria-hidden="true">A</span>,
            },
            {
              value: 'policy',
              label: 'Policy',
              badge: '1',
              icon: <span aria-hidden="true">P</span>,
            },
          ]}
        />
        <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
          <Text variant="secondary">
            P2 ile segmented yüzeyine appearance, shape, badge ve nullable exclusive seçim davranışı eklendi.
          </Text>
        </div>
      </div>
    </div>
  ),
};

export const AdaptersAndPresets: Story = {
  render: () => {
    const routeItems = createSegmentedItemsFromRoutes(
      [
        { value: 'overview', title: 'Overview' },
        { value: 'audit', title: 'Audit' },
        { value: 'policy', title: 'Policy', current: true },
      ],
      { currentBadge: 'Current' },
    );
    const filterItems = createSegmentedItemsFromFilters(
      [
        { value: 'all', label: 'All', count: 14 },
        { value: 'warning', label: 'Warning', count: 2 },
        { value: 'error', label: 'Error', count: 1 },
      ],
      { hideZeroCountBadge: true },
    );
    const preset = createSegmentedPreset('filter_bar');

    return (
      <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 rounded-[28px] border border-border-subtle bg-surface-default p-6 shadow-sm">
          <Segmented
            ariaLabel="Route adapters"
            defaultValue="policy"
            items={routeItems}
            shape="pill"
            variant="ghost"
          />
          <Segmented
            ariaLabel="Filter adapters"
            defaultValue={['all']}
            items={filterItems}
            {...preset}
          />
          <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
            <Text variant="secondary">
              P3 ile route ve filter adapter helper&apos;lari, preset recipe&apos;leri ve selection helper
              function&apos;lari segmented ailesine eklendi.
            </Text>
          </div>
        </div>
      </div>
    );
  },
};
