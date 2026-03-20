import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import {
  NavigationRail,
  createNavigationDestinationItems,
  createNavigationRailPreset,
} from '../packages/design-system/src/components/NavigationRail';
import { Text } from '../packages/design-system/src/components/Text';

const meta: Meta<typeof NavigationRail> = {
  title: 'UI Kit/NavigationRail',
  component: NavigationRail,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof NavigationRail>;

export const Overview: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
      <div className="mx-auto flex max-w-5xl gap-6 rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
        <NavigationRail
          ariaLabel="Workspace destinations"
          defaultValue="overview"
          items={[
            {
              value: 'overview',
              label: 'Overview',
              description: 'Status',
              icon: <span aria-hidden="true">O</span>,
            },
            {
              value: 'audit',
              label: 'Audit',
              description: 'Events',
              icon: <span aria-hidden="true">A</span>,
              badge: '3',
            },
            {
              value: 'policy',
              label: 'Policy',
              description: 'Gates',
              icon: <span aria-hidden="true">P</span>,
            },
          ]}
        />
        <div className="flex-1 rounded-[28px] border border-border-subtle bg-surface-panel p-6">
          <Text variant="secondary">
            NavigationRail, top-level workspace destinasyonlarini soldan ulasilabilir bir primitive ile sunar.
          </Text>
        </div>
      </div>
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
      <div className="mx-auto flex max-w-4xl gap-6 rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
        <NavigationRail
          compact
          defaultValue="audit"
          items={[
            {
              value: 'overview',
              label: 'Overview',
              icon: <span aria-hidden="true">O</span>,
            },
            {
              value: 'audit',
              label: 'Audit',
              icon: <span aria-hidden="true">A</span>,
              badge: '3',
            },
            {
              value: 'policy',
              label: 'Policy',
              icon: <span aria-hidden="true">P</span>,
            },
          ]}
        />
        <div className="flex-1 rounded-[28px] border border-border-subtle bg-surface-panel p-6">
          <Text variant="secondary">
            Compact rail, dar ekran veya yardımcı navigation column ihtiyacinda ikon-odakli bir footprint verir.
          </Text>
        </div>
      </div>
    </div>
  ),
};

export const RouteAware: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
      <div className="mx-auto flex max-w-5xl gap-6 rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
        <NavigationRail
          ariaLabel="Route aware destinations"
          currentPath="/audit"
          appearance="ghost"
          labelVisibility="active"
          footer={<Text variant="secondary">Workspace settings</Text>}
          items={[
            {
              value: 'overview',
              label: 'Overview',
              description: 'Status',
              icon: <span aria-hidden="true">O</span>,
              href: '/overview',
            },
            {
              value: 'audit',
              label: 'Audit',
              description: 'Events',
              icon: <span aria-hidden="true">A</span>,
              href: '/audit',
              badge: '3',
            },
            {
              value: 'policy',
              label: 'Policy',
              description: 'Gates',
              icon: <span aria-hidden="true">P</span>,
              href: '/policy',
            },
          ]}
        />
        <div className="flex-1 rounded-[28px] border border-border-subtle bg-surface-panel p-6">
          <Text variant="secondary">
            P2 ile route-aware selection, label visibility policy, ghost surface ve footer slotu eklendi.
          </Text>
        </div>
      </div>
    </div>
  ),
};

export const PresetsAndAdapters: Story = {
  render: () => {
    const routeItems = createNavigationDestinationItems(
      [
        {
          value: 'overview',
          title: 'Overview',
          href: '/overview',
        },
        {
          value: 'audit',
          title: 'Audit',
          href: '/audit',
          current: true,
        },
        {
          value: 'policy',
          title: 'Policy',
          href: '/policy',
        },
      ],
      { currentBadge: 'Current' },
    );
    const preset = createNavigationRailPreset('ops_side_nav');

    return (
      <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
        <div className="mx-auto flex max-w-5xl gap-6 rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
          <NavigationRail
            ariaLabel="Preset destinations"
            items={routeItems}
            currentPath="/audit"
            footer={<Text variant="secondary">Workspace settings</Text>}
            {...preset}
          />
          <div className="flex-1 rounded-[28px] border border-border-subtle bg-surface-panel p-6">
            <Text variant="secondary">
              P3 ile route adapter ve preset helper&apos;lari NavigationRail ailesine eklendi.
            </Text>
          </div>
        </div>
      </div>
    );
  },
};
