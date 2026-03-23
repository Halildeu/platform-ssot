import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from './ThemeProvider';

const meta: Meta<typeof ThemeProvider> = {
  component: ThemeProvider,
  title: 'Providers/ThemeProvider',
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
