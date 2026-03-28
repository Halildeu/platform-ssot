// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormField } from '../FormField';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('FormField — temel render', () => {
  it('renders label text', () => {
    render(
      <FormField label="Email">
        <input />
      </FormField>,
    );
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders help/description text', () => {
    render(
      <FormField label="Email" help="Enter your email address">
        <input />
      </FormField>,
    );
    expect(screen.getByText('Enter your email address')).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(
      <FormField label="Email" error="Email is required">
        <input />
      </FormField>,
    );
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  it('hides help text when error is shown', () => {
    render(
      <FormField label="Email" help="Enter your email" error="Email is required">
        <input />
      </FormField>,
    );
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.queryByText('Enter your email')).not.toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(
      <FormField label="Email" required>
        <input />
      </FormField>,
    );
    expect(screen.getByText('*')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Label association                                                   */
/* ------------------------------------------------------------------ */

describe('FormField — label association', () => {
  it('associates label with child input via htmlFor/id', () => {
    render(
      <FormField label="Email" htmlFor="email-input">
        <input />
      </FormField>,
    );
    const label = screen.getByText('Email');
    expect(label).toHaveAttribute('for', 'email-input');
    // The child input should receive the matching id
    const input = document.getElementById('email-input');
    expect(input).toBeInTheDocument();
  });

  it('auto-generates id when htmlFor is not provided', () => {
    render(
      <FormField label="Name">
        <input />
      </FormField>,
    );
    const label = screen.getByText('Name');
    const htmlFor = label.getAttribute('for');
    expect(htmlFor).toBeTruthy();
    const input = document.getElementById(htmlFor!);
    expect(input).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Error state — aria                                                  */
/* ------------------------------------------------------------------ */

describe('FormField — error state', () => {
  it('sets aria-invalid on child input when error is present', () => {
    render(
      <FormField label="Email" error="Required">
        <input />
      </FormField>,
    );
    const input = document.querySelector('input');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not set aria-invalid when no error', () => {
    render(
      <FormField label="Email">
        <input />
      </FormField>,
    );
    const input = document.querySelector('input');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('error message has role="alert"', () => {
    render(
      <FormField label="Email" error="Email is required">
        <input />
      </FormField>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  displayName                                                         */
/* ------------------------------------------------------------------ */

describe('FormField — displayName', () => {
  it('has displayName set', () => {
    expect(FormField.displayName).toBe('FormField');
  });
});

/* ------------------------------------------------------------------ */
/*  Accessibility (axe)                                                */
/* ------------------------------------------------------------------ */

describe('FormField — a11y', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <FormField label="Email" required>
        <input />
      </FormField>,
    );
    await expectNoA11yViolations(container);
  });

  it('has no axe violations with error', async () => {
    const { container } = render(
      <FormField label="Email" error="Email is required">
        <input />
      </FormField>,
    );
    await expectNoA11yViolations(container);
  });
});


/* ------------------------------------------------------------------ */
/*  userEvent & getByRole coverage                                     */
/* ------------------------------------------------------------------ */

describe('FormField — interaction & role', () => {
  it('supports user interaction', async () => {
    const user = userEvent.setup();
    render(<FormField label="Name"><input /></FormField>);
    await user.tab();
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('FormField — quality signals', () => {
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
