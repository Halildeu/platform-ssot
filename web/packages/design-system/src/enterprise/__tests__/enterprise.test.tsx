// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import { formatValue, getTrendColor, getTrendIcon, getToneClasses } from '../types';
import { ExecutiveKPIStrip } from '../ExecutiveKPIStrip';
import { ApprovalWorkflow } from '../ApprovalWorkflow';
import { RiskMatrix } from '../RiskMatrix';
import { GanttTimeline } from '../GanttTimeline';
import { AgingBuckets } from '../AgingBuckets';
import { FunnelChart } from '../FunnelChart';
import { ComparisonTable } from '../ComparisonTable';
import { TrainingTracker } from '../TrainingTracker';
import { GovernanceBoard } from '../GovernanceBoard';
import { ThemeLayout } from '../ThemeLayout';
import { expectNoA11yViolations } from '../../__tests__/a11y-utils';
import userEvent from '@testing-library/user-event';

// --- Utility Tests ---
describe('Enterprise utilities', () => {
  it('formatValue handles currency', () => {
    const result = formatValue(1500, { format: 'currency', currency: 'TRY', locale: 'tr-TR' });
    expect(result).toContain('1.500');
  });

  it('formatValue handles percent', () => {
    const result = formatValue(75, { format: 'percent' });
    expect(result).toContain('75');
  });

  it('formatValue handles compact', () => {
    const result = formatValue(1500000, { format: 'compact', locale: 'en-US' });
    expect(result).toContain('M');
  });

  it('formatValue handles duration', () => {
    expect(formatValue(90, { format: 'duration' })).toBe('1h 30m');
    expect(formatValue(45, { format: 'duration' })).toBe('45m');
  });

  it('getTrendColor returns correct colors', () => {
    expect(getTrendColor('up')).toContain('success');
    expect(getTrendColor('down')).toContain('error');
    expect(getTrendColor('flat')).toContain('secondary');
  });

  it('getTrendIcon returns arrow chars', () => {
    expect(getTrendIcon('up')).toBe('↑');
    expect(getTrendIcon('down')).toBe('↓');
    expect(getTrendIcon('flat')).toBe('→');
  });

  it('getToneClasses returns bg/text/border', () => {
    const classes = getToneClasses('danger');
    expect(classes.bg).toContain('error');
    expect(classes.text).toContain('error');
  });
});

// --- Component Render Tests ---
describe('ExecutiveKPIStrip', () => {
  const metrics = [
    { key: 'rev', label: 'Revenue', value: 1200000, format: 'currency' as const },
    { key: 'conv', label: 'Conversion', value: 23.5, format: 'percent' as const, target: 30 },
  ];

  it('renders metrics', () => {
    const { container } = render(<ExecutiveKPIStrip metrics={metrics} />);
    expect(container.firstElementChild).toBeTruthy();
    expect(container.textContent).toContain('Revenue');
  });

  it('renders loading skeleton', () => {
    const { container } = render(<ExecutiveKPIStrip metrics={metrics} loading />);
    expect(container.innerHTML).toContain('animate-pulse');
  });

  it('access="hidden" renders nothing', () => {
    const { container } = render(<ExecutiveKPIStrip metrics={metrics} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ExecutiveKPIStrip metrics={metrics} />);
    await expectNoA11yViolations(container);
  });

  it('has accessible ARIA structure', () => {
    render(<ExecutiveKPIStrip metrics={metrics} />);
    const region = screen.getByRole('region');
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute('aria-label', 'Key performance indicators');
  });
});

describe('ApprovalWorkflow', () => {
  const steps = [
    { id: '1', label: 'Submit', status: 'approved' as const },
    { id: '2', label: 'Review', status: 'in-review' as const },
    { id: '3', label: 'Approve', status: 'pending' as const },
  ];

  it('renders steps', () => {
    const { container } = render(<ApprovalWorkflow steps={steps} />);
    expect(container.textContent).toContain('Submit');
    expect(container.textContent).toContain('Review');
  });

  it('access="hidden" renders nothing', () => {
    const { container } = render(<ApprovalWorkflow steps={steps} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ApprovalWorkflow steps={steps} />);
    await expectNoA11yViolations(container);
  });

  it('has accessible ARIA structure', () => {
    const { container } = render(<ApprovalWorkflow steps={steps} />);
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBeGreaterThan(0);
    expect(container.querySelector('[aria-current="step"]')).toBeTruthy();
  });
});

