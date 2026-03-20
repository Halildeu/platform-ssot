// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdaptiveForm } from '../AdaptiveForm';
import type { FormField } from '../AdaptiveForm';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

const basicFields: FormField[] = [
  { key: 'name', type: 'text', label: 'Name', required: true },
  { key: 'age', type: 'number', label: 'Age' },
];

describe('AdaptiveForm contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(AdaptiveForm.displayName).toBe('AdaptiveForm');
  });

  /* ---- Default render ---- */
  it('renders form with fields', () => {
    render(<AdaptiveForm fields={basicFields} />);
    expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Age/)).toBeInTheDocument();
  });

  it('sets data-component attribute', () => {
    const { container } = render(<AdaptiveForm fields={basicFields} />);
    expect(container.querySelector('[data-component="adaptive-form"]')).toBeInTheDocument();
  });

  /* ---- Submit button ---- */
  it('renders submit button with custom label', () => {
    render(<AdaptiveForm fields={basicFields} submitLabel="Save" />);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  /* ---- Reset button ---- */
  it('renders reset button when showReset=true', () => {
    render(<AdaptiveForm fields={basicFields} showReset resetLabel="Clear" />);
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
  });

  /* ---- Callback: onSubmit ---- */
  it('calls onSubmit with values on form submission', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<AdaptiveForm fields={basicFields} onSubmit={onSubmit} values={{ name: 'John', age: 30 }} />);
    await user.click(screen.getByRole('button', { name: 'Gonder' }));
    expect(onSubmit).toHaveBeenCalledWith({ name: 'John', age: 30 });
  });

  /* ---- Callback: onValuesChange ---- */
  it('calls onValuesChange when a field changes', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<AdaptiveForm fields={basicFields} onValuesChange={onChange} />);
    const input = screen.getByLabelText(/Name/);
    await user.type(input, 'A');
    expect(onChange).toHaveBeenCalled();
  });

  /* ---- className merging ---- */
  it('merges className', () => {
    const { container } = render(<AdaptiveForm fields={basicFields} className="custom-form" />);
    expect(container.querySelector('[data-component="adaptive-form"]')?.className).toContain('custom-form');
  });

  /* ---- Loading state ---- */
  it('renders loading skeleton when loading=true', () => {
    const { container } = render(<AdaptiveForm fields={basicFields} loading />);
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
  });

  /* ---- Access hidden ---- */
  it('renders nothing when access=hidden', () => {
    const { container } = render(<AdaptiveForm fields={basicFields} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });
});

describe('AdaptiveForm — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<AdaptiveForm fields={basicFields} />);
    await expectNoA11yViolations(container);
  });
});
