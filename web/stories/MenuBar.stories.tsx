import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import {
  Badge,
  MenuBar,
  createMenuBarItemsFromRoutes,
  createMenuBarPreset,
} from '../packages/design-system/src';
import { Text } from '../packages/design-system/src/components/Text';

const meta: Meta<typeof MenuBar> = {
  title: 'UI Kit/MenuBar',
  component: MenuBar,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof MenuBar>;

const StoryShell: React.FC<{
  eyebrow: string;
  title: string;
  description: string;
  accentClassName?: string;
  children: React.ReactNode;
  notes?: React.ReactNode;
}> = ({ eyebrow, title, description, accentClassName, children, notes }) => (
  <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
    <div
      className={[
        'mx-auto flex max-w-5xl flex-col gap-6 rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-[0_28px_64px_-48px_rgba(15,23,42,0.26)]',
        accentClassName,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(240px,0.85fr)]">
        <div>
          <Text as="div" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
            {eyebrow}
          </Text>
          <Text as="div" preset="body-sm" className="mt-2 text-xl font-semibold text-text-primary">
            {title}
          </Text>
          <Text variant="secondary" className="mt-2 block text-sm leading-7">
            {description}
          </Text>
        </div>
        <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
          {(notes ? React.Children.toArray(notes) : []).map((note, index) => (
            <div
              key={`note-${index}`}
              className="rounded-[22px] border border-border-subtle/70 bg-white/82 p-4 shadow-[0_16px_32px_-26px_rgba(15,23,42,0.2)]"
            >
              {note}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-[28px] border border-border-subtle/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,247,255,0.94))] p-5 shadow-[0_24px_50px_-40px_rgba(15,23,42,0.22)]">
        {children}
      </div>
    </div>
  </div>
);

const StoryMetric: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <Text as="div" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
      {label}
    </Text>
    <Text as="div" preset="body-sm" className="mt-1 text-sm font-semibold text-text-primary">
      {value}
    </Text>
  </div>
);

export const HorizontalDefault: Story = {
  render: () => (
    <StoryShell
      eyebrow="Core parity"
      title="Workspace menubar"
      description="Ant Design ve Material UI çizgisindeki temel yatay uygulama menüsü. Route-aware aktif durum, submenu ve sakin utility alanı birlikte çalışır."
      accentClassName="bg-[radial-gradient(circle_at_top_left,rgba(191,219,254,0.24),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,255,0.96))]"
      notes={[
        <StoryMetric key="routes" label="Active route" value="Recipes" />,
        <StoryMetric key="focus" label="Focus mode" value="Desktop roving" />,
        <StoryMetric key="utility" label="Utility" value="UI Kit status" />,
      ]}
    >
      <MenuBar
        ariaLabel="Workspace menu bar"
        currentPath="/workspace/recipes"
        startSlot={<Badge tone="muted">Platform</Badge>}
        endSlot={<Badge tone="success">UI Kit</Badge>}
        items={[
          { value: 'overview', label: 'Overview', href: '/workspace/overview' },
          { value: 'packages', label: 'Packages', href: '/workspace/packages' },
          {
            value: 'recipes',
            label: 'Recipes',
            href: '/workspace/recipes',
            menuItems: [
              { key: 'navigation', label: 'Navigation family', groupLabel: 'Collections' },
              { key: 'overlay', label: 'Overlay family', groupLabel: 'Collections' },
              { key: 'review', label: 'Review stack', groupLabel: 'Collections' },
            ],
          },
          { value: 'docs', label: 'Docs', href: '/workspace/docs' },
        ]}
      />
    </StoryShell>
  ),
};

export const SearchHeader: Story = {
  render: () => (
    <StoryShell
      eyebrow="Modern header"
      title="Search-first command header"
      description="Büyük yüzeylerde arama, hızlı işlem ve root navigation'ı tek üst kabukta birleştirir. Kullanıcı dostu keşif ve hız için en modern header recipe’lerinden biri."
      accentClassName="bg-[radial-gradient(circle_at_top_left,rgba(186,230,253,0.28),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(240,249,255,0.96))]"
      notes={[
        <StoryMetric key="shortcut" label="Shortcut" value="Cmd+K" />,
        <StoryMetric key="actions" label="Quick actions" value="16" />,
        <StoryMetric key="context" label="Live context" value="Approval + Audit" />,
      ]}
    >
      <MenuBar
        ariaLabel="Search driven application header"
        appearance="outline"
        labelVisibility="active"
        overflowBehavior="collapse-to-more"
        overflowLabel="Tools"
        maxVisibleItems={4}
        enableSearchHandoff
        searchPlaceholder="Search routes or commands"
        defaultRecentValues={['approval', 'audit']}
        defaultFavoriteValues={['approval']}
        showFavoriteToggle
        currentPath="/approval"
        startSlot={
          <div className="flex items-center gap-2 rounded-full border border-border-subtle/70 bg-white/78 px-3 py-1.5 shadow-[0_12px_24px_-24px_rgba(15,23,42,0.2)] ring-1 ring-white/70 backdrop-blur-sm">
            <span aria-hidden="true">⌕</span>
            <Text variant="secondary" className="text-xs">
              Ara, komut çalıştır, rota aç
            </Text>
            <Badge tone="muted">⌘K</Badge>
          </div>
        }
        endSlot={
          <div className="flex items-center gap-2">
            <Badge tone="info">Search</Badge>
            <Badge tone="success">Live</Badge>
            <Badge tone="muted">v2</Badge>
          </div>
        }
        items={[
          { value: 'overview', label: 'Overview', href: '/overview', overflowPriority: 8, group: 'primary', keywords: ['dashboard', 'home'] },
          {
            value: 'approval',
            label: 'Approval',
            href: '/approval',
            overflowPriority: 10,
            pinned: true,
            group: 'primary',
            emphasis: 'promoted',
            keywords: ['approve', 'policy', 'review'],
            menuSurfaceTitle: 'Approval cockpit',
            menuSurfaceDescription: 'High-signal approval routes and review commands grouped in a richer panel.',
            menuSurfaceMeta: <div className="flex flex-wrap gap-2"><Badge tone="warning">4 hot items</Badge><Badge tone="info">Cmd-ready</Badge></div>,
            menuItems: [
              { key: 'pending', label: 'Pending approvals', groupLabel: 'Review', description: 'Open approval queue' },
              { key: 'history', label: 'Decision history', groupLabel: 'Review', description: 'Inspect previous decisions' },
            ],
          },
          {
            value: 'audit',
            label: 'Audit',
            href: '/audit',
            overflowPriority: 9,
            pinned: true,
            group: 'primary',
            keywords: ['events', 'evidence', 'logs'],
            menuItems: [{ key: 'events', label: 'Events', groupLabel: 'Logs', description: 'Open live event stream' }],
          },
          { value: 'ops', label: 'Ops', href: '/ops', overflowPriority: 7, group: 'secondary', keywords: ['lane', 'queue'] },
          { value: 'insights', label: 'Insights', href: '/insights', overflowPriority: 6, group: 'utility', emphasis: 'subtle', keywords: ['analytics', 'signals'] },
        ]}
      />
    </StoryShell>
  ),
};

export const OverflowMore: Story = {
  render: () => (
    <StoryShell
      eyebrow="Large IA"
      title="Priority-managed overflow"
      description="AntD’deki More davranışını daha akıllı hale getirir: büyük bilgi mimarisinde kritik rotalar görünür kalır, ikincil yollar kontrollü overflow içine gider."
      accentClassName="bg-[radial-gradient(circle_at_top_right,rgba(253,230,138,0.28),transparent_36%),linear-gradient(180deg,rgba(255,251,235,0.98),rgba(255,255,255,0.96))]"
      notes={[
        <StoryMetric key="visible" label="Visible roots" value="4 / 7" />,
        <StoryMetric key="label" label="Overflow label" value="More" />,
        <StoryMetric key="policy" label="Retention" value="Priority-first" />,
      ]}
    >
      <div className="max-w-[640px]">
        <MenuBar
          ariaLabel="Overflow managed application header"
          appearance="outline"
          overflowBehavior="collapse-to-more"
          overflowLabel="More"
          maxVisibleItems={4}
          currentPath="/workspace/approval"
          startSlot={<Badge tone="muted">Release</Badge>}
          endSlot={<Badge tone="warning">Incident 1</Badge>}
          items={[
            { value: 'overview', label: 'Overview', href: '/workspace/overview', overflowPriority: 6, group: 'primary' },
            { value: 'approval', label: 'Approval', href: '/workspace/approval', overflowPriority: 10, group: 'primary', emphasis: 'promoted' },
            { value: 'audit', label: 'Audit', href: '/workspace/audit', overflowPriority: 9, group: 'primary' },
            { value: 'analytics', label: 'Analytics', href: '/workspace/analytics', overflowPriority: 8, group: 'secondary' },
            { value: 'signals', label: 'Signals', href: '/workspace/signals', overflowPriority: 7, group: 'secondary' },
            { value: 'exports', label: 'Exports', href: '/workspace/exports', overflowPriority: 4, group: 'utility', emphasis: 'subtle' },
            { value: 'settings', label: 'Settings', href: '/workspace/settings', overflowPriority: 3, group: 'utility', emphasis: 'subtle' },
          ]}
        />
      </div>
    </StoryShell>
  ),
};

export const ResponsiveAppHeader: Story = {
  render: () => (
    <StoryShell
      eyebrow="Responsive header"
      title="App bar with mobile fallback"
      description="MUI AppBar mantığına yakın: geniş ekranda utility cluster, dar görünümde ise menü fallback’i ile sade ama işlevsel kalan üst navigasyon."
      accentClassName="bg-[radial-gradient(circle_at_top_left,rgba(221,214,254,0.28),transparent_36%),linear-gradient(180deg,rgba(248,250,255,0.98),rgba(244,244,255,0.96))]"
      notes={[
        <StoryMetric key="labels" label="Label collapse" value="1200px" />,
        <StoryMetric key="breakpoint" label="Menu fallback" value="960px" />,
        <StoryMetric key="fallback" label="Fallback" value="Menu" />,
        <StoryMetric key="utility" label="Utility collapse" value="Hide" />,
      ]}
    >
      <div className="max-w-[680px]">
        <MenuBar
          ariaLabel="Responsive support header"
          appearance="outline"
          labelVisibility="responsive"
          labelCollapseBreakpoint="(max-width: 1200px)"
          overflowBehavior="collapse-to-more"
          overflowLabel="Menu"
          maxVisibleItems={3}
          submenuTrigger="hover"
          responsiveBreakpoint="(max-width: 960px)"
          mobileFallback="menu"
          utilityCollapse="hide"
          currentPath="/support/inbox"
          startSlot={<Badge tone="muted">Support</Badge>}
          endSlot={
            <div className="flex items-center gap-2">
              <Badge tone="warning">SLA 2h</Badge>
              <Badge tone="info">Live</Badge>
            </div>
          }
          items={[
            { value: 'overview', label: 'Overview', href: '/support/overview', overflowPriority: 6, group: 'primary' },
            { value: 'inbox', label: 'Inbox', href: '/support/inbox', badge: '12', overflowPriority: 10, group: 'primary', emphasis: 'promoted' },
            {
              value: 'escalations',
              label: 'Escalations',
              href: '/support/escalations',
              overflowPriority: 9,
              group: 'primary',
              menuItems: [
                { key: 'sev1', label: 'Sev-1', groupLabel: 'Priority', badge: '2', danger: true },
                { key: 'sev2', label: 'Sev-2', groupLabel: 'Priority', badge: '5' },
                { key: 'handoff', label: 'Owner handoff', groupLabel: 'Operations' },
              ],
            },
            { value: 'sla', label: 'SLA', href: '/support/sla', overflowPriority: 8, group: 'secondary' },
            { value: 'exports', label: 'Exports', href: '/support/exports', overflowPriority: 3, group: 'utility', emphasis: 'subtle' },
          ]}
        />
      </div>
    </StoryShell>
  ),
};

export const PinnedFavorites: Story = {
  render: () => (
    <StoryShell
      eyebrow="Enterprise IA"
      title="Pinned favorites shell"
      description="Kurumsal bilgi mimarisinde en çok kullanılan rotaları sabit tutar. UX açısından kritik olan şey, kullanıcının her sayfada aynı favori köklere tek tıkla ulaşabilmesidir."
      accentClassName="bg-[radial-gradient(circle_at_top_left,rgba(254,215,170,0.28),transparent_36%),linear-gradient(180deg,rgba(255,250,245,0.98),rgba(255,255,255,0.96))]"
      notes={[
        <StoryMetric key="pinned" label="Pinned roots" value="3" />,
        <StoryMetric key="roots" label="Total roots" value="6" />,
        <StoryMetric key="overflow" label="Overflow" value="Non-favorites" />,
      ]}
    >
      <MenuBar
        ariaLabel="Pinned favorites menu"
        overflowBehavior="collapse-to-more"
        overflowLabel="More"
        maxVisibleItems={4}
        showFavoriteToggle
        defaultFavoriteValues={['approval', 'audit', 'owners']}
        currentPath="/approval"
        startSlot={<Badge tone="warning">Pinned</Badge>}
        endSlot={<Badge tone="info">Enterprise IA</Badge>}
        items={[
          { value: 'approval', label: 'Approval', href: '/approval', overflowPriority: 10, pinned: true, group: 'primary', emphasis: 'promoted' },
          { value: 'audit', label: 'Audit', href: '/audit', overflowPriority: 9, pinned: true, group: 'primary' },
          { value: 'owners', label: 'Owners', href: '/owners', overflowPriority: 8, pinned: true, group: 'primary' },
          { value: 'analytics', label: 'Analytics', href: '/analytics', overflowPriority: 7, group: 'secondary' },
          { value: 'exports', label: 'Exports', href: '/exports', overflowPriority: 4, group: 'utility', emphasis: 'subtle' },
          { value: 'tokens', label: 'Tokens', href: '/tokens', overflowPriority: 3, group: 'utility', emphasis: 'subtle' },
        ]}
      />
    </StoryShell>
  ),
};

export const CommandHybrid: Story = {
  render: () => {
    const preset = createMenuBarPreset('ops_command_bar');
    const items = createMenuBarItemsFromRoutes(
      [
        {
          value: 'overview',
          title: 'Overview',
          href: '/ops/overview',
          group: 'primary',
        },
        {
          value: 'lanes',
          label: 'Lanes',
          href: '/ops/lanes',
          matchPath: ['/ops/lanes', '/ops/queue'],
          overflowPriority: 10,
          group: 'primary',
          emphasis: 'promoted',
          menuItems: [
            { key: 'resume', label: 'Resume lane', groupLabel: 'Delivery', shortcut: '⌘R' },
            { key: 'pause', label: 'Pause lane', groupLabel: 'Delivery', shortcut: '⌘P' },
            { key: 'budget', label: 'Script budget', groupLabel: 'Checks', shortcut: '⌘B' },
          ],
        },
        {
          value: 'freeze',
          label: 'Freeze',
          href: '/ops/freeze',
          overflowPriority: 9,
          group: 'secondary',
          badge: 'Hot',
        },
        {
          value: 'reports',
          label: 'Reports',
          href: '/ops/reports',
          overflowPriority: 6,
          group: 'utility',
          emphasis: 'subtle',
        },
      ],
      {
        currentPath: '/ops/lanes',
        currentBadge: <Badge tone="success">Live</Badge>,
      },
    );

    return (
      <StoryShell
        eyebrow="Action + command"
        title="Ops command hybrid"
        description="Toolbar, route switching ve command hint alanını aynı menubar yüzeyinde birleştirir. Büyük operasyon ekranlarında modern ama yalın kalan bir üst bar verir."
        accentClassName="bg-[linear-gradient(180deg,rgba(248,250,252,0.98),rgba(241,245,249,0.96))]"
        notes={[
          <StoryMetric key="queue" label="Queue" value="4" />,
          <StoryMetric key="preset" label="Preset" value="Ops command" />,
          <StoryMetric key="adapter" label="Adapter" value="Route-driven" />,
        ]}
      >
      <MenuBar
        ariaLabel="Command hybrid ops bar"
        {...preset}
        currentPath="/ops/lanes"
        enableSearchHandoff
        searchPlaceholder="Search lanes or commands"
        defaultRecentValues={['lanes', 'freeze']}
        startSlot={
            <div className="flex items-center gap-2">
              <Badge tone="muted">⌘K</Badge>
              <Text variant="secondary" className="text-xs">
                search lanes
              </Text>
            </div>
          }
          endSlot={<Badge tone="warning">Queue 4</Badge>}
          items={items}
        />
      </StoryShell>
    );
  },
};
