// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Autocomplete } from '../Autocomplete';
import type { AutocompleteOption } from '../Autocomplete';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

const defaultOptions: AutocompleteOption[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

describe('Autocomplete contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Autocomplete.displayName).toBe('Autocomplete');
  });

  it('renders with required props', () => {
    const { container } = render(<Autocomplete options={defaultOptions} />);
    expect(container.querySelector('input[role="combobox"]')).toBeInTheDocument();
  });

  it('forwards ref to <input>', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Autocomplete ref={ref} options={defaultOptions} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  /* ---- Label ---- */
  it('renders label', () => {
    render(<Autocomplete options={defaultOptions} label="Fruit" />);
    expect(screen.getByText('Fruit')).toBeInTheDocument();
  });

  /* ---- Description ---- */
  it('renders description', () => {
    render(<Autocomplete options={defaultOptions} description="Pick a fruit" />);
    expect(screen.getByText('Pick a fruit')).toBeInTheDocument();
  });

  /* ---- Error ---- */
  it('sets aria-invalid when error is provided', () => {
    const { container } = render(<Autocomplete options={defaultOptions} error="Required" />);
    expect(container.querySelector('input')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders error message text', () => {
    render(<Autocomplete options={defaultOptions} error="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  /* ---- Disabled ---- */
  it('respects disabled prop', () => {
    const { container } = render(<Autocomplete options={defaultOptions} disabled />);
    expect(container.querySelector('input')).toBeDisabled();
  });

  /* ---- Placeholder ---- */
  it('renders placeholder', () => {
    render(<Autocomplete options={defaultOptions} placeholder="Search..." />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  /* ---- className merge ---- */
  it('merges custom className', () => {
    const { container } = render(<Autocomplete options={defaultOptions} className="my-auto" />);
    expect(container.querySelector('.my-auto')).toBeInTheDocument();
  });

  /* ---- Shows dropdown on focus ---- */
  it('shows options dropdown on input focus', async () => {
    const user = userEvent.setup();
    render(<Autocomplete options={defaultOptions} />);
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  /* ---- Sizes ---- */
  it.each(['sm', 'md', 'lg'] as const)('renders size=%s', (size) => {
    const { container } = render(<Autocomplete options={defaultOptions} size={size} />);
    expect(container.querySelector('input[role="combobox"]')).toBeInTheDocument();
  });
});

describe('Autocomplete — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<Autocomplete options={defaultOptions} label="Fruit" />);
    await expectNoA11yViolations(container);
  });
});
