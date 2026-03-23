// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Combobox } from '../Combobox';
import type { ComboboxOption } from '../Combobox';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

const defaultOptions: ComboboxOption[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

describe('Combobox contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Combobox.displayName).toBe('Combobox');
  });

  it('renders with required props', () => {
    const { container } = render(<Combobox options={defaultOptions} />);
    expect(container.querySelector('input[role="combobox"]')).toBeInTheDocument();
  });

  it('forwards ref to <input>', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Combobox ref={ref} options={defaultOptions} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  /* ---- Label ---- */
  it('renders label', () => {
    render(<Combobox options={defaultOptions} label="Fruit" />);
    expect(screen.getByText('Fruit')).toBeInTheDocument();
  });

  /* ---- Description ---- */
  it('renders description', () => {
    render(<Combobox options={defaultOptions} description="Choose a fruit" />);
    expect(screen.getByText('Choose a fruit')).toBeInTheDocument();
  });

  /* ---- Error ---- */
  it('sets aria-invalid when error is provided', () => {
    const { container } = render(<Combobox options={defaultOptions} error="Required" />);
    expect(container.querySelector('input')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders error message text', () => {
    render(<Combobox options={defaultOptions} error="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('sets aria-invalid when invalid=true', () => {
    const { container } = render(<Combobox options={defaultOptions} invalid />);
    expect(container.querySelector('input')).toHaveAttribute('aria-invalid', 'true');
  });

  /* ---- Disabled ---- */
  it('respects disabled prop', () => {
    const { container } = render(<Combobox options={defaultOptions} disabled />);
    expect(container.querySelector('input')).toBeDisabled();
  });

  /* ---- Required ---- */
  it('sets required on the input', () => {
    const { container } = render(<Combobox options={defaultOptions} required />);
    expect(container.querySelector('input')).toBeRequired();
  });

  /* ---- Loading ---- */
  it('accepts loading prop', () => {
    const { container } = render(<Combobox options={defaultOptions} loading />);
    expect(container.querySelector('[data-loading]')).toBeInTheDocument();
  });

  /* ---- className merge ---- */
  it('merges custom className', () => {
    const { container } = render(<Combobox options={defaultOptions} className="my-custom" />);
    expect(container.querySelector('.my-custom')).toBeInTheDocument();
  });

  /* ---- data-testid ---- */
  it('forwards data-testid', () => {
    const { container } = render(<Combobox options={defaultOptions} data-testid="combo-field" />);
    expect(container.querySelector('[data-testid="combo-field"]')).toBeInTheDocument();
  });

  /* ---- Sizes ---- */
  it.each(['sm', 'md', 'lg'] as const)('renders size=%s', (size) => {
    const { container } = render(<Combobox options={defaultOptions} size={size} />);
    expect(container.querySelector('input[role="combobox"]')).toBeInTheDocument();
  });

  /* ---- Access control ---- */
  it('access=hidden returns null', () => {
    const { container } = render(<Combobox options={defaultOptions} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('access=disabled renders disabled input', () => {
    const { container } = render(<Combobox options={defaultOptions} access="disabled" />);
    expect(container.querySelector('input')).toBeDisabled();
  });

  it('access=readonly renders read-only input', () => {
    const { container } = render(<Combobox options={defaultOptions} access="readonly" />);
    expect(container.querySelector('input')).toHaveAttribute('aria-readonly', 'true');
  });
});

describe('Combobox — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<Combobox options={defaultOptions} label="Fruit" />);
    await expectNoA11yViolations(container);
  });
});
