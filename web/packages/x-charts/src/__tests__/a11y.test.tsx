// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

// Test that all chart components have proper aria attributes
describe('Charts a11y', { timeout: 10000 }, () => {
  it('SparklineChart has role=img and aria-label', async () => {
    // Dynamic import to avoid module resolution issues
    const { SparklineChart } = await import('../SparklineChart');
    const { container } = render(<SparklineChart data={[1, 2, 3]} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('role')).toBe('img');
    expect(svg?.getAttribute('aria-label')).toBeTruthy();
  });

  it('KPICard is accessible', async () => {
    const { KPICard } = await import('../KPICard');
    const { container } = render(<KPICard title="Test" value="100" />);
    // Should have accessible content
    expect(container.textContent).toContain('Test');
    expect(container.textContent).toContain('100');
  });

  it('ChartContainer shows accessible error state', async () => {
    const { ChartContainer } = await import('../ChartContainer');
    const { container } = render(
      <ChartContainer error="Data load failed">
        <div>chart</div>
      </ChartContainer>
    );
    expect(container.textContent).toContain('Data load failed');
  });

  it('ChartLegend uses list semantics', async () => {
    const { ChartLegend } = await import('../ChartLegend');
    const { container } = render(
      <ChartLegend items={[{ label: 'A', color: 'red' }]} />
    );
    expect(container.querySelector('[role="list"]')).toBeTruthy();
    expect(container.querySelector('[role="listitem"]')).toBeTruthy();
  });
});
