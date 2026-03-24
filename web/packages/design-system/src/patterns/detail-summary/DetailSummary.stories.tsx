import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DetailSummary } from './DetailSummary';

const meta: Meta<typeof DetailSummary> = {
  title: 'Patterns/DetailSummary',
  component: DetailSummary,
  tags: ['autodocs'],
  argTypes: { disabled: { control: 'boolean' } },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof DetailSummary>;

export const Default: Story = {
  args: {
    title: 'Proje Detayi',
    description: 'Proje yonetim paneli ozet sayfasi.',
    entity: {
      title: 'Otonom Orkestrator',
      subtitle: 'Ana proje',
      items: [
        { key: 'owner', label: 'Sahip', value: 'Halil Kocoglu' },
        { key: 'status', label: 'Durum', value: 'Aktif', tone: 'success' as const },
        { key: 'created', label: 'Olusturulma', value: '15 Ocak 2024' },
      ],
      avatar: { name: 'HK' },
    },
    summaryItems: [
      { key: 'tasks', label: 'Gorevler', value: '48' },
      { key: 'completed', label: 'Tamamlanan', value: '36' },
      { key: 'coverage', label: 'Kapsam', value: '%75' },
    ],
    detailItems: [
      { key: 'framework', label: 'Framework', value: 'React + TypeScript' },
      { key: 'ci', label: 'CI/CD', value: 'GitHub Actions' },
    ],
  },
};

export const Minimal: Story = {
  args: {
    title: 'Minimal Detail',
    entity: {
      title: 'Simple Entity',
      items: [
        { key: 'status', label: 'Status', value: 'Draft' },
      ],
    },
    summaryItems: [
      { key: 'count', label: 'Items', value: '5' },
    ],
  },
};

export const WithManyItems: Story = {
  args: {
    title: 'Full Detail',
    description: 'Entity with many data points',
    entity: {
      title: 'Complex Entity',
      subtitle: 'Sub-category',
      items: [
        { key: 'a', label: 'Field A', value: 'Value A' },
        { key: 'b', label: 'Field B', value: 'Value B' },
        { key: 'c', label: 'Field C', value: 'Value C' },
        { key: 'd', label: 'Field D', value: 'Value D' },
      ],
    },
    summaryItems: [
      { key: 's1', label: 'Metric 1', value: '100' },
      { key: 's2', label: 'Metric 2', value: '200' },
      { key: 's3', label: 'Metric 3', value: '300' },
    ],
    detailItems: [
      { key: 'd1', label: 'Detail 1', value: 'Info' },
      { key: 'd2', label: 'Detail 2', value: 'Data' },
    ],
  },
};

export const WithTone: Story = {
  args: {
    title: 'Status Detail',
    entity: {
      title: 'Service Health',
      items: [
        { key: 'status', label: 'Status', value: 'Degraded', tone: 'warning' as const },
        { key: 'uptime', label: 'Uptime', value: '99.2%', tone: 'success' as const },
      ],
    },
    summaryItems: [
      { key: 'incidents', label: 'Incidents', value: '3' },
    ],
  },
};

export const WithDescription: Story = {
  args: {
    title: 'With Description',
    description: 'A detail view with full description text.',
    entity: {
      title: 'Entity',
      subtitle: 'Sub',
      items: [{ key: 'a', label: 'A', value: '1' }],
    },
    summaryItems: [{ key: 's', label: 'S', value: '2' }],
  },
};

export const NoSummary: Story = {
  args: {
    title: 'No Summary Items',
    entity: {
      title: 'Entity Only',
      items: [{ key: 'a', label: 'Field', value: 'Value' }],
    },
    summaryItems: [],
  },
};
