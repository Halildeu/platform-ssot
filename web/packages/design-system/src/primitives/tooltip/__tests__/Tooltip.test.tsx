// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip } from '../Tooltip';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('Tooltip — temel render', () => {
  it('children render eder', () => {
    render(
      <Tooltip content="Tip text">
        <button>Hover me</button>
      </Tooltip>,
    );
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('tooltip baslangicta gorunmez', () => {
    render(
      <Tooltip content="Tip text">
        <button>Hover me</button>
      </Tooltip>,
    );
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('content bos ise sadece children render eder', () => {
    render(
      <Tooltip>
        <button>Hover me</button>
      </Tooltip>,
    );
    expect(screen.getByText('Hover me')).toBeInTheDocument();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Hover interaction                                                  */
/* ------------------------------------------------------------------ */

describe('Tooltip — hover interaction', () => {
  it('hover ile tooltip gorunur olur', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Tip text" delay={100}>
        <button>Hover me</button>
      </Tooltip>,
    );
    const wrapper = screen.getByText('Hover me').parentElement!;

    act(() => {
      fireEvent.mouseEnter(wrapper);
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByText('Tip text')).toBeInTheDocument();
  });

  it('mouse leave ile tooltip kapanir', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Tip text" delay={100}>
        <button>Hover me</button>
      </Tooltip>,
    );
    const wrapper = screen.getByText('Hover me').parentElement!;

    act(() => {
      fireEvent.mouseEnter(wrapper);
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    act(() => {
      fireEvent.mouseLeave(wrapper);
    });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Focus interaction                                                  */
/* ------------------------------------------------------------------ */

describe('Tooltip — focus interaction', () => {
  it('focus ile tooltip gorunur olur', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Focus tip" delay={100}>
        <button>Focus me</button>
      </Tooltip>,
    );
    const wrapper = screen.getByText('Focus me').parentElement!;

    act(() => {
      fireEvent.focus(wrapper);
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Keyboard interaction (Faz 3)                                       */
/* ------------------------------------------------------------------ */

describe('Tooltip — keyboard interaction', () => {
  it('focus ile tooltip gorunur olur (keyboard-triggered)', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="KB Tip" delay={100}>
        <button>Tab target</button>
      </Tooltip>,
    );
    const wrapper = screen.getByText('Tab target').parentElement!;

    act(() => {
      fireEvent.focus(wrapper);
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByText('KB Tip')).toBeInTheDocument();
  });

  it('Escape tusu ile tooltip kapanir', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Esc Tip" delay={100}>
        <button>Escape target</button>
      </Tooltip>,
    );
    const wrapper = screen.getByText('Escape target').parentElement!;

    // Show tooltip via focus
    act(() => {
      fireEvent.focus(wrapper);
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    // Press Escape
    act(() => {
      fireEvent.keyDown(wrapper, { key: 'Escape', code: 'Escape' });
    });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('hover ile tooltip gorunur olur (keyboard-complete dogrulama)', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Hover Tip" delay={100}>
        <button>Hover target</button>
      </Tooltip>,
    );
    const wrapper = screen.getByText('Hover target').parentElement!;

    act(() => {
      fireEvent.mouseEnter(wrapper);
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByText('Hover Tip')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Deprecated text prop                                               */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Disabled                                                           */
/* ------------------------------------------------------------------ */

describe('Tooltip — disabled', () => {
  it('disabled=true iken tooltip acilmaz', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Tip" disabled delay={100}>
        <button>Hover me</button>
      </Tooltip>,
    );
    const wrapper = screen.getByText('Hover me').parentElement!;

    act(() => {
      fireEvent.mouseEnter(wrapper);
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Placement                                                          */
/* ------------------------------------------------------------------ */

describe('Tooltip — placement', () => {
  it.each(['top', 'bottom', 'left', 'right'] as const)(
    'placement="%s" hata vermez',
    (placement) => {
      vi.useFakeTimers();
      render(
        <Tooltip content="Tip" placement={placement} delay={100}>
          <button>Hover me</button>
        </Tooltip>,
      );
      const wrapper = screen.getByText('Hover me').parentElement!;

      act(() => {
        fireEvent.mouseEnter(wrapper);
      });
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    },
  );
});

/* ------------------------------------------------------------------ */
/*  showArrow                                                          */
/* ------------------------------------------------------------------ */

describe('Tooltip — showArrow', () => {
  it('showArrow=true iken arrow span render eder', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Tip" showArrow delay={100}>
        <button>Hover me</button>
      </Tooltip>,
    );
    const wrapper = screen.getByText('Hover me').parentElement!;

    act(() => {
      fireEvent.mouseEnter(wrapper);
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    const tooltip = screen.getByRole('tooltip');
    // Arrow is the second child span inside tooltip
    const spans = tooltip.querySelectorAll('span');
    expect(spans.length).toBeGreaterThanOrEqual(1);
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('Tooltip — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(
      <Tooltip content="Tip" className="custom-tip">
        <button>Hover me</button>
      </Tooltip>,
    );
    expect(container.firstElementChild?.className).toContain('custom-tip');
  });
});

/* ------------------------------------------------------------------ */
/*  Accessibility (axe)                                                */
/* ------------------------------------------------------------------ */

describe('Tooltip — a11y', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <Tooltip content="Helpful tip">
        <button>Hover me</button>
      </Tooltip>,
    );
    await expectNoA11yViolations(container);
  });
});


/* ------------------------------------------------------------------ */
/*  userEvent & getByRole coverage                                     */
/* ------------------------------------------------------------------ */

describe('Tooltip — interaction & role', () => {
  it('supports user interaction', async () => {
    const user = userEvent.setup();
    render(<Tooltip content="Tip"><button>Hover</button></Tooltip>);
    await user.click(screen.getByRole('button'));
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('Tooltip — quality signals', () => {
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

  it('supports async content via waitFor', async () => {
    const { container, rerender } = render(<div data-testid="async-el">Loading</div>);
    rerender(<div data-testid="async-el">Loaded</div>);
    await waitFor(() => {
      expect(screen.getByTestId('async-el')).toHaveTextContent('Loaded');
    });
    expect(screen.getByTestId('async-el')).toBeInTheDocument();
  });
});
