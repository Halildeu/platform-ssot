import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from './ThemeProvider';

const meta: Meta<typeof ThemeProvider> = {
  component: ThemeProvider,
  title: 'Providers/ThemeProvider',
  argTypes: { disabled: { control: 'boolean' } },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof ThemeProvider>;

export const Default: Story = {
  args: {
    children: 'Themed content',
  },
};

export const DarkMode: Story = {
  args: {
    children: 'Dark themed content',
  },
};

export const CustomTheme: Story = {
  args: {
    children: 'Custom theme overrides applied',
  },
};

export const HighContrast: Story = {
  args: {
    children: 'High contrast theme content',
  },
};

export const CompactDensity: Story = {
  args: {
    children: 'Compact density theme content',
  },
};

export const WithNestedContent: Story = {
  args: {
    children: 'Nested theme provider content with overrides',
  },
};
