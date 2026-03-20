import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { NotificationDrawer } from '../packages/design-system/src/components/NotificationDrawer';
import { Button } from '../packages/design-system/src/components/Button';
import { Text } from '../packages/design-system/src/components/Text';
import type { NotificationSurfaceItem } from '../packages/design-system/src/components/NotificationItemCard';

const meta: Meta<typeof NotificationDrawer> = {
  title: 'UI Kit/NotificationDrawer',
  component: NotificationDrawer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof NotificationDrawer>;

const referenceTime = new Date('2026-03-14T12:00:00.000Z').getTime();

const initialItems: NotificationSurfaceItem[] = [
  {
    id: 'release-blocked',
    message: 'Release lane blocked',
    description: 'Policy-check yeni migration evidence bekliyor.',
    type: 'warning',
    priority: 'high',
    pinned: true,
    createdAt: new Date('2026-03-14T09:30:00.000Z').getTime(),
    read: false,
    meta: {
      pathname: '/admin/design-lab',
      search: 'dl_mode=components&dl_section=components',
      actionLabel: 'Design Lab ac',
    },
  },
  {
    id: 'audit-owner',
    message: 'Audit owner review tamamlandi',
    description: 'Cross-app review icin yeni owner notu eklendi.',
    type: 'info',
    priority: 'normal',
    createdAt: new Date('2026-03-14T07:10:00.000Z').getTime(),
    read: false,
    meta: {
      pathname: '/audit/events',
      actionLabel: 'Audit olaylarini ac',
    },
  },
  {
    id: 'storybook-green',
    message: 'Storybook coverage guncellendi',
    description: 'Notification drawer artik canonical story ile release paketine girdi.',
    type: 'success',
    priority: 'normal',
    createdAt: new Date('2026-03-13T19:40:00.000Z').getTime(),
    read: true,
  },
];

const renderStoryShell = (
  content: React.ReactNode,
  sidebar: React.ReactNode,
) => (
  <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(226,232,255,0.62),transparent_34%),linear-gradient(180deg,rgba(244,247,255,0.96),rgba(236,240,248,0.98))] px-6 py-8 text-text-primary">
    <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[minmax(0,1.45fr)_22rem]">
      <div className="rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-[0_26px_64px_-42px_rgba(15,23,42,0.22)]">
        {content}
      </div>
      <div className="rounded-[28px] border border-border-subtle bg-white/78 p-5 shadow-[0_20px_46px_-36px_rgba(15,23,42,0.18)] backdrop-blur-sm">
        {sidebar}
      </div>
    </div>
  </div>
);

export const OpsInbox: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    const [items, setItems] = React.useState(initialItems);
    const [lastCloseReason, setLastCloseReason] = React.useState<string>('drawer acik');
    const unreadCount = items.filter((item) => !item.read).length;

    return renderStoryShell(
      <>
        <Text as="div" className="text-lg font-semibold text-text-primary">
          Notification center drawer
        </Text>
        <Text variant="secondary" className="mt-2 block max-w-3xl leading-7">
          NotificationDrawer, shell notification center hissini reusable bir sag panel primitive&apos;ine indirir.
          Overlay close reason&apos;lari, filter/grouping ve panel callback&apos;leri tek kontratta kalir.
        </Text>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button onClick={() => setOpen(true)}>Drawer ac</Button>
          <Button
            variant="secondary"
            onClick={() => {
              setItems((current) => current.map((item) => ({ ...item, read: true })));
            }}
          >
            Tumunu okundu say
          </Button>
          <span className="inline-flex rounded-full border border-border-subtle bg-surface-panel px-3 py-1 text-xs font-semibold text-text-secondary">
            {`${unreadCount} unread`}
          </span>
        </div>
        <div className="mt-6 rounded-[28px] border border-border-subtle bg-surface-panel p-5">
          <Text as="div" className="text-sm font-semibold text-text-primary">
            Last close reason
          </Text>
          <Text variant="secondary" className="mt-2 block leading-6">
            {lastCloseReason}
          </Text>
        </div>
        <NotificationDrawer
          open={open}
          disablePortal
          items={items}
          title={`Ops inbox${unreadCount > 0 ? ` (${unreadCount})` : ''}`}
          summaryLabel="Shell-level release, audit ve rollout bildirimleri"
          dialogLabel="Ops inbox notifications"
          showFilters
          grouping="priority"
          dateGrouping="relative-day"
          dateGroupingReferenceTime={referenceTime}
          onMarkAllRead={() => {
            setItems((current) => current.map((item) => ({ ...item, read: true })));
          }}
          onClear={() => {
            setItems([]);
          }}
          onRemoveItem={(id) => {
            setItems((current) => current.filter((item) => item.id !== id));
          }}
          getPrimaryActionLabel={(item) =>
            typeof item.meta?.actionLabel === 'string' ? item.meta.actionLabel : 'Detayi ac'
          }
          onPrimaryAction={(item) => {
            setLastCloseReason(`primary-action:${item.id}`);
          }}
          onClose={(reason) => {
            setOpen(false);
            setLastCloseReason(reason);
          }}
        />
      </>,
      <>
        <Text as="div" className="text-sm font-semibold text-text-primary">
          Preview focus
        </Text>
        <div className="mt-3 space-y-3 text-sm leading-6 text-text-secondary">
          <p>Right-side premium drawer surface</p>
          <p>Priority grouping ve relative-day sections</p>
          <p>Overlay, escape ve close-button close reason parity</p>
          <p>NotificationCenter benzeri production shell wiring</p>
        </div>
      </>,
    );
  },
};

