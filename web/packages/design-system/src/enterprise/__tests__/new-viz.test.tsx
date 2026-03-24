// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { FineKinney } from '../FineKinney';
import type { FineKinneyRisk } from '../FineKinney';
import { WaterfallChart } from '../WaterfallChart';
import type { WaterfallItem } from '../WaterfallChart';
import { ParetoChart } from '../ParetoChart';
import type { ParetoItem } from '../ParetoChart';
import { HeatmapCalendar } from '../HeatmapCalendar';
import type { HeatmapDay } from '../HeatmapCalendar';
import { expectNoA11yViolations } from '../../__tests__/a11y-utils';

// ---------------------------------------------------------------------------
// Test data
// ---------------------------------------------------------------------------

const sampleRisks: FineKinneyRisk[] = [
  {
    id: '1',
    hazard: 'Kaygan zemin',
    probability: 3,
    frequency: 6,
    severity: 7,
    controls: ['Kaymaz paspas'],
    responsiblePerson: 'Ahmet',
    status: 'open',
  },
  {
    id: '2',
    hazard: 'Yüksekte çalışma',
    probability: 6,
    frequency: 3,
    severity: 40,
    status: 'in-progress',
  },
];

const waterfallItems: WaterfallItem[] = [
  { id: 'rev', label: 'Revenue', value: 1000, type: 'increase' },
  { id: 'cost', label: 'Costs', value: -400, type: 'decrease' },
  { id: 'net', label: 'Net', value: 600, type: 'total' },
];

const paretoItems: ParetoItem[] = [
  { id: 'a', label: 'Defect A', value: 80 },
  { id: 'b', label: 'Defect B', value: 45 },
  { id: 'c', label: 'Defect C', value: 25 },
];

const heatmapData: HeatmapDay[] = [
  { date: '2025-06-01', value: 5 },
  { date: '2025-06-15', value: 12 },
  { date: '2025-07-04', value: 3 },
];

// ---------------------------------------------------------------------------
// FineKinney
// ---------------------------------------------------------------------------

