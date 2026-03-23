import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { PortalProvider } from './PortalProvider';

const meta: Meta<typeof PortalProvider> = {
  component: PortalProvider,
  title: 'Internal/PortalProvider',
};
export default meta;

type Story = StoryObj<typeof PortalProvider>;

export const Default: Story = {
  render: () => (
    <PortalProvider>
      <div>Portal content</div>
    </PortalProvider>
  ),
};

export const NestedProviders: Story = {
  render: () => (
    <PortalProvider>
      <PortalProvider>
        <div>Nested portal content</div>
      </PortalProvider>
    </PortalProvider>
  ),
};

export const WithMultipleChildren: Story = {
  render: () => (
    <PortalProvider>
      <div>Child 1</div>
      <div>Child 2</div>
    </PortalProvider>
  ),
};

export const Disabled: Story = {
  render: () => (
    <PortalProvider enabled={false}>
      <div>Portals disabled — content renders inline</div>
    </PortalProvider>
  ),
};

export const WithCustomContainer: Story = {
  render: () => (
    <PortalProvider container={null}>
      <div>PortalProvider with null container — falls back to defaults</div>
    </PortalProvider>
  ),
};

export const ReEnabled: Story = {
  render: () => (
    <PortalProvider enabled>
      <div>PortalProvider re-enabled — portals render in portal containers</div>
    </PortalProvider>
  ),
};
