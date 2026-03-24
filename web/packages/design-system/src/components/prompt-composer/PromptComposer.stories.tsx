import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PromptComposer } from './PromptComposer';

const meta: Meta<typeof PromptComposer> = {
  title: 'Components/AI/PromptComposer',
  component: PromptComposer,
  tags: ['autodocs'],
  argTypes: { disabled: { control: 'boolean' } },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof PromptComposer>;

export const Default: Story = {
  args: {},
};

export const WithGuardrails: Story = {
  args: {
    guardrails: ['PII icermemeli', 'Yalnizca onaylanmis veri kaynaklari kullanilmali', 'Maks 500 kelime'],
  },
};

export const WithCitations: Story = {
  args: {
    citations: ['Guvenlik Politikasi v2.1', 'API Dokumantasyonu', 'Uyumluluk Rehberi'],
  },
};

export const ApprovalScope: Story = {
  args: {
    defaultScope: 'approval',
    defaultTone: 'strict',
  },
};

export const StrictTone: Story = {
  args: {
    defaultTone: 'strict',
    guardrails: ['Yalnizca dogrulanmis veriler kullanilmali'],
  },
};

export const FriendlyTone: Story = {
  args: {
    defaultTone: 'friendly',
    citations: ['Kullanici Kilavuzu v1.0'],
  },
};