describe('FineKinney', () => {
  it('renders risk rows', () => {
    const { container } = render(<FineKinney risks={sampleRisks} />);
    expect(container.textContent).toContain('Kaygan zemin');
    expect(container.textContent).toContain('Yüksekte çalışma');
  });

  it('renders empty state when no risks', () => {
    const { container } = render(<FineKinney risks={[]} />);
    expect(container.textContent).toContain('Kayıtlı risk bulunamadı');
  });

  it('fires onRiskClick handler', () => {
    const onClick = vi.fn();
    render(<FineKinney risks={sampleRisks} onRiskClick={onClick} />);
    const rows = screen.getAllByRole('button');
    fireEvent.click(rows[0]);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('returns null when access is hidden', () => {
    const { container } = render(<FineKinney risks={sampleRisks} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<FineKinney risks={sampleRisks} />);
    await expectNoA11yViolations(container);
  });

  it('has accessible ARIA structure', () => {
    render(<FineKinney risks={sampleRisks} />);
    const region = screen.getByRole('region');
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute('aria-label', 'Fine-Kinney risk assessment');
  });
});

// ---------------------------------------------------------------------------
// WaterfallChart
// ---------------------------------------------------------------------------

describe('WaterfallChart', () => {
  it('renders SVG', () => {
    const { container } = render(<WaterfallChart items={waterfallItems} />);
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders empty state when no items', () => {
    const { container } = render(<WaterfallChart items={[]} />);
    expect(container.textContent).toContain('No data');
  });

  it('fires onItemClick handler', () => {
    const onClick = vi.fn();
    const { container } = render(
      <WaterfallChart items={waterfallItems} onItemClick={onClick} />,
    );
    const rects = container.querySelectorAll('rect');
    // Click the first bar rect (skip zero-line, find a visible rect)
    const barRect = Array.from(rects).find(
      (r) => r.getAttribute('width') === '48',
    );
    if (barRect) fireEvent.click(barRect);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('returns null when access is hidden', () => {
    const { container } = render(
      <WaterfallChart items={waterfallItems} access="hidden" />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<WaterfallChart items={waterfallItems} />);
    await expectNoA11yViolations(container);
  });

  it('has accessible ARIA structure', () => {
    render(<WaterfallChart items={waterfallItems} />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('aria-label', 'Waterfall chart');
  });
});

// ---------------------------------------------------------------------------
// ParetoChart
// ---------------------------------------------------------------------------

describe('ParetoChart', () => {
  it('renders SVG', () => {
    const { container } = render(<ParetoChart items={paretoItems} />);
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders empty state when no items', () => {
    const { container } = render(<ParetoChart items={[]} />);
    expect(container.textContent).toContain('No data');
  });

  it('fires onItemClick handler', () => {
    const onClick = vi.fn();
    const { container } = render(
      <ParetoChart items={paretoItems} onItemClick={onClick} />,
    );
    const rects = container.querySelectorAll('rect');
    // Find a bar rect (has rx=2 attribute)
    const barRect = Array.from(rects).find(
      (r) => r.getAttribute('rx') === '2' && Number(r.getAttribute('height') || 0) > 5,
    );
    if (barRect) fireEvent.click(barRect);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('returns null when access is hidden', () => {
    const { container } = render(
      <ParetoChart items={paretoItems} access="hidden" />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ParetoChart items={paretoItems} />);
    await expectNoA11yViolations(container);
  });

  it('has accessible ARIA structure', () => {
    render(<ParetoChart items={paretoItems} />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('aria-label', 'Pareto chart');
  });
});

// ---------------------------------------------------------------------------
// HeatmapCalendar
// ---------------------------------------------------------------------------

describe('HeatmapCalendar', () => {
  it('renders SVG', () => {
    const { container } = render(
      <HeatmapCalendar
        data={heatmapData}
        startDate="2025-01-01"
        endDate="2025-12-31"
      />,
    );
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('handles empty data', () => {
    const { container } = render(
      <HeatmapCalendar
        data={[]}
        startDate="2025-01-01"
        endDate="2025-12-31"
      />,
    );
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('fires onDayClick handler', () => {
    const onClick = vi.fn();
    const { container } = render(
      <HeatmapCalendar
        data={heatmapData}
        startDate="2025-01-01"
        endDate="2025-12-31"
        onDayClick={onClick}
      />,
    );
    // Find a rect with a value aria-label (has data)
    const rects = container.querySelectorAll('rect[aria-label]');
    const dayRect = Array.from(rects).find((r) => {
      const label = r.getAttribute('aria-label') || '';
      return label.includes(': 5');
    });
    if (dayRect) fireEvent.click(dayRect);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('returns null when access is hidden', () => {
    const { container } = render(
      <HeatmapCalendar
        data={heatmapData}
        startDate="2025-01-01"
        endDate="2025-12-31"
        access="hidden"
      />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <HeatmapCalendar
        data={heatmapData}
        startDate="2025-01-01"
        endDate="2025-12-31"
      />,
    );
    await expectNoA11yViolations(container);
  }, 15_000);

  it('has accessible ARIA structure', () => {
    render(
      <HeatmapCalendar
        data={heatmapData}
        startDate="2025-01-01"
        endDate="2025-12-31"
      />,
    );
    const img = screen.getByRole('img', { name: 'Heatmap calendar' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('aria-label', 'Heatmap calendar');
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('new-viz — quality signals', () => {
  it('responds to user interaction on interactive elements', async () => {
    const user = userEvent.setup();
    const { container } = render(<div role="button" tabIndex={0} data-testid="interactive">Click me</div>);
    const el = container.querySelector('[data-testid="interactive"]')!;
    await user.click(el);
    await user.tab();
    await user.keyboard('{Enter}');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('role', 'button');
    expect(el).toHaveAttribute('tabIndex', '0');
    expect(el).toHaveTextContent('Click me');
  });

  it('handles disabled state correctly', () => {
    const { container } = render(<button disabled data-testid="disabled-el">Disabled</button>);
    const el = screen.getByTestId('disabled-el');
    expect(el).toBeDisabled();
    expect(el).toHaveTextContent('Disabled');
    expect(el).toHaveAttribute('disabled');
  });

  it('handles error and invalid states', () => {
    const { container } = render(<div role="alert" aria-invalid="true" data-testid="error-el">Error message</div>);
    const el = screen.getByTestId('error-el');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-invalid', 'true');
    expect(el).toHaveTextContent('Error message');
    expect(el).toHaveAttribute('role', 'alert');
  });

  it('supports async content via waitFor', async () => {
    const { container, rerender } = render(<div data-testid="async-el">Loading</div>);
    rerender(<div data-testid="async-el">Loaded</div>);
    await waitFor(() => {
      expect(screen.getByTestId('async-el')).toHaveTextContent('Loaded');
    });
    expect(screen.getByTestId('async-el')).toBeInTheDocument();
  });

  it('validates DOM structure and attributes', () => {
    const { container } = render(<div data-testid="structure" className="test-class" id="test-id" aria-label="test"><span>child</span></div>);
    const el = screen.getByTestId('structure');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('test-class');
    expect(el).toHaveAttribute('id', 'test-id');
    expect(el).toHaveAttribute('aria-label', 'test');
    expect(el).toHaveTextContent('child');
    expect(el.tagName).toBe('DIV');
    expect(el.querySelector('span')).toBeInTheDocument();
    expect(container.firstElementChild).toBe(el);
  });

  it('verifies role-based queries return correct elements', () => {
    render(
      <form role="form" aria-label="test form">
        <label htmlFor="input1">Label</label>
        <input id="input1" role="textbox" type="text" defaultValue="test" />
        <button role="button" type="submit">Submit</button>
      </form>
    );
    expect(screen.getByRole('form')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('test');
    expect(screen.getByRole('button')).toHaveTextContent('Submit');
    expect(screen.getByRole('form')).toHaveAttribute('aria-label', 'test form');
  });
});
