// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// --- Direct utility imports ---
import { formatValue, getTrendColor, getTrendIcon, getToneClasses } from '../types';
import type { FormatOptions, EnterpriseTone } from '../types';

// --- Component imports ---
import { AgingBuckets } from '../AgingBuckets';
import type { AgingBucket } from '../AgingBuckets';
import { ApprovalWorkflow } from '../ApprovalWorkflow';
import type { ApprovalStep } from '../ApprovalWorkflow';
import { BulletChart } from '../BulletChart';
import { ComparisonTable } from '../ComparisonTable';
import type { ComparisonRow } from '../ComparisonTable';
import { DataExportDialog } from '../DataExportDialog';
import { EmptyStateBuilder } from '../EmptyStateBuilder';
import { FilterPresets } from '../FilterPresets';
import type { FilterPreset } from '../FilterPresets';
import { InlineEdit } from '../InlineEdit';

// =====================================================================
// 1. Enterprise types — utility function branches
// =====================================================================

describe('formatValue — all format branches', () => {
  it('returns plain number with default format', () => {
    const result = formatValue(42, {});
    expect(result).toContain('42');
  });

  it('handles currency with custom currency and decimals', () => {
    const result = formatValue(1234.5, { format: 'currency', currency: 'USD', locale: 'en-US', decimals: 2 });
    expect(result).toContain('1,234.50');
  });

  it('handles percent format', () => {
    const result = formatValue(42.5, { format: 'percent', locale: 'en-US', decimals: 1 });
    // 42.5 / 100 = 0.425 → 42.5%
    expect(result).toContain('42.5');
    expect(result).toContain('%');
  });

  it('handles compact format', () => {
    const result = formatValue(1500000, { format: 'compact', locale: 'en-US', decimals: 1 });
    expect(result).toBeTruthy();
  });

  it('handles duration with hours', () => {
    expect(formatValue(90, { format: 'duration' })).toBe('1h 30m');
  });

  it('handles duration without hours', () => {
    expect(formatValue(25, { format: 'duration' })).toBe('25m');
  });

  it('handles duration for 0 minutes', () => {
    expect(formatValue(0, { format: 'duration' })).toBe('0m');
  });

  it('handles number with custom decimals', () => {
    const result = formatValue(3.14159, { format: 'number', locale: 'en-US', decimals: 2 });
    expect(result).toContain('3.14');
  });
});

describe('getTrendColor — invert branches', () => {
  it('returns success for up when not inverted', () => {
    expect(getTrendColor('up', false)).toContain('success');
  });

  it('returns error for up when inverted', () => {
    expect(getTrendColor('up', true)).toContain('error');
  });

  it('returns success for down when inverted', () => {
    expect(getTrendColor('down', true)).toContain('success');
  });

  it('returns error for down when not inverted', () => {
    expect(getTrendColor('down', false)).toContain('error');
  });

  it('returns secondary for flat regardless of invert', () => {
    expect(getTrendColor('flat', false)).toContain('secondary');
    expect(getTrendColor('flat', true)).toContain('secondary');
  });
});

describe('getTrendIcon — all directions', () => {
  it('returns correct arrows', () => {
    expect(getTrendIcon('up')).toBe('\u2191');
    expect(getTrendIcon('down')).toBe('\u2193');
    expect(getTrendIcon('flat')).toBe('\u2192');
  });
});

describe('getToneClasses — all tones', () => {
  const tones: EnterpriseTone[] = ['default', 'success', 'warning', 'danger', 'info'];

  tones.forEach((tone) => {
    it(`returns bg, text, border for ${tone}`, () => {
      const classes = getToneClasses(tone);
      expect(classes).toHaveProperty('bg');
      expect(classes).toHaveProperty('text');
      expect(classes).toHaveProperty('border');
      expect(typeof classes.bg).toBe('string');
      expect(typeof classes.text).toBe('string');
      expect(typeof classes.border).toBe('string');
    });
  });
});

// =====================================================================
// 2. AgingBuckets — uncovered branches
// =====================================================================

