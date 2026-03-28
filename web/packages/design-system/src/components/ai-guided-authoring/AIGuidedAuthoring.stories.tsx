import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AIGuidedAuthoring } from './AIGuidedAuthoring';

const meta: Meta<typeof AIGuidedAuthoring> = {
  title: 'Components/AI/AIGuidedAuthoring',
  component: AIGuidedAuthoring,
  tags: ['autodocs'],
  argTypes: { disabled: { control: 'boolean' } },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof AIGuidedAuthoring>;

export const Default: Story = {
  args: {
    recommendations: [
      { id: '1', title: 'Basligi guncelle', summary: 'Baslik daha aciklayici olabilir.', confidenceLevel: 'high', confidenceScore: 92 },
      { id: '2', title: 'Kaynak ekle', summary: 'Daha fazla referans eklenmesi onerilir.', confidenceLevel: 'medium', confidenceScore: 68 },
    ],
  },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="button"], button, [data-testid], input, [tabindex]');
    if (el) (el as HTMLElement).click();
  },
};

export const WithConfidence: Story = {
  args: {
    confidenceLevel: 'high',
    confidenceScore: 95,
    sourceCount: 12,
    recommendations: [
      { id: '1', title: 'Performans iyilestirmesi', summary: 'Sorgu optimizasyonu onerilir.', confidenceLevel: 'very-high', confidenceScore: 98 },
    ],
  },
};

export const Empty: Story = {
  args: {
    recommendations: [],
  },
};

export const LowConfidence: Story = {
  args: {
    confidenceLevel: 'low',
    confidenceScore: 35,
    recommendations: [
      { id: '1', title: 'Veri dogrula', summary: 'Veriler yetersiz, dogrulama onerilir.', confidenceLevel: 'low', confidenceScore: 35 },
    ],
  },
};

export const ManyRecommendations: Story = {
  args: {
    recommendations: Array.from({ length: 8 }, (_, i) => ({
      id: String(i + 1),
      title: `Oneri ${i + 1}`,
      summary: `Detayli aciklama ${i + 1}.`,
      confidenceLevel: 'medium' as const,
      confidenceScore: 50 + i * 5,
    })),
  },
};

export const SingleRecommendation: Story = {
  args: {
    recommendations: [
      { id: '1', title: 'Tek oneri', summary: 'Yalnizca bir oneri mevcut.', confidenceLevel: 'very-high', confidenceScore: 99 },
    ],
    confidenceLevel: 'very-high',
    confidenceScore: 99,
  },
};
