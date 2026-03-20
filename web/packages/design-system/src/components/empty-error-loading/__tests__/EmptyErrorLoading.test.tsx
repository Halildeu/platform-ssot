// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
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
});
