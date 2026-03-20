import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { SectionTabs } from '../packages/design-system/src/components/SectionTabs';
import { Text } from '../packages/design-system/src/components/Text';

const meta: Meta<typeof SectionTabs> = {
  title: 'UI Kit/SectionTabs',
  component: SectionTabs,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof SectionTabs>;

const demoItems = [
  {
    value: 'general',
    label: 'General',
    description: 'Identity, release status and quick decision context',
  },
  {
    value: 'preview',
    label: 'Preview',
    description: 'Live demo and variant surface in a single active workspace',
  },
  {
    value: 'overview',
    label: 'Overview',
    description: 'Short summary, status and decision framing',
  },
  {
    value: 'api',
    label: 'API',
    description: 'Import, props, variant axes and state model',
  },
  {
    value: 'quality',
    label: 'Quality',
    description: 'Gate, regression and usage evidence',
  },
];

export const CompactScroll: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
      <div className="mx-auto max-w-6xl rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
        <SectionTabs items={demoItems} value="preview" />
        <div className="mt-6 rounded-[28px] border border-border-subtle bg-surface-panel p-6">
          <Text variant="secondary">
            SectionTabs, uzun aciklamali bolum sekmelerini dikey alani sisirmeden yatay scroll odakli kompakt bir yuzeyde toplar. Aciklamalar varsayilan olarak kucuk bilgi kapsulu halinde hover ile acilir.
          </Text>
        </div>
      </div>
    </div>
  ),
};

export const WrapLayout: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
        <SectionTabs
          items={demoItems}
          value="general"
          layout="auto"
          autoWrapBreakpoint="2xl"
          density="comfortable"
          descriptionVisibility="always"
        />
        <div className="mt-6 rounded-[28px] border border-border-subtle bg-surface-panel p-6">
          <Text variant="secondary">
            Auto layout, genis ekranda wrap duzenine gecip daha dar ekranlarda yatay scroll davranisini korur.
          </Text>
        </div>
      </div>
    </div>
  ),
};
