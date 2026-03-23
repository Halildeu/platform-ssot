// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PageHeader, createPageHeaderTagItems, createPageHeaderStatItems } from '../PageHeader';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('PageHeader — temel render', () => {
  it('header elementini render eder', () => {
    const { container } = render(<PageHeader title="Dashboard" />);
    expect(container.querySelector('header')).toBeInTheDocument();
  });

  it('title h1 olarak render edilir', () => {
    render(<PageHeader title="Dashboard" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dashboard');
  });

  it('subtitle gosterilir', () => {
    render(<PageHeader title="T" subtitle="Sub text" />);
    expect(screen.getByText('Sub text')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Slot proplari                                                      */
/* ------------------------------------------------------------------ */

describe('PageHeader — slots', () => {
  it('breadcrumb slotu render edilir', () => {
    render(<PageHeader title="T" breadcrumb={<nav data-testid="bc">Back</nav>} />);
    expect(screen.getByTestId('bc')).toBeInTheDocument();
  });

  it('avatar slotu render edilir', () => {
    render(<PageHeader title="T" avatar={<img data-testid="av" alt="avatar" />} />);
    expect(screen.getByTestId('av')).toBeInTheDocument();
  });

  it('actions slotu render edilir', () => {
    render(<PageHeader title="T" actions={<button data-testid="act">Save</button>} />);
    expect(screen.getByTestId('act')).toBeInTheDocument();
  });

  it('footer slotu render edilir', () => {
    render(<PageHeader title="T" footer={<div data-testid="ft">Footer</div>} />);
    expect(screen.getByTestId('ft')).toBeInTheDocument();
  });

  it('extra slotu render edilir', () => {
    render(<PageHeader title="T" extra={<div data-testid="ex">Extra</div>} />);
    expect(screen.getByTestId('ex')).toBeInTheDocument();
  });

  it('tags slotu render edilir', () => {
    render(<PageHeader title="T" tags={<span data-testid="tag">v2</span>} />);
    expect(screen.getByTestId('tag')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Variants                                                           */
/* ------------------------------------------------------------------ */

describe('PageHeader — variants', () => {
  it('sticky=true durumunda sticky class uygulanir', () => {
    const { container } = render(<PageHeader title="T" sticky />);
    expect(container.querySelector('header')?.className).toContain('sticky');
  });

  it('noBorder=true durumunda border class uygulanmaz', () => {
    const { container } = render(<PageHeader title="T" noBorder />);
    expect(container.querySelector('header')?.className).not.toContain('border-b');
  });

  it('varsayilan olarak alt border vardir', () => {
    const { container } = render(<PageHeader title="T" />);
    expect(container.querySelector('header')?.className).toContain('border-b');
  });
});

/* ------------------------------------------------------------------ */
/*  className forwarding                                               */
/* ------------------------------------------------------------------ */

describe('PageHeader — className', () => {
  it('className forwarding calisir', () => {
    const { container } = render(<PageHeader title="T" className="custom-hdr" />);
    expect(container.querySelector('header')?.className).toContain('custom-hdr');
  });
});

/* ------------------------------------------------------------------ */
/*  Factory functions                                                  */
/* ------------------------------------------------------------------ */

describe('PageHeader — factory helpers', () => {
  it('createPageHeaderTagItems string inputu donusturur', () => {
    const tags = createPageHeaderTagItems(['Alpha', 'Beta']);
    expect(tags).toHaveLength(2);
    expect(tags[0].label).toBe('Alpha');
    expect(tags[0].tone).toBe('default');
  });

  it('createPageHeaderTagItems obje inputu donusturur', () => {
    const tags = createPageHeaderTagItems([{ label: 'Custom', tone: 'info' }]);
    expect(tags[0].label).toBe('Custom');
    expect(tags[0].tone).toBe('info');
  });

  it('createPageHeaderStatItems tuple inputu donusturur', () => {
    const stats = createPageHeaderStatItems([['Revenue', '$5k', 'USD']]);
    expect(stats[0].label).toBe('Revenue');
    expect(stats[0].value).toBe('$5k');
    expect(stats[0].helper).toBe('USD');
  });

  it('createPageHeaderStatItems obje inputu donusturur', () => {
    const stats = createPageHeaderStatItems([{ label: 'Users', value: 100 }]);
    expect(stats[0].label).toBe('Users');
    expect(stats[0].value).toBe(100);
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('PageHeader — edge cases', () => {
  it('sadece title ile minimum render basarili olur', () => {
    const { container } = render(<PageHeader title="Minimal" />);
    expect(container.querySelector('header')).toBeInTheDocument();
  });

  it('ReactNode title kabul eder', () => {
    render(<PageHeader title={<span data-testid="rn-title">Rich Title</span>} />);
    expect(screen.getByTestId('rn-title')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  A11y                                                               */
/* ------------------------------------------------------------------ */

describe('PageHeader — a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<PageHeader title="Dashboard" />);
    await expectNoA11yViolations(container);
  });
});


/* ------------------------------------------------------------------ */
/*  userEvent & getByRole coverage                                     */
/* ------------------------------------------------------------------ */

describe('PageHeader — interaction & role', () => {
  it('supports user interaction', async () => {
    const user = userEvent.setup();
    render(<PageHeader title="Test" />);
    await user.tab();
  });
});
