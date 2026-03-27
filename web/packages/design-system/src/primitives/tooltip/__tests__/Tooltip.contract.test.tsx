// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, act } from '@testing-library/react';
import { Tooltip } from '../Tooltip';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('Tooltip contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Tooltip.displayName).toBe('Tooltip');
  });

  /* ---- Renders children ---- */
  it('always renders children', () => {
    render(
      <Tooltip content="Tip text">
        <button>Hover me</button>
      </Tooltip>,
    );
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  /* ---- Shows tooltip on hover ---- */
  it('shows tooltip content on mouse enter after delay', async () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Tip text" delay={0}>
        <button>Hover me</button>
      </Tooltip>,
    );
    const trigger = screen.getByText('Hover me');
    await act(async () => {
      fireEvent.mouseEnter(trigger.closest('span')!);
      vi.advanceTimersByTime(250);
    });
    expect(screen.getByRole('tooltip')).toHaveTextContent('Tip text');
    vi.useRealTimers();
  });

  /* ---- Hidden by default ---- */
  it('does not show tooltip content initially', () => {
    render(
      <Tooltip content="Tip text">
        <button>Hover me</button>
      </Tooltip>,
    );
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  /* ---- Hides on mouse leave ---- */
  it('hides tooltip on mouse leave', async () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Tip text" delay={0}>
        <button>Hover me</button>
      </Tooltip>,
    );
    const wrapper = screen.getByText('Hover me').closest('span')!;
    await act(async () => {
      fireEvent.mouseEnter(wrapper);
      vi.advanceTimersByTime(250);
    });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await act(async () => {
      fireEvent.mouseLeave(wrapper);
    });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  /* ---- Accepts className ---- */
  it('merges custom className on wrapper', () => {
    const { container } = render(
      <Tooltip content="Tip" className="custom-tooltip">
        <button>T</button>
      </Tooltip>,
    );
    // className is applied to the outer wrapper span
    expect(container.firstElementChild).toHaveClass('custom-tooltip');
  });

  /* ---- disabled prop ---- */
  it('does not show when disabled', async () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Tip text" disabled delay={0}>
        <button>Hover me</button>
      </Tooltip>,
    );
    const wrapper = screen.getByText('Hover me').closest('span')!;
    await act(async () => {
      fireEvent.mouseEnter(wrapper);
      vi.advanceTimersByTime(250);
    });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  /* ---- Renders nothing extra when no content ---- */
  it('renders only children when content is undefined', () => {
    render(
      <Tooltip>
        <button>Plain</button>
      </Tooltip>,
    );
    // When no content, Tooltip renders children as-is (no wrapper span)
    expect(screen.getByText('Plain')).toBeInTheDocument();
  });

  /* ---- Placements ---- */
  it.each(['top', 'bottom', 'left', 'right'] as const)(
    'renders placement=%s without crash',
    (placement) => {
      const { container } = render(
        <Tooltip content="Tip" placement={placement}>
          <button>P</button>
        </Tooltip>,
      );
      expect(container.firstElementChild).toBeInTheDocument();
    },
  );
});

describe('Tooltip — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(
      <Tooltip content="Helpful tip">
        <button>Hover me</button>
      </Tooltip>,
    );
    await expectNoA11yViolations(container);
  });
});
