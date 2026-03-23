// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import React from 'react';
import { AnimatePresence } from '../AnimatePresence';
import { expectNoA11yViolations } from '../../__tests__/a11y-utils';

describe('AnimatePresence', () => {
  it('renders children normally', () => {
    const { getByText } = render(
      <AnimatePresence>
        <div key="a">Hello</div>
      </AnimatePresence>,
    );
    expect(getByText('Hello')).toBeTruthy();
  });

  it('keeps removed children during exit duration', () => {
    vi.useFakeTimers();

    const { queryByText, rerender } = render(
      <AnimatePresence exitDuration={200}>
        <div key="a">Item A</div>
      </AnimatePresence>,
    );

    // Remove child
    rerender(
      <AnimatePresence exitDuration={200}>
        {null}
      </AnimatePresence>,
    );

    // Still present during exit
    expect(queryByText('Item A')).toBeTruthy();

    // After duration, removed
    act(() => { vi.advanceTimersByTime(250); });
    expect(queryByText('Item A')).toBeNull();

    vi.useRealTimers();
  });

  it('calls onExitComplete after all exits finish', () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();

    const { rerender } = render(
      <AnimatePresence exitDuration={100} onExitComplete={onComplete}>
        <div key="a">A</div>
      </AnimatePresence>,
    );

    rerender(
      <AnimatePresence exitDuration={100} onExitComplete={onComplete}>
        {null}
      </AnimatePresence>,
    );

    expect(onComplete).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(150); });
    expect(onComplete).toHaveBeenCalledOnce();

    vi.useRealTimers();
  });

  it('handles new children appearing', () => {
    const { getByText, rerender } = render(
      <AnimatePresence>
        <div key="a">A</div>
      </AnimatePresence>,
    );

    rerender(
      <AnimatePresence>
        <div key="a">A</div>
        <div key="b">B</div>
      </AnimatePresence>,
    );

    expect(getByText('A')).toBeTruthy();
    expect(getByText('B')).toBeTruthy();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <AnimatePresence>
        <div key="a">Hello</div>
      </AnimatePresence>,
    );
    await expectNoA11yViolations(container);
  });
});
