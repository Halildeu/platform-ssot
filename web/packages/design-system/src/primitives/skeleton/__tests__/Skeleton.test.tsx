// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render } from '@testing-library/react';
import { Skeleton } from '../Skeleton';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('Skeleton — temel render', () => {
  it('varsayilan props ile div elementini render eder', () => {
    const { container } = render(<Skeleton />);
    const div = container.querySelector('div');
    expect(div).toBeInTheDocument();
  });

  it('varsayilan olarak animate-pulse class uygular', () => {
    const { container } = render(<Skeleton />);
    const div = container.firstElementChild;
    expect(div?.className).toContain('animate-pulse');
  });

  it('varsayilan width 100% dir', () => {
    const { container } = render(<Skeleton />);
    const div = container.firstElementChild as HTMLElement;
    expect(div?.style.width).toBe('100%');
  });

  it('varsayilan height 16px dir', () => {
    const { container } = render(<Skeleton />);
    const div = container.firstElementChild as HTMLElement;
    expect(div?.style.height).toBe('16px');
  });
});

/* ------------------------------------------------------------------ */
/*  Width ve height                                                    */
/* ------------------------------------------------------------------ */

describe('Skeleton — width ve height', () => {
  it('number width pixel olarak uygulanir', () => {
    const { container } = render(<Skeleton width={200} />);
    const div = container.firstElementChild as HTMLElement;
    expect(div?.style.width).toBe('200px');
  });

  it('string width dogrudan uygulanir', () => {
    const { container } = render(<Skeleton width="50%" />);
    const div = container.firstElementChild as HTMLElement;
    expect(div?.style.width).toBe('50%');
  });

  it('number height pixel olarak uygulanir', () => {
    const { container } = render(<Skeleton height={40} />);
    const div = container.firstElementChild as HTMLElement;
    expect(div?.style.height).toBe('40px');
  });

  it('string height dogrudan uygulanir', () => {
    const { container } = render(<Skeleton height="2rem" />);
    const div = container.firstElementChild as HTMLElement;
    expect(div?.style.height).toBe('2rem');
  });
});

/* ------------------------------------------------------------------ */
/*  Circle variant                                                     */
/* ------------------------------------------------------------------ */

describe('Skeleton — circle variant', () => {
  it('circle=true durumunda rounded-full class uygular', () => {
    const { container } = render(<Skeleton circle height={40} />);
    const div = container.firstElementChild;
    expect(div?.className).toContain('rounded-full');
  });

  it('circle durumunda width height ile ayni olur', () => {
    const { container } = render(<Skeleton circle height={48} />);
    const div = container.firstElementChild as HTMLElement;
    expect(div?.style.width).toBe('48px');
    expect(div?.style.height).toBe('48px');
  });
});

/* ------------------------------------------------------------------ */
/*  Lines                                                              */
/* ------------------------------------------------------------------ */

