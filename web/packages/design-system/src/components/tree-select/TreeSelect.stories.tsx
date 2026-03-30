import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TreeSelect } from './TreeSelect';

const sampleData = [
  { value: 'eng', label: 'Muhendislik', children: [
    { value: 'fe', label: 'Frontend' },
    { value: 'be', label: 'Backend' },
    { value: 'devops', label: 'DevOps' },
  ]},
  { value: 'design', label: 'Tasarim', children: [
    { value: 'ux', label: 'UX Tasarim' },
    { value: 'ui', label: 'UI Tasarim' },
  ]},
  { value: 'pm', label: 'Urun Yonetimi' },
  { value: 'qa', label: 'Kalite Guvence', disabled: true },
];

const meta: Meta<typeof TreeSelect> = {
  title: 'Components/Components/TreeSelect',
  component: TreeSelect,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    multiple: { control: 'boolean' },
    searchable: { control: 'boolean' },
    treeCheckable: { control: 'boolean' },
    treeDefaultExpandAll: { control: 'boolean' },
  },
  decorators: [(Story) => <div style={{ padding: '1rem', maxWidth: 400 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof TreeSelect>;

export const Default: Story = { args: { data: sampleData, placeholder: 'Departman secin' } };
export const Multiple: Story = { args: { data: sampleData, multiple: true, placeholder: 'Departmanlar secin' } };
export const Searchable: Story = { args: { data: sampleData, searchable: true, placeholder: 'Ara ve sec...' } };
export const Checkable: Story = { args: { data: sampleData, treeCheckable: true, multiple: true, treeDefaultExpandAll: true } };
export const ExpandAll: Story = { args: { data: sampleData, treeDefaultExpandAll: true } };
