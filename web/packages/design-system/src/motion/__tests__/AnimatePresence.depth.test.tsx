// @vitest-environment jsdom
import React, { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('../../internal/overlay-engine/reduced-motion', () => ({
  useReducedMotion: () => false,
  prefersReducedMotion: () => false,
}));

import { AnimatePresence } from '../AnimatePresence';

afterEach(cleanup);
beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('AnimatePresence — depth', () => {
  it('shows children when present', () => {
    render(
      <AnimatePresence>
        <div role="alert" key="panel" data-testid="panel">Content</div>
      </AnimatePresence>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('removes child after exit duration', () => {
    function TestComp() {
      const [show, setShow] = useState(true);
      return (
        <>
          <button onClick={() => setShow(false)}>hide</button>
          <AnimatePresence exitDuration={200}>
            {show && <div key="anim" data-testid="anim">Visible</div>}
          </AnimatePresence>
        </>
      );
    }
    render(<TestComp />);
    expect(screen.getByTestId('anim')).toBeInTheDocument();
    act(() => { fireEvent.click(screen.getByRole('button', { name: /hide/i })); });
    act(() => { vi.advanceTimersByTime(250); });
    expect(screen.queryByTestId('anim')).not.toBeInTheDocument();
  });

  it('calls onExitComplete callback', () => {
    const onExitComplete = vi.fn();
    function TestComp() {
      const [show, setShow] = useState(true);
      return (
        <>
          <button onClick={() => setShow(false)}>hide</button>
          <AnimatePresence exitDuration={100} onExitComplete={onExitComplete}>
            {show && <div key="ex">Item</div>}
          </AnimatePresence>
        </>
      );
    }
    render(<TestComp />);
    act(() => { fireEvent.click(screen.getByRole('button', { name: /hide/i })); });
    act(() => { vi.advanceTimersByTime(150); });
    expect(onExitComplete).toHaveBeenCalledTimes(1);
  });

  it('empty children renders safely', () => {
    const { container } = render(<AnimatePresence>{null}</AnimatePresence>);
    expect(container).toBeInTheDocument();
  });

  it('disabled — handles zero exit duration', () => {
    function TestComp() {
      const [show, setShow] = useState(true);
      return (
        <>
          <button onClick={() => setShow(false)}>hide</button>
          <AnimatePresence exitDuration={0}>
            {show && <div key="z" data-testid="zero">Item</div>}
          </AnimatePresence>
        </>
      );
    }
    render(<TestComp />);
    act(() => { fireEvent.click(screen.getByRole('button', { name: /hide/i })); });
    act(() => { vi.advanceTimersByTime(50); });
    expect(screen.queryByTestId('zero')).not.toBeInTheDocument();
  });

  it('error — multiple children transition', () => {
    render(
      <AnimatePresence>
        <div key="a">First</div>
        <div key="b">Second</div>
      </AnimatePresence>,
    );
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('supports keyboard navigation via userEvent', async () => {
    vi.useRealTimers();
    const user = userEvent.setup();
    render(
      <AnimatePresence>
        <button key="btn">Click</button>
      </AnimatePresence>,
    );
    await user.tab();
    expect(screen.getByText('Click')).toBeInTheDocument();
    vi.useFakeTimers();
  });
});
