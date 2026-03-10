import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import Button from '../packages/ui-kit/src/components/Button';
import { Badge } from '../packages/ui-kit/src/components/Badge';
import { Tag } from '../packages/ui-kit/src/components/Tag';
import { Select } from '../packages/ui-kit/src/components/Select';
import { Empty } from '../packages/ui-kit/src/components/Empty';
import { DetailSummary } from '../packages/ui-kit/src/components/DetailSummary';
import { Breadcrumb } from '../packages/ui-kit/src/components/Breadcrumb';
import { Pagination } from '../packages/ui-kit/src/components/Pagination';
import { Modal } from '../packages/ui-kit/src/components/Modal';
import { Text } from '../packages/ui-kit/src/components/Text';
import { ThemePreviewCard } from '../packages/ui-kit/src/components/theme/ThemePreviewCard';
import { FormDrawer } from '../packages/ui-kit/src/layout/FormDrawer';
import { DetailDrawer } from '../packages/ui-kit/src/layout/DetailDrawer';

const meta: Meta = {
  title: 'UI Kit/ReleaseMatrix',
  parameters: {
    chromatic: { delay: 300, disableSnapshot: false },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const SurfaceOverviewCanvas = () => {
  const [themeMode, setThemeMode] = React.useState('pw-light');

  return (
    <div className="min-h-screen bg-surface-canvas px-6 py-8 text-text-primary">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-6 rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
          <div className="space-y-3">
            <Text as="div" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
              Release-ready surface
            </Text>
            <div className="flex flex-wrap items-center gap-3">
              <Text as="h2" className="text-3xl font-semibold tracking-[-0.04em] text-text-primary">
                UI Kit visual preview matrix
              </Text>
              <Badge tone="success">Stable</Badge>
              <Tag tone="info">Storybook</Tag>
            </div>
            <Text variant="secondary" className="block max-w-3xl text-sm leading-7">
              Bu harness, design systemin tuketiciye hazir ana surface alanlarini tek Storybook rotasinda gorsel olarak yan yana toplar.
            </Text>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary action</Button>
            <Button variant="secondary">Secondary action</Button>
            <Button variant="ghost">Ghost action</Button>
            <Badge tone="warning">Beta-aware</Badge>
            <Tag tone="success">Design Lab</Tag>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-[0.7fr_1.3fr]">
            <div className="rounded-[24px] border border-border-subtle bg-surface-panel p-4">
              <Text as="div" className="text-sm font-semibold text-text-primary">
                Theme contract
              </Text>
              <Text variant="secondary" className="mt-2 block text-sm leading-6">
                Preview route ile yayinlanan componentler burada ayni token zinciriyle dogrulanir.
              </Text>
              <Select
                value={themeMode}
                onChange={setThemeMode}
                options={[
                  { value: 'pw-light', label: 'PW Light' },
                  { value: 'pw-ocean', label: 'PW Ocean' },
                  { value: 'pw-graphite', label: 'PW Graphite' },
                ]}
                className="mt-4 w-full"
              />
              <div className="mt-4 grid grid-cols-3 gap-3">
                <ThemePreviewCard selected={themeMode === 'pw-light'} />
                <ThemePreviewCard selected={themeMode === 'pw-ocean'} />
                <ThemePreviewCard selected={themeMode === 'pw-graphite'} />
              </div>
            </div>

            <div className="rounded-[24px] border border-border-subtle bg-surface-panel p-4">
              <Breadcrumb
                items={[
                  { label: 'Platform', href: '#' },
                  { label: 'Design Lab', href: '#' },
                  { label: 'Release matrix', current: true },
                ]}
              />
              <div className="mt-4">
                <DetailSummary
                  eyebrow="Consumer Preview"
                  title="Rollout summary"
                  description="Stable component ve overlay surface ayni release preview icinde dogrulanir."
                  status={<Badge tone="success">Ready</Badge>}
                  summaryItems={[
                    { label: 'Exports', value: '92', helper: 'Public package surface' },
                    { label: 'Coverage', value: '100%', helper: 'API catalog coverage' },
                    { label: 'Stories', value: 'expanded', helper: 'Visual harness matrix' },
                    { label: 'Route', value: '/admin/design-lab', helper: 'Preview route' },
                  ]}
                  entity={{
                    title: 'mfe-ui-kit',
                    subtitle: 'Tek noktadan yayinlanan tasarim kutuphanesi',
                    badge: <Tag tone="info">remote ./library</Tag>,
                    items: [
                      { label: 'Version', value: '1.1.0' },
                      { label: 'Channel', value: 'latest' },
                      { label: 'Owner', value: 'Platform UI' },
                      { label: 'Contract', value: 'release-grade' },
                    ],
                  }}
                  detailItems={[
                    { label: 'Publish', value: 'publish:bundle' },
                    { label: 'Manifest', value: 'release:ui-library:manifest' },
                    { label: 'Doctor', value: 'doctor:frontend' },
                    { label: 'Wave gate', value: 'wave_11_recipes' },
                  ]}
                  jsonValue={{
                    remote: 'mfe_ui_kit',
                    exposes: ['./library', './Button'],
                    previewRoute: '/admin/design-lab',
                  }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-border-subtle bg-surface-panel p-4">
            <Text as="div" className="text-sm font-semibold text-text-primary">
              Adoption pagination
            </Text>
            <Pagination totalItems={240} pageSize={20} defaultPage={4} mode="server" className="mt-4" />
          </div>
        </section>

        <section className="space-y-6 rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
          <div className="rounded-[24px] border border-border-subtle bg-surface-panel p-4">
            <Text as="div" className="text-sm font-semibold text-text-primary">
              Empty state fallback
            </Text>
            <Empty className="mt-4" description="Adoption backlogu olmayan release adimlari burada yesil gorunur." />
          </div>

          <div className="rounded-[24px] border border-border-subtle bg-surface-panel p-4">
            <Text as="div" className="text-sm font-semibold text-text-primary">
              Overlay release guidance
            </Text>
            <Text variant="secondary" className="mt-2 block text-sm leading-6">
              Ayrica ayni story dosyasi Modal, FormDrawer ve DetailDrawer surface alanlarini ayri snapshot sahneleriyle kapsar.
            </Text>
          </div>
        </section>
      </div>
    </div>
  );
};

export const SurfaceOverview: Story = {
  render: () => <SurfaceOverviewCanvas />,
};

export const ModalPreview: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="min-h-screen bg-surface-canvas p-8">
      <Modal
        open
        title="Release confirmation"
        onClose={() => undefined}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary">Cancel</Button>
            <Button>Publish</Button>
          </div>
        }
      >
        <Text variant="secondary" className="block leading-7">
          Modal surface, publish oncesi karar ve onay akislarinda ayni release contract altinda kullanilir.
        </Text>
      </Modal>
    </div>
  ),
};

