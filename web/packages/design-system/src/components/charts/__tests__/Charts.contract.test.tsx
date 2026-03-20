// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { BarChart } from '../BarChart';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

const sampleData = [
  { label: 'Jan', value: 100 },
  { label: 'Feb', value: 200 },
  { label: 'Mar', value: 150 },
];

describe('BarChart contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(BarChart.displayName).toBe('BarChart');
  });

  /* ---- Default render ---- */
  it('renders bars for each data point', () => {
    render(<BarChart data={sampleData} />);
    const bars = screen.getAllByTestId('bar-chart-bar');
    expect(bars).toHaveLength(3);
  });

  it('sets data-testid on root', () => {
    render(<BarChart data={sampleData} />);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  /* ---- Title ---- */
  it('renders title when provided', () => {
    render(<BarChart data={sampleData} title="Revenue" />);
    expect(screen.getByTestId('bar-chart-title')).toHaveTextContent('Revenue');
  });

  /* ---- Empty state ---- */
  it('renders empty state when data is empty', () => {
    render(<BarChart data={[]} />);
    expect(screen.getByTestId('bar-chart-empty')).toBeInTheDocument();
  });

  /* ---- showValues ---- */
  it('renders value labels when showValues=true', () => {
    render(<BarChart data={sampleData} showValues />);
    const values = screen.getAllByTestId('bar-chart-value');
    expect(values.length).toBeGreaterThanOrEqual(3);
  });

  /* ---- showLegend ---- */
  it('renders legend when showLegend=true', () => {
    render(<BarChart data={sampleData} showLegend />);
    expect(screen.getByTestId('bar-chart-legend')).toBeInTheDocument();
  });

  /* ---- className merging ---- */
  it('merges className on root element', () => {
    render(<BarChart data={sampleData} className="my-chart" />);
    expect(screen.getByTestId('bar-chart').className).toContain('my-chart');
  });

  /* ---- Access hidden ---- */
  it('renders nothing when access=hidden', () => {
    const { container } = render(<BarChart data={sampleData} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  /* ---- SVG role=img ---- */
  it('has SVG with role=img and aria-label', () => {
    render(<BarChart data={sampleData} title="Rev" description="Q1" />);
    const svg = screen.getByRole('img');
    expect(svg).toHaveAttribute('aria-label', 'Rev — Q1');
  });
});

describe('BarChart — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<BarChart data={sampleData} title="Revenue" />);
    await expectNoA11yViolations(container);
  });
});
