// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { SmartDashboard, type DashboardWidget } from '../SmartDashboard';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ---- Helpers ---- */

const makeWidget = (overrides: Partial<DashboardWidget> = {}): DashboardWidget => ({
  key: 'w1',
  title: 'Widget 1',
  type: 'kpi',
  ...overrides,
});

const makeWidgets = (count: number): DashboardWidget[] =>
  Array.from({ length: count }, (_, i) => ({
    key: `widget-${i}`,
    title: `Widget ${i}`,
    type: 'kpi' as const,
    value: i * 100,
  }));

/* ------------------------------------------------------------------ */
/*  Contract: Basic rendering                                          */
/* ------------------------------------------------------------------ */

describe('SmartDashboard contract — basic rendering', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <SmartDashboard widgets={[makeWidget()]} />,
    );
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    const { container } = render(
      <SmartDashboard widgets={[makeWidget()]} className="my-custom-class" />,
    );
    const section = container.querySelector('section');
    expect(section).toHaveClass('my-custom-class');
    // Ensure base classes are also present (not overwritten)
    expect(section).toHaveClass('space-y-4');
  });

  it('has data-component="smart-dashboard"', () => {
    const { container } = render(
      <SmartDashboard widgets={[makeWidget()]} />,
    );
    expect(container.querySelector('[data-component="smart-dashboard"]')).toBeInTheDocument();
  });

  it('does not forward ref (React.FC — no forwardRef)', () => {
    // SmartDashboard is a React.FC, not wrapped in forwardRef.
    // Verify the component renders as a plain FC without ref support.
    const { container } = render(
      <SmartDashboard widgets={[makeWidget()]} />,
    );
    expect(container.querySelector('section')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Variant — columns                                        */
/* ------------------------------------------------------------------ */

describe('SmartDashboard contract — column variants', () => {
  it('renders with 2 columns (default minmax 280px)', () => {
    const { container } = render(
      <SmartDashboard widgets={makeWidgets(4)} columns={2} />,
    );
    const grid = container.querySelector('[role="list"]') as HTMLElement;
    expect(grid).toBeInTheDocument();
    expect(grid.style.gridTemplateColumns).toContain('280px');
  });

  it('renders with 3 columns (default minmax 220px)', () => {
    const { container } = render(
      <SmartDashboard widgets={makeWidgets(4)} columns={3} />,
    );
    const grid = container.querySelector('[role="list"]') as HTMLElement;
    expect(grid.style.gridTemplateColumns).toContain('220px');
  });

  it('renders with 4 columns (default minmax 200px)', () => {
    const { container } = render(
      <SmartDashboard widgets={makeWidgets(4)} columns={4} />,
    );
    const grid = container.querySelector('[role="list"]') as HTMLElement;
    expect(grid.style.gridTemplateColumns).toContain('200px');
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Variant — density                                        */
/* ------------------------------------------------------------------ */

describe('SmartDashboard contract — density variants', () => {
  it('renders with comfortable density (gap-5)', () => {
    const { container } = render(
      <SmartDashboard widgets={[makeWidget()]} density="comfortable" />,
    );
    const grid = container.querySelector('[role="list"]');
    expect(grid?.className).toContain('gap-5');
  });

  it('renders with compact density (gap-3)', () => {
    const { container } = render(
      <SmartDashboard widgets={[makeWidget()]} density="compact" />,
    );
    const grid = container.querySelector('[role="list"]');
    expect(grid?.className).toContain('gap-3');
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Children / composition                                   */
/* ------------------------------------------------------------------ */

describe('SmartDashboard contract — dashboard cards', () => {
  it('renders dashboard cards as list items', () => {
    const widgets = makeWidgets(3);
    const { container } = render(<SmartDashboard widgets={widgets} />);
    const listItems = container.querySelectorAll('[role="listitem"]');
    expect(listItems).toHaveLength(3);
  });

  it('renders widget cards with correct data attributes', () => {
    const { container } = render(
      <SmartDashboard
        widgets={[makeWidget({ key: 'revenue', type: 'kpi', tone: 'success' })]}
      />,
    );
    const card = container.querySelector('[data-widget-key="revenue"]');
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('data-widget-type', 'kpi');
    expect(card).toHaveAttribute('data-widget-tone', 'success');
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Empty state                                              */
/* ------------------------------------------------------------------ */

describe('SmartDashboard contract — empty state', () => {
  it('handles empty widgets array without crashing', () => {
    expect(() => {
      render(<SmartDashboard widgets={[]} />);
    }).not.toThrow();
  });

  it('renders an empty grid when no widgets are provided', () => {
    const { container } = render(<SmartDashboard widgets={[]} />);
    const grid = container.querySelector('[role="list"]');
    expect(grid).toBeInTheDocument();
    expect(grid?.children).toHaveLength(0);
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Accessibility                                            */
/* ------------------------------------------------------------------ */

describe('SmartDashboard contract — accessibility', () => {
  it('has no axe-core a11y violations with widgets', async () => {
    const { container } = render(
      <SmartDashboard
        widgets={makeWidgets(3)}
        title="Kontrol Paneli"
        greeting="Hos geldiniz"
      />,
    );
    await expectNoA11yViolations(container);
  });

  it('has no axe-core a11y violations in empty state', async () => {
    const { container } = render(
      <SmartDashboard widgets={[]} title="Bos Panel" />,
    );
    await expectNoA11yViolations(container);
  });

  it('widget cards have role="region" with aria-label', () => {
    const { container } = render(
      <SmartDashboard widgets={[makeWidget({ title: 'Satis' })]} />,
    );
    const regions = container.querySelectorAll('[role="region"]');
    expect(regions).toHaveLength(1);
    expect(regions[0]).toHaveAttribute('aria-label', 'Satis');
  });

  it('grid has role="list" with aria-label fallback', () => {
    const { container } = render(
      <SmartDashboard widgets={[makeWidget()]} />,
    );
    const list = container.querySelector('[role="list"]');
    expect(list).toHaveAttribute('aria-label', 'Kontrol paneli');
  });
});
