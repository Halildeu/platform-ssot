import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Badge, TableSimple } from '../packages/design-system/src';
import { Text } from '../packages/design-system/src/components/Text';

const meta: Meta<typeof TableSimple> = {
  title: 'UI Kit/TableSimple',
  component: TableSimple,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof TableSimple>;

type PolicyRow = {
  id: string;
  control: string;
  owner: string;
  status: 'Healthy' | 'Review' | 'Blocked';
  risk: 'Low' | 'Medium' | 'High';
  due: string;
};

type QueueRow = {
  id: string;
  task: string;
  owner: string;
  age: string;
  lane: string;
};

const policyColumns = [
  {
    key: 'control',
    label: 'Control',
    accessor: 'control',
    emphasis: true,
  },
  {
    key: 'owner',
    label: 'Owner',
    accessor: 'owner',
  },
  {
    key: 'status',
    label: 'Status',
    render: (row: PolicyRow) => (
      <Badge
        tone={row.status === 'Healthy' ? 'success' : row.status === 'Review' ? 'warning' : 'danger'}
      >
        {row.status}
      </Badge>
    ),
  },
  {
    key: 'risk',
    label: 'Risk',
    render: (row: PolicyRow) => (
      <Badge tone={row.risk === 'Low' ? 'success' : row.risk === 'Medium' ? 'warning' : 'danger'}>
        {row.risk}
      </Badge>
    ),
    align: 'center' as const,
  },
  {
    key: 'due',
    label: 'Due',
    accessor: 'due',
    align: 'right' as const,
  },
] satisfies React.ComponentProps<typeof TableSimple<PolicyRow>>['columns'];

const queueColumns = [
  {
    key: 'task',
    label: 'Task',
    accessor: 'task',
    emphasis: true,
  },
  {
    key: 'owner',
    label: 'Owner',
    accessor: 'owner',
  },
  {
    key: 'age',
    label: 'Age',
    accessor: 'age',
    align: 'center' as const,
  },
  {
    key: 'lane',
    label: 'Lane',
    render: (row: QueueRow) => <Badge tone="info">{row.lane}</Badge>,
    align: 'right' as const,
  },
] satisfies React.ComponentProps<typeof TableSimple<QueueRow>>['columns'];

const policyRows: PolicyRow[] = [
  { id: 'pol-1', control: 'Approval timeout policy', owner: 'Governance', status: 'Healthy', risk: 'Low', due: '14 Mar' },
  { id: 'pol-2', control: 'Evidence retention', owner: 'Audit', status: 'Review', risk: 'Medium', due: '15 Mar' },
  { id: 'pol-3', control: 'User export waiver', owner: 'Legal', status: 'Blocked', risk: 'High', due: '16 Mar' },
];

const queueRows: QueueRow[] = [
  { id: 'q-1', task: 'Re-run policy lane', owner: 'Platform', age: '4m', lane: 'Delivery' },
  { id: 'q-2', task: 'Open approval diff', owner: 'Audit', age: '8m', lane: 'Review' },
  { id: 'q-3', task: 'Sync release report', owner: 'Reporting', age: '14m', lane: 'Ops' },
  { id: 'q-4', task: 'Validate shell manifest', owner: 'Platform', age: '22m', lane: 'Checks' },
];

const StoryShell: React.FC<{
  eyebrow: string;
  title: string;
  description: string;
  accentClassName?: string;
  children: React.ReactNode;
}> = ({ eyebrow, title, description, accentClassName, children }) => (
  <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
    <div
      className={[
        'mx-auto flex max-w-6xl flex-col gap-6 rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-[0_28px_64px_-48px_rgba(15,23,42,0.24)]',
        accentClassName,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div>
        <Text as="div" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
          {eyebrow}
        </Text>
        <Text as="div" preset="body-sm" className="mt-2 text-xl font-semibold text-text-primary">
          {title}
        </Text>
        <Text variant="secondary" className="mt-2 block text-sm leading-7">
          {description}
        </Text>
      </div>
      <div className="rounded-[28px] border border-border-subtle/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,247,255,0.94))] p-5 shadow-[0_24px_50px_-40px_rgba(15,23,42,0.22)]">
        {children}
      </div>
    </div>
  </div>
);

export const PolicyReviewBoard: Story = {
  render: () => (
    <StoryShell
      eyebrow="Canonical table"
      title="Policy review board"
      description="Sticky header, row emphasis ve premium status badge’leri ile kurumsal karar tabloları için temiz, modern ve okunabilir bir temel verir."
      accentClassName="bg-[radial-gradient(circle_at_top_left,rgba(191,219,254,0.24),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,255,0.96))]"
    >
      <TableSimple<PolicyRow>
        caption="Policy review board"
        description="TableSimple, ağır grid gerektirmeyen ama premium okuma kalitesi isteyen veri yüzeyleri için ideal temel tablo primitive’idir."
        columns={policyColumns}
        rows={policyRows}
        stickyHeader
        getRowKey={(row) => row.id}
      />
    </StoryShell>
  ),
};

export const CompactOpsQueue: Story = {
  render: () => (
    <StoryShell
      eyebrow="Dense operations"
      title="Compact ops queue"
      description="MUI yoğun data table mantığına yakın; compact density, hızlı tarama ve lane badge’leri ile operasyon ekipleri için daha hızlı okunur bir sıra görünümü sağlar."
      accentClassName="bg-[radial-gradient(circle_at_top_right,rgba(165,243,252,0.22),transparent_36%),linear-gradient(180deg,rgba(245,252,255,0.98),rgba(255,255,255,0.96))]"
    >
      <TableSimple<QueueRow>
        caption="Ops queue"
        description="Kısa görev listelerinde tam grid yerine hafif ama güçlü bir queue görünümü sunar."
        columns={queueColumns}
        rows={queueRows}
        density="compact"
        striped={false}
        getRowKey={(row) => row.id}
      />
    </StoryShell>
  ),
};

export const LoadingAndEmptyStates: Story = {
  render: () => (
    <StoryShell
      eyebrow="State parity"
      title="Loading + empty contract"
      description="Bir UI kütüphanesi için yalnız tablo gövdesi değil, loading ve empty fallback davranışı da first-class olmalı. Bu story ikisini birlikte canonical hale getirir."
      accentClassName="bg-[radial-gradient(circle_at_top_left,rgba(221,214,254,0.22),transparent_36%),linear-gradient(180deg,rgba(248,250,255,0.98),rgba(244,244,255,0.96))]"
    >
      <div className="grid gap-5 xl:grid-cols-2">
        <TableSimple<QueueRow>
          caption="Loading queue"
          description="Skeleton satırlar yerleşimi sabit tutar; sayfa boşluk hissi oluşmaz."
          columns={queueColumns}
          rows={[]}
          loading
        />
        <TableSimple<QueueRow>
          caption="Empty queue"
          description="Empty state açıklaması bağlama göre özelleştirilebilir."
          columns={queueColumns}
          rows={[]}
          localeText={{
            emptyStateLabel: 'Bu queue için açık görev bulunmuyor.',
            emptyFallbackDescription: 'Tüm lane kontrolleri temiz geçti; yeni görev gelene kadar tablo boş kalır.',
          }}
        />
      </div>
    </StoryShell>
  ),
};

export const ReadonlyRegistry: Story = {
  render: () => (
    <StoryShell
      eyebrow="Governance"
      title="Readonly registry"
      description="Yetki kısıtı olan ama görünür kalması gereken kayıt tabloları için daha sakin, daha güvenli ve kurumsal bir görünüm sunar."
      accentClassName="bg-[radial-gradient(circle_at_top_right,rgba(254,215,170,0.22),transparent_36%),linear-gradient(180deg,rgba(255,250,245,0.98),rgba(255,255,255,0.96))]"
    >
      <div className="max-w-4xl">
        <TableSimple<PolicyRow>
          caption="Readonly waiver registry"
          description="Readonly modda tablo kaybolmaz; yalnız etkileşim yüzeyi daha sakin hale gelir."
          columns={policyColumns}
          rows={policyRows.slice(0, 2)}
          access="readonly"
          getRowKey={(row) => row.id}
        />
      </div>
    </StoryShell>
  ),
};
