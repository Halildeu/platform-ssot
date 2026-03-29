import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Rating } from './Rating';

const meta: Meta<typeof Rating> = {
  title: 'Components/DataDisplay/Rating',
  component: Rating,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    max: { control: { type: 'number', min: 1, max: 10 } },
    allowHalf: { control: 'boolean' },
    allowClear: { control: 'boolean' },
    showValue: { control: 'boolean' },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Rating>;

export const Default: Story = {
  args: {
    defaultValue: 3,
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState(4);
    return (
      <div>
        <Rating value={value} onValueChange={setValue} showValue />
        <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
          Secilen deger: {value}
        </div>
      </div>
    );
  },
};

export const HalfStars: Story = {
  args: {
    defaultValue: 3.5,
    allowHalf: true,
    showValue: true,
  },
};

export const WithLabels: Story = {
  args: {
    defaultValue: 3,
    labels: {
      1: 'Cok Kotu',
      2: 'Kotu',
      3: 'Orta',
      4: 'Iyi',
      5: 'Mukemmel',
    },
  },
};

export const CustomColors: Story = {
  args: {
    defaultValue: 4,
    colors: ['var(--state-danger-text)', 'var(--state-warning-text)', 'var(--state-warning-text)', 'var(--state-success-text)', 'var(--state-success-text)'],
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, width: 60 }}>Kucuk:</span>
        <Rating size="sm" defaultValue={3} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, width: 60 }}>Orta:</span>
        <Rating size="md" defaultValue={3} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, width: 60 }}>Buyuk:</span>
        <Rating size="lg" defaultValue={3} />
      </div>
    </div>
  ),
};

export const Max10: Story = {
  name: '10 Yildiz',
  args: {
    max: 10,
    defaultValue: 7,
    showValue: true,
    size: 'sm',
  },
};

export const ReadOnly: Story = {
  args: {
    defaultValue: 4.5,
    allowHalf: true,
    showValue: true,
    access: 'readonly',
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: 2,
    access: 'disabled',
  },
};

export const WithFormatter: Story = {
  args: {
    defaultValue: 4,
    showValue: true,
    valueFormatter: (v: number) => `${v} / 5 puan`,
  },
};

export const UrunDegerlendirmesi: Story = {
  name: 'Urun Degerlendirmesi',
  render: () => {
    const [rating, setRating] = useState(0);
    return (
      <div style={{ maxWidth: 360 }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>
          Bu urunu nasil degerlendirirsiniz?
        </div>
        <Rating
          value={rating}
          onValueChange={setRating}
          size="lg"
          labels={{
            1: 'Cok Kotu',
            2: 'Kotu',
            3: 'Fena Degil',
            4: 'Iyi',
            5: 'Harika',
          }}
        />
        {rating > 0 && (
          <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
            Degerlendirmeniz icin tesekkur ederiz!
          </div>
        )}
      </div>
    );
  },
};
