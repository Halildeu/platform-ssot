// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import React from 'react';
import { Transition } from '../Transition';
import { expectNoA11yViolations } from '../../__tests__/a11y-utils';

describe('Transition', () => {
  it('renders children when show=true', () => {
    const { getByText } = render(
      <Transition show={true} preset="fadeIn">
        <div>Hello</div>
      </Transition>,
    );
    expect(getByText('Hello')).toBeTruthy();
  });

  it('does not render when show=false initially', () => {
    const { queryByText } = render(
      <Transition show={false} preset="fadeIn">
        <div>Hello</div>
      </Transition>,
    );
    expect(queryByText('Hello')).toBeNull();
  });

  it('applies enter classes when show=true', () => {
    const { getByText } = render(
      <Transition show={true} preset="zoomIn">
        <div>Content</div>
      </Transition>,
    );
    const el = getByText('Content');
    expect(el.className).toContain('animate-in');
    expect(el.className).toContain('zoom-in-95');
  });

  it('applies exit classes when show transitions to false', () => {
    const { getByText, rerender } = render(
      <Transition show={true} preset="zoomIn" duration={100}>
        <div>Content</div>
      </Transition>,
    );

    rerender(
      <Transition show={false} preset="zoomIn" duration={100}>
        <div>Content</div>
      </Transition>,
    );

    const el = getByText('Content');
    expect(el.className).toContain('animate-out');
  });

  it('removes element after exit duration', async () => {
    vi.useFakeTimers();

    const { queryByText, rerender } = render(
      <Transition show={true} preset="fadeIn" duration={100}>
        <div>Content</div>
      </Transition>,
    );

    rerender(
      <Transition show={false} preset="fadeIn" duration={100}>
        <div>Content</div>
      </Transition>,
    );

    // Still mounted during exit
    expect(queryByText('Content')).toBeTruthy();

    // After duration, should be removed
    act(() => { vi.advanceTimersByTime(150); });
    expect(queryByText('Content')).toBeNull();

    vi.useRealTimers();
  });

  it('calls onExited after exit animation', () => {
    vi.useFakeTimers();
    const onExited = vi.fn();

    const { rerender } = render(
      <Transition show={true} preset="fadeIn" duration={100} onExited={onExited}>
        <div>Content</div>
      </Transition>,
    );

    rerender(
      <Transition show={false} preset="fadeIn" duration={100} onExited={onExited}>
        <div>Content</div>
      </Transition>,
    );

    expect(onExited).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(150); });
    expect(onExited).toHaveBeenCalledOnce();

    vi.useRealTimers();
  });

  it('accepts custom enter/exit classes', () => {
    const { getByText } = render(
      <Transition show={true} enter="custom-enter" exit="custom-exit">
        <div>Content</div>
      </Transition>,
    );
    expect(getByText('Content').className).toContain('custom-enter');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Transition show={true} preset="fadeIn">
        <div>Content</div>
      </Transition>,
    );
    await expectNoA11yViolations(container);
  });
});
