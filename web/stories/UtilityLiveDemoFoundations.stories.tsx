import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Badge } from '../packages/ui-kit/src/components/Badge';
import { ContextMenu } from '../packages/ui-kit/src/components/ContextMenu';
import { DatePicker } from '../packages/ui-kit/src/components/DatePicker';
import { Descriptions } from '../packages/ui-kit/src/components/Descriptions';
import { Divider } from '../packages/ui-kit/src/components/Divider';
import { IconButton } from '../packages/ui-kit/src/components/IconButton';
import { JsonViewer } from '../packages/ui-kit/src/components/JsonViewer';
import { LinkInline } from '../packages/ui-kit/src/components/LinkInline';
import { Text } from '../packages/ui-kit/src/components/Text';
import { EntitySummaryBlock } from '../packages/ui-kit/src/layout/EntitySummaryBlock';

const meta: Meta = {
  title: 'UI Kit/UtilityLiveDemoFoundations',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const UtilityLiveDemoCanvas = () => {
  const [selectedDate, setSelectedDate] = React.useState('2026-03-10');

  return (
    <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6">
        <section className="rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
          <Text as="div" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
            Utility live demo surface
          </Text>
          <Text as="h2" className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-text-primary">
            Utility primitive’ler ve entity summary yüzeyi ayni canlı demo kokpitinde doğrulanıyor
          </Text>
        </section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.96fr_1.04fr]">
          <section className="space-y-6 rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
            <EntitySummaryBlock
              title="Design Lab release entity"
              subtitle="EntitySummaryBlock, owner, lifecycle ve rollout notlarini tek summary shell altinda toplar."
              badge={<Badge tone="success">live-demo</Badge>}
              avatar={{ name: 'Platform UI' }}
              actions={
                <div className="flex items-center gap-2">
                  <IconButton icon={<span>✎</span>} label="Duzenle" />
                  <IconButton icon={<span>↗</span>} label="Ac" variant="secondary" />
                </div>
              }
              items={[
                { key: 'version', label: 'Version', value: '1.1.0', helper: 'Current published channel', tone: 'success' },
                { key: 'route', label: 'Preview route', value: '/admin/design-lab', helper: 'Shell admin surface', tone: 'info' },
                { key: 'owner', label: 'Owner', value: 'Platform UI', helper: 'Release steward', tone: 'default' },
                { key: 'scope', label: 'Scope', value: 'recipes + live demos', helper: 'Single package rollout', tone: 'warning' },
              ]}
            />

            <Divider label="Utility controls" />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[0.52fr_0.48fr]">
              <DatePicker
                label="Release date"
                description="DatePicker, release takvimi ve wave freeze tarihi gibi planlama yüzeylerinde kullanılır."
                value={selectedDate}
                onValueChange={setSelectedDate}
              />

              <Descriptions
                title="Release metadata"
                description="Descriptions, kritik rollout detaylarini kisa kartlar halinde okutur."
                columns={1}
                density="compact"
                items={[
                  { key: 'harness', label: 'Harness', value: '12', helper: 'Storybook story count', tone: 'success' },
                  { key: 'coverage', label: 'Coverage', value: '60%', helper: 'Visual component coverage', tone: 'info' },
                ]}
              />
            </div>

            <JsonViewer
              title="Live demo evidence payload"
              description="JsonViewer, generated visual summary ve release evidence setini okunabilir ağaç halinde gösterir."
              value={{
                previewRoute: '/admin/design-lab',
                metrics: {
                  storyCoveragePercent: 60,
                  releaseReadyCoveragePercent: 100,
                  adoptedCoveragePercent: 100,
                },
                backlog: {
                  stableWithoutStory: [],
                  adoptedWithoutStory: [],
                },
              }}
              defaultExpandedDepth={2}
              maxHeight={320}
            />
          </section>

          <section className="space-y-6 rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
            <div className="space-y-3">
              <Text as="div" className="text-sm font-semibold text-text-primary">
                Navigation and actions
              </Text>
              <Text variant="secondary" className="block text-sm leading-6">
                LinkInline, ContextMenu ve IconButton aynı toolbar diliyle bir arada çalışır.
              </Text>
              <div className="flex flex-wrap items-center gap-3">
                <LinkInline href="/admin/design-lab" current>
                  Design Lab route
                </LinkInline>
                <LinkInline href="https://github.com/Halildeu/frontend" external tone="secondary">
                  Repo evidence
                </LinkInline>
                <Divider orientation="vertical" decorative className="mx-1 h-8" />
                <ContextMenu
                  title="Release actions"
                  defaultOpen
                  items={[
                    {
                      key: 'refresh',
                      label: 'Manifest yenile',
                      description: 'release:ui-library:manifest artefactini yeniden uret',
                      shortcut: 'G M',
                    },
                    {
                      key: 'doctor',
                      label: 'Frontend doctor',
                      description: 'ui-library preset ile shell ve scenario zincirini dogrula',
                      shortcut: 'G D',
                    },
                    {
                      key: 'archive',
                      label: 'Eski preview artik yok',
                      description: 'deprecated route kaydini temizle',
                      shortcut: 'G X',
                      danger: true,
                    },
                  ]}
                />
              </div>
            </div>

            <div className="rounded-[24px] border border-border-subtle bg-surface-panel p-4">
              <Text as="div" className="text-sm font-semibold text-text-primary">
                Inline release note
              </Text>
              <Text variant="secondary" className="mt-2 block text-sm leading-6">
                Utility primitive’ler, tasarım kütüphanesinin yalnız görsel kartları değil, günlük rollout ve governance
                iş akışlarını da merkezden yönetebilmesi için gerekli yüzeyi sağlar.
              </Text>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export const UtilityLiveDemoMatrix: Story = {
  render: () => <UtilityLiveDemoCanvas />,
};
