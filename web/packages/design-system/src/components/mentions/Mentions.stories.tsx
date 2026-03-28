import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Mentions } from './Mentions';
import type { MentionOption } from './Mentions';

const meta: Meta<typeof Mentions> = {
  title: 'Components/Form/Mentions',
  component: Mentions,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    error: { control: 'boolean' },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Mentions>;

const users: MentionOption[] = [
  { key: 'halil', label: 'Halil Kocoglu', description: 'Yazilim Muhendisi' },
  { key: 'ayse', label: 'Ayse Demir', description: 'Tasarimci' },
  { key: 'mehmet', label: 'Mehmet Kaya', description: 'Proje Yoneticisi' },
  { key: 'zeynep', label: 'Zeynep Arslan', description: 'QA Muhendisi' },
];

export const Default: Story = {
  args: {
    options: users,
    label: 'Yorum',
    placeholder: '@ile kullanici etiketleyin...',
  },
};

export const WithError: Story = {
  args: {
    options: users,
    label: 'Mesaj',
    error: true,
    description: 'Mesaj alani bos birakilamaz.',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Mentions key={size} options={users} size={size} label={size} placeholder="Bir sey yazin..." />
      ))}
    </div>
  ),
};
