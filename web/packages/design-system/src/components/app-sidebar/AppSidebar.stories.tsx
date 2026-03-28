import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent } from '@storybook/test';
import { AppSidebar } from './AppSidebar';

/* ------------------------------------------------------------------ */
/*  Inline icons (avoid external dependency for stories)               */
/* ------------------------------------------------------------------ */

const HomeIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
    <path d="M8 1L1 7h2v6h4V9h2v4h4V7h2L8 1z" />
  </svg>
);
const SettingsIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
    <path d="M8 10a2 2 0 100-4 2 2 0 000 4z" />
  </svg>
);
const UsersIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
    <path d="M8 8a3 3 0 100-6 3 3 0 000 6zm0 2c-3.3 0-6 1.3-6 3v1h12v-1c0-1.7-2.7-3-6-3z" />
  </svg>
);
const FileIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
    <path d="M3 1h7l3 3v10a1 1 0 01-1 1H3a1 1 0 01-1-1V2a1 1 0 011-1z" />
  </svg>
);
const ChartIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
    <path d="M2 14V6h3v8H2zm5 0V2h3v12H7zm5 0V9h3v5h-3z" />
  </svg>
);
const FolderIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
    <path d="M1 3h5l2 2h7v9H1V3z" />
  </svg>
);
const HelpIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
    <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <text x="8" y="11" textAnchor="middle" fontSize="9" fill="currentColor">?</text>
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof AppSidebar> = {
  title: 'Components/Navigation/AppSidebar',
  component: AppSidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    defaultMode: { control: 'select', options: ['expanded', 'collapsed'], description: 'Initial sidebar mode' },
    collapsedWidth: { control: 'number', description: 'Width when collapsed (px)' },
    expandedWidth: { control: 'number', description: 'Width when expanded (px)' },
    resizable: { control: 'boolean', description: 'Enable drag-to-resize' },
    className: { control: 'text', description: 'Additional CSS class' },
  },
  decorators: [
    (Story) => (
      <div style={{ height: 600, display: 'flex', background: 'var(--surface-canvas, #f5f5f5)' }}>
        <Story />
        <div style={{ flex: 1, padding: 24 }}>
          <p style={{ color: 'var(--text-secondary, #666)' }}>Main content area</p>
        </div>
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof AppSidebar>;

/* ================================================================== */
/*  1. Default                                                         */
/* ================================================================== */

export const Default: Story = {
  render: () => (
    <AppSidebar>
      <AppSidebar.Header
        title="Design Lab"
        subtitle="Component Library"
        action={<AppSidebar.Trigger />}
      />
      <AppSidebar.Nav>
        <AppSidebar.NavItem icon={<HomeIcon />} label="Dashboard" active />
        <AppSidebar.NavItem icon={<UsersIcon />} label="Team" />
        <AppSidebar.NavItem icon={<ChartIcon />} label="Analytics" />
        <AppSidebar.NavItem icon={<SettingsIcon />} label="Settings" />
      </AppSidebar.Nav>
      <AppSidebar.Footer>
        <span style={{ fontSize: 11, color: 'var(--text-secondary, #999)' }}>v2.4.0</span>
      </AppSidebar.Footer>
    </AppSidebar>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const sidebar = canvas.getByLabelText('Sidebar');
    await expect(sidebar).toBeInTheDocument();
    const trigger = canvas.getByLabelText('Collapse sidebar');
    await userEvent.click(trigger);
    await expect(sidebar).toHaveAttribute('data-state', 'collapsed');
  },
};

/* ================================================================== */
/*  2. Collapsed                                                       */
/* ================================================================== */

export const Collapsed: Story = {
  render: () => (
    <AppSidebar defaultMode="collapsed">
      <AppSidebar.Header
        logo={<HomeIcon />}
        action={<AppSidebar.Trigger />}
      />
      <AppSidebar.Nav>
        <AppSidebar.NavItem icon={<HomeIcon />} label="Dashboard" tooltip="Dashboard" active />
        <AppSidebar.NavItem icon={<UsersIcon />} label="Team" tooltip="Team" />
        <AppSidebar.NavItem icon={<ChartIcon />} label="Analytics" tooltip="Analytics" />
        <AppSidebar.NavItem icon={<SettingsIcon />} label="Settings" tooltip="Settings" />
      </AppSidebar.Nav>
    </AppSidebar>
  ),
};

/* ================================================================== */
/*  3. WithSearch                                                      */
/* ================================================================== */

export const WithSearch: Story = {
  render: function WithSearchRender() {
    const [query, setQuery] = useState('');
    const items = [
      { icon: <HomeIcon />, label: 'Dashboard' },
      { icon: <UsersIcon />, label: 'Team Members' },
      { icon: <ChartIcon />, label: 'Analytics' },
      { icon: <FileIcon />, label: 'Documents' },
      { icon: <SettingsIcon />, label: 'Settings' },
    ];
    const filtered = items.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase()),
    );

    return (
      <AppSidebar>
        <AppSidebar.Header title="Design Lab" action={<AppSidebar.Trigger />} />
        <AppSidebar.Search
          placeholder="Search navigation..."
          shortcut="⌘K"
          value={query}
          onChange={setQuery}
        />
        <AppSidebar.Nav>
          {filtered.map((item) => (
            <AppSidebar.NavItem key={item.label} icon={item.icon} label={item.label} />
          ))}
        </AppSidebar.Nav>
      </AppSidebar>
    );
  },
};