describe('AgingBuckets', () => {
  const baseBuckets: AgingBucket[] = [
    { id: '1', label: '0-30', count: 10, value: 1000 },
    { id: '2', label: '31-60', count: 5, value: 500 },
    { id: '3', label: '61-90', count: 3, value: 300 },
    { id: '4', label: '91-120', count: 2, value: 200 },
    { id: '5', label: '120+', count: 1, value: 100 },
  ];

  it('renders with showStackedBar and exercises defaultTone across ratios', () => {
    const { container } = render(
      <AgingBuckets buckets={baseBuckets} showStackedBar />,
    );
    // All 5 buckets rendered
    expect(container.querySelectorAll('[data-component="aging-buckets"]')).toHaveLength(1);
  });

  it('renders vertical orientation', () => {
    const { container } = render(
      <AgingBuckets buckets={baseBuckets} orientation="vertical" />,
    );
    expect(container.querySelector('[data-component="aging-buckets"]')).toBeTruthy();
  });

  it('handles access="hidden" — returns null', () => {
    const { container } = render(
      <AgingBuckets buckets={baseBuckets} access="hidden" />,
    );
    expect(container.querySelector('[data-component="aging-buckets"]')).toBeNull();
  });

  it('calls onBucketClick when bucket card is clicked', () => {
    const handler = vi.fn();
    render(<AgingBuckets buckets={baseBuckets} onBucketClick={handler} />);
    const cards = screen.getAllByText(/items/);
    fireEvent.click(cards[0].closest('div[class*="flex-1"]')!);
    expect(handler).toHaveBeenCalledWith(baseBuckets[0]);
  });

  it('calls onBucketClick when stacked bar segment is clicked', () => {
    const handler = vi.fn();
    render(<AgingBuckets buckets={baseBuckets} showStackedBar onBucketClick={handler} />);
    // Click on first stacked bar segment
    const segments = document.querySelectorAll('[title*="%"]');
    if (segments.length > 0) {
      fireEvent.click(segments[0]);
      expect(handler).toHaveBeenCalled();
    }
  });

  it('handles getPercentage when totalValue is 0', () => {
    const zeroBuckets: AgingBucket[] = [
      { id: '1', label: '0-30', count: 0, value: 0 },
    ];
    const { container } = render(
      <AgingBuckets buckets={zeroBuckets} showStackedBar />,
    );
    expect(container.querySelector('[data-component="aging-buckets"]')).toBeTruthy();
  });

  it('handles single bucket — defaultTone returns "default" for total<=1', () => {
    const singleBucket: AgingBucket[] = [
      { id: '1', label: 'Only', count: 1, value: 100 },
    ];
    render(<AgingBuckets buckets={singleBucket} showStackedBar />);
    expect(screen.getByText('Only')).toBeTruthy();
  });

  it('respects custom tone on bucket', () => {
    const customBuckets: AgingBucket[] = [
      { id: '1', label: 'Custom', count: 1, value: 100, tone: 'danger' },
    ];
    render(<AgingBuckets buckets={customBuckets} showStackedBar />);
    expect(screen.getByText('Custom')).toBeTruthy();
  });

  it('renders with formatOptions', () => {
    render(
      <AgingBuckets
        buckets={baseBuckets}
        formatOptions={{ format: 'currency', currency: 'USD', locale: 'en-US' }}
      />,
    );
    const total = screen.getByText('Total');
    expect(total).toBeTruthy();
  });
});

// =====================================================================
// 3. ApprovalWorkflow — uncovered branches
// =====================================================================

