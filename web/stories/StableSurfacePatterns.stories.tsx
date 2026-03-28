import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { ApprovalReview } from '../packages/design-system/src/components/ApprovalReview';
import { Badge } from '../packages/design-system/src/components/Badge';
import { Radio } from '../packages/design-system/src/components/Radio';
import { SearchFilterListing } from '../packages/design-system/src/components/SearchFilterListing';
import { Switch } from '../packages/design-system/src/components/Switch';
import { Tabs } from '../packages/design-system/src/components/Tabs';
import { Text } from '../packages/design-system/src/components/Text';
import { TextArea } from '../packages/design-system/src/components/TextArea';

const meta: Meta = {
  title: 'UI Kit/StableSurfacePatterns',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const StableSurfaceCanvas = () => {
  const [channel, setChannel] = React.useState('stable');
  const [notifyConsumers, setNotifyConsumers] = React.useState(true);
  const [notes, setNotes] = React.useState(
    'Stable rollout oncesi visual harness, migration impact ve release gate kanitlarini ayni cockpit altinda topla.',
  );
  const [activeTab, setActiveTab] = React.useState('summary');

  return (
    <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-6 rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
          <div>
            <Text as="div" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
              Stable release controls
            </Text>
            <Text as="h2" className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-text-primary">
              Tabs, Radio, Switch ve TextArea ayni rollout hazirlik akisini besliyor
            </Text>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            appearance="pill"
            items={[
              {
                value: 'summary',
                label: 'Summary',
                badge: <Badge variant="success">Stable</Badge>,
                content: (
                  <div className="space-y-4 rounded-[24px] border border-border-subtle bg-surface-panel p-4">
                    <Radio
                      name="release-channel"
                      label="Stable channel"
                      checked={channel === 'stable'}
                      onCheckedChange={() => setChannel('stable')}
                    />
                    <Radio
                      name="release-channel"
                      label="Candidate channel"
                      checked={channel === 'candidate'}
                      onCheckedChange={() => setChannel('candidate')}
                    />
                    <Switch
                      label="Consumer migration duyurusu acik"
                      checked={notifyConsumers}
                      onCheckedChange={setNotifyConsumers}
                    />
                    <TextArea
                      label="Release notes"
                      value={notes}
                      onValueChange={setNotes}
                      rows={5}
                      resize="auto"
                      showCount
                    />
                  </div>
                ),
              },
              {
                value: 'backlog',
                label: 'Backlog',
                content: (
                  <div className="rounded-[24px] border border-border-subtle bg-surface-panel p-4">
                    <Text as="div" className="text-sm font-semibold text-text-primary">
                      Remaining stable backlog
                    </Text>
                    <Text variant="secondary" className="mt-2 block text-sm leading-6">
                      Bu harness ile temel stable kontroller gorsel kontrata alinmis durumda. Agir data ve entity recipe'leri ayri turda ele alinacak.
                    </Text>
                  </div>
                ),
              },
            ]}
          />

          <SearchFilterListing
            eyebrow="Recipe"
            title="SearchFilterListing release recipe"
            description="Header, filter ve result shell ayni stable recipe icinde yeniden kullanilir."
            meta="wave_11_recipes"
            status={<Badge variant="success">Ready</Badge>}
            filters={(
              <>
                <div className="min-w-[200px]">
                  <Text className="text-sm text-text-secondary">Channel: {channel}</Text>
                </div>
                <div className="min-w-[220px]">
                  <Text className="text-sm text-text-secondary">
                    Notify consumers: {notifyConsumers ? 'Acik' : 'Kapali'}
                  </Text>
                </div>
              </>
            )}
            onReset={() => {
              setChannel('stable');
              setNotifyConsumers(true);
            }}
            onSaveView={() => undefined}
            filterExtra={<Badge variant="info">release-ops</Badge>}
            summaryItems={[
              { label: 'Stable', value: '34', helper: 'Wide adoption ready' },
              { label: 'Coverage', value: 'guncel', helper: 'Storybook visual contract' },
              { label: 'Apps', value: '6', helper: 'Consumer impact scope' },
            ]}
            items={[
              {
                key: 'release-gate',
                title: 'Release gate',
                description: 'doctor + wave gate + visual contract',
                meta: 'platform',
                badges: ['Green'],
                tone: 'success',
              },
              {
                key: 'migration',
                title: 'Migration summary',
                description: 'single-app blast radius ve adopted coverage birlikte izleniyor',
                meta: 'ops',
                badges: ['Tracked'],
                tone: 'info',
              },
            ]}
          />
        </section>

        <section className="space-y-6 rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
          <ApprovalReview
            title="ApprovalReview publish checkpoint"
            description="Stable release oncesi insan onayi, citation panel ve audit timeline ayni review recipe altinda toplanir."
            checkpoint={{
              title: 'Publish checkpoint',
              summary: 'Visual contract, migration impact ve release evidence seti tam.',
              status: 'approved',
              evidenceItems: ['release-manifest', 'frontend-doctor', 'storybook-static'],
              steps: [
                { key: 'visual', label: 'Visual harness', helper: 'All required stories present', status: 'approved' },
                { key: 'doctor', label: 'Frontend doctor', helper: 'ui-library preset PASS', status: 'approved' },
                { key: 'impact', label: 'Consumer impact', helper: '6 app scope review edildi', status: 'ready' },
              ],
              citations: ['design-lab.index.json', 'ui-library-release-manifest.v1.json'],
              footerNote: 'Release owner: Platform UI',
            }}
            citations={[
              {
                id: 'design-lab',
                title: 'Design Lab summary',
                excerpt: 'storybook coverage, release-ready coverage ve adopted coverage ayni metadata altinda sync edilir.',
                source: 'apps/mfe-shell/src/pages/admin/design-lab.index.json',
                locator: 'visualContract.summary',
                kind: 'code',
              },
              {
                id: 'release-manifest',
                title: 'Release manifest',
                excerpt: 'consumer impact, migration summary ve visual contract release artefact icinde saklanir.',
                source: 'web/test-results/releases/ui-library/latest/ui-library-release-manifest.v1.json',
                locator: 'latestRelease.catalogMetrics',
                kind: 'log',
              },
            ]}
            auditItems={[
              {
                id: 'ai-review',
                actor: 'ai',
                title: 'Coverage backlog scan',
                timestamp: '11:08',
                summary: 'Stable surface icin story eksikleri daraltildi.',
                status: 'approved',
              },
              {
                id: 'human-signoff',
                actor: 'human',
                title: 'Release sign-off',
                timestamp: '11:09',
                summary: 'Publish adimi icin release gate PASS.',
                status: 'approved',
              },
            ]}
            defaultSelectedCitationId="design-lab"
            defaultSelectedAuditId="human-signoff"
          />
        </section>
      </div>
    </div>
  );
};

export const StableSurfaceMatrix: Story = {
  render: () => <StableSurfaceCanvas />,
};
