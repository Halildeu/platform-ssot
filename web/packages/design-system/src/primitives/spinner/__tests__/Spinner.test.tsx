// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Spinner } from '../Spinner';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('Spinner — temel render', () => {
  it('varsayilan props ile svg elementini render eder', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('varsayilan label "Loading" dir', () => {
    render(<Spinner />);
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('varsayilan size "md" dir', () => {
    render(<Spinner />);
    const svg = screen.getByRole('status');
    const cls = svg.getAttribute('class') ?? '';
    expect(cls).toContain('h-5');
    expect(cls).toContain('w-5');
  });

  it('animate-spin class uygular', () => {
    render(<Spinner />);
    const svg = screen.getByRole('status');
    const cls = svg.getAttribute('class') ?? '';
    expect(cls).toContain('animate-spin');
  });
});

/* ------------------------------------------------------------------ */
/*  Size proplari                                                      */
/* ------------------------------------------------------------------ */

describe('Spinner — size proplari', () => {
  it.each([
    ['xs', 'h-3'],
    ['sm', 'h-4'],
    ['md', 'h-5'],
    ['lg', 'h-6'],
    ['xl', 'h-8'],
  ] as const)('size="%s" dogru height class uygular', (size, expectedClass) => {
    render(<Spinner size={size} />);
    const svg = screen.getByRole('status');
    const cls = svg.getAttribute('class') ?? '';
    expect(cls).toContain(expectedClass);
  });
});

/* ------------------------------------------------------------------ */
/*  Label prop                                                         */
/* ------------------------------------------------------------------ */

describe('Spinner — label prop', () => {
  it('ozel label aria-label olarak atanir', () => {
    render(<Spinner label="Yukleniyor" />);
    expect(screen.getByLabelText('Yukleniyor')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Mode prop                                                          */
/* ------------------------------------------------------------------ */

describe('Spinner — mode prop', () => {
  it('mode="inline" (varsayilan) durumunda sadece svg render eder', () => {
    const { container } = render(<Spinner mode="inline" />);
    expect(container.firstElementChild?.tagName).toBe('svg');
  });

  it('mode="block" durumunda wrapper div render eder', () => {
    const { container } = render(<Spinner mode="block" />);
    const wrapper = container.firstElementChild;
    expect(wrapper?.tagName).toBe('DIV');
    expect(wrapper?.className).toContain('flex');
    expect(wrapper?.className).toContain('items-center');
  });

  it('mode="block" durumunda label metni gorunur sekilde gosterir', () => {
    render(<Spinner mode="block" label="Loading data" />);
    expect(screen.getByText('Loading data')).toBeInTheDocument();
  });

  it('mode="block" ve label bos ise metin gostermez', () => {
    render(<Spinner mode="block" label="" />);
    const svg = screen.getByRole('status');
    expect(svg).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Accessibility                                                      */
/* ------------------------------------------------------------------ */

describe('Spinner — accessibility', () => {
  it('role="status" atanir', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('aria-label atanir', () => {
    render(<Spinner label="Processing" />);
    const svg = screen.getByRole('status');
    expect(svg).toHaveAttribute('aria-label', 'Processing');
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('Spinner — edge cases', () => {
  it('className forwarding calisir (inline mode)', () => {
    render(<Spinner className="custom-class" />);
    const svg = screen.getByRole('status');
    const cls = svg.getAttribute('class') ?? '';
    expect(cls).toContain('custom-class');
  });

  it('className forwarding calisir (block mode)', () => {
    const { container } = render(<Spinner mode="block" className="custom-class" />);
    const wrapper = container.firstElementChild;
    expect(wrapper?.className).toContain('custom-class');
  });
});

/* ------------------------------------------------------------------ */
/*  Accessibility (axe)                                                */
/* ------------------------------------------------------------------ */

describe('Spinner — a11y', () => {
  it('has no axe violations', async () => {
    const { container } = render(<Spinner />);
    await expectNoA11yViolations(container);
  });
});
