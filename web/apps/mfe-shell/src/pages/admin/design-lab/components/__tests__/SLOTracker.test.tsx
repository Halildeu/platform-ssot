// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SLOTracker } from '../SLOTracker';

describe('SLOTracker', () => {
  const sampleMetrics = [
    { name: 'Uptime', target: '99.9%', current: 99, status: 'healthy' as const, budgetRemaining: 80 },
    { name: 'Latency', target: '<200ms', current: 75, status: 'warning' as const, budgetRemaining: 30 },
    { name: 'Error Rate', target: '<1%', current: 45, status: 'critical' as const, budgetRemaining: 5 },
  ];

  it('renders without crashing', () => {
    render(<SLOTracker metrics={sampleMetrics} />);
    expect(document.body).toBeTruthy();
  });

  it('renders all metrics', () => {
    const { container } = render(<SLOTracker metrics={sampleMetrics} />);
    expect(container.textContent).toContain('Uptime');
    expect(container.textContent).toContain('Latency');
  });

  it('renders with empty metrics', () => {
    render(<SLOTracker metrics={[]} />);
    expect(document.body).toBeTruthy();
  });
});
