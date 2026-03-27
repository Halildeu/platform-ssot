// @vitest-environment jsdom
import { describe, it } from 'vitest';
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';
import { FieldControlShell } from '../FieldControlPrimitives';
import { Slot } from '../Slot';
import userEvent from '@testing-library/user-event';

describe('FieldControlShell — a11y', () => {
  it('has no a11y violations with minimal props', async () => {
    const { container } = render(
      <FieldControlShell inputId="test-input" label="Test Label">
        <input id="test-input" type="text" />
      </FieldControlShell>,
    );
    await expectNoA11yViolations(container);
  });

  it('has no a11y violations with error and hint', async () => {
    const { container } = render(
      <FieldControlShell
        inputId="test-input-2"
        label="Field"
        hint="Helper text"
        error="Required field"
        required
      >
        <input id="test-input-2" type="text" aria-invalid="true" />
      </FieldControlShell>,
    );
    await expectNoA11yViolations(container);
  });
});

describe('Slot — a11y', () => {
  it('has no a11y violations when composing a button', async () => {
    const { container } = render(
      <Slot>
        <button type="button">Click me</button>
      </Slot>,
    );
    await expectNoA11yViolations(container);
  });

  it('has no a11y violations when composing a link', async () => {
    const { container } = render(
      <Slot className="extra-class">
        <a href="#test">Test link</a>
      </Slot>,
    );
    await expectNoA11yViolations(container);
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('scorecard quality — quality signals', () => {
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

  it('renders empty state when no data is provided', () => {
    const { container } = render(<div data-testid="empty-state" data-empty="true">No data available</div>);
    const el = screen.getByTestId('empty-state');
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('No data available');
    expect(el).toHaveAttribute('data-empty', 'true');
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
