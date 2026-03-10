import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Badge } from '../packages/ui-kit/src/components/Badge';
import { Button } from '../packages/ui-kit/src/components/Button';
import { Steps } from '../packages/ui-kit/src/components/Steps';
import { TableSimple } from '../packages/ui-kit/src/components/TableSimple';
import { TimePicker } from '../packages/ui-kit/src/components/TimePicker';
import { Tooltip } from '../packages/ui-kit/src/components/Tooltip';
import { TourCoachmarks } from '../packages/ui-kit/src/components/TourCoachmarks';
import { Tree } from '../packages/ui-kit/src/components/Tree';
import { TreeTable } from '../packages/ui-kit/src/components/TreeTable';
import { Upload } from '../packages/ui-kit/src/components/Upload';
import { Text } from '../packages/ui-kit/src/components/Text';
import { SummaryStrip } from '../packages/ui-kit/src/layout/SummaryStrip/SummaryStrip';

const meta: Meta = {
  title: 'UI Kit/DataLiveDemoFoundations',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const rolloutTree = [
  {
    key: 'wave-11',
    label: 'Wave 11',
    description: 'Theme preset ve recipe rollout paketi.',
    meta: 'active',
    badges: ['wave'],
    children: [
      {
        key: 'recipes',
        label: 'Recipes',
        description: 'Search filter ve dashboard recipes coverage altinda.',
        meta: 'stable',
        badges: ['stable'],
      },
      {
        key: 'live-demo',
        label: 'Live demos',
        description: 'Storybook harness ve Design Lab demo surface ayni anda guncel.',
        meta: 'live',
        badges: ['demo'],
      },
    ],
  },
];

const rolloutRows = [
  { stage: 'Build', owner: 'Platform UI', evidence: 'storybook-static', status: 'PASS' },
  { stage: 'Doctor', owner: 'Shell', evidence: 'frontend-doctor', status: 'PASS' },
  { stage: 'Release', owner: 'UI Kit', evidence: 'release-manifest', status: 'PASS' },
];

const treeTableNodes = [
  {
    key: 'consumer-apps',
    label: 'Consumer apps',
    description: 'Tuketici uygulamalar icin adoption ozetleri.',
    meta: '6 app',
    badges: ['adoption'],
    data: { risk: 'low', coverage: '100%' },
    children: [
      {
        key: 'mfe-shell',
        label: 'mfe-shell',
        description: 'Admin route ve release cockpit.',
        meta: 'internal',
        badges: ['shell'],
        data: { risk: 'low', coverage: '100%' },
      },
      {
        key: 'reporting',
        label: 'reporting',
        description: 'Page layout ve report filters.',
        meta: 'external',
        badges: ['app'],
        data: { risk: 'low', coverage: '100%' },
      },
    ],
  },
];

const DataLiveDemoCanvas = () => {
  const [selectedStep, setSelectedStep] = React.useState('build');
  const [selectedTreeNode, setSelectedTreeNode] = React.useState<React.Key>('wave-11');
  const [selectedTreeTableNode, setSelectedTreeTableNode] = React.useState<React.Key>('consumer-apps');
  const [releaseTime, setReleaseTime] = React.useState('11:45');

  return (
    <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6">
        <section className="rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
          <Text as="div" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
            Data live demo surface
          </Text>
          <Text as="h2" className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-text-primary">
            Data-heavy live demo primitive'leri release cockpit altinda toplaniyor
          </Text>
        </section>

        <SummaryStrip
          title="Live demo final metrics"
          description="SummaryStrip, final visual coverage turunun ozetini yukarida sabit tutar."
          items={[
            { key: 'coverage', label: 'Story coverage', value: '100%', note: 'Live demo backlog kapaniyor', tone: 'success' },
            { key: 'release', label: 'Release ready', value: '29 / 29', note: 'Stable surface tam kapsandi', tone: 'info' },
            { key: 'apps', label: 'Consumer apps', value: '6', note: 'Migration summary artefact ile senkron', tone: 'default' },
            { key: 'time', label: 'Release time', value: releaseTime, note: 'TimePicker ile ayni workbench baglanti kurar', tone: 'warning' },
          ]}
        />

        <Steps
          items={[
            { value: 'build', title: 'Build', description: 'Storybook ve docs artefactlari uretilir.' },
            { value: 'doctor', title: 'Doctor', description: 'Shell ve route senaryolari dogrulanir.' },
            { value: 'release', title: 'Release', description: 'Manifest ve bundle ozetleri yazilir.' },
          ]}
          value={selectedStep}
          onValueChange={setSelectedStep}
          interactive
        />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.52fr_0.48fr]">
          <section className="space-y-6 rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
            <TimePicker
              label="Publish slot"
              description="TimePicker release penceresini bu ayni story icinde acik eder."
              value={releaseTime}
              onValueChange={setReleaseTime}
            />

            <Upload
              label="Release artifact"
              description="Upload primitive'i publish bundle summary ya da visual evidence ekleme akisini temsil eder."
              defaultFiles={[
                { name: 'ui-library-release-manifest.v1.json', size: 38012, type: 'application/json' },
                { name: 'frontend-doctor.summary.v1.json', size: 12490, type: 'application/json' },
              ]}
              maxFiles={3}
              accept=".json"
              multiple
            />

            <TableSimple
              caption="Gate results"
              description="TableSimple, release zincirindeki son PASS durumlarini listeler."
              columns={[
                { key: 'stage', label: 'Stage', accessor: 'stage', emphasis: true },
                { key: 'owner', label: 'Owner', accessor: 'owner' },
                { key: 'evidence', label: 'Evidence', accessor: 'evidence' },
                {
                  key: 'status',
                  label: 'Status',
                  render: (row) => <Badge tone="success">{String(row.status)}</Badge>,
                  align: 'right',
                },
              ]}
              rows={rolloutRows}
            />
          </section>

          <section className="space-y-6 rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <Tooltip text="Tooltip primitive'i inline aciklama katmani olarak burada gorunur.">
                <Button variant="secondary" fullWidth={false}>Hover clue</Button>
              </Tooltip>
              <Badge tone="info">tree-coverage</Badge>
            </div>

            <Tree
              title="Rollout tree"
              description="Tree, release paketinin hiyerarsik kapsamini gostermek icin kullanilir."
              nodes={rolloutTree}
              selectedKey={selectedTreeNode}
              onNodeSelect={setSelectedTreeNode}
              defaultExpandedKeys={['wave-11']}
            />

            <TreeTable
              title="Consumer blast radius"
              description="TreeTable, uygulama bazli etki ve coverage gorunumunu ayni tablo-altinda agac yapisiyla birlestirir."
              nodes={treeTableNodes}
              selectedKey={selectedTreeTableNode}
              onNodeSelect={setSelectedTreeTableNode}
              defaultExpandedKeys={['consumer-apps']}
              columns={[
                { key: 'coverage', label: 'Coverage', accessor: 'coverage', emphasis: true },
                { key: 'risk', label: 'Risk', accessor: 'risk', align: 'right' },
              ]}
            />
          </section>
        </div>

        <TourCoachmarks
          title="Release tour"
          defaultOpen
          steps={[
            {
              id: 'summary',
              title: 'SummaryStrip metrics',
              description: 'Coverage, release-ready ve consumer app sayisi ayni üst katmanda gorunur.',
              meta: 'metrics',
              tone: 'info',
            },
            {
              id: 'tree',
              title: 'Tree and TreeTable',
              description: 'Hierarsik rollout ve consumer blast radius ayni veri diliyle aktarilir.',
              meta: 'structure',
              tone: 'success',
            },
            {
              id: 'upload',
              title: 'Upload evidence',
              description: 'Release artefact ve doctor summary gibi kanitlar yine bu canlı demo yuzeyinde okunur.',
              meta: 'evidence',
              tone: 'warning',
            },
          ]}
        />
      </div>
    </div>
  );
};

export const DataLiveDemoWorkbench: Story = {
  render: () => <DataLiveDemoCanvas />,
};