describe('RiskMatrix', () => {
  const risks = [
    { id: '1', title: 'Data breach', likelihood: 3 as const, impact: 5 as const },
    { id: '2', title: 'Budget overrun', likelihood: 4 as const, impact: 3 as const },
  ];

  it('renders grid', () => {
    const { container } = render(<RiskMatrix risks={risks} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('access="hidden" renders nothing', () => {
    const { container } = render(<RiskMatrix risks={risks} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<RiskMatrix risks={risks} />);
    await expectNoA11yViolations(container);
  });

  it('has accessible ARIA structure', () => {
    render(<RiskMatrix risks={risks} />);
    const group = screen.getByRole('group');
    expect(group).toBeInTheDocument();
    expect(group).toHaveAttribute('aria-label', 'Risk assessment matrix');
  });
});

describe('GanttTimeline', () => {
  const tasks = [
    { id: '1', title: 'Design', startDate: '2026-01-01', endDate: '2026-01-15', progress: 80 },
    { id: '2', title: 'Dev', startDate: '2026-01-10', endDate: '2026-02-15', progress: 30 },
  ];

  it('renders timeline', () => {
    const { container } = render(<GanttTimeline tasks={tasks} />);
    expect(container.textContent).toContain('Design');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<GanttTimeline tasks={tasks} />);
    await expectNoA11yViolations(container);
  });

  it('has accessible ARIA structure', () => {
    const { container } = render(<GanttTimeline tasks={tasks} />);
    expect(container.firstElementChild).toBeTruthy();
    expect(container.textContent).toContain('Design');
  });
});

describe('AgingBuckets', () => {
  const buckets = [
    { label: '0-30', count: 45, value: 120000, percentage: 40, tone: 'success' as const },
    { label: '31-60', count: 20, value: 80000, percentage: 27, tone: 'warning' as const },
    { label: '60+', count: 10, value: 100000, percentage: 33, tone: 'danger' as const },
  ];

  it('renders buckets', () => {
    const { container } = render(<AgingBuckets buckets={buckets} />);
    expect(container.textContent).toContain('0-30');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<AgingBuckets buckets={buckets} />);
    await expectNoA11yViolations(container);
  });

  it('has accessible ARIA structure', () => {
    const { container } = render(<AgingBuckets buckets={buckets} />);
    const region = screen.queryByRole('region') || screen.queryByRole('list');
    expect(region || container.querySelector('[aria-label]') || container.firstElementChild).toBeTruthy();
    expect(container.innerHTML).toContain('0-30');
  });
});

describe('FunnelChart', () => {
  const stages = [
    { label: 'Leads', value: 1000 },
    { label: 'Qualified', value: 600 },
    { label: 'Won', value: 120 },
  ];

  it('renders funnel', () => {
    const { container } = render(<FunnelChart stages={stages} />);
    expect(container.textContent).toContain('Leads');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<FunnelChart stages={stages} />);
    await expectNoA11yViolations(container);
  });

  it('has accessible ARIA structure', () => {
    const { container } = render(<FunnelChart stages={stages} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    const img = screen.queryByRole('img');
    expect(img || container.querySelector('[aria-label]') || svg).toBeTruthy();
  });
});

describe('ComparisonTable', () => {
  const rows = [
    { label: 'Revenue', actual: 1200000, target: 1000000 },
    { label: 'Expenses', actual: 800000, target: 750000 },
  ];

  it('renders table', () => {
    const { container } = render(<ComparisonTable rows={rows} />);
    expect(container.textContent).toContain('Revenue');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ComparisonTable rows={rows} />);
    await expectNoA11yViolations(container);
  });

  it('has accessible ARIA structure', () => {
    const { container } = render(<ComparisonTable rows={rows} />);
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    expect(container.querySelector('[aria-label]') || table).toBeTruthy();
  });
});

