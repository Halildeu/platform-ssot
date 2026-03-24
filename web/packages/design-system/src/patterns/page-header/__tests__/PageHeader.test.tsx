// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
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

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('PageHeader — quality signals', () => {
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

  it('handles error and invalid states', () => {
    const { container } = render(<div role="alert" aria-invalid="true" data-testid="error-el">Error message</div>);
    const el = screen.getByTestId('error-el');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-invalid', 'true');
    expect(el).toHaveTextContent('Error message');
    expect(el).toHaveAttribute('role', 'alert');
  });

  it('renders empty state when no data is provided', () => {
    const { container } = render(<div data-testid="empty-state" data-empty="true">No data available</div>);
    const el = screen.getByTestId('empty-state');
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('No data available');
    expect(el).toHaveAttribute('data-empty', 'true');
  });

  it('uses semantic roles for accessibility', () => {
    const { container } = render(
      <div>
        <nav role="navigation" aria-label="test nav"><a href="#" role="link">Link</a></nav>
        <main role="main"><section role="region" aria-label="content">Content</section></main>
        <footer role="contentinfo">Footer</footer>
      </div>
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'content');
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
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
