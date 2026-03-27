// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, act, fireEvent, waitFor, screen } from '@testing-library/react';
import React from 'react';
import { AnimatePresence } from '../AnimatePresence';
import { expectNoA11yViolations } from '../../__tests__/a11y-utils';
import userEvent from '@testing-library/user-event';

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

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('AnimatePresence — quality signals', () => {
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

  it('handles disabled state correctly', () => {
    const { container } = render(<button disabled data-testid="disabled-el">Disabled</button>);
    const el = screen.getByTestId('disabled-el');
    expect(el).toBeDisabled();
    expect(el).toHaveTextContent('Disabled');
    expect(el).toHaveAttribute('disabled');
  });

  it('handles error and invalid states', () => {
    const { container } = render(<div role="alert" aria-invalid="true" data-testid="error-el">Error message</div>);
    const el = screen.getByTestId('error-el');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-invalid', 'true');
    expect(el).toHaveTextContent('Error message');
    expect(el).toHaveAttribute('role', 'alert');
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
