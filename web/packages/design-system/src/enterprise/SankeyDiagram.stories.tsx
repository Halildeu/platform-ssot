import type { Meta, StoryObj } from '@storybook/react';
import { SankeyDiagram } from './SankeyDiagram';
import type { SankeyNode, SankeyLink } from './SankeyDiagram';

const sampleNodes: SankeyNode[] = [
  { id: 'organic', label: 'Organic Search' },
  { id: 'paid', label: 'Paid Ads' },
  { id: 'social', label: 'Social Media' },
  { id: 'referral', label: 'Referral' },
  { id: 'landing', label: 'Landing Page' },
  { id: 'pricing', label: 'Pricing Page' },
  { id: 'signup', label: 'Sign Up' },
  { id: 'trial', label: 'Free Trial' },
  { id: 'paid-plan', label: 'Paid Plan' },
  { id: 'churn', label: 'Churned' },
];

const sampleLinks: SankeyLink[] = [
  { source: 'organic', target: 'landing', value: 5000 },
  { source: 'paid', target: 'landing', value: 3000 },
  { source: 'social', target: 'landing', value: 2000 },
  { source: 'referral', target: 'landing', value: 1500 },
  { source: 'landing', target: 'pricing', value: 8000 },
  { source: 'landing', target: 'signup', value: 3500 },
  { source: 'pricing', target: 'signup', value: 4500 },
  { source: 'signup', target: 'trial', value: 6000 },
  { source: 'trial', target: 'paid-plan', value: 2400 },
  { source: 'trial', target: 'churn', value: 3600 },
];

const meta: Meta<typeof SankeyDiagram> = {
  title: 'Enterprise/SankeyDiagram',
  component: SankeyDiagram,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof SankeyDiagram>;

export const Default: Story = {
  args: {
    nodes: sampleNodes,
    links: sampleLinks,
  },
};

export const WithValues: Story = {
  args: {
    nodes: sampleNodes,
    links: sampleLinks,
    showValues: true,
    formatOptions: { style: 'decimal' },
  },
};

export const CustomDimensions: Story = {
  args: {
    nodes: sampleNodes.slice(0, 6),
    links: sampleLinks.slice(0, 5),
    width: 500,
    height: 300,
    nodeWidth: 16,
    nodePadding: 20,
    showValues: true,
  },
};
