import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Alert } from '../packages/design-system/src/components/Alert';
import { Button } from '../packages/design-system/src/components/Button';
import { Text } from '../packages/design-system/src/components/Text';

const meta: Meta<typeof Alert> = {
  title: 'UI Kit/Alert',
  component: Alert,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof Alert>;

export const SeverityStack: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-canvas px-6 py-8 text-text-primary">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
        <Text as="div" className="text-lg font-semibold text-text-primary">
          Feedback ladder
        </Text>
        <Text variant="secondary" className="mt-2 block max-w-3xl leading-7">
          `Alert`, Ant Design ve MUI seviyesinde beklenen severity hiyerarsisini, daha yumusak premium surface dili ile
          inline feedback alanina tasir. Basaridan blokaja kadar ayni API ritmi korunur.
        </Text>
        <div className="mt-6 space-y-4">
          <Alert
            severity="success"
            title="Release gate gecti"
            description="Visual harness, smoke test ve contract paketi ayni turda temizlendi."
          />
          <Alert
            severity="info"
            title="Yeni rollout penceresi"
            description="Navigation refresh yalniz beta kanalinda kademeli olarak aktiflestirilecek."
          />
          <Alert
            severity="warning"
            title="Review gerekli"
            description="Consumer app owner'lari migration notlarini onaylamadan rollout ilerlememeli."
          />
          <Alert
            severity="error"
            title="Policy blokaji"
            description="Eksik evidence nedeniyle release lane otomatik olarak durduruldu."
          />
        </div>
      </div>
    </div>
  ),
};

export const BannerActions: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true);

    return (
      <div className="min-h-screen bg-surface-canvas px-6 py-8 text-text-primary">
        <div className="mx-auto max-w-6xl rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
          <Text as="div" className="text-lg font-semibold text-text-primary">
            Banner workflow
          </Text>
          <Text variant="secondary" className="mt-2 block max-w-4xl leading-7">
            App shell veya dashboard header alaninda kullanilan banner alert, aksiyon ve dismiss davranisini ayni primitive
            uzerinde tutar. Bu model, AntD&apos;deki banner hissi ile MUI&apos;nin action slot netligini birlestirir.
          </Text>
          <div className="mt-6 rounded-[28px] border border-border-subtle bg-surface-panel p-5">
            {open ? (
              <Alert
                severity="warning"
                banner
                closable
                open={open}
                title="Rollout penceresi 18:00'de kapanacak"
                description="Acil rollback karari gerekiyorsa owner ekibiyle ayni turda evidence paketini paylas."
                action={<Button variant="secondary">Runbook ac</Button>}
                onOpenChange={setOpen}
              />
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-dashed border-border-default bg-surface-canvas px-4 py-4">
                <div>
                  <Text as="div" className="text-sm font-semibold text-text-primary">
                    Banner kapatildi
                  </Text>
                  <Text variant="secondary" className="mt-1 block text-sm leading-6">
                    Controlled `open` modeli, workflow shell icinde tekrar acma kararini consumer katmana birakir.
                  </Text>
                </div>
                <Button onClick={() => setOpen(true)}>Yeniden ac</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
};

export const AccessAndIconControl: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-canvas px-6 py-8 text-text-primary">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
        <Text as="div" className="text-lg font-semibold text-text-primary">
          Governed states
        </Text>
        <Text variant="secondary" className="mt-2 block max-w-3xl leading-7">
          Access seviyesi, icon kontrolu ve dismiss affordance ayni surface kontratinda kalir. Bu, kurumsal urunlerde
          readonly policy ekranlari ile aktif operasyon banner'larini ayni primitive ailesinde tutmayi kolaylastirir.
        </Text>
        <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
          <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5">
            <Alert
              severity="info"
              title="Readonly governance note"
              description="Bu alert yalniz inceleme modunda oldugu icin dismiss davranisi kilitli kalir."
              closable
              access="readonly"
            />
          </div>
          <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-5">
            <Alert
              severity="success"
              title="Icon-free compact confirmation"
              description="Daha sakin embedded feedback yuzeylerinde icon gizlenebilir."
              icon={false}
              action={<Button variant="secondary">Detayi gor</Button>}
            />
          </div>
        </div>
      </div>
    </div>
  ),
};
