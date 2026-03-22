// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
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
});