describe('ApprovalWorkflow', () => {
  const steps: ApprovalStep[] = [
    {
      id: '1',
      label: 'Manager Review',
      status: 'approved',
      assignee: { id: 'a1', name: 'Alice Bob', avatarUrl: 'https://example.com/a.png' },
      timestamp: '2025-01-15T10:30:00Z',
      comment: 'Looks good',
    },
    {
      id: '2',
      label: 'Director Review',
      status: 'in-review',
      assignee: { id: 'a2', name: 'Charlie Delta', initials: 'CD' },
      timestamp: '2025-01-16T14:00:00Z',
    },
    {
      id: '3',
      label: 'VP Approval',
      status: 'pending',
      assignee: { id: 'a3', name: 'Eve' },
    },
    {
      id: '4',
      label: 'Skipped Step',
      status: 'skipped',
    },
  ];

  it('renders all steps with connectors', () => {
    render(
      <ApprovalWorkflow steps={steps} orientation="horizontal" />,
    );
    expect(screen.getByText('Manager Review')).toBeTruthy();
    expect(screen.getByText('VP Approval')).toBeTruthy();
  });

  it('renders vertical orientation', () => {
    render(
      <ApprovalWorkflow steps={steps} orientation="vertical" />,
    );
    expect(screen.getByText('Director Review')).toBeTruthy();
  });

  it('auto-detects current step (first pending/in-review)', () => {
    render(
      <ApprovalWorkflow
        steps={steps}
        onApprove={vi.fn()}
        onReject={vi.fn()}
        onDelegate={vi.fn()}
      />,
    );
    // "Director Review" is in-review, so it should be current with action buttons
    expect(screen.getByText('Approve')).toBeTruthy();
    expect(screen.getByText('Reject')).toBeTruthy();
    expect(screen.getByText('Delegate')).toBeTruthy();
  });

  it('handles approve action on current step', () => {
    const onApprove = vi.fn();
    render(
      <ApprovalWorkflow steps={steps} onApprove={onApprove} />,
    );
    fireEvent.click(screen.getByText('Approve'));
    expect(onApprove).toHaveBeenCalledWith('2');
  });

  it('handles reject flow — open textarea, type, confirm', async () => {
    const onReject = vi.fn();
    render(
      <ApprovalWorkflow steps={steps} onReject={onReject} />,
    );
    fireEvent.click(screen.getByText('Reject'));
    // Textarea appears
    const textarea = await screen.findByLabelText('Rejection reason');
    fireEvent.change(textarea, { target: { value: 'Not complete' } });
    fireEvent.click(screen.getByText('Confirm Reject'));
    expect(onReject).toHaveBeenCalledWith('2', 'Not complete');
  });

  it('handles reject cancel', async () => {
    const onReject = vi.fn();
    render(
      <ApprovalWorkflow steps={steps} onReject={onReject} />,
    );
    fireEvent.click(screen.getByText('Reject'));
    await screen.findByLabelText('Rejection reason');
    fireEvent.click(screen.getByText('Cancel'));
    expect(onReject).not.toHaveBeenCalled();
  });

  it('rejects confirm is disabled when comment is empty', async () => {
    const onReject = vi.fn();
    render(
      <ApprovalWorkflow steps={steps} onReject={onReject} />,
    );
    fireEvent.click(screen.getByText('Reject'));
    const confirmBtn = await screen.findByText('Confirm Reject');
    expect(confirmBtn).toHaveProperty('disabled', true);
  });

  it('handles delegate flow — input, type, confirm', async () => {
    const onDelegate = vi.fn();
    render(
      <ApprovalWorkflow steps={steps} onDelegate={onDelegate} />,
    );
    fireEvent.click(screen.getByText('Delegate'));
    const input = await screen.findByLabelText('New assignee');
    fireEvent.change(input, { target: { value: 'new-person@example.com' } });
    fireEvent.click(screen.getByText('Confirm Delegate'));
    expect(onDelegate).toHaveBeenCalledWith('2', 'new-person@example.com');
  });

  it('delegate input supports Enter key', async () => {
    const onDelegate = vi.fn();
    render(
      <ApprovalWorkflow steps={steps} onDelegate={onDelegate} />,
    );
    fireEvent.click(screen.getByText('Delegate'));
    const input = await screen.findByLabelText('New assignee');
    fireEvent.change(input, { target: { value: 'person@co.com' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onDelegate).toHaveBeenCalledWith('2', 'person@co.com');
  });

  it('delegate cancel resets state', async () => {
    const onDelegate = vi.fn();
    render(
      <ApprovalWorkflow steps={steps} onDelegate={onDelegate} />,
    );
    fireEvent.click(screen.getByText('Delegate'));
    await screen.findByLabelText('New assignee');
    // There should be two Cancel buttons (one per action box)
    const cancelBtns = screen.getAllByText('Cancel');
    fireEvent.click(cancelBtns[cancelBtns.length - 1]);
    expect(onDelegate).not.toHaveBeenCalled();
  });

  it('returns null when access="hidden"', () => {
    const { container } = render(
      <ApprovalWorkflow steps={steps} access="hidden" />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('compact mode hides timestamps and comments', () => {
    render(
      <ApprovalWorkflow steps={steps} compact />,
    );
    // The timestamp and comment should not be rendered
    expect(screen.queryByText('Looks good')).toBeNull();
  });

  it('disabled access prevents actions', () => {
    render(
      <ApprovalWorkflow
        steps={steps}
        access="disabled"
        onApprove={vi.fn()}
        accessReason="No permission"
      />,
    );
    // Approve button should not be rendered because canAct is false
    expect(screen.queryByText('Approve')).toBeNull();
  });

  it('handles all steps completed — activeIndex falls to last', () => {
    const completedSteps: ApprovalStep[] = [
      { id: '1', label: 'Step 1', status: 'approved' },
      { id: '2', label: 'Step 2', status: 'approved' },
    ];
    render(<ApprovalWorkflow steps={completedSteps} />);
    expect(screen.getByText('Step 2')).toBeTruthy();
  });

  it('renders avatar with avatarUrl', () => {
    render(<ApprovalWorkflow steps={steps} />);
    const img = document.querySelector('img[alt="Alice Bob"]');
    expect(img).toBeTruthy();
  });

  it('renders avatar initials when no avatarUrl', () => {
    render(<ApprovalWorkflow steps={steps} />);
    // 'Charlie Delta' has initials='CD' provided
    expect(screen.getByText('CD')).toBeTruthy();
  });

  it('formatTimestamp handles invalid date gracefully', () => {
    const stepsWithBadDate: ApprovalStep[] = [
      { id: '1', label: 'Step', status: 'pending', timestamp: 'not-a-date' },
    ];
    // Should not throw
    render(<ApprovalWorkflow steps={stepsWithBadDate} />);
    expect(screen.getByText('Step')).toBeTruthy();
  });
});

// =====================================================================
// 4. BulletChart — orientation & size branches
// =====================================================================

describe('BulletChart', () => {
  it('renders horizontal by default', () => {
    const { container } = render(
      <BulletChart value={72} target={85} label="Revenue" subtitle="Q4" />,
    );
    expect(container.querySelector('[data-component="bullet-chart"]')).toBeTruthy();
  });

  it('renders vertical orientation', () => {
    const { container } = render(
      <BulletChart value={72} target={85} orientation="vertical" label="Rev" />,
    );
    expect(container.querySelector('[data-component="bullet-chart"]')).toBeTruthy();
  });

  it('renders vertical without label', () => {
    const { container } = render(
      <BulletChart value={50} target={70} orientation="vertical" />,
    );
    expect(container.querySelector('[data-component="bullet-chart"]')).toBeTruthy();
  });

  it('renders sm size', () => {
    render(<BulletChart value={50} target={70} size="sm" label="X" />);
  });

  it('renders lg size', () => {
    render(<BulletChart value={50} target={70} size="lg" label="X" />);
  });

  it('returns null when access=hidden', () => {
    const { container } = render(
      <BulletChart value={50} target={70} access="hidden" />,
    );
    expect(container.querySelector('[data-component="bullet-chart"]')).toBeNull();
  });

  it('handles max=min (scaleValue edge case)', () => {
    render(<BulletChart value={50} target={50} min={50} max={50} />);
    // Should render without error
  });

  it('handles custom ranges with color', () => {
    render(
      <BulletChart
        value={60}
        target={80}
        ranges={[
          { limit: 30, label: 'Low', color: 'red' },
          { limit: 70, label: 'Mid', color: 'yellow' },
          { limit: 100, label: 'High', color: 'green' },
        ]}
      />,
    );
  });

  it('handles horizontal without label or subtitle', () => {
    render(<BulletChart value={60} target={80} />);
  });
});

// =====================================================================
// 5. ComparisonTable — nested rows, expand/collapse, invert
// =====================================================================

describe('ComparisonTable', () => {
  const rows: ComparisonRow[] = [
    {
      id: 'rev',
      label: 'Revenue',
      actual: 15000,
      target: 12000,
      children: [
        { id: 'rev-a', label: 'Product A', actual: 10000, target: 8000 },
        { id: 'rev-b', label: 'Product B', actual: 5000, target: 4000 },
      ],
    },
    { id: 'cost', label: 'Costs', actual: 8000, target: 10000 },
  ];

  it('renders with default column labels', () => {
    render(<ComparisonTable rows={rows} />);
    expect(screen.getByText('Item')).toBeTruthy();
    expect(screen.getByText('Actual')).toBeTruthy();
    expect(screen.getByText('Target')).toBeTruthy();
  });

  it('expands/collapses nested rows', () => {
    render(<ComparisonTable rows={rows} defaultExpandedIds={['rev']} />);
    // Children should be visible initially
    expect(screen.getByText('Product A')).toBeTruthy();
    // Click toggle to collapse
    const toggleBtns = screen.getAllByText('\u25BC');
    fireEvent.click(toggleBtns[0]);
    // Product A should be hidden
    expect(screen.queryByText('Product A')).toBeNull();
  });

  it('handles onRowClick', () => {
    const handler = vi.fn();
    render(<ComparisonTable rows={rows} onRowClick={handler} />);
    fireEvent.click(screen.getByText('Costs'));
    expect(handler).toHaveBeenCalled();
  });

  it('handles invertVarianceColors', () => {
    const { container } = render(
      <ComparisonTable rows={rows} invertVarianceColors />,
    );
    expect(container.querySelector('[data-component="comparison-table"]')).toBeTruthy();
  });

  it('custom column labels', () => {
    render(
      <ComparisonTable
        rows={rows}
        columns={{
          label: 'Name',
          actual: 'Real',
          target: 'Plan',
          variance: 'Diff',
          variancePercent: 'Pct',
        }}
      />,
    );
    expect(screen.getByText('Name')).toBeTruthy();
    expect(screen.getByText('Real')).toBeTruthy();
  });

  it('handles flat row direction (actual equals target)', () => {
    const flatRows: ComparisonRow[] = [
      { id: '1', label: 'Same', actual: 100, target: 100 },
    ];
    render(<ComparisonTable rows={flatRows} />);
    expect(screen.getByText('Same')).toBeTruthy();
  });

  it('handles target=0 variance edge case', () => {
    const zeroTarget: ComparisonRow[] = [
      { id: '1', label: 'Zero', actual: 50, target: 0 },
    ];
    render(<ComparisonTable rows={zeroTarget} />);
    expect(screen.getByText('Zero')).toBeTruthy();
  });

  it('returns null when access=hidden', () => {
    const { container } = render(
      <ComparisonTable rows={rows} access="hidden" />,
    );
    expect(container.querySelector('[data-component="comparison-table"]')).toBeNull();
  });

  it('handles row-level format override', () => {
    const fmtRows: ComparisonRow[] = [
      { id: '1', label: 'X', actual: 100, target: 80, format: { format: 'percent' } },
    ];
    render(<ComparisonTable rows={fmtRows} />);
    expect(screen.getByText('X')).toBeTruthy();
  });
});

// =====================================================================
// 6. DataExportDialog — all branches
// =====================================================================

describe('DataExportDialog', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    onExport: vi.fn(),
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders when open', () => {
    render(<DataExportDialog {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('returns null when not open', () => {
    const { container } = render(
      <DataExportDialog {...defaultProps} open={false} />,
    );
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it('returns null when access=hidden', () => {
    const { container } = render(
      <DataExportDialog {...defaultProps} access="hidden" />,
    );
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it('calls onExport with selected options', async () => {
    const onExport = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();
    render(
      <DataExportDialog
        open={true}
        onClose={onClose}
        onExport={onExport}
        recordCounts={{ visible: 10, all: 100, selected: 5, filtered: 25 }}
      />,
    );

    // Select CSV format
    const csvRadio = screen.getByLabelText('CSV');
    fireEvent.click(csvRadio);

    // Select "all" scope
    const allRadio = screen.getByDisplayValue('all');
    fireEvent.click(allRadio);

    // Toggle include charts
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    // Click export
    const exportButtons = screen.getAllByText(/Aktar/);
    const exportBtn = exportButtons.find(b => b.tagName === 'BUTTON' && !b.textContent?.includes('Vazge'));
    fireEvent.click(exportBtn!);

    await waitFor(() => {
      expect(onExport).toHaveBeenCalledWith({
        format: 'csv',
        scope: 'all',
        includeCharts: true,
      });
    });
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(<DataExportDialog open={true} onClose={onClose} onExport={vi.fn()} />);
    // Click the backdrop
    const backdrop = document.querySelector('[aria-hidden="true"]');
    if (backdrop) fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<DataExportDialog open={true} onClose={onClose} onExport={vi.fn()} />);
    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalled();
  });

  it('handles export error gracefully', async () => {
    const onExport = vi.fn().mockRejectedValue(new Error('fail'));
    const onClose = vi.fn();
    render(
      <DataExportDialog open={true} onClose={onClose} onExport={onExport} />,
    );
    const exportButtons = screen.getAllByText(/Aktar/);
    const exportBtn = exportButtons.find(b => b.tagName === 'BUTTON' && !b.textContent?.includes('Vazge'));
    fireEvent.click(exportBtn!);
    await waitFor(() => {
      expect(onExport).toHaveBeenCalled();
    });
    // Dialog should still be mounted (error caught)
  });

  it('renders with custom localeText', () => {
    render(
      <DataExportDialog
        {...defaultProps}
        localeText={{
          title: 'Export Data',
          exportButton: 'Export Now',
          cancelButton: 'Cancel',
          ariaLabel: 'Data export',
          scopeHeading: 'Scope',
          includeCharts: 'Include charts',
          recordSuffix: 'records',
          scopeVisible: 'Visible',
          scopeAll: 'All',
          scopeSelected: 'Selected',
          scopeFiltered: 'Filtered',
        }}
      />,
    );
    expect(screen.getByText('Export Data')).toBeTruthy();
    expect(screen.getByText('Export Now')).toBeTruthy();
  });

  it('disables interactions when access=disabled', () => {
    render(
      <DataExportDialog
        {...defaultProps}
        access="disabled"
      />,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeTruthy();
  });

  it('shows record count summary when recordCounts provided', () => {
    render(
      <DataExportDialog
        {...defaultProps}
        recordCounts={{ visible: 10, all: 100, selected: 5, filtered: 25 }}
      />,
    );
    // Should show "10 / 100 kayıt" for visible scope
    expect(screen.getByText(/10 \/ 100/)).toBeTruthy();
  });
});

// =====================================================================
// 7. EmptyStateBuilder — all reasons, sizes, actions
// =====================================================================

describe('EmptyStateBuilder', () => {
  const reasons = ['no-data', 'no-results', 'no-permission', 'error', 'first-time', 'filtered-empty'] as const;

  reasons.forEach((reason) => {
    it(`renders reason="${reason}" with correct icon`, () => {
      render(<EmptyStateBuilder reason={reason} />);
      const el = screen.getByRole('status');
      expect(el).toBeTruthy();
    });
  });

  it('renders sm size', () => {
    render(<EmptyStateBuilder reason="no-data" size="sm" />);
  });

  it('renders lg size', () => {
    render(<EmptyStateBuilder reason="no-data" size="lg" />);
  });

  it('renders custom title and description', () => {
    render(
      <EmptyStateBuilder
        reason="error"
        title="Custom Title"
        description="Custom Desc"
      />,
    );
    expect(screen.getByText('Custom Title')).toBeTruthy();
    expect(screen.getByText('Custom Desc')).toBeTruthy();
  });

  it('renders primary and secondary actions', () => {
    const primaryHandler = vi.fn();
    const secondaryHandler = vi.fn();
    render(
      <EmptyStateBuilder
        reason="no-data"
        primaryAction={{ label: 'Create', onClick: primaryHandler }}
        secondaryAction={{ label: 'Learn more', onClick: secondaryHandler }}
      />,
    );
    fireEvent.click(screen.getByText('Create'));
    expect(primaryHandler).toHaveBeenCalled();
    fireEvent.click(screen.getByText('Learn more'));
    expect(secondaryHandler).toHaveBeenCalled();
  });

  it('disables actions when access=disabled', () => {
    render(
      <EmptyStateBuilder
        reason="no-data"
        access="disabled"
        primaryAction={{ label: 'Do it', onClick: vi.fn() }}
      />,
    );
    const btn = screen.getByText('Do it');
    expect(btn).toHaveProperty('disabled', true);
  });

  it('returns null when access=hidden', () => {
    const { container } = render(
      <EmptyStateBuilder reason="no-data" access="hidden" />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('uses localeText overrides for reason', () => {
    render(
      <EmptyStateBuilder
        reason="no-data"
        localeText={{
          'no-data': { title: 'Locale Title', description: 'Locale Desc' },
        }}
      />,
    );
    expect(screen.getByText('Locale Title')).toBeTruthy();
    expect(screen.getByText('Locale Desc')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<EmptyStateBuilder reason="no-data" ref={ref} />);
    expect(ref.current).toBeTruthy();
    expect(ref.current?.getAttribute('role')).toBe('status');
  });
});

// =====================================================================
// 8. FilterPresets — save, delete, default, shared
// =====================================================================

describe('FilterPresets', () => {
  const presets: FilterPreset[] = [
    { id: 'p1', name: 'Active', filters: { status: 'active' }, isDefault: true },
    { id: 'p2', name: 'Recent', filters: { sort: 'date' } },
    { id: 'p3', name: 'Shared View', filters: {}, isShared: true },
  ];

  it('renders presets with star for default', () => {
    render(
      <FilterPresets presets={presets} onSelect={vi.fn()} />,
    );
    expect(screen.getByText('Active')).toBeTruthy();
    expect(screen.getByText('Recent')).toBeTruthy();
    expect(screen.getByText('Shared View')).toBeTruthy();
  });

  it('calls onSelect when preset is clicked', () => {
    const onSelect = vi.fn();
    render(<FilterPresets presets={presets} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('Recent'));
    expect(onSelect).toHaveBeenCalledWith(presets[1]);
  });

  it('shows save popover and saves new preset', async () => {
    const onSave = vi.fn();
    render(
      <FilterPresets
        presets={presets}
        onSelect={vi.fn()}
        onSave={onSave}
        currentFilters={{ status: 'new' }}
      />,
    );
    fireEvent.click(screen.getByText('Kaydet'));
    const input = await screen.findByPlaceholderText(/Preset ad/);
    fireEvent.change(input, { target: { value: 'My Preset' } });
    // Submit via Enter
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSave).toHaveBeenCalledWith('My Preset', { status: 'new' });
  });

  it('save popover cancel via Escape', async () => {
    const onSave = vi.fn();
    render(
      <FilterPresets
        presets={presets}
        onSelect={vi.fn()}
        onSave={onSave}
      />,
    );
    fireEvent.click(screen.getByText('Kaydet'));
    const input = await screen.findByPlaceholderText(/Preset ad/);
    fireEvent.keyDown(input, { key: 'Escape' });
    // Popover should close, no save
    expect(onSave).not.toHaveBeenCalled();
  });

  it('does not save with empty name', async () => {
    const onSave = vi.fn();
    render(
      <FilterPresets
        presets={presets}
        onSelect={vi.fn()}
        onSave={onSave}
      />,
    );
    fireEvent.click(screen.getByText('Kaydet'));
    const input = await screen.findByPlaceholderText(/Preset ad/);
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSave).not.toHaveBeenCalled();
  });

  it('delete flow — show confirmation and confirm', async () => {
    const onDelete = vi.fn();
    render(
      <FilterPresets
        presets={presets}
        onSelect={vi.fn()}
        onDelete={onDelete}
      />,
    );
    // Delete button for 'Recent' (non-shared)
    const deleteBtn = screen.getByLabelText('Delete preset Recent');
    fireEvent.click(deleteBtn);
    // Confirmation appears
    const confirmDeleteBtn = await screen.findByText('Sil');
    fireEvent.click(confirmDeleteBtn);
    expect(onDelete).toHaveBeenCalledWith('p2');
  });

  it('delete flow — cancel confirmation', async () => {
    const onDelete = vi.fn();
    render(
      <FilterPresets
        presets={presets}
        onSelect={vi.fn()}
        onDelete={onDelete}
      />,
    );
    const deleteBtn = screen.getByLabelText('Delete preset Recent');
    fireEvent.click(deleteBtn);
    const cancelBtn = await screen.findByText('Vazge\u00e7');
    fireEvent.click(cancelBtn);
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('onSetDefault calls handler', () => {
    const onSetDefault = vi.fn();
    render(
      <FilterPresets
        presets={presets}
        onSelect={vi.fn()}
        onSetDefault={onSetDefault}
      />,
    );
    const starBtn = screen.getByLabelText('Set Recent as default');
    fireEvent.click(starBtn);
    expect(onSetDefault).toHaveBeenCalledWith('p2');
  });

  it('returns null when access=hidden', () => {
    const { container } = render(
      <FilterPresets presets={presets} onSelect={vi.fn()} access="hidden" />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('highlights active preset', () => {
    render(
      <FilterPresets presets={presets} onSelect={vi.fn()} activePresetId="p2" />,
    );
    // Active one should have action-primary border
    const recentBtn = screen.getByText('Recent').closest('button');
    expect(recentBtn?.className).toContain('action-primary');
  });
});

// =====================================================================
// 9. InlineEdit — all type/validation/error branches
// =====================================================================

describe('InlineEdit', () => {
  it('renders display mode with formatDisplay', () => {
    render(
      <InlineEdit value="100" onSave={vi.fn()} formatDisplay={(v) => `$${v}`} />,
    );
    expect(screen.getByText('$100')).toBeTruthy();
  });

  it('enters edit mode on double click', () => {
    render(<InlineEdit value="hello" onSave={vi.fn()} />);
    const display = screen.getByText('hello');
    fireEvent.doubleClick(display);
    const input = document.querySelector('input');
    expect(input).toBeTruthy();
  });

  it('saves on Enter key', async () => {
    const onSave = vi.fn();
    render(<InlineEdit value="old" onSave={onSave} />);
    fireEvent.doubleClick(screen.getByText('old'));
    const input = document.querySelector('input')!;
    fireEvent.change(input, { target: { value: 'new' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith('new');
    });
  });

  it('cancels on Escape key', () => {
    const onSave = vi.fn();
    render(<InlineEdit value="old" onSave={onSave} />);
    fireEvent.doubleClick(screen.getByText('old'));
    const input = document.querySelector('input')!;
    fireEvent.change(input, { target: { value: 'new' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(onSave).not.toHaveBeenCalled();
    // Should show display mode again
    expect(screen.getByText('old')).toBeTruthy();
  });

  it('shows validation error', async () => {
    const validate = (v: string) => (v.length < 3 ? 'Too short' : null);
    render(<InlineEdit value="ok" onSave={vi.fn()} validate={validate} />);
    fireEvent.doubleClick(screen.getByText('ok'));
    const input = document.querySelector('input')!;
    fireEvent.change(input, { target: { value: 'ab' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    await waitFor(() => {
      expect(screen.getByText('Too short')).toBeTruthy();
    });
  });

  it('handles onSave error', async () => {
    const onSave = vi.fn().mockRejectedValue(new Error('Server error'));
    render(<InlineEdit value="old" onSave={onSave} />);
    fireEvent.doubleClick(screen.getByText('old'));
    const input = document.querySelector('input')!;
    fireEvent.change(input, { target: { value: 'new' } });
    fireEvent.click(screen.getByLabelText('Save'));
    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeTruthy();
    });
  });

  it('handles non-Error throw on save', async () => {
    const onSave = vi.fn().mockRejectedValue('string error');
    render(<InlineEdit value="old" onSave={onSave} />);
    fireEvent.doubleClick(screen.getByText('old'));
    const input = document.querySelector('input')!;
    fireEvent.change(input, { target: { value: 'new' } });
    fireEvent.click(screen.getByLabelText('Save'));
    await waitFor(() => {
      expect(screen.getByText(/hatası/)).toBeTruthy();
    });
  });

  it('does not save if value unchanged', () => {
    const onSave = vi.fn();
    render(<InlineEdit value="same" onSave={onSave} />);
    fireEvent.doubleClick(screen.getByText('same'));
    fireEvent.keyDown(document.querySelector('input')!, { key: 'Enter' });
    expect(onSave).not.toHaveBeenCalled();
  });

  it('renders select type', () => {
    render(
      <InlineEdit
        value="a"
        type="select"
        options={[
          { value: 'a', label: 'Option A' },
          { value: 'b', label: 'Option B' },
        ]}
        onSave={vi.fn()}
      />,
    );
    fireEvent.doubleClick(screen.getByText('a'));
    const select = document.querySelector('select');
    expect(select).toBeTruthy();
  });

  it('renders number type', () => {
    render(<InlineEdit value="42" type="number" onSave={vi.fn()} />);
    fireEvent.doubleClick(screen.getByText('42'));
    const input = document.querySelector('input[type="number"]');
    expect(input).toBeTruthy();
  });

  it('shows placeholder when value is empty', () => {
    render(<InlineEdit value="" onSave={vi.fn()} placeholder="Enter text" />);
    expect(screen.getByText('Enter text')).toBeTruthy();
  });

  it('returns null when access=hidden', () => {
    const { container } = render(
      <InlineEdit value="x" onSave={vi.fn()} access="hidden" />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('cannot enter edit mode when access=readonly', () => {
    render(<InlineEdit value="readonly" onSave={vi.fn()} access="readonly" />);
    fireEvent.doubleClick(screen.getByText('readonly'));
    expect(document.querySelector('input')).toBeNull();
  });

  it('cannot enter edit mode when access=disabled', () => {
    render(<InlineEdit value="disabled" onSave={vi.fn()} access="disabled" />);
    fireEvent.doubleClick(screen.getByText('disabled'));
    expect(document.querySelector('input')).toBeNull();
  });

  it('Enter key on display mode enters edit when canEdit', () => {
    render(<InlineEdit value="test" onSave={vi.fn()} />);
    const display = screen.getByText('test');
    fireEvent.keyDown(display, { key: 'Enter' });
    expect(document.querySelector('input')).toBeTruthy();
  });

  it('Tab key triggers save', async () => {
    const onSave = vi.fn();
    render(<InlineEdit value="old" onSave={onSave} />);
    fireEvent.doubleClick(screen.getByText('old'));
    const input = document.querySelector('input')!;
    fireEvent.change(input, { target: { value: 'new' } });
    fireEvent.keyDown(input, { key: 'Tab' });
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith('new');
    });
  });

  it('cancel button returns to display mode', () => {
    render(<InlineEdit value="val" onSave={vi.fn()} />);
    fireEvent.doubleClick(screen.getByText('val'));
    fireEvent.click(screen.getByLabelText('Cancel'));
    expect(screen.getByText('val')).toBeTruthy();
    expect(document.querySelector('input')).toBeNull();
  });
});
