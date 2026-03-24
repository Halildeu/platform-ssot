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
  argTypes: { disabled: { control: 'boolean' } },
};
export default meta;
type Story = StoryObj<typeof RiskMatrix>;

export const Default: Story = {
  args: {
    risks: sampleRisks,
    showLegend: true,
  },
  play: async ({ canvasElement }) => {
    const cell = canvasElement.querySelector('td, [role="cell"], [role="button"]');
    if (cell) (cell as HTMLElement).click();
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

export const Interactive: Story = {
  args: {
    risks: sampleRisks,
    showLegend: true,
    onCellClick: (risks: RiskItem[], l: number, i: number) =>
      console.log(`Cell L${l}/I${i}:`, risks),
  },
};

export const EmptyMatrix: Story = {
  args: {
    risks: [],
    showLegend: true,
  },
};

export const MediumSize: Story = {
  args: {
    risks: sampleRisks,
    size: 'md',
    showLegend: true,
  },
};
