import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import Button from '../packages/design-system/src/components/Button';
import { Checkbox } from '../packages/design-system/src/components/Checkbox';
import { Dropdown } from '../packages/design-system/src/components/Dropdown';
import { EmptyErrorLoading } from '../packages/design-system/src/components/EmptyErrorLoading';
import { Select } from '../packages/design-system/src/components/Select';
import { Tabs } from '../packages/design-system/src/components/Tabs';
import { Text } from '../packages/design-system/src/components/Text';
import { TextInput } from '../packages/design-system/src/components/TextInput';
import { FilterBar } from '../packages/design-system/src/layout/FilterBar';
import {
  PageLayout,
  createPageLayoutBreadcrumbItems,
  createPageLayoutPreset,
} from '../packages/design-system/src/layout/PageLayout';
import { ReportFilterPanel } from '../packages/design-system/src/layout/ReportFilterPanel';

const meta: Meta = {
  title: 'UI Kit/PageLayoutReporting',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const ReportWorkspaceCanvas = () => {
  const [query, setQuery] = React.useState('Design Lab');
  const [owner, setOwner] = React.useState('platform');
  const [includeArchived, setIncludeArchived] = React.useState(true);

  return (
    <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
      <PageLayout
        {...createPageLayoutPreset({ preset: 'ops-workspace', stickyHeader: false })}
        title="Reporting workspace"
        description="PageLayout ve ReportFilterPanel ayni raporlama ekraninda tekrar kullanilan release-grade temel surface alanlaridir."
        breadcrumbItems={createPageLayoutBreadcrumbItems([
          { title: 'Platform', path: '#' },
          { title: 'Reporting', path: '#' },
          { title: 'Workspace' },
        ])}
        secondaryNav={(
          <Tabs
            listLabel="Workspace tabs"
            items={[
              { value: 'overview', label: 'Overview' },
              { value: 'audit', label: 'Audit trail' },
              { value: 'export', label: 'Export queue' },
            ]}
          />
        )}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Dropdown
              trigger={<span>Gorunum</span>}
              items={[
                { key: 'overview', label: 'Overview' },
                { key: 'audit', label: 'Audit trail' },
                { key: 'export', label: 'Export backlog' },
              ]}
            />
            <Button variant="secondary">Taslak</Button>
            <Button>Yayinla</Button>
          </div>
        }
        filterBar={(
          <div className="space-y-3">
            <FilterBar
              onReset={() => {
                setQuery('');
                setOwner('all');
                setIncludeArchived(false);
              }}
              onSaveView={() => undefined}
              extra={<Text className="text-xs text-text-secondary">Kaydedilen gorunum: release-ops</Text>}
            >
              <Checkbox
                label="Arsiv kayitlarini dahil et"
                checked={includeArchived}
                onCheckedChange={setIncludeArchived}
                fullWidth={false}
              />
            </FilterBar>
            <ReportFilterPanel
              onSubmit={() => undefined}
              onReset={() => {
                setQuery('');
                setOwner('all');
              }}
            >
              <TextInput
                label="Arama"
                value={query}
                onValueChange={setQuery}
                placeholder="Recipe, component veya owner ara"
              />
              <Select
                label="Owner"
                value={owner}
                onValueChange={setOwner}
                options={[
                  { value: 'all', label: 'Tum ekipler' },
                  { value: 'platform', label: 'Platform UI' },
                  { value: 'reporting', label: 'Reporting' },
                  { value: 'ops', label: 'Ops' },
                ]}
              />
            </ReportFilterPanel>
          </div>
        )}
        detail={(
          <div className="space-y-4">
            <EmptyErrorLoading
              mode="empty"
              title="Filter preview"
              description="Secilen filtreler bu release dalga setinde eslesen bir backlog kaydi dondurmediginde ortak bos durum recipe'i kullanilir."
            />
            <div className="rounded-[24px] border border-border-subtle bg-surface-panel p-4">
              <Text as="div" className="text-sm font-semibold text-text-primary">
                Applied state
              </Text>
              <dl className="mt-3 space-y-2 text-sm text-text-secondary">
                <div className="flex items-center justify-between gap-3">
                  <dt>Query</dt>
                  <dd>{query || 'Yok'}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt>Owner</dt>
                  <dd>{owner}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt>Arsiv</dt>
                  <dd>{includeArchived ? 'Acik' : 'Kapali'}</dd>
                </div>
              </dl>
            </div>
          </div>
        )}
      >
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <section className="rounded-[24px] border border-border-subtle bg-surface-default p-5 shadow-sm">
            <Text as="div" className="text-sm font-semibold text-text-primary">
              Release queue
            </Text>
            <div className="mt-4 space-y-3">
              {[
                ['Wave 11 recipes', 'Ready for publish'],
                ['Theme token validation', 'Awaiting sign-off'],
                ['Consumer migration review', '6 app impacted'],
              ].map(([title, helper]) => (
                <div key={title} className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
                  <Text as="div" className="text-sm font-semibold text-text-primary">
                    {title}
                  </Text>
                  <Text variant="secondary" className="mt-1 block text-sm leading-6">
                    {helper}
                  </Text>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-border-subtle bg-surface-default p-5 shadow-sm">
            <Text as="div" className="text-sm font-semibold text-text-primary">
              Migration handoff
            </Text>
            <Text variant="secondary" className="mt-2 block text-sm leading-6">
              Bu harness, report ekranlarinin PageLayout ve ReportFilterPanel uzerinden standartlasan filtre ve rollout akisini gosterir.
            </Text>
            <div className="mt-4 rounded-2xl border border-border-subtle bg-surface-panel p-4">
              <Text as="div" className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
                Consumer note
              </Text>
              <Text className="mt-2 block text-sm text-text-primary">
                `mfe-reporting`, `mfe-users` ve `mfe-shell` benzeri ekranlar ayni surface alanlarini tuketir; parca degisince rollout tek paket uzerinden yayilir.
              </Text>
            </div>
          </section>
        </div>
      </PageLayout>
    </div>
  );
};

export const ReportingWorkspace: Story = {
  render: () => <ReportWorkspaceCanvas />,
};
