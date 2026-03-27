// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { FormField } from '../FormField';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('FormField contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(FormField.displayName).toBe('FormField');
  });

  /* ---- Default render ---- */
  it('renders children', () => {
    render(
      <FormField>
        <input data-testid="input" />
      </FormField>,
    );
    expect(screen.getByTestId('input')).toBeInTheDocument();
  });

  /* ---- Label ---- */
  it('renders label when provided', () => {
    render(
      <FormField label="Email">
        <input />
      </FormField>,
    );
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  /* ---- Required indicator ---- */
  it('shows required indicator when required=true', () => {
    render(
      <FormField label="Name" required>
        <input />
      </FormField>,
    );
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  /* ---- Optional indicator ---- */
  it('shows optional indicator when optional=true', () => {
    render(
      <FormField label="Phone" optional>
        <input />
      </FormField>,
    );
    expect(screen.getByText('(optional)')).toBeInTheDocument();
  });

  /* ---- Error message ---- */
  it('renders error message with role=alert', () => {
    render(
      <FormField label="Email" error="Invalid email">
        <input />
      </FormField>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email');
  });

  it('sets aria-invalid on child input when error is provided', () => {
    render(
      <FormField label="Email" error="Bad">
        <input data-testid="inp" />
      </FormField>,
    );
    expect(screen.getByTestId('inp')).toHaveAttribute('aria-invalid', 'true');
  });

  /* ---- Help text ---- */
  it('renders help text when provided and no error', () => {
    render(
      <FormField label="Name" help="Enter your full name">
        <input />
      </FormField>,
    );
    expect(screen.getByText('Enter your full name')).toBeInTheDocument();
  });

  /* ---- className merging ---- */
  it('merges className onto root element', () => {
    const { container } = render(
      <FormField className="my-class">
        <input />
      </FormField>,
    );
    expect(container.firstElementChild?.className).toContain('my-class');
  });

  /* ---- Disabled state ---- */
  it('applies disabled to child input', () => {
    render(
      <FormField label="Name" disabled>
        <input data-testid="inp" />
      </FormField>,
    );
    expect(screen.getByTestId('inp')).toBeDisabled();
  });
});

describe('FormField — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(
      <FormField label="Email">
        <input />
      </FormField>,
    );
    await expectNoA11yViolations(container);
  });
});