export const DrawerPreview: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="min-h-screen bg-surface-canvas p-8">
      <DetailDrawer
        open
        title="Release detail"
        onClose={() => undefined}
        tabs={[
          {
            key: 'summary',
            label: 'Summary',
            sections: [
              { key: 'version', title: 'Version', content: <Text variant="secondary">1.1.0</Text> },
              { key: 'route', title: 'Preview Route', content: <Text variant="secondary">/admin/design-lab</Text> },
            ],
          },
          {
            key: 'evidence',
            label: 'Evidence',
            sections: [
              { key: 'doctor', title: 'Doctor', content: <Text variant="secondary">frontend-doctor PASS</Text> },
              { key: 'gate', title: 'Gate', content: <Text variant="secondary">ui-library-release PASS</Text> },
            ],
          },
        ]}
      />
    </div>
  ),
};

export const FormDrawerPreview: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="min-h-screen bg-surface-canvas p-8">
      <FormDrawer open title="Publish bundle" onClose={() => undefined} onSubmit={() => undefined}>
        <div className="space-y-4">
          <div>
            <Text as="div" className="text-sm font-semibold text-text-primary">
              Release channel
            </Text>
            <Select
              value="latest"
              onChange={() => undefined}
              options={[
                { value: 'latest', label: 'Latest' },
                { value: 'candidate', label: 'Candidate' },
              ]}
              className="mt-2 w-full"
            />
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface-panel p-4">
            <Text variant="secondary" className="block text-sm leading-6">
              FormDrawer surface, yayin oncesi metadata ve rollout parametrelerini tek side-panel akista toplar.
            </Text>
          </div>
        </div>
      </FormDrawer>
    </div>
  ),
};
