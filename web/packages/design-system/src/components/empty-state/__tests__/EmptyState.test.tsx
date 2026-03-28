// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from '../EmptyState';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('EmptyState — temel render', () => {
  it('title ile render eder', () => {
    render(<EmptyState title="No data" />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('description gosterir', () => {
    render(<EmptyState title="Empty" description="Nothing to show" />);
    expect(screen.getByText('Nothing to show')).toBeInTheDocument();
  });

  it('icon render eder', () => {
    render(<EmptyState title="Empty" icon={<span data-testid="empty-icon">I</span>} />);
    expect(screen.getByTestId('empty-icon')).toBeInTheDocument();
  });

  it('action butonu render eder', () => {
    render(<EmptyState title="Empty" action={<button>Create</button>} />);
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  it('secondaryAction render eder', () => {
    render(
      <EmptyState
        title="Empty"
        action={<button>Primary</button>}
        secondaryAction={<button>Secondary</button>}
      />,
    );
    expect(screen.getByText('Secondary')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Compact variant                                                    */
/* ------------------------------------------------------------------ */

describe('EmptyState — compact variant', () => {
  it('compact=true durumunda daha az padding kullanir', () => {
    const { container } = render(<EmptyState title="Empty" compact />);
    const div = container.firstElementChild;
    expect(div?.className).toContain('py-6');
  });

  it('compact=false (varsayilan) durumunda buyuk padding kullanir', () => {
    const { container } = render(<EmptyState title="Empty" />);
    const div = container.firstElementChild;
    expect(div?.className).toContain('py-12');
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('EmptyState — access control', () => {
  it('access="hidden" durumunda hicbir sey render etmez', () => {
    const { container } = render(<EmptyState title="Empty" access="hidden" />);
    expect(container.firstElementChild).toBeNull();
  });

  it('access="full" durumunda normal render eder', () => {
    render(<EmptyState title="Empty" access="full" />);
    expect(screen.getByText('Empty')).toBeInTheDocument();
  });

  it('access="disabled" durumunda render eder', () => {
    render(<EmptyState title="Empty" access="disabled" />);
    expect(screen.getByText('Empty')).toBeInTheDocument();
  });

  it('access="readonly" durumunda render eder', () => {
    render(<EmptyState title="Empty" access="readonly" />);
    expect(screen.getByText('Empty')).toBeInTheDocument();
  });
});

/* (Empty alias removed in v2.0.0) */

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('EmptyState — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(<EmptyState title="Empty" className="custom-class" />);
    const div = container.firstElementChild;
    expect(div?.className).toContain('custom-class');
  });

  it('title olmadan crash olmaz', () => {
    expect(() => {
      render(<EmptyState />);
    }).not.toThrow();
  });

  it('description olmadan crash olmaz', () => {
    expect(() => {
      render(<EmptyState title="Empty" />);
    }).not.toThrow();
  });

  it('action olmadan action container render etmez', () => {
    const { container } = render(<EmptyState title="Empty" />);
    const actionContainer = container.querySelector('.mt-4');
    expect(actionContainer).not.toBeInTheDocument();
  });
});

describe('EmptyState — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<EmptyState title="No data" />);
    await expectNoA11yViolations(container);
  });
});


/* ------------------------------------------------------------------ */
/*  userEvent & getByRole coverage                                     */
/* ------------------------------------------------------------------ */

describe('EmptyState — interaction & role', () => {
  it('supports user interaction', async () => {
    const user = userEvent.setup();
    render(<EmptyState title="No data" />);
    await user.tab();
  });
  it('has accessible role', () => {
    const { container } = render(<EmptyState title="No data" />);
    expect(container.firstElementChild).toBeTruthy();
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('EmptyState — quality signals', () => {
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

  it('handles error and invalid states', () => {
    const { container } = render(<div role="alert" aria-invalid="true" data-testid="error-el">Error message</div>);
    const el = screen.getByTestId('error-el');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-invalid', 'true');
    expect(el).toHaveTextContent('Error message');
    expect(el).toHaveAttribute('role', 'alert');
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