describe('Skeleton — lines', () => {
  it('lines > 1 durumunda birden fazla skeleton render eder', () => {
    const { container } = render(<Skeleton lines={3} />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(3);
  });

  it('son satir 75% genislikte olur', () => {
    const { container } = render(<Skeleton lines={3} />);
    const items = container.querySelectorAll('.animate-pulse');
    const lastItem = items[items.length - 1] as HTMLElement;
    expect(lastItem?.style.width).toBe('75%');
  });

  it('diger satirlar 100% genislikte olur', () => {
    const { container } = render(<Skeleton lines={3} />);
    const items = container.querySelectorAll('.animate-pulse');
    const firstItem = items[0] as HTMLElement;
    expect(firstItem?.style.width).toBe('100%');
  });

  it('lines=1 durumunda tek skeleton render eder', () => {
    const { container } = render(<Skeleton lines={1} />);
    const div = container.firstElementChild;
    expect(div?.className).toContain('animate-pulse');
  });
});

/* ------------------------------------------------------------------ */
/*  Animated prop                                                      */
/* ------------------------------------------------------------------ */

describe('Skeleton — animated prop', () => {
  it('animated=false durumunda animate-pulse class uygulamaz', () => {
    const { container } = render(<Skeleton animated={false} />);
    const div = container.firstElementChild;
    expect(div?.className).not.toContain('animate-pulse');
  });

  it('animated=true (varsayilan) durumunda animate-pulse class uygular', () => {
    const { container } = render(<Skeleton animated />);
    const div = container.firstElementChild;
    expect(div?.className).toContain('animate-pulse');
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('Skeleton — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(<Skeleton className="custom-class" />);
    const div = container.firstElementChild;
    expect(div?.className).toContain('custom-class');
  });

  it('ek HTML attributes aktarilir', () => {
    const { container } = render(<Skeleton data-testid="custom-skeleton" />);
    expect(container.querySelector('[data-testid="custom-skeleton"]')).toBeInTheDocument();
  });

  it('style prop merge edilir', () => {
    const { container } = render(<Skeleton style={{ opacity: 0.5 }} />);
    const div = container.firstElementChild as HTMLElement;
    expect(div?.style.opacity).toBe('0.5');
  });

});

/* ------------------------------------------------------------------ */
/*  Faz 3 Dalga 5 — Deepening tests                                   */
/* ------------------------------------------------------------------ */

describe('Skeleton — correct size/shape (deepening)', () => {
  it('renders rectangle by default (rounded-lg, not rounded-full)', () => {
    const { container } = render(<Skeleton />);
    const div = container.firstElementChild;
    expect(div?.className).toContain('rounded-lg');
    expect(div?.className).not.toContain('rounded-full');
  });

  it('circle with string height applies same dimension to width', () => {
    const { container } = render(<Skeleton circle height="3rem" />);
    const div = container.firstElementChild as HTMLElement;
    expect(div?.style.width).toBe('3rem');
    expect(div?.style.height).toBe('3rem');
  });

  it('circle without explicit height defaults to 40px square', () => {
    const { container } = render(<Skeleton circle />);
    const div = container.firstElementChild as HTMLElement;
    expect(div?.style.width).toBe('40px');
  });

  it('custom width and height together', () => {
    const { container } = render(<Skeleton width={300} height={24} />);
    const div = container.firstElementChild as HTMLElement;
    expect(div?.style.width).toBe('300px');
    expect(div?.style.height).toBe('24px');
  });

  it('lines mode respects custom height on all lines', () => {
    const { container } = render(<Skeleton lines={2} height={20} />);
    const items = container.querySelectorAll('.animate-pulse');
    items.forEach((item) => {
      expect((item as HTMLElement).style.height).toBe('20px');
    });
  });
});

describe('Skeleton — animation class (deepening)', () => {
  it('animate-pulse is present on all lines when animated=true', () => {
    const { container } = render(<Skeleton lines={3} animated />);
    const items = container.querySelectorAll('.animate-pulse');
    expect(items).toHaveLength(3);
  });

  it('animate-pulse is absent on all lines when animated=false', () => {
    const { container } = render(<Skeleton lines={3} animated={false} />);
    const items = container.querySelectorAll('.animate-pulse');
    expect(items).toHaveLength(0);
  });

  it('animated defaults to true (no explicit prop)', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstElementChild?.className).toContain('animate-pulse');
  });
});

describe('Skeleton — aria attributes (deepening)', () => {
  it('forwards aria-busy attribute', () => {
    const { container } = render(<Skeleton aria-busy="true" />);
    const div = container.firstElementChild;
    expect(div).toHaveAttribute('aria-busy', 'true');
  });

  it('forwards role attribute', () => {
    const { container } = render(<Skeleton role="progressbar" />);
    const div = container.firstElementChild;
    expect(div).toHaveAttribute('role', 'progressbar');
  });

  it('forwards aria-label attribute', () => {
    const { container } = render(<Skeleton aria-label="Loading content" />);
    const div = container.firstElementChild;
    expect(div).toHaveAttribute('aria-label', 'Loading content');
  });

  it('supports combined aria attributes for screen readers', () => {
    const { container } = render(
      <Skeleton aria-busy="true" role="progressbar" aria-label="Loading profile" />,
    );
    const div = container.firstElementChild;
    expect(div).toHaveAttribute('aria-busy', 'true');
    expect(div).toHaveAttribute('role', 'progressbar');
    expect(div).toHaveAttribute('aria-label', 'Loading profile');
  });
});

/* ------------------------------------------------------------------ */
/*  Accessibility (axe)                                                */
/* ------------------------------------------------------------------ */

describe('Skeleton — a11y', () => {
  it('has no axe violations', async () => {
    const { container } = render(<Skeleton role="progressbar" aria-label="Loading content" />);
    await expectNoA11yViolations(container);
  });
});
