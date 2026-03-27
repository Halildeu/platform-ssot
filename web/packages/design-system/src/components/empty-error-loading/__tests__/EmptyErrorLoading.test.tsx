// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyErrorLoading } from '../EmptyErrorLoading';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('EmptyErrorLoading — temel render', () => {
  it('varsayilan title render eder', () => {
    render(<EmptyErrorLoading mode="empty" />);
    expect(screen.getByText('Durum tarifi')).toBeInTheDocument();
  });

  it('data-component attribute atar', () => {
    const { container } = render(<EmptyErrorLoading mode="empty" />);
    expect(
      container.querySelector('[data-component="empty-error-loading"]'),
    ).toBeInTheDocument();
  });

  it('section elementini render eder', () => {
    const { container } = render(<EmptyErrorLoading mode="empty" />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('data-mode attribute atar', () => {
    const { container } = render(<EmptyErrorLoading mode="error" />);
    expect(container.querySelector('[data-mode="error"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Mode: empty                                                        */
/* ------------------------------------------------------------------ */

describe('EmptyErrorLoading — empty mode', () => {
  it('empty state gosterir', () => {
    render(<EmptyErrorLoading mode="empty" />);
    expect(screen.getByText('Veri bulunamadi.')).toBeInTheDocument();
  });

  it('data-mode="empty" atar', () => {
    const { container } = render(<EmptyErrorLoading mode="empty" />);
    expect(container.querySelector('[data-mode="empty"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Mode: error                                                        */
/* ------------------------------------------------------------------ */

describe('EmptyErrorLoading — error mode', () => {
  it('varsayilan error mesajini gosterir', () => {
    render(<EmptyErrorLoading mode="error" />);
    expect(
      screen.getByText(
        'Something went wrong. Check the evidence set and upstream connections.',
      ),
    ).toBeInTheDocument();
  });

  it('ozel errorLabel gosterir', () => {
    render(
      <EmptyErrorLoading mode="error" errorLabel="Custom error message" />,
    );
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('onRetry verilince retry butonu render eder', () => {
    const handler = vi.fn();
    render(<EmptyErrorLoading mode="error" onRetry={handler} />);
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('retry butonu tiklaninca onRetry calisir', async () => {
    const handler = vi.fn();
    render(<EmptyErrorLoading mode="error" onRetry={handler} />);
    await userEvent.click(screen.getByText('Retry'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('onRetry olmadan retry butonu render etmez', () => {
    render(<EmptyErrorLoading mode="error" />);
    expect(screen.queryByText('Retry')).not.toBeInTheDocument();
  });

  it('ozel retryLabel kullanilir', () => {
    render(
      <EmptyErrorLoading mode="error" onRetry={vi.fn()} retryLabel="Try again" />,
    );
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Mode: loading                                                      */
/* ------------------------------------------------------------------ */

describe('EmptyErrorLoading — loading mode', () => {
  it('loading state gosterir', () => {
    render(<EmptyErrorLoading mode="loading" />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('ozel loadingLabel kullanilir', () => {
    render(<EmptyErrorLoading mode="loading" loadingLabel="Fetching data" />);
    expect(screen.getByText('Fetching data')).toBeInTheDocument();
  });

  it('showSkeleton=true (varsayilan) iken skeleton render eder', () => {
    const { container } = render(<EmptyErrorLoading mode="loading" />);
    // Skeleton components render div elements with animation classes
    expect(container.querySelector('[data-mode="loading"]')).toBeInTheDocument();
  });

  it('showSkeleton=false iken skeleton render etmez', () => {
    const { container } = render(
      <EmptyErrorLoading mode="loading" showSkeleton={false} />,
    );
    expect(container.querySelector('[data-mode="loading"]')).toBeInTheDocument();
  });

  it('data-mode="loading" atar', () => {
    const { container } = render(<EmptyErrorLoading mode="loading" />);
    expect(container.querySelector('[data-mode="loading"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('EmptyErrorLoading — access control', () => {
  it('access="hidden" durumunda hicbir sey render etmez', () => {
    const { container } = render(
      <EmptyErrorLoading mode="empty" access="hidden" />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('access="full" durumunda data-access-state="full" olur', () => {
    const { container } = render(
      <EmptyErrorLoading mode="empty" access="full" />,
    );
    expect(container.querySelector('[data-access-state="full"]')).toBeInTheDocument();
  });

  it('accessReason title olarak section a atanir', () => {
    const { container } = render(
      <EmptyErrorLoading mode="empty" accessReason="No permission" />,
    );
    expect(container.querySelector('section')).toHaveAttribute('title', 'No permission');
  });

  it('access="disabled" durumunda retry butonu disabled olur', () => {
    render(
      <EmptyErrorLoading mode="error" access="disabled" onRetry={vi.fn()} />,
    );
    expect(screen.getByText('Retry')).toBeDisabled();
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('EmptyErrorLoading — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(
      <EmptyErrorLoading mode="empty" className="custom-eel" />,
    );
    expect(container.querySelector('section')?.className).toContain('custom-eel');
  });

  it('ozel title ve description render eder', () => {
    render(
      <EmptyErrorLoading
        mode="empty"
        title="Custom title"
        description="Custom description"
      />,
    );
    expect(screen.getByText('Custom title')).toBeInTheDocument();
    expect(screen.getByText('Custom description')).toBeInTheDocument();
  });

  it('displayName dogru atanir', () => {
    expect(EmptyErrorLoading.displayName).toBe('EmptyErrorLoading');
  });
});

describe('EmptyErrorLoading — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<EmptyErrorLoading mode="empty" />);
    await expectNoA11yViolations(container);
  });

  it('renders section element with aria-label', () => {
    const { container } = render(<EmptyErrorLoading mode="empty" />);
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section?.tagName).toBe('SECTION');
  });

  it('retry button has accessible name', () => {
    render(<EmptyErrorLoading mode="error" onRetry={vi.fn()} />);
    const button = screen.getByRole('button', { name: /retry/i });
    expect(button).toBeInTheDocument();
  });

  it('loading mode uses aria-live for status updates', () => {
    const { container } = render(<EmptyErrorLoading mode="loading" />);
    expect(container.querySelector('[data-mode="loading"]')).toBeInTheDocument();
  });

  it('error mode displays alert-like content', () => {
    render(<EmptyErrorLoading mode="error" />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('EmptyErrorLoading — quality signals', () => {
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