export const BatchTriage: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    const [items, setItems] = React.useState(initialItems);
    const [selectionLog, setSelectionLog] = React.useState<string>('Secim bekleniyor');

    return renderStoryShell(
      <>
        <Text as="div" className="text-lg font-semibold text-text-primary">
          Batch triage workflow
        </Text>
        <Text variant="secondary" className="mt-2 block max-w-3xl leading-7">
          Selectable mod, drawer&apos;i sadece pasif feed olmaktan cikarip product-level bir triage surface&apos;ine cevirir.
          Bu model buyuk operasyon sayfalarinda AntD drawer + list hissinden daha kontrollu bir UX sunar.
        </Text>
        <div className="mt-6 rounded-[28px] border border-border-subtle bg-surface-panel p-5">
          <Text as="div" className="text-sm font-semibold text-text-primary">
            Batch action log
          </Text>
          <Text variant="secondary" className="mt-2 block leading-6">
            {selectionLog}
          </Text>
        </div>
        <NotificationDrawer
          open={open}
          disablePortal
          items={items}
          title="Triage queue"
          summaryLabel="Secilebilir bildirim kuyrugu"
          dialogLabel="Triage queue notifications"
          showFilters
          selectable
          grouping="priority"
          dateGrouping="relative-day"
          dateGroupingReferenceTime={referenceTime}
          onMarkSelectedRead={(ids) => {
            setItems((current) =>
              current.map((item) => (ids.includes(item.id) ? { ...item, read: true } : item)),
            );
            setSelectionLog(`mark-read:${ids.join(',')}`);
          }}
          onRemoveSelected={(ids) => {
            setItems((current) => current.filter((item) => !ids.includes(item.id)));
            setSelectionLog(`remove:${ids.join(',')}`);
          }}
          onRemoveItem={(id) => {
            setItems((current) => current.filter((item) => item.id !== id));
            setSelectionLog(`single-remove:${id}`);
          }}
          onClose={(reason) => {
            setOpen(false);
            setSelectionLog(`closed:${reason}`);
          }}
        />
        {!open ? (
          <div className="mt-6">
            <Button onClick={() => setOpen(true)}>Drawer'i yeniden ac</Button>
          </div>
        ) : null}
      </>,
      <>
        <Text as="div" className="text-sm font-semibold text-text-primary">
          Regression focus
        </Text>
        <div className="mt-3 space-y-3 text-sm leading-6 text-text-secondary">
          <p>Selection callback passthrough</p>
          <p>Batch remove ve mark-read parity</p>
          <p>Readonly/disabled close button guard</p>
          <p>Portal ile inline render davranis eslesmesi</p>
        </div>
      </>,
    );
  },
};
