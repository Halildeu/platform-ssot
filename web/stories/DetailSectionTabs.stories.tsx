import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { DetailSectionTabs } from '../packages/design-system/src/components/DetailSectionTabs';
import { Text } from '../packages/design-system/src/components/Text';

const meta: Meta<typeof DetailSectionTabs> = {
  title: 'UI Kit/DetailSectionTabs',
  component: DetailSectionTabs,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof DetailSectionTabs>;

const demoTabs = [
  {
    id: 'general',
    label: 'General',
    description: 'Identity, release status and quick decision context',
  },
  {
    id: 'preview',
    label: 'Preview',
    description: 'Live demo and variant surface in a single active workspace',
  },
  {
    id: 'overview',
    label: 'Overview',
    description: 'Short summary, status and decision framing',
  },
  {
    id: 'api',
    label: 'API',
    description: 'Import, props, variant axes and state model',
  },
  {
    id: 'quality',
    label: 'Quality',
    description: 'Gate, regression and usage evidence',
  },
];

export const DesignLabShell: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
      <div className="mx-auto max-w-6xl rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
        <DetailSectionTabs tabs={demoTabs} activeTabId="preview" onTabChange={() => undefined} />
        <div className="mt-6 rounded-[28px] border border-border-subtle bg-surface-panel p-6">
          <Text variant="secondary">
            DetailSectionTabs, SectionTabs primitive&apos;ini documentation/detail workspace kullanimi icin opinionated bir recipe olarak sabitler. Varsayilan olarak tooltip aciklamali, kompakt ve daha erken wrap eden bir davranisla gelir.
          </Text>
        </div>
      </div>
    </div>
  ),
};