/* ================================================================== */
/*  4. NestedItems                                                     */
/* ================================================================== */

export const NestedItems: Story = {
  render: () => (
    <AppSidebar>
      <AppSidebar.Header title="Design Lab" action={<AppSidebar.Trigger />} />
      <AppSidebar.Nav>
        <AppSidebar.NavItem icon={<FolderIcon />} label="Components">
          <AppSidebar.NavItem label="Primitives">
            <AppSidebar.NavItem label="Button" active />
            <AppSidebar.NavItem label="Input" />
            <AppSidebar.NavItem label="Badge" />
          </AppSidebar.NavItem>
          <AppSidebar.NavItem label="Patterns">
            <AppSidebar.NavItem label="Page Layout" />
            <AppSidebar.NavItem label="Detail Drawer" />
          </AppSidebar.NavItem>
        </AppSidebar.NavItem>
        <AppSidebar.NavItem icon={<FileIcon />} label="Tokens">
          <AppSidebar.NavItem label="Colors" />
          <AppSidebar.NavItem label="Typography" />
        </AppSidebar.NavItem>
      </AppSidebar.Nav>
    </AppSidebar>
  ),
};

/* ================================================================== */
/*  5. WithBadges                                                      */
/* ================================================================== */

const StableBadge = () => (
  <span style={{
    fontSize: 10, padding: '1px 6px', borderRadius: 9999,
    background: 'var(--status-success-subtle, #dcfce7)', color: 'var(--status-success, #16a34a)',
  }}>
    stable
  </span>
);
const BetaBadge = () => (
  <span style={{
    fontSize: 10, padding: '1px 6px', borderRadius: 9999,
    background: 'var(--status-warning-subtle, #fef9c3)', color: 'var(--status-warning, #ca8a04)',
  }}>
    beta
  </span>
);
const DeprecatedBadge = () => (
  <span style={{
    fontSize: 10, padding: '1px 6px', borderRadius: 9999,
    background: 'var(--status-error-subtle, #fee2e2)', color: 'var(--status-error, #dc2626)',
  }}>
    deprecated
  </span>
);

export const WithBadges: Story = {
  render: () => (
    <AppSidebar>
      <AppSidebar.Header title="Design Lab" action={<AppSidebar.Trigger />} />
      <AppSidebar.Nav>
        <AppSidebar.NavItem icon={<HomeIcon />} label="Button" badge={<StableBadge />} active />
        <AppSidebar.NavItem icon={<ChartIcon />} label="SmartDashboard" badge={<BetaBadge />} />
        <AppSidebar.NavItem icon={<FileIcon />} label="LegacyTable" badge={<DeprecatedBadge />} disabled />
        <AppSidebar.NavItem icon={<UsersIcon />} label="Avatar" badge={<StableBadge />} />
        <AppSidebar.NavItem icon={<FolderIcon />} label="AILayoutBuilder" badge={<BetaBadge />} />
      </AppSidebar.Nav>
    </AppSidebar>
  ),
};

/* ================================================================== */
/*  6. WithGroups                                                      */
/* ================================================================== */

