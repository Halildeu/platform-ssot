import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Badge } from '../packages/design-system/src/components/Badge';
import { Button } from '../packages/design-system/src/components/Button';
import { List } from '../packages/design-system/src/components/List';
import { Popover } from '../packages/design-system/src/components/Popover';
import { PromptComposer } from '../packages/design-system/src/components/PromptComposer';
import { RecommendationCard } from '../packages/design-system/src/components/RecommendationCard';
import { Skeleton } from '../packages/design-system/src/components/Skeleton';
import { Slider } from '../packages/design-system/src/components/Slider';
import { Spinner } from '../packages/design-system/src/components/Spinner';
import { Text } from '../packages/design-system/src/components/Text';
import { PageHeader } from '../packages/design-system/src/layout/PageHeader';

const meta: Meta = {
  title: 'UI Kit/InteractiveLiveDemoFoundations',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const recommendationBacklog = [
  {
    key: 'rec-1',
    title: 'PromptComposer release helper',
    description: 'AI authoring ve rollout notlari icin ortak prompt contract.',
    meta: 'stable',
    badges: ['ai', 'release'],
    tone: 'info' as const,
  },
  {
    key: 'rec-2',
    title: 'Popover quick actions',
    description: 'Inline preview, action menu ve guidance yuzeyi ayni primitive ile acilir.',
    meta: 'stable',
    badges: ['ops'],
    tone: 'success' as const,
  },
  {
    key: 'rec-3',
    title: 'Spinner + Skeleton loading language',
    description: 'Live demo workbench icinde bekleme ve placeholder durumu tek gorunur dilde tutulur.',
    meta: 'stable',
    badges: ['loading'],
    tone: 'warning' as const,
  },
];

const InteractiveLiveDemoCanvas = () => {
  const [selectedKey, setSelectedKey] = React.useState<React.Key>('rec-1');
  const [coverageTarget, setCoverageTarget] = React.useState(82);

  return (
    <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6">
        <PageHeader
          eyebrow="Interactive live demo surface"
          title="Prompt, recommendation ve loading primitive'leri ayni release workbench icinde"
          description="Bu harness, kalan live demo komponentlerini tek bir interactive canvas altinda toplar ve Storybook coverage tarayicisina dogrudan gorunur hale getirir."
          status={<Badge variant="success">live-demo</Badge>}
          meta={
            <>
              <Badge variant="info">story contract</Badge>
              <Badge variant="default">release cockpit</Badge>
              <Badge variant="warning">interactive</Badge>
            </>
          }
          actions={
            <>
              <Button fullWidth={false}>Preview ac</Button>
              <Button variant="secondary" fullWidth={false}>Manifest yenile</Button>
            </>
          }
          aside={
            <div className="rounded-[24px] border border-border-subtle bg-surface-default p-4">
              <Text as="div" className="text-sm font-semibold text-text-primary">
                Release target
              </Text>
              <Slider
                label="Coverage hedefi"
                description="Slider release hedefini ayni visual harness icinde gosterir."
                min={0}
                max={100}
                step={1}
                value={coverageTarget}
                onValueChange={setCoverageTarget}
                valueFormatter={(value) => `${value}%`}
                minLabel="0%"
                maxLabel="100%"
              />
            </div>
          }
        />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.42fr_0.58fr]">
          <section className="space-y-6 rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
            <List
              title="Interactive backlog"
              description="List, release cockpit icinde secilebilir recommendation setini tasir."
              items={recommendationBacklog}
              selectedKey={selectedKey}
              onItemSelect={setSelectedKey}
            />

            <div className="rounded-[24px] border border-border-subtle bg-surface-panel p-4">
              <Text as="div" className="text-sm font-semibold text-text-primary">
                Quick actions
              </Text>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Popover
                  title="Popover release actions"
                  defaultOpen
                  trigger={<Button variant="secondary" fullWidth={false}>Ops menu</Button>}
                  content={
                    <div className="space-y-2">
                      <Text variant="secondary" className="block text-sm leading-6">
                        Preview route, doctor sonucu ve publish artefact'i ayni kisa menude toplanir.
                      </Text>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="info">/admin/design-lab</Badge>
                        <Badge variant="success">doctor PASS</Badge>
                        <Badge variant="warning">gate PASS</Badge>
                      </div>
                    </div>
                  }
                />
                <Spinner mode="block" tone="neutral" label="Visual contract taraniyor" />
              </div>
            </div>

            <div className="rounded-[24px] border border-border-subtle bg-surface-panel p-4">
              <Text as="div" className="text-sm font-semibold text-text-primary">
                Loading language
              </Text>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <Skeleton lines={3} />
                <Skeleton variant="rect" className="h-28" />
                <Skeleton variant="pill" />
                <Spinner mode="overlay" label="Publish bundle hazirlaniyor" />
              </div>
            </div>
          </section>

          <section className="space-y-6 rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
            <RecommendationCard
              title="RecommendationCard rollout insight"
              summary="Live demo backlog sifirlandiginda release cockpit coverage ve evidence tarafini ayni karta baglar."
              recommendationType="Release insight"
              tone="success"
              confidenceLevel="high"
              confidenceScore={96}
              sourceCount={14}
              rationale={[
                'liveDemoWithoutStory backlog kapanir',
                'Storybook harness sayisi artar',
                'Full release gate tekrar yesile doner',
              ]}
              citations={['design-lab.index.json', 'ui-library-release-manifest.v1.json']}
              badges={[<Badge key="coverage" variant="success">coverage</Badge>]}
              primaryActionLabel="Accept"
              secondaryActionLabel="Inspect"
              footerNote="Owner: Platform UI"
            />

            <PromptComposer
              title="PromptComposer release note"
              description="PromptComposer, future-ready AI yardimli tasarim platformu icin rollout anlatimini ayni contract ile toplar."
              defaultSubject="Full package ui-library rollout"
              defaultValue="Stable, adopted ve live demo surface coverage artik tek release cockpit altinda toplanir. Consumer etki alanini ozetle ve migration risklerini cikar."
              defaultScope="release"
              defaultTone="strict"
              guardrails={['evidence-linked', 'consumer-aware', 'release-grade']}
              citations={['design-lab.index.json', 'ui-library-consumer-impact.v1.json']}
              footerNote="Prompt output'u migration ve release cockpit notlari icin temel olusturur."
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export const InteractiveLiveDemoWorkbench: Story = {
  render: () => <InteractiveLiveDemoCanvas />,
};
