import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AIGuidedAuthoring } from './AIGuidedAuthoring';

const meta: Meta<typeof AIGuidedAuthoring> = {
  title: 'Components/AI/AIGuidedAuthoring',
  component: AIGuidedAuthoring,
  tags: ['autodocs'],
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
