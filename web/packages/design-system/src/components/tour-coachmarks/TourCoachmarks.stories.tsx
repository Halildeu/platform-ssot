import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TourCoachmarks } from './TourCoachmarks';
import type { TourCoachmarkStep } from './TourCoachmarks';

const meta: Meta<typeof TourCoachmarks> = {
  title: 'Components/Feedback/TourCoachmarks',
  component: TourCoachmarks,
  tags: ['autodocs'],
  argTypes: {
    allowSkip: { control: 'boolean' },
    showProgress: { control: 'boolean' },
    mode: {
      control: 'select',
      options: ['guided', 'readonly'],
    },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof TourCoachmarks>;

const steps: TourCoachmarkStep[] = [
  { id: 'welcome', title: 'Hos Geldiniz', description: 'Bu tur size sistemi tanitacaktir.', tone: 'info' },
  { id: 'navigation', title: 'Navigasyon', description: 'Sol menuden sayfalara erisebilirsiniz.' },
  { id: 'dashboard', title: 'Kontrol Paneli', description: 'Genel istatistikleri burada gorebilirsiniz.', tone: 'success' },
  { id: 'settings', title: 'Ayarlar', description: 'Profil ve tercihlerinizi buradan yonetebilirsiniz.' },
];

export const Default: Story = {
  args: {
    steps,
    defaultOpen: true,
    showProgress: true,
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="button"], button, [data-testid], input, [tabindex]');
    if (el) (el as HTMLElement).click();
  },
};

export const WithSkip: Story = {
  args: {
    steps,
    defaultOpen: true,
    allowSkip: true,
  },
};

export const ReadonlyMode: Story = {
  args: {
    steps,
    defaultOpen: true,
    mode: 'readonly',
  },
};

export const CustomStep: Story = {
  args: {
    steps,
    defaultOpen: true,
    defaultStep: 2,
    showProgress: true,
  },
};

export const SingleStep: Story = {
  args: {
    steps: [steps[0]],
    defaultOpen: true,
  },
};

export const NoProgress: Story = {
  args: {
    steps,
    defaultOpen: true,
    showProgress: false,
  },
};