export const WithGroups: Story = {
  render: () => (
    <AppSidebar>
      <AppSidebar.Header title="Design Lab" action={<AppSidebar.Trigger />} />
      <AppSidebar.Nav>
        <AppSidebar.Group label="Foundations" icon={<FolderIcon />} collapsible defaultOpen>
          <AppSidebar.NavItem icon={<HomeIcon />} label="Colors" active />
          <AppSidebar.NavItem icon={<FileIcon />} label="Typography" />
          <AppSidebar.NavItem icon={<SettingsIcon />} label="Spacing" />
        </AppSidebar.Group>
        <AppSidebar.Separator />
        <AppSidebar.Group label="Components" icon={<ChartIcon />} collapsible defaultOpen>
          <AppSidebar.NavItem icon={<HomeIcon />} label="Button" />
          <AppSidebar.NavItem icon={<UsersIcon />} label="Avatar" />
          <AppSidebar.NavItem icon={<FileIcon />} label="Modal" />
        </AppSidebar.Group>
        <AppSidebar.Separator />
        <AppSidebar.Group label="Patterns" icon={<FolderIcon />} collapsible defaultOpen={false}>
          <AppSidebar.NavItem icon={<HomeIcon />} label="Page Layout" />
          <AppSidebar.NavItem icon={<ChartIcon />} label="Detail Drawer" />
        </AppSidebar.Group>
      </AppSidebar.Nav>
    </AppSidebar>
  ),
};

/* ================================================================== */
/*  7. Resizable                                                       */
/* ================================================================== */

export const Resizable: Story = {
  render: () => (
    <AppSidebar resizable minWidth={180} maxWidth={450}>
      <AppSidebar.Header title="Design Lab" subtitle="Drag edge to resize" action={<AppSidebar.Trigger />} />
      <AppSidebar.Nav>
        <AppSidebar.NavItem icon={<HomeIcon />} label="Dashboard" active />
        <AppSidebar.NavItem icon={<UsersIcon />} label="Team" />
        <AppSidebar.NavItem icon={<ChartIcon />} label="Analytics" />
        <AppSidebar.NavItem icon={<SettingsIcon />} label="Settings" />
      </AppSidebar.Nav>
      <AppSidebar.Resizer />
    </AppSidebar>
  ),
};

/* ================================================================== */
/*  8. KitchenSink                                                     */
/* ================================================================== */

export const KitchenSink: Story = {
  render: function KitchenSinkRender() {
    const [query, setQuery] = useState('');

    return (
      <AppSidebar resizable>
        <AppSidebar.Header
          title="Design Lab"
          subtitle="v2.4.0 — Enterprise"
          logo={
            <span style={{
              width: 28, height: 28, borderRadius: 6,
              background: 'var(--action-primary, #3b82f6)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700,
            }}>
              DL
            </span>
          }
          action={<AppSidebar.Trigger />}
        />

        <AppSidebar.Search
          placeholder="Search components..."
          shortcut="⌘K"
          value={query}
          onChange={setQuery}
        />

        <AppSidebar.Nav>
          <AppSidebar.Section title="Overview">
            <AppSidebar.NavItem icon={<HomeIcon />} label="Dashboard" active />
            <AppSidebar.NavItem icon={<ChartIcon />} label="Analytics" badge={<BetaBadge />} />
          </AppSidebar.Section>

          <AppSidebar.Separator />

          <AppSidebar.Group label="Library" icon={<FolderIcon />} collapsible defaultOpen>
            <AppSidebar.NavItem icon={<HomeIcon />} label="Primitives">
              <AppSidebar.NavItem label="Button" badge={<StableBadge />} />
              <AppSidebar.NavItem label="Input" badge={<StableBadge />} />
              <AppSidebar.NavItem label="Badge" badge={<BetaBadge />} />
            </AppSidebar.NavItem>
            <AppSidebar.NavItem icon={<FileIcon />} label="Patterns">
              <AppSidebar.NavItem label="Page Layout" />
              <AppSidebar.NavItem label="Detail Drawer" />
            </AppSidebar.NavItem>
          </AppSidebar.Group>

          <AppSidebar.Separator />

          <AppSidebar.Group label="Administration" icon={<SettingsIcon />} collapsible defaultOpen={false}>
            <AppSidebar.NavItem icon={<UsersIcon />} label="Team Members" />
            <AppSidebar.NavItem icon={<SettingsIcon />} label="Settings" />
            <AppSidebar.NavItem icon={<HelpIcon />} label="Legacy Config" badge={<DeprecatedBadge />} disabled />
          </AppSidebar.Group>
        </AppSidebar.Nav>

        <AppSidebar.Footer>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px' }}>
            <span style={{
              width: 24, height: 24, borderRadius: '50%',
              background: 'var(--action-primary, #3b82f6)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 600,
            }}>
              HK
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-secondary, #666)' }}>Halil K.</span>
          </div>
        </AppSidebar.Footer>
        <AppSidebar.Resizer />
      </AppSidebar>
    );
  },
};
