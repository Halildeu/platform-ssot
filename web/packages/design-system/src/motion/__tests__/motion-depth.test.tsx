// @vitest-environment jsdom
/**
 * Motion — interaction + edge-case depth tests
 *
 * Targets: StaggerGroup, AnimatePresence, Transition
 */
import React, { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, act } from '@testing-library/react';

/* ---- Components under test ---- */
import { StaggerGroup } from '../StaggerGroup';
import { AnimatePresence } from '../AnimatePresence';
import { Transition } from '../Transition';

/* ---- Mock reduced motion to false (animations enabled) ---- */
vi.mock('../../internal/overlay-engine/reduced-motion', () => ({
  useReducedMotion: () => false,
  prefersReducedMotion: () => false,
}));

afterEach(cleanup);

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

/* ================================================================== */
/*  1. StaggerGroup                                                    */
/* ================================================================== */

describe('StaggerGroup — depth', () => {
  it('renders children in sequence with stagger delays', () => {
    render(
      <StaggerGroup staggerDelay={100}>
        <div data-testid="item-0">A</div>
        <div data-testid="item-1">B</div>
        <div data-testid="item-2">C</div>
      </StaggerGroup>,
    );
    const item0 = screen.getByTestId('item-0');
    const item1 = screen.getByTestId('item-1');
    const item2 = screen.getByTestId('item-2');

    expect(item0.style.animationDelay).toBe('0ms');
    expect(item1.style.animationDelay).toBe('100ms');
    expect(item2.style.animationDelay).toBe('200ms');
  });

  it('renders empty children safely', () => {
    const { container } = render(
      <StaggerGroup>{null}</StaggerGroup>,
    );
    expect(container).toBeTruthy();
  });

  it('applies custom delay prop', () => {
    render(
      <StaggerGroup staggerDelay={50}>
        <div data-testid="s1">X</div>
        <div data-testid="s2">Y</div>
      </StaggerGroup>,
    );
    expect(screen.getByTestId('s2').style.animationDelay).toBe('50ms');
  });

  it('applies animation duration to children', () => {
    render(
      <StaggerGroup duration={400}>
        <div data-testid="dur">Item</div>
      </StaggerGroup>,
    );
    expect(screen.getByTestId('dur').style.animationDuration).toBe('400ms');
  });

  it('applies animation className to children', () => {
    render(
      <StaggerGroup className="animate-in fade-in-0">
        <div data-testid="cls">Item</div>
      </StaggerGroup>,
    );
    expect(screen.getByTestId('cls').className).toContain('animate-in');
    expect(screen.getByTestId('cls').className).toContain('fade-in-0');
  });

  it('sets animationFillMode to both', () => {
    render(
      <StaggerGroup>
        <div data-testid="fill">Item</div>
      </StaggerGroup>,
    );
    expect(screen.getByTestId('fill').style.animationFillMode).toBe('both');
  });
});

/* ================================================================== */
/*  2. AnimatePresence                                                 */
/* ================================================================== */

describe('AnimatePresence — depth', () => {
  it('shows children when present', () => {
    render(
      <AnimatePresence>
        <div key="panel" data-testid="panel">Content</div>
      </AnimatePresence>,
    );
    expect(screen.getByTestId('panel')).toBeInTheDocument();
  });

  it('keeps child mounted during exit duration then removes', () => {
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

    // Trigger hide
    act(() => {
      screen.getByText('hide').click();
    });

    // Child still mounted during exit
    expect(screen.queryByTestId('anim')).toBeInTheDocument();

    // After exit duration, child removed
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(screen.queryByTestId('anim')).not.toBeInTheDocument();
  });

  it('calls onExitComplete after exit', () => {
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
    act(() => {
      screen.getByText('hide').click();
    });
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(onExitComplete).toHaveBeenCalledTimes(1);
  });

  it('renders empty children safely', () => {
    const { container } = render(
      <AnimatePresence>{null}</AnimatePresence>,
    );
    expect(container).toBeTruthy();
  });
});

/* ================================================================== */
/*  3. Transition                                                      */
/* ================================================================== */

describe('Transition — depth', () => {
  it('renders child when show=true', () => {
    render(
      <Transition show={true}>
        <div data-testid="trans">Content</div>
      </Transition>,
    );
    expect(screen.getByTestId('trans')).toBeInTheDocument();
  });

  it('does not render when show=false (after exit)', () => {
    render(
      <Transition show={false}>
        <div data-testid="trans-hidden">Content</div>
      </Transition>,
    );
    expect(screen.queryByTestId('trans-hidden')).not.toBeInTheDocument();
  });

  it('applies enter classes when showing', () => {
    render(
      <Transition show={true} enter="animate-fade-in" exit="animate-fade-out">
        <div data-testid="trans-enter">Content</div>
      </Transition>,
    );
    expect(screen.getByTestId('trans-enter').className).toContain('animate-fade-in');
  });

  it('applies exit classes then removes after duration', () => {
    function TestComp() {
      const [show, setShow] = useState(true);
      return (
        <>
          <button onClick={() => setShow(false)}>close</button>
          <Transition
            show={show}
            duration={150}
            enter="enter-cls"
            exit="exit-cls"
          >
            <div data-testid="trans-exit">Content</div>
          </Transition>
        </>
      );
    }
    render(<TestComp />);
    expect(screen.getByTestId('trans-exit').className).toContain('enter-cls');

    act(() => {
      screen.getByText('close').click();
    });

    // During exit, exit classes applied
    expect(screen.getByTestId('trans-exit').className).toContain('exit-cls');

    // After duration, element removed
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.queryByTestId('trans-exit')).not.toBeInTheDocument();
  });

  it('applies animationDuration style', () => {
    render(
      <Transition show={true} duration={300}>
        <div data-testid="dur-trans">Content</div>
      </Transition>,
    );
    expect(screen.getByTestId('dur-trans').style.animationDuration).toBe('300ms');
  });

  it('calls onExited after exit animation', () => {
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
    act(() => {
      screen.getByText('close').click();
    });
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(onExited).toHaveBeenCalledTimes(1);
  });

  it('calls onEntered after enter animation', () => {
    const onEntered = vi.fn();
    render(
      <Transition show={true} duration={100} onEntered={onEntered}>
        <div>Content</div>
      </Transition>,
    );
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(onEntered).toHaveBeenCalledTimes(1);
  });
});
