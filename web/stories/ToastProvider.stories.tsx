import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Button } from '../packages/design-system/src/components/Button';
import { Text } from '../packages/design-system/src/components/Text';
import { ToastProvider } from '../packages/design-system/src/components/ToastProvider';
import { useToast } from '../packages/design-system/src/components/useToast';

const meta: Meta<typeof ToastProvider> = {
  title: 'UI Kit/ToastProvider',
  component: ToastProvider,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof ToastProvider>;

const StoryShell = ({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) => (
  <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,240,214,0.44),transparent_30%),linear-gradient(180deg,rgba(248,246,240,0.98),rgba(239,243,248,0.98))] px-6 py-8 text-text-primary">
    <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[minmax(0,1.5fr)_22rem]">
      <div className="rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-[0_28px_64px_-42px_rgba(15,23,42,0.22)]">
        {children}
      </div>
      <div className="rounded-[28px] border border-border-subtle bg-white/78 p-5 shadow-[0_20px_46px_-36px_rgba(15,23,42,0.18)] backdrop-blur-sm">
        {sidebar}
      </div>
    </div>
  </div>
);

const ToastTriggerPanel = ({
  onLog,
}: {
  onLog: (value: string) => void;
}) => {
  const toast = useToast();

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <Button
        onClick={() => {
          const id = toast.success({
            title: 'Release gate gecti',
            description: 'Visual regression ve smoke kanitlari ayni turda temizlendi.',
          });
          onLog(`success:${id}`);
        }}
      >
        Success toast
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          const id = toast.warning({
            title: 'Manual review gerekiyor',
            description: 'Cross-app owner onayi gelmeden rollout acilmamali.',
          });
          onLog(`warning:${id}`);
        }}
      >
        Warning toast
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          const id = toast.error({
            title: 'Policy blokaji',
            description: 'Eksik release evidence nedeniyle lane durduruldu.',
            action: <Button variant="ghost">Runbook</Button>,
          });
          onLog(`error:${id}`);
        }}
      >
        Error toast
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          const id = toast.loading({
            title: 'Bundle yayimlaniyor',
            description: 'Loading severity varsayilan olarak auto-hide kullanmiyor.',
          });
          onLog(`loading:${id}`);
        }}
      >
        Loading toast
      </Button>
      <Button
        variant="ghost"
        onClick={() => {
          toast.dismissAll();
          onLog('dismiss-all');
        }}
      >
        Tumunu kapat
      </Button>
    </div>
  );
};

export const GlobalToastLane: Story = {
  render: () => {
    const [log, setLog] = React.useState('Hazir');

    return (
      <ToastProvider disablePortal placement="top-right" autoHideDuration={2600} viewportTestId="toast-story-viewport">
        <StoryShell
          sidebar={(
            <>
              <Text as="div" className="text-sm font-semibold text-text-primary">
                Preview focus
              </Text>
              <div className="mt-3 space-y-3 text-sm leading-6 text-text-secondary">
                <p>Global app-shell toast lane</p>
                <p>Severity bazli trigger API</p>
                <p>Auto-hide ve loading parity</p>
                <p>Inline viewport ile stable visual preview</p>
              </div>
            </>
          )}
        >
          <Text as="div" className="text-lg font-semibold text-text-primary">
            Global toast stack
          </Text>
          <Text variant="secondary" className="mt-2 block max-w-3xl leading-7">
            ToastProvider, MUI SnackbarProvider benzeri global bildirim hattini daha yaln bir API ile kurar.
            Severity helper&apos;lari ve dismiss davranisi ayni context kontratinda toplanir.
          </Text>
          <ToastTriggerPanel onLog={setLog} />
          <div className="mt-6 rounded-[28px] border border-border-subtle bg-surface-panel p-5">
            <Text as="div" className="text-sm font-semibold text-text-primary">
              Son event
            </Text>
            <Text variant="secondary" className="mt-2 block leading-6">
              {log}
            </Text>
          </div>
        </StoryShell>
      </ToastProvider>
    );
  },
};

const QueueHarness = ({
  onLog,
}: {
  onLog: (value: string) => void;
}) => {
  const toast = useToast();

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <Button
        onClick={() => {
          toast.info({ title: 'Overview acildi', description: 'Route-aware navigation state yenilendi.' });
          onLog('info');
        }}
      >
        Info
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          toast.success({ title: 'Owner atandi', description: 'Cross-app review owner registry guncellendi.' });
          onLog('success');
        }}
      >
        Success
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          toast.warning({ title: 'Beta component', description: 'Adoption notlari manuel review istiyor.' });
          onLog('warning');
        }}
      >
        Warning
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          toast.error({ title: 'Lane durdu', description: 'Failing contract release'i bloke etti.' });
          onLog('error');
        }}
      >
        Error
      </Button>
    </div>
  );
};

export const PlacementAndQueuePolicy: Story = {
  render: () => {
    const [log, setLog] = React.useState('Queue hazir');

    return (
      <ToastProvider
        disablePortal
        placement="bottom-left"
        newestOnTop={false}
        maxVisible={2}
        autoHideDuration={4000}
        viewportClassName="!max-w-md"
        toastTestId="toast-queue-item"
      >
        <StoryShell
          sidebar={(
            <>
              <Text as="div" className="text-sm font-semibold text-text-primary">
                Regression focus
              </Text>
              <div className="mt-3 space-y-3 text-sm leading-6 text-text-secondary">
                <p>maxVisible trim davranisi</p>
                <p>newestOnTop=false append policy</p>
                <p>bottom-left placement</p>
                <p>test id ve class override sozlesmesi</p>
              </div>
            </>
          )}
        >
          <Text as="div" className="text-lg font-semibold text-text-primary">
            Queue governance
          </Text>
          <Text variant="secondary" className="mt-2 block max-w-3xl leading-7">
            Buyuk urunlerde toast hattinin sadece gorunmesi yetmez; siralama, kapasite ve placement kararlari da
            sistematik olmalidir. Bu recipe queue politikasini gozle gorulebilir hale getirir.
          </Text>
          <QueueHarness onLog={setLog} />
          <div className="mt-6 rounded-[28px] border border-border-subtle bg-surface-panel p-5">
            <Text as="div" className="text-sm font-semibold text-text-primary">
              Queue log
            </Text>
            <Text variant="secondary" className="mt-2 block leading-6">
              {log}
            </Text>
          </div>
        </StoryShell>
      </ToastProvider>
    );
  },
};
