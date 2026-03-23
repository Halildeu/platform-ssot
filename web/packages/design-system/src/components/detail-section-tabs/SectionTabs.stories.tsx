import type { Meta, StoryObj } from '@storybook/react';
import { SectionTabs } from './SectionTabs';
import type { SectionTabsItem } from './SectionTabs';

const sampleItems: SectionTabsItem[] = [
  { value: 'overview', label: 'Overview', description: 'General information', badge: '3' },
  { value: 'details', label: 'Details', description: 'Detailed specifications' },
  { value: 'history', label: 'History', description: 'Change log', badge: '12' },
  { value: 'comments', label: 'Comments', description: 'User feedback', badge: '5' },
  { value: 'settings', label: 'Settings', disabled: true },
];

const meta: Meta<typeof SectionTabs> = {
  title: 'Components/SectionTabs',
  component: SectionTabs,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof SectionTabs>;

export const Default: Story = {
  args: {
    items: sampleItems,
    defaultValue: 'overview',
  },
};

export const Compact: Story = {
  args: {
    items: sampleItems,
    defaultValue: 'details',
    density: 'compact',
  },
};

export const WithDescriptionTooltip: Story = {
  args: {
    items: sampleItems,
    defaultValue: 'overview',
    descriptionVisibility: 'hover',
    descriptionDisplay: 'tooltip',
    layout: 'scroll',
  },
};

export const WithDisabled: Story = {
  args: {
    items: sampleItems,
    defaultValue: 'overview',
    density: 'comfortable',
  },
};

export const FewItems: Story = {
  args: {
    items: sampleItems.slice(0, 2),
    defaultValue: 'overview',
  },
};

export const ScrollLayout: Story = {
  args: {
    items: sampleItems,
    defaultValue: 'details',
    layout: 'scroll',
  },
};
