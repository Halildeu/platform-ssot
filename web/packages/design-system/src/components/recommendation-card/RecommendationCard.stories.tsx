import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RecommendationCard } from './RecommendationCard';

const meta: Meta<typeof RecommendationCard> = {
  title: 'Components/AI/RecommendationCard',
  component: RecommendationCard,
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'select',
      options: ['info', 'success', 'warning'],
    },
    compact: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof RecommendationCard>;

export const Default: Story = {
  args: {
    title: 'Performans Iyilestirmesi',
    summary: 'Veritabani sorgularinda N+1 problemi tespit edildi. Eager loading kullanilmasi onerilir.',
    confidenceLevel: 'high',
    confidenceScore: 92,
    sourceCount: 5,
    rationale: ['N+1 sorgu deseni tespit edildi', 'Eager loading %40 performans artisi saglayabilir'],
  },
};

export const Warning: Story = {
  args: {
    title: 'Guvenlik Uyarisi',
    summary: 'Kullanilmayan API anahtarlari tespit edildi. Kaldirilmasi onerilir.',
    tone: 'warning',
    confidenceLevel: 'medium',
    confidenceScore: 68,
  },
};

export const Success: Story = {
  args: {
    title: 'Test Kapsami Basarili',
    summary: 'Kod kapsami %85 esigi gecti. Tebrikler!',
    tone: 'success',
    confidenceLevel: 'very-high',
    confidenceScore: 99,
  },
};

export const Compact: Story = {
  args: {
    title: 'Hizli Oneri',
    summary: 'Index eklenmesi gerekiyor.',
    compact: true,
    confidenceLevel: 'high',
  },
};

export const WithCitations: Story = {
  args: {
    title: 'Uyumluluk Kontrolu',
    summary: 'KVKK gereksinimlerine uygun degisiklikler onerilir.',
    citations: ['KVKK Rehberi v3.0', 'Sirket Guvenlik Politikasi'],
    confidenceLevel: 'high',
    confidenceScore: 88,
  },
};
