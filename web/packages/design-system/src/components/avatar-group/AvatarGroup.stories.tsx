import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AvatarGroup } from './AvatarGroup';
import type { AvatarGroupItem } from './AvatarGroup';

const meta: Meta<typeof AvatarGroup> = {
  title: 'Components/Data/AvatarGroup',
  component: AvatarGroup,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    shape: {
      control: 'select',
      options: ['circle', 'square'],
    },
    spacing: {
      control: 'select',
      options: ['tight', 'normal', 'loose'],
    },
    max: { control: 'number' },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof AvatarGroup>;

const users: AvatarGroupItem[] = [
  { key: '1', name: 'Ali Yilmaz' },
  { key: '2', name: 'Ayse Demir' },
  { key: '3', name: 'Mehmet Kaya' },
  { key: '4', name: 'Zeynep Ozturk' },
  { key: '5', name: 'Can Arslan' },
  { key: '6', name: 'Elif Sahin' },
];

export const Default: Story = {
  args: {
    items: users,
  },
};

export const WithMax: Story = {
  args: {
    items: users,
    max: 3,
  },
};

export const LargeSize: Story = {
  args: {
    items: users.slice(0, 4),
    size: 'lg',
  },
};

export const SquareShape: Story = {
  args: {
    items: users.slice(0, 4),
    shape: 'square',
  },
};

export const AllSpacings: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(['tight', 'normal', 'loose'] as const).map((spacing) => (
        <div key={spacing}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{spacing}</div>
          <AvatarGroup items={users.slice(0, 4)} spacing={spacing} />
        </div>
      ))}
    </div>
  ),
};
