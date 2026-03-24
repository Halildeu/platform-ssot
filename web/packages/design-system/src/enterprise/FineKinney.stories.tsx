import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FineKinney } from './FineKinney';
import type { FineKinneyRisk } from './FineKinney';

const sampleRisks: FineKinneyRisk[] = [
  {
    id: '1',
    hazard: 'Kaygan zemin',
    description: 'Islak zeminde kayma riski',
    probability: 3,
    frequency: 6,
    severity: 7,
    controls: ['Kaymaz paspas', 'Uyarı levhası'],
    responsiblePerson: 'Ahmet Y.',
    deadline: '2026-04-15',
    status: 'in-progress',
  },
  {
    id: '2',
    hazard: 'Yüksekte çalışma',
    description: 'İskele üzerinde korkuluk eksikliği',
    probability: 6,
    frequency: 3,
    severity: 40,
    controls: ['Emniyet kemeri'],
    responsiblePerson: 'Mehmet K.',
    deadline: '2026-03-30',
    status: 'open',
  },
  {
    id: '3',
    hazard: 'Elektrik çarpması',
    description: 'Açık kablo uçları',
    probability: 1,
    frequency: 2,
    severity: 15,
    controls: ['İzolasyon', 'Kaçak akım rölesi'],
    responsiblePerson: 'Ali B.',
    deadline: '2026-05-01',
    status: 'closed',
  },
  {
    id: '4',
    hazard: 'Gürültü maruziyeti',
    probability: 6,
    frequency: 10,
    severity: 3,
    controls: ['Kulak koruyucu'],
    responsiblePerson: 'Fatma S.',
    status: 'in-progress',
  },
  {
    id: '5',
    hazard: 'Kimyasal maruziyet',
    description: 'Solvent buharlarına maruz kalma',
    probability: 3,
    frequency: 6,
    severity: 15,
    responsiblePerson: 'Zeynep A.',
    deadline: '2026-06-01',
    status: 'open',
  },
];

const highRisks: FineKinneyRisk[] = [
  {
    id: 'h1',
    hazard: 'Yapısal çökme riski',
    probability: 10,
    frequency: 6,
    severity: 100,
    status: 'open',
    responsiblePerson: 'Mühendis Ekibi',
  },
  {
    id: 'h2',
    hazard: 'Patlama tehlikesi',
    probability: 6,
    frequency: 10,
    severity: 100,
    status: 'open',
    responsiblePerson: 'Güvenlik Müdürü',
  },
  {
    id: 'h3',
    hazard: 'Toz patlaması',
    probability: 6,
    frequency: 6,
    severity: 40,
    controls: ['Havalandırma sistemi'],
    status: 'in-progress',
    responsiblePerson: 'Bakım Ekibi',
  },
];

const meta: Meta<typeof FineKinney> = {
  title: 'Enterprise/FineKinney',
  component: FineKinney,
  tags: ['autodocs'],
  argTypes: {
    showControls: { control: 'boolean' },
    showStatus: { control: 'boolean' },
    compact: { control: 'boolean' },
    access: {
      control: 'select',
      options: ['full', 'readonly', 'disabled', 'hidden'],
    },
  },
  decorators: [(Story) => <div style={{ padding: '1rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof FineKinney>;

export const Default: Story = {
  args: {
    risks: sampleRisks,
    showControls: true,
    showStatus: true,
  },
  play: async ({ canvasElement }) => {
    const cell = canvasElement.querySelector('td, [role="cell"], [role="button"]');
    if (cell) (cell as HTMLElement).click();
  },
};

export const HighRisk: Story = {
  args: {
    risks: highRisks,
    showControls: true,
    showStatus: true,
  },
};

export const Compact: Story = {
  args: {
    risks: sampleRisks,
    compact: true,
    showControls: false,
    showStatus: true,
  },
};

export const ReadOnly: Story = {
  args: {
    risks: sampleRisks,
    access: 'readonly',
    accessReason: 'Yalnızca görüntüleme yetkisi',
  },
};