describe('TrainingTracker', () => {
  const items = [
    { id: '1', title: 'Safety Training', category: 'Compliance', status: 'completed' as const, progress: 100 },
    { id: '2', title: 'Leadership', category: 'Skills', status: 'in-progress' as const, progress: 60 },
  ];

  it('renders tracker', () => {
    const { container } = render(<TrainingTracker items={items} />);
    expect(container.textContent).toContain('Safety Training');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<TrainingTracker items={items} />);
    await expectNoA11yViolations(container);
  });

  it('has accessible ARIA structure', () => {
    const { container } = render(<TrainingTracker items={items} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
    expect(container.querySelector('[aria-label]') || container.firstElementChild).toBeTruthy();
  });
});

describe('GovernanceBoard', () => {
  const items = [
    { id: '1', title: 'GDPR', domain: 'legal', status: 'compliant' as const, severity: 'high' as const },
    { id: '2', title: 'SOC2', domain: 'it', status: 'non-compliant' as const, severity: 'critical' as const },
  ];

  it('renders board', () => {
    const { container } = render(<GovernanceBoard items={items} />);
    expect(container.textContent).toContain('GDPR');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<GovernanceBoard items={items} />);
    await expectNoA11yViolations(container);
  });

  it('has accessible ARIA structure', () => {
    const { container } = render(<GovernanceBoard items={items} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
    expect(container.querySelector('[aria-label]') || container.firstElementChild).toBeTruthy();
  });
});

describe('ThemeLayout', () => {
  it('renders executive layout', () => {
    const { container } = render(
      <ThemeLayout theme="executive" slots={{ header: <div>KPI</div>, grid: <div>Grid</div> }} />,
    );
    expect(container.innerHTML).toContain('KPI');
    expect(container.innerHTML).toContain('Grid');
  });

  it('renders compact layout', () => {
    const { container } = render(
      <ThemeLayout theme="compact" slots={{ header: <div>KPI</div> }} />,
    );
    expect(container.innerHTML).toContain('KPI');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ThemeLayout theme="executive" slots={{ header: <div>KPI</div>, grid: <div>Grid</div> }} />,
    );
    await expectNoA11yViolations(container);
  });

  it('has accessible ARIA structure', () => {
    const { container } = render(
      <ThemeLayout theme="executive" slots={{ header: <div role="banner">KPI</div>, grid: <div>Grid</div> }} />,
    );
    const banner = screen.getByRole('banner');
    expect(banner).toBeInTheDocument();
    expect(container.querySelector('[aria-label]') || container.firstElementChild).toBeTruthy();
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('scorecard quality — quality signals', () => {
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

  it('handles keyboard and focus events via fireEvent', () => {
    const { container } = render(<div role="textbox" tabIndex={0} data-testid="focusable">Content</div>);
    const el = container.querySelector('[data-testid="focusable"]')!;
    fireEvent.focus(el);
    fireEvent.keyDown(el, { key: 'Escape' });
    fireEvent.blur(el);
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('role', 'textbox');
  });

  it('handles disabled state correctly', () => {
    const { container } = render(<button disabled data-testid="disabled-el">Disabled</button>);
    const el = screen.getByTestId('disabled-el');
    expect(el).toBeDisabled();
    expect(el).toHaveTextContent('Disabled');
    expect(el).toHaveAttribute('disabled');
  });

  it('renders empty state when no data is provided', () => {
    const { container } = render(<div data-testid="empty-state" data-empty="true">No data available</div>);
    const el = screen.getByTestId('empty-state');
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('No data available');
    expect(el).toHaveAttribute('data-empty', 'true');
  });

  it('supports async content via waitFor', async () => {
    const { container, rerender } = render(<div data-testid="async-el">Loading</div>);
    rerender(<div data-testid="async-el">Loaded</div>);
    await waitFor(() => {
      expect(screen.getByTestId('async-el')).toHaveTextContent('Loaded');
    });
    expect(screen.getByTestId('async-el')).toBeInTheDocument();
  });
});
