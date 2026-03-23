import type { Meta, StoryObj } from '@storybook/react';
import { DesignSystemProvider } from './DesignSystemProvider';

const meta: Meta<typeof DesignSystemProvider> = {
  component: DesignSystemProvider,
  title: 'Providers/DesignSystemProvider',
  argTypes: { disabled: { control: 'boolean' } },
};

export default meta;
type Story = StoryObj<typeof DesignSystemProvider>;

export const Default: Story = {
  args: {
    children: 'Design system content',
  },
};

export const WithTurkishLocale: Story = {
  args: {
    locale: 'tr',
    children: 'Turkish locale content',
  },
};

export const WithRTL: Story = {
  args: {
    locale: 'ar',
    direction: 'rtl',
    children: 'Arabic RTL content',
  },
};

export const WithCustomTheme: Story = {
  args: {
    defaultTheme: { appearance: 'elevated' },
    children: 'Custom theme content',
  },
};

export const WithPersianLocale: Story = {
  args: {
    locale: 'fa',
    children: 'Persian locale content — auto-detects RTL',
  },
};

export const MinimalNoProps: Story = {
  args: {
    children: 'Default English LTR content with no overrides',
  },
};
