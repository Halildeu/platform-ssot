import React from 'react';
import {
  Badge,
  NavigationRail,
  Text,
  createNavigationDestinationItems,
  createNavigationRailPreset,
} from '@mfe/design-system';
import type { ComponentShowcaseSection, PreviewPanelComponent } from '../../showcaseTypes';

type BuildNavigationRailPreviewOptions = {
  PreviewPanel: PreviewPanelComponent;
};

const workspaceItems = [
  {
    value: 'overview',
    label: 'Overview',
    description: 'Health',
    icon: <span aria-hidden="true">⌂</span>,
  },
  {
    value: 'audit',
    label: 'Audit',
    description: 'Events',
    icon: <span aria-hidden="true">◎</span>,
    badge: <Badge variant="info">3</Badge>,
  },
  {
    value: 'policy',
    label: 'Policy',
    description: 'Gates',
    icon: <span aria-hidden="true">⛨</span>,
  },
];

const compactItems = [
  {
    value: 'home',
    label: 'Home',
    icon: <span aria-hidden="true">⌂</span>,
  },
  {
    value: 'search',
    label: 'Search',
    icon: <span aria-hidden="true">⌕</span>,
    badge: <Badge variant="success">2</Badge>,
  },
  {
    value: 'files',
    label: 'Files',
    icon: <span aria-hidden="true">▣</span>,
  },
];

const routeAwareItems = createNavigationDestinationItems(
  [
    {
      value: 'overview',
      title: 'Overview',
      href: '/overview',
      icon: <span aria-hidden="true">⌂</span>,
    },
    {
      value: 'audit',
      title: 'Audit',
      href: '/audit',
      icon: <span aria-hidden="true">◎</span>,
      current: true,
    },
    {
      value: 'policy',
      title: 'Policy',
      href: '/policy',
      icon: <span aria-hidden="true">⛨</span>,
    },
  ],
  { currentBadge: <Badge variant="warning">Current</Badge> },
);

const presetProps = createNavigationRailPreset('ops_side_nav');

const NavigationRailWorkspacePanel = () => (
  <div className="flex gap-4 rounded-2xl border border-border-subtle bg-surface-default p-4">
    <NavigationRail
      ariaLabel="Workspace destinations"
      defaultValue="audit"
      items={workspaceItems}
      footer={<Text variant="secondary">Workspace settings</Text>}
    />
    <div className="min-h-[320px] flex-1 rounded-2xl border border-border-subtle bg-surface-panel p-4">
      <Text as="div" className="font-semibold text-text-primary">
        Workspace rail
      </Text>
      <Text variant="secondary" className="mt-2 block text-sm leading-6">
        Badge, description ve footer slotu ile top-level uygulama destinasyonlari ayni rail primitive uzerinden gorunur.
      </Text>
    </div>
  </div>
);

const NavigationRailCompactPanel = () => (
  <div className="flex gap-4 rounded-2xl border border-border-subtle bg-surface-default p-4">
    <NavigationRail
      compact
      appearance="ghost"
      defaultValue="search"
      items={compactItems}
      ariaLabel="Compact utility rail"
    />
    <div className="min-h-[240px] flex-1 rounded-2xl border border-border-subtle bg-surface-panel p-4">
      <Text as="div" className="font-semibold text-text-primary">
        Compact utility rail
      </Text>
      <Text variant="secondary" className="mt-2 block text-sm leading-6">
        Dar utility kolonlari icin ikon-odakli footprint kullanir; labels none/compact davranisi rail icinde cozulur.
      </Text>
    </div>
  </div>
);

const NavigationRailRouteAwarePanel = () => (
  <div className="flex gap-4 rounded-2xl border border-border-subtle bg-surface-default p-4">
    <NavigationRail
      ariaLabel="Route aware destinations"
      items={routeAwareItems}
      currentPath="/audit"
      footer={<Text variant="secondary">Ops settings</Text>}
      {...presetProps}
    />
    <div className="min-h-[320px] flex-1 rounded-2xl border border-border-subtle bg-surface-panel p-4">
      <Text as="div" className="font-semibold text-text-primary">
        Route aware preset
      </Text>
      <Text variant="secondary" className="mt-2 block text-sm leading-6">
        Helper adapter, preset export ve currentPath secimi birlikte calisir; canonical side navigation contract'i budur.
      </Text>
    </div>
  </div>
);

export const buildNavigationRailLivePreview = (
  itemName: string,
  { PreviewPanel }: BuildNavigationRailPreviewOptions,
): React.ReactNode | null => {
  if (itemName !== 'NavigationRail') {
    return null;
  }

  return (
    <div className="rounded-3xl border border-border-subtle bg-surface-panel p-5 shadow-xs">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <PreviewPanel title="Workspace rail">
          <NavigationRailWorkspacePanel />
        </PreviewPanel>
        <PreviewPanel title="Compact utility rail">
          <NavigationRailCompactPanel />
        </PreviewPanel>
        <PreviewPanel title="Route aware preset">
          <NavigationRailRouteAwarePanel />
        </PreviewPanel>
      </div>
    </div>
  );
};

export const buildNavigationRailShowcaseSections = (
  itemName: string,
  { PreviewPanel }: BuildNavigationRailPreviewOptions,
): ComponentShowcaseSection[] | null => {
  if (itemName !== 'NavigationRail') {
    return null;
  }

  return [
    {
      id: 'navigationrail-workspace',
      eyebrow: 'Pattern 01',
      title: 'Workspace rail',
      description: 'Primary app destinations, badge state ve footer slotu ayni rail yuzeyinde toplanir.',
      badges: ['live', 'workspace', 'beta'],
      content: (
        <PreviewPanel title="Workspace rail">
          <NavigationRailWorkspacePanel />
        </PreviewPanel>
      ),
    },
    {
      id: 'navigationrail-compact',
      eyebrow: 'Pattern 02',
      title: 'Compact utility rail',
      description: 'Icon-first compact mode, dar kolonlarda secondary navigation dili icin kullanilir.',
      badges: ['live', 'compact', 'utility'],
      content: (
        <PreviewPanel title="Compact utility rail">
          <NavigationRailCompactPanel />
        </PreviewPanel>
      ),
    },
    {
      id: 'navigationrail-route-aware',
      eyebrow: 'Pattern 03',
      title: 'Route aware preset',
      description: 'Preset helper, route adapter ve currentPath secimi birlikte canonical navigation contract'i kurar.',
      badges: ['reference', 'route-aware', 'preset'],
      content: (
        <PreviewPanel title="Route aware preset" kind="reference">
          <NavigationRailRouteAwarePanel />
        </PreviewPanel>
      ),
    },
  ];
};
