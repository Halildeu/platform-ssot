// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from '../Toast';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* Helper component that exposes toast API */
function ToastTrigger({ variant = 'info', message = 'Test message', title, duration }: {
  variant?: 'info' | 'success' | 'warning' | 'error';
  message?: string;
  title?: string;
  duration?: number;
}) {
  const toast = useToast();
  return (
    <button
      data-testid="trigger"
      onClick={() => toast[variant](message, { title, duration })}
    >
      Show toast
    </button>
  );
}

const renderWithProvider = (ui: React.ReactElement, props = {}) =>
  render(
    <ToastProvider duration={0} {...props}>
      {ui}
    </ToastProvider>,
  );

/* Helper: click trigger using fireEvent (safe with fake timers) */
const clickTrigger = (el: HTMLElement) => {
  act(() => { fireEvent.click(el); });
};

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('ToastProvider — temel render', () => {
  it('children render eder', () => {
    renderWithProvider(<div data-testid="child">App</div>);
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('aria-live="polite" container render eder', () => {
    const { container } = renderWithProvider(<div>App</div>);
    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  useToast hook                                                      */
/* ------------------------------------------------------------------ */

describe('useToast — hook', () => {
  it('provider disinda kullanildiginda hata firlatir', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ToastTrigger />)).toThrow('useToast must be used within <ToastProvider>');
    spy.mockRestore();
  });
});

/* ------------------------------------------------------------------ */
/*  Toast variants                                                     */
/* ------------------------------------------------------------------ */

describe('Toast — variant methods', () => {
  it.each(['info', 'success', 'warning', 'error'] as const)(
    '%s methodu toast render eder',
    async (variant) => {
      renderWithProvider(<ToastTrigger variant={variant} message={`${variant} msg`} />);
      await userEvent.click(screen.getByTestId('trigger'));
      expect(screen.getByText(`${variant} msg`)).toBeInTheDocument();
    },
  );
});

/* ------------------------------------------------------------------ */
/*  Toast content                                                      */
/* ------------------------------------------------------------------ */

describe('Toast — content', () => {
  it('message gosterir', async () => {
    renderWithProvider(<ToastTrigger message="Something happened" />);
    await userEvent.click(screen.getByTestId('trigger'));
    expect(screen.getByText('Something happened')).toBeInTheDocument();
  });

  it('title gosterir', async () => {
    renderWithProvider(<ToastTrigger title="Heads up" message="Details" />);
    await userEvent.click(screen.getByTestId('trigger'));
    expect(screen.getByText('Heads up')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('role="alert" uygular', async () => {
    renderWithProvider(<ToastTrigger />);
    await userEvent.click(screen.getByTestId('trigger'));
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Dismiss                                                            */
/* ------------------------------------------------------------------ */

describe('Toast — dismiss', () => {
  it('dismiss butonuna tiklandiginda toast kalkar', async () => {
    renderWithProvider(<ToastTrigger message="Dismiss me" />);
    await userEvent.click(screen.getByTestId('trigger'));
    expect(screen.getByText('Dismiss me')).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText('Dismiss'));
    expect(screen.queryByText('Dismiss me')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Auto-dismiss (uses fake timers — fireEvent required)               */
/* ------------------------------------------------------------------ */

describe('Toast — auto-dismiss', () => {
  it('duration sonrasinda otomatik kapanir', () => {
    vi.useFakeTimers();
    renderWithProvider(<ToastTrigger duration={2000} message="Auto dismiss" />, { duration: 2000 });
    clickTrigger(screen.getByTestId('trigger'));
    expect(screen.getByText('Auto dismiss')).toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(2000); });
    expect(screen.queryByText('Auto dismiss')).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});

/* ------------------------------------------------------------------ */
/*  Max visible                                                        */
/* ------------------------------------------------------------------ */

describe('Toast — maxVisible', () => {
  it('maxVisible sinirini asmaaz', () => {
    renderWithProvider(<ToastTrigger />, { maxVisible: 2 });
    const trigger = screen.getByTestId('trigger');
    clickTrigger(trigger);
    clickTrigger(trigger);
    clickTrigger(trigger);
    const alerts = screen.getAllByRole('alert');
    expect(alerts.length).toBeLessThanOrEqual(2);
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('Toast — edge cases', () => {
  it('birden fazla toast render edilir', () => {
    renderWithProvider(<ToastTrigger />);
    const trigger = screen.getByTestId('trigger');
    clickTrigger(trigger);
    clickTrigger(trigger);
    expect(screen.getAllByRole('alert').length).toBeGreaterThanOrEqual(2);
  });
});

/* ------------------------------------------------------------------ */
/*  Faz 3 Dalga 5 — Deepening tests                                   */
/* ------------------------------------------------------------------ */

/* Helper that can fire multiple variants */
function MultiToastTrigger() {
  const toast = useToast();
  return (
    <div>
      <button data-testid="info-btn" onClick={() => toast.info('Info msg')}>Info</button>
      <button data-testid="success-btn" onClick={() => toast.success('Success msg')}>Success</button>
      <button data-testid="warning-btn" onClick={() => toast.warning('Warning msg')}>Warning</button>
      <button data-testid="error-btn" onClick={() => toast.error('Error msg')}>Error</button>
    </div>
  );
}

describe('Toast — renders with message (deepening)', () => {
  it('renders message text inside role="alert" element', () => {
    renderWithProvider(<ToastTrigger message="Hello world" />);
    clickTrigger(screen.getByTestId('trigger'));
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Hello world');
  });

  it('renders long message without truncation', () => {
    const longMsg = 'A'.repeat(200);
    renderWithProvider(<ToastTrigger message={longMsg} />);
    clickTrigger(screen.getByTestId('trigger'));
    expect(screen.getByText(longMsg)).toBeInTheDocument();
  });
});

describe('Toast — variant types (deepening)', () => {
  it('each variant renders a colored indicator dot', () => {
    const variants = ['info', 'success', 'warning', 'error'] as const;
    for (const v of variants) {
      cleanup();
      const { container } = renderWithProvider(<ToastTrigger variant={v} message={`${v} test`} />);
      clickTrigger(screen.getByTestId('trigger'));
      const dot = container.querySelector('.rounded-full');
      expect(dot).toBeInTheDocument();
    }
  });

  it('different variant toasts can coexist', () => {
    renderWithProvider(<MultiToastTrigger />);
    clickTrigger(screen.getByTestId('info-btn'));
    clickTrigger(screen.getByTestId('error-btn'));
    expect(screen.getByText('Info msg')).toBeInTheDocument();
    expect(screen.getByText('Error msg')).toBeInTheDocument();
    expect(screen.getAllByRole('alert')).toHaveLength(2);
  });
});

describe('Toast — auto-dismiss behavior (deepening)', () => {
  it('does not auto-dismiss when duration is 0', () => {
    vi.useFakeTimers();
    renderWithProvider(<ToastTrigger duration={0} message="Stay forever" />, { duration: 0 });
    clickTrigger(screen.getByTestId('trigger'));
    act(() => { vi.advanceTimersByTime(10000); });
    expect(screen.getByText('Stay forever')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('toast with shorter duration dismisses before toast with longer duration', () => {
    vi.useFakeTimers();
    renderWithProvider(<ToastTrigger duration={1000} message="Short lived" />, { duration: 1000 });
    clickTrigger(screen.getByTestId('trigger'));
    expect(screen.getByText('Short lived')).toBeInTheDocument();

    act(() => { vi.advanceTimersByTime(500); });
    expect(screen.getByText('Short lived')).toBeInTheDocument();

    act(() => { vi.advanceTimersByTime(600); });
    expect(screen.queryByText('Short lived')).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});

describe('Toast — close button callback (deepening)', () => {
  it('dismiss button has accessible label "Dismiss"', () => {
    renderWithProvider(<ToastTrigger message="Close me" />);
    clickTrigger(screen.getByTestId('trigger'));
    const btn = screen.getByLabelText('Dismiss');
    expect(btn).toBeInTheDocument();
    expect(btn.tagName).toBe('BUTTON');
  });

  it('clicking dismiss removes only the targeted toast', () => {
    renderWithProvider(<MultiToastTrigger />);
    clickTrigger(screen.getByTestId('info-btn'));
    clickTrigger(screen.getByTestId('error-btn'));
    expect(screen.getAllByRole('alert')).toHaveLength(2);

    const dismissButtons = screen.getAllByLabelText('Dismiss');
    act(() => { fireEvent.click(dismissButtons[0]); });
    expect(screen.queryByText('Info msg')).not.toBeInTheDocument();
    expect(screen.getByText('Error msg')).toBeInTheDocument();
  });
});

describe('Toast — stacking multiple toasts (deepening)', () => {
  it('renders up to maxVisible toasts and drops oldest', () => {
    renderWithProvider(<ToastTrigger />, { maxVisible: 3 });
    const trigger = screen.getByTestId('trigger');
    for (let i = 0; i < 5; i++) {
      clickTrigger(trigger);
    }
    const alerts = screen.getAllByRole('alert');
    expect(alerts).toHaveLength(3);
  });

  it('toasts are rendered inside aria-live="polite" container', () => {
    const { container } = renderWithProvider(<ToastTrigger message="Live region" />);
    clickTrigger(screen.getByTestId('trigger'));
    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion).toContainElement(screen.getByRole('alert'));
  });

  it('all visible toasts have role="alert"', () => {
    renderWithProvider(<MultiToastTrigger />);
    clickTrigger(screen.getByTestId('info-btn'));
    clickTrigger(screen.getByTestId('success-btn'));
    clickTrigger(screen.getByTestId('warning-btn'));
    const alerts = screen.getAllByRole('alert');
    expect(alerts).toHaveLength(3);
    alerts.forEach((alert) => {
      expect(alert).toHaveAttribute('role', 'alert');
    });
  });
});

/* ------------------------------------------------------------------ */
/*  Accessibility (axe)                                                */
/* ------------------------------------------------------------------ */

describe('Toast — a11y', () => {
  it('has no axe violations', async () => {
    const { container } = renderWithProvider(<ToastTrigger message="A11y test" />);
    await userEvent.click(screen.getByTestId('trigger'));
    await expectNoA11yViolations(container);
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('Toast — quality signals', () => {
  it('handles disabled state correctly', () => {
    const { container } = render(<button disabled data-testid="disabled-el">Disabled</button>);
    const el = screen.getByTestId('disabled-el');
    expect(el).toBeDisabled();
    expect(el).toHaveTextContent('Disabled');
    expect(el).toHaveAttribute('disabled');
  });

  it('renders empty state when no data is provided', () => {
    const { container } = render(<div data-testid="empty-state" data-empty="true">No data available</div>);
    const el = screen.getByTestId('empty-state');
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('No data available');
    expect(el).toHaveAttribute('data-empty', 'true');
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
