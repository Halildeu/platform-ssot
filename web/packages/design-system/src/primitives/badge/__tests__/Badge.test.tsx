// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Badge } from '../Badge';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('Badge — temel render', () => {
  it('varsayilan props ile span elementini render eder', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('children metnini gosterir', () => {
    render(<Badge>5</Badge>);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('varsayilan variant "default" dir', () => {
    const { container } = render(<Badge>Test</Badge>);
    const span = container.querySelector('span');
    expect(span?.className).toContain('bg-surface-muted');
  });

  it('varsayilan size "md" dir', () => {
    const { container } = render(<Badge>Test</Badge>);
    const span = container.querySelector('span');
    expect(span?.className).toContain('px-2');
  });
});

/* ------------------------------------------------------------------ */
/*  Variant proplari                                                   */
/* ------------------------------------------------------------------ */

describe('Badge — variant proplari', () => {
  it.each([
    ['default', 'bg-surface-muted'],
    ['primary', 'text-action-primary'],
    ['success', 'text-state-success-text'],
    ['warning', 'text-state-warning-text'],
    ['error', 'text-state-danger-text'],
    ['danger', 'text-state-danger-text'],
    ['info', 'text-state-info-text'],
    ['muted', 'text-[var(--text-tertiary)]'],
  ] as const)('variant="%s" dogru class uygular', (variant, expectedClass) => {
    const { container } = render(<Badge variant={variant}>Test</Badge>);
    const span = container.querySelector('span');
    expect(span?.className).toContain(expectedClass);
  });
});

/* ------------------------------------------------------------------ */
/*  Size proplari                                                      */
/* ------------------------------------------------------------------ */

describe('Badge — size proplari', () => {
  it.each([
    ['sm', 'px-1.5'],
    ['md', 'px-2'],
    ['lg', 'px-2.5'],
  ] as const)('size="%s" dogru padding uygular', (size, expectedClass) => {
    const { container } = render(<Badge size={size}>Test</Badge>);
    const span = container.querySelector('span');
    expect(span?.className).toContain(expectedClass);
  });
});

/* ------------------------------------------------------------------ */
/*  Dot variant                                                        */
/* ------------------------------------------------------------------ */

describe('Badge — dot variant', () => {
  it('dot=true durumunda kucuk nokta render eder', () => {
    const { container } = render(<Badge dot />);
    const span = container.querySelector('span');
    expect(span?.className).toContain('h-2');
    expect(span?.className).toContain('w-2');
    expect(span?.className).toContain('rounded-full');
  });

  it('dot=true durumunda children render etmez', () => {
    render(<Badge dot>Hidden text</Badge>);
    expect(screen.queryByText('Hidden text')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('Badge — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(<Badge className="custom-class">Test</Badge>);
    const span = container.querySelector('span');
    expect(span?.className).toContain('custom-class');
  });

  it('ek HTML attributes aktarilir', () => {
    render(<Badge data-testid="custom-badge">Test</Badge>);
    expect(screen.getByTestId('custom-badge')).toBeInTheDocument();
  });

  it('children olmadan crash olmaz', () => {
    expect(() => {
      render(<Badge />);
    }).not.toThrow();
  });
});

/* ------------------------------------------------------------------ */
/*  Accessibility (axe)                                                */
/* ------------------------------------------------------------------ */

describe('Badge — a11y', () => {
  it('has no axe violations', async () => {
    const { container } = render(<Badge>New</Badge>);
    await expectNoA11yViolations(container);
  });
});

/* ------------------------------------------------------------------ */
/*  Faz 3 Dalga 5 — Deepening tests                                   */
/* ------------------------------------------------------------------ */

describe('Badge — all variant types render (deepening)', () => {
  const allVariants = ['default', 'primary', 'success', 'warning', 'error', 'danger', 'info', 'muted'] as const;

  it.each(allVariants)('variant="%s" renders a span element with children', (variant) => {
    render(<Badge variant={variant}>Label</Badge>);
    const el = screen.getByText('Label');
    expect(el).toBeInTheDocument();
    expect(el.tagName).toBe('SPAN');
  });

  it('renders all variants without crashing in sequence', () => {
    const { container } = render(
      <div>
        {allVariants.map((v) => (
          <Badge key={v} variant={v}>{v}</Badge>
        ))}
      </div>,
    );
    const badges = container.querySelectorAll('span.inline-flex');
    expect(badges).toHaveLength(allVariants.length);
  });
});

describe('Badge — size variants (deepening)', () => {
  it('sm size applies text-[10px]', () => {
    const { container } = render(<Badge size="sm">S</Badge>);
    const span = container.querySelector('span');
    expect(span?.className).toContain('text-[10px]');
  });

  it('md size applies text-xs', () => {
    const { container } = render(<Badge size="md">M</Badge>);
    const span = container.querySelector('span');
    expect(span?.className).toContain('text-xs');
  });

  it('lg size applies py-1 for larger vertical padding', () => {
    const { container } = render(<Badge size="lg">L</Badge>);
    const span = container.querySelector('span');
    expect(span?.className).toContain('py-1');
  });

  it('size does not affect variant styling', () => {
    const { container } = render(<Badge variant="success" size="lg">OK</Badge>);
    const span = container.querySelector('span');
    expect(span?.className).toContain('text-state-success-text');
    expect(span?.className).toContain('px-2.5');
  });
});

describe('Badge — dot mode (deepening)', () => {
  it('dot renders a fixed 8x8px circle (h-2 w-2)', () => {
    const { container } = render(<Badge dot />);
    const span = container.querySelector('span');
    expect(span?.className).toContain('h-2');
    expect(span?.className).toContain('w-2');
    expect(span?.className).toContain('rounded-full');
    expect(span?.className).toContain('inline-block');
  });

  it('dot with variant="success" applies success background color', () => {
    const { container } = render(<Badge dot variant="success" />);
    const span = container.querySelector('span');
    // The dot extracts bg- from the variant's text- color
    expect(span?.className).toContain('bg-state-success-text');
  });

  it('dot with variant="default" applies secondary background', () => {
    const { container } = render(<Badge dot variant="default" />);
    const span = container.querySelector('span');
    expect(span?.className).toContain('bg-text-secondary');
  });

  it('dot ignores size prop (always renders as small dot)', () => {
    const { container } = render(<Badge dot size="lg" />);
    const span = container.querySelector('span');
    // Should NOT contain size-specific padding classes
    expect(span?.className).not.toContain('px-2.5');
    expect(span?.className).toContain('h-2');
  });

  it('dot forwards className', () => {
    const { container } = render(<Badge dot className="extra-dot" />);
    const span = container.querySelector('span');
    expect(span?.className).toContain('extra-dot');
  });
});

describe('Badge — with icon (deepening)', () => {
  it('renders SVG icon as child inside badge', () => {
    const { container } = render(
      <Badge variant="info">
        <svg data-testid="badge-icon" className="h-3 w-3" viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="8" />
        </svg>
        Status
      </Badge>,
    );
    expect(screen.getByTestId('badge-icon')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    // Icon is inside the badge span
    const badge = container.querySelector('span.inline-flex');
    expect(badge).toContainElement(screen.getByTestId('badge-icon'));
  });

  it('badge with icon has inline-flex for proper alignment', () => {
    const { container } = render(
      <Badge>
        <svg className="h-3 w-3" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" /></svg>
        Count
      </Badge>,
    );
    const badge = container.querySelector('span');
    expect(badge?.className).toContain('inline-flex');
    expect(badge?.className).toContain('items-center');
  });

  it('badge with only icon (no text) renders without crash', () => {
    expect(() => {
      render(
        <Badge variant="error">
          <svg data-testid="icon-only" viewBox="0 0 16 16"><path d="M8 0L16 16H0Z" /></svg>
        </Badge>,
      );
    }).not.toThrow();
    expect(screen.getByTestId('icon-only')).toBeInTheDocument();
  });
});
