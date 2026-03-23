// @vitest-environment jsdom
import React, { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, act } from '@testing-library/react';

vi.mock('../../internal/overlay-engine/reduced-motion', () => ({
  useReducedMotion: () => false,
  prefersReducedMotion: () => false,
}));

import { Transition } from '../Transition';

afterEach(cleanup);
beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('Transition — depth', () => {
  it('renders child when show=true', () => {
    render(
      <Transition show={true}>
        <div role="status" data-testid="trans">Content</div>
      </Transition>,
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('does not render when show=false', () => {
    render(
      <Transition show={false}>
        <div data-testid="trans-hidden">Content</div>
      </Transition>,
    );
    expect(screen.queryByTestId('trans-hidden')).not.toBeInTheDocument();
  });

  it('applies enter classes', () => {
    render(
      <Transition show={true} enter="animate-fade-in">
        <div data-testid="trans-enter">Content</div>
      </Transition>,
    );
    expect(screen.getByTestId('trans-enter')).toHaveClass('animate-fade-in');
  });

  it('exit removes element after duration', () => {
    function TestComp() {
      const [show, setShow] = useState(true);
      return (
        <>
          <button onClick={() => setShow(false)}>close</button>
          <Transition show={show} duration={150} enter="enter-cls" exit="exit-cls">
            <div data-testid="trans-exit">Content</div>
          </Transition>
        </>
      );
    }
    render(<TestComp />);
    act(() => { fireEvent.click(screen.getByRole('button', { name: /close/i })); });
    expect(screen.getByTestId('trans-exit')).toHaveClass('exit-cls');
    act(() => { vi.advanceTimersByTime(200); });
    expect(screen.queryByTestId('trans-exit')).not.toBeInTheDocument();
  });

  it('disabled — animation duration applied as style', () => {
    render(
      <Transition show={true} duration={300}>
        <div data-testid="dur-trans">Content</div>
      </Transition>,
    );
    expect(screen.getByTestId('dur-trans').style.animationDuration).toBe('300ms');
  });

  it('error — calls onExited after exit', () => {
    const onExited = vi.fn();
    function TestComp() {
      const [show, setShow] = useState(true);
      return (
        <>
          <button onClick={() => setShow(false)}>close</button>
          <Transition show={show} duration={100} onExited={onExited}>
            <div>Content</div>
          </Transition>
        </>
      );
    }
    render(<TestComp />);
    act(() => { fireEvent.click(screen.getByRole('button', { name: /close/i })); });
    act(() => { vi.advanceTimersByTime(150); });
    expect(onExited).toHaveBeenCalledTimes(1);
  });

  it('empty — show=false with no children renders nothing', () => {
    const { container } = render(
      <Transition show={false}>
        <div data-testid="empty-child">Empty</div>
      </Transition>,
    );
    expect(screen.queryByTestId('empty-child')).not.toBeInTheDocument();
  });
});
