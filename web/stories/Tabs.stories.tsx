import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Badge } from '../packages/design-system/src/components/Badge';
import { Tabs } from '../packages/design-system/src/components/Tabs';
import { Text } from '../packages/design-system/src/components/Text';

const meta: Meta<typeof Tabs> = {
  title: 'UI Kit/Tabs',
  component: Tabs,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const RouterAwareWorkspace: Story = {
  render: () => {
    const [value, setValue] = React.useState('preview');

    return (
      <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
        <div className="mx-auto max-w-6xl rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
          <Text as="div" className="text-lg font-semibold text-text-primary">
            Router-aware workspace tabs
          </Text>
          <Text variant="secondary" className="mt-2 block max-w-4xl leading-7">
            `getTabLinkProps`, sekmeleri yalniz stateful button degil, route-aware navigation dugumleri olarak da
            calistirir. Bu model, React Aria ve Mantine benchmark’inda one cikan router-first sekme davranisina yakindir.
          </Text>
          <div className="mt-6 rounded-[28px] border border-border-subtle bg-surface-panel p-6">
            <Tabs
              value={value}
              onValueChange={setValue}
              variant="scrollable"
              appearance="underline"
              activationMode="automatic"
              showScrollButtons="auto"
              showIndicator
              listLabel="Workspace tabs"
              getTabLinkProps={({ value: tabValue }) => ({ href: `/design-lab/${tabValue}` })}
              tabBarExtraContent={{
                end: <Badge variant="info">Route-aware</Badge>,
              }}
              items={[
                { value: 'overview', label: 'Overview', content: <Text variant="secondary">Workspace ozeti.</Text> },
                {
                  value: 'preview',
                  label: 'Preview',
                  badge: <Badge variant="success">live</Badge>,
                  content: <Text variant="secondary">Canli preview ve benchmark yuzeyi.</Text>,
                },
                { value: 'api', label: 'API', content: <Text variant="secondary">Public API authority.</Text> },
                { value: 'quality', label: 'Quality', content: <Text variant="secondary">Regression ve quality gates.</Text> },
                { value: 'adoption', label: 'Adoption', content: <Text variant="secondary">Consumer adoption backlog’u.</Text> },
              ]}
            />
          </div>
        </div>
      </div>
    );
  },
};

export const ManualActivationReview: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
        <Text as="div" className="text-lg font-semibold text-text-primary">
          Manual activation review tabs
        </Text>
        <Text variant="secondary" className="mt-2 block max-w-4xl leading-7">
          `activationMode=&quot;manual&quot;` ve `selectionFollowsFocus=false`, focus hareketi ile icerik aktivasyonunu
          ayirir. Review ve dense governance yuzeylerinde bu ayrim daha kontrollu bir klavye davranisi verir.
        </Text>
        <div className="mt-6 rounded-[28px] border border-border-subtle bg-surface-panel p-6">
          <Tabs
            defaultValue="summary"
            activationMode="manual"
            selectionFollowsFocus={false}
            appearance="pill"
            listLabel="Review tabs"
            items={[
              {
                value: 'summary',
                label: 'Summary',
                description: 'Klavye ile gezinirken panel aktivasyonu ayrik kalir.',
                content: <Text variant="secondary">Ozet review notlari ve owner kararlari.</Text>,
              },
              {
                value: 'evidence',
                label: 'Evidence',
                description: 'Source packs ve policy kanitlari.',
                content: <Text variant="secondary">Evidence stack ve source diff gorunumu.</Text>,
              },
              {
                value: 'handoff',
                label: 'Handoff',
                description: 'Consumer teslim maddeleri.',
                content: <Text variant="secondary">Release ve handoff checklist’i.</Text>,
              },
            ]}
          />
        </div>
      </div>
    </div>
  ),
};

export const NoLoopVertical: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
        <Text as="div" className="text-lg font-semibold text-text-primary">
          Non-looping vertical tabs
        </Text>
        <Text variant="secondary" className="mt-2 block max-w-4xl leading-7">
          `loopFocus=false`, Base UI benchmark’indeki non-wrapping focus davranisina yaklasir. Ozellikle denetimli
          dikey bilgi mimarisi gorunumlerinde son sekmeden basa donmemek daha tahmin edilebilir olabilir.
        </Text>
        <div className="mt-6 rounded-[28px] border border-border-subtle bg-surface-panel p-6">
          <Tabs
            orientation="vertical"
            activationMode="manual"
            loopFocus={false}
            selectionFollowsFocus={false}
            listLabel="Information architecture"
            items={[
              { value: 'foundations', label: 'Foundations', content: <Text variant="secondary">Token ve surface contracts.</Text> },
              { value: 'patterns', label: 'Patterns', content: <Text variant="secondary">Navigation ve data recipes.</Text> },
              { value: 'governance', label: 'Governance', content: <Text variant="secondary">Quality gates ve approval rails.</Text> },
            ]}
          />
        </div>
      </div>
    </div>
  ),
};
