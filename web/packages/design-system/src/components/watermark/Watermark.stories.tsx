import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Watermark } from './Watermark';

const meta: Meta<typeof Watermark> = {
  title: 'Components/Feedback/Watermark',
  component: Watermark,
  tags: ['autodocs'],
  argTypes: {
    rotate: { control: 'number' },
    fontSize: { control: 'number' },
    opacity: { control: 'number' },
  },
};
export default meta;
type Story = StoryObj<typeof Watermark>;

export const Default: Story = {
  args: {
    content: 'TASLAK',
    children: (
      <div style={{ height: 300, padding: 24, border: '1px solid var(--border-subtle)', borderRadius: 12 }}>
        <h3 style={{ margin: 0, fontSize: 18 }}>Belge Basligi</h3>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Bu belge taslak durumundadir ve henuz onaylanmamistir.
        </p>
      </div>
    ),
  },
};

export const MultilineContent: Story = {
  args: {
    content: ['GIZLI', 'Sirket Ici'],
    children: (
      <div style={{ height: 250, padding: 24, border: '1px solid var(--border-subtle)', borderRadius: 12 }}>
        <p style={{ fontSize: 14 }}>Gizli icerik alani.</p>
      </div>
    ),
  },
};

export const CustomStyle: Story = {
  args: {
    content: 'ORNEK',
    rotate: -30,
    fontSize: 20,
    opacity: 0.25,
    fontColor: '#3b82f6',
    children: (
      <div style={{ height: 200, padding: 24, border: '1px solid var(--border-subtle)', borderRadius: 12 }}>
        <p style={{ fontSize: 14 }}>Ozel stilli filigran.</p>
      </div>
    ),
  },
};
