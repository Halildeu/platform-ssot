import type { Meta, StoryObj } from '@storybook/react';
import { RiskMatrix } from './RiskMatrix';
import type { RiskItem } from './RiskMatrix';

const sampleRisks: RiskItem[] = [
  { id: 'r1', title: 'Data Breach', likelihood: 2, impact: 5 },
  { id: 'r2', title: 'Server Downtime', likelihood: 3, impact: 4 },
  { id: 'r3', title: 'Supply Chain Delay', likelihood: 4, impact: 3 },
  { id: 'r4', title: 'Regulatory Fine', likelihood: 1, impact: 5 },
  { id: 'r5', title: 'Staff Turnover', likelihood: 3, impact: 2 },
  { id: 'r6', title: 'Currency Fluctuation', likelihood: 4, impact: 2 },
  { id: 'r7', title: 'Cyber Attack', likelihood: 2, impact: 4 },
];

const meta: Meta<typeof RiskMatrix> = {
  title: 'Enterprise/RiskMatrix',
  component: RiskMatrix,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof RiskMatrix>;

export const Default: Story = {
  args: {
    risks: sampleRisks,
    showLegend: true,
  },
};

export const LargeWithCustomLabels: Story = {
  args: {
    risks: sampleRisks,
    size: 'lg',
    showLegend: true,
    likelihoodLabels: ['Nadir', 'Dusuk', 'Orta', 'Yuksek', 'Cok Yuksek'],
    impactLabels: ['Onemsiz', 'Kucuk', 'Orta', 'Buyuk', 'Felaket'],
  },
};

export const SmallCompact: Story = {
  args: {
    risks: sampleRisks.slice(0, 3),
    size: 'sm',
    showLegend: false,
  },
};
