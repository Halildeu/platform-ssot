import type { Meta, StoryObj } from '@storybook/react';
import { LocaleProvider } from './LocaleProvider';

const meta: Meta<typeof LocaleProvider> = {
  component: LocaleProvider,
  title: 'Providers/LocaleProvider',
};

export default meta;
type Story = StoryObj<typeof LocaleProvider>;

export const Default: Story = {
  args: {
    locale: 'en',
    children: 'English content',
  },
};

export const Turkish: Story = {
  args: {
    locale: 'tr',
    children: 'Turkish locale content',
  },
};

export const ArabicRTL: Story = {
  args: {
    locale: 'ar',
    children: 'Arabic locale — auto-detects RTL direction',
  },
};
