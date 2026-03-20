import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Select } from '../packages/design-system/src/components/Select';
import { Combobox } from '../packages/design-system/src/components/Combobox';
import { Text } from '../packages/design-system/src/components/Text';

const meta: Meta<typeof Select> = {
  title: 'UI Kit/Select',
  component: Select,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof Select>;

export const GroupedMetadata: Story = {
  render: () => {
    const [value, setValue] = React.useState('regulated');

    return (
      <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
        <div className="mx-auto max-w-5xl rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
          <Text as="div" className="text-lg font-semibold text-text-primary">
            Grouped native select with richer selection context
          </Text>
          <Text variant="secondary" className="mt-2 block max-w-3xl leading-7">
            `Select`, native popup davranisini korurken grup aciklamasi ve secili deger metadata badge’i ile daha kurumsal bir
            karar dili sunar. Bu model, arama gerekmeyen committed option listeleri icin canonical kalir.
          </Text>
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-6">
              <Select
                label="Approval lane"
                description="Release akisini hangi governance koridorunda yurutmek istedigini sec."
                value={value}
                onValueChange={setValue}
                clearable
                emptyOptionLabel="Varsayilan lane"
                options={[
                  {
                    label: 'Standard flow',
                    description: 'Gundelik urun ve platform rollout kararlarini toplar.',
                    options: [
                      {
                        value: 'default',
                        label: 'Default lane',
                        description: 'Ek governance kontrolu gerekmez.',
                        metaLabel: 'Standard',
                        tone: 'info',
                      },
                    ],
                  },
                  {
                    label: 'Governed flow',
                    description: 'Compliance, policy ve insan onayi gerektiren kararlar bu grupta toplanir.',
                    options: [
                      {
                        value: 'regulated',
                        label: 'Regulated lane',
                        description: 'Ek insan onayi ve audit izi gerekir.',
                        metaLabel: 'Compliance',
                        tone: 'warning',
                      },
                      {
                        value: 'policy',
                        label: 'Policy review',
                        description: 'Yalniz policy board tarafindan kapanir.',
                        metaLabel: 'Board',
                        tone: 'danger',
                      },
                    ],
                  },
                ]}
                emptyStateLabel="Bir lane secmediginde sistem varsayilan akisa geri doner."
              />
            </div>
            <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-6">
              <Text as="div" className="text-sm font-semibold text-text-primary">
                Neden bu pattern canonical?
              </Text>
              <Text variant="secondary" className="mt-3 block leading-7">
                Search, async query veya popup icinde sanal liste gerekmiyorsa native select daha dusuk riskli ve daha tahmin
                edilebilir kalir. Yeni metadata badge ve group description katmani, bu yalın primitive’i daha enterprise bir
                karar satirina tasir.
              </Text>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const NativeVsComboboxUpgradePath: Story = {
  render: () => {
    const [selectValue, setSelectValue] = React.useState('platform');
    const [comboboxValue, setComboboxValue] = React.useState<string | null>('platform');
    const [comboboxInput, setComboboxInput] = React.useState('Platform UI');

    const options = [
      {
        label: 'Teams',
        description: 'Sahiplik ve operasyon alanlari.',
        options: [
          {
            value: 'platform',
            label: 'Platform UI',
            description: 'Core design system ve release governance sahibi.',
            keywords: ['platform', 'design', 'release'],
          },
          {
            value: 'governance',
            label: 'Governance desk',
            description: 'Compliance ve policy escalation akislarini yonetir.',
            keywords: ['policy', 'compliance', 'review'],
          },
          {
            value: 'support',
            label: 'Support ops',
            description: 'Triage ve incident handoff akislarini toplar.',
            keywords: ['support', 'triage', 'incident'],
          },
        ],
      },
    ] as const;

    return (
      <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
        <div className="mx-auto max-w-6xl rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
          <Text as="div" className="text-lg font-semibold text-text-primary">
            Select to Combobox escalation path
          </Text>
          <Text variant="secondary" className="mt-2 block max-w-4xl leading-7">
            `Select` committed ve kisa listeler icin, `Combobox` ise arama, async query ve daha zengin popup anatomy icin
            canonical yol olarak ayrilir. Bu ayrim Base UI, Ark UI ve Chakra benchmark kararlarimizla uyumludur.
          </Text>
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-6">
              <Text as="div" className="text-sm font-semibold text-text-primary">
                Native Select
              </Text>
              <Select
                label="Owner"
                description="Liste kisaysa native popup tercih edilir."
                value={selectValue}
                onValueChange={setSelectValue}
                options={[
                  {
                    label: 'Teams',
                    description: 'Operasyon ve sahiplik ekipleri.',
                    options: [
                      { value: 'platform', label: 'Platform UI', metaLabel: 'Core', tone: 'info' },
                      { value: 'governance', label: 'Governance desk', metaLabel: 'Policy', tone: 'warning' },
                      { value: 'support', label: 'Support ops', metaLabel: 'Ops', tone: 'muted' },
                    ],
                  },
                ]}
              />
            </div>
            <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-6">
              <Text as="div" className="text-sm font-semibold text-text-primary">
                Searchable Combobox
              </Text>
              <Combobox
                label="Owner"
                description="Arama, anahtar kelime ve popup icinde daha zengin secenek anatomy’si gerekirse combobox kullan."
                value={comboboxValue}
                inputValue={comboboxInput}
                onValueChange={setComboboxValue}
                onInputChange={setComboboxInput}
                options={options}
                clearable
                emptyStateLabel="Bir owner secilmedi"
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const ReadonlyAndClearable: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
        <Text as="div" className="text-lg font-semibold text-text-primary">
          Governed states
        </Text>
        <Text variant="secondary" className="mt-2 block max-w-3xl leading-7">
          Access guard, disabled reason ve clearable bos-durum davranislari ayni field shell kontratinda kalir.
        </Text>
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-6">
            <Select
              label="Managed scope"
              value="core"
              access="readonly"
              options={[
                {
                  value: 'core',
                  label: 'Core managed',
                  description: 'Bu alan release kontrati tarafindan yonetilir.',
                  metaLabel: 'Locked',
                  tone: 'muted',
                },
              ]}
            />
          </div>
          <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-6">
            <Select
              label="Approval lane"
              defaultValue="standard"
              options={[
                { value: 'standard', label: 'Standard lane', metaLabel: 'Default', tone: 'info' },
                {
                  value: 'regulated',
                  label: 'Regulated lane',
                  disabled: true,
                  disabledReason: 'Bu lane yalniz compliance repolari icin acilir.',
                  metaLabel: 'Restricted',
                  tone: 'warning',
                },
              ]}
            />
          </div>
          <div className="rounded-[28px] border border-border-subtle bg-surface-panel p-6">
            <Select
              label="Opsiyonel baglam"
              clearable
              placeholder="Yuzey sec"
              emptyStateLabel="Secim yapmadan da devam edebilirsin."
              options={[
                { value: 'workspace', label: 'Workspace context', metaLabel: 'Scoped', tone: 'info' },
                { value: 'portfolio', label: 'Portfolio context', metaLabel: 'Global', tone: 'success' },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  ),
};
