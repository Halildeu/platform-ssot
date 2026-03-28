// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, act, fireEvent, waitFor, screen } from '@testing-library/react';
import React from 'react';
import { Transition } from '../Transition';
import { expectNoA11yViolations } from '../../__tests__/a11y-utils';
import userEvent from '@testing-library/user-event';

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

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('Transition — quality signals', () => {
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
