// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { SearchInput } from '../SearchInput';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('SearchInput contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(SearchInput.displayName).toBe('SearchInput');
  });

  it('renders with required props', () => {
    const { container } = render(<SearchInput />);
    expect(container.querySelector('input[type="search"]')).toBeInTheDocument();
  });

  it('forwards ref to <input>', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<SearchInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  /* ---- Disabled ---- */
  it('respects disabled prop', () => {
    const { container } = render(<SearchInput disabled />);
    expect(container.querySelector('input')).toBeDisabled();
  });

  /* ---- Loading ---- */
  it('renders loading spinner when loading=true', () => {
    const { container } = render(<SearchInput loading />);
    expect(container.querySelector('svg.animate-spin')).toBeInTheDocument();
  });

  /* ---- className merge ---- */
  it('merges custom className', () => {
    const { container } = render(<SearchInput className="my-custom" />);
    expect(container.querySelector('input.my-custom')).toBeInTheDocument();
  });

  /* ---- data-testid ---- */
  it('forwards data-testid', () => {
    const { container } = render(<SearchInput data-testid="search-field" />);
    expect(container.querySelector('[data-testid="search-field"]')).toBeInTheDocument();
  });

  /* ---- Size variants ---- */
  it.each(['sm', 'md', 'lg'] as const)('renders size=%s', (size) => {
    const { container } = render(<SearchInput size={size} />);
    expect(container.querySelector('input[type="search"]')).toBeInTheDocument();
  });

  /* ---- Placeholder ---- */
  it('forwards placeholder', () => {
    render(<SearchInput placeholder="Search..." />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  /* ---- Value handling ---- */
  it('passes value to input', () => {
    const { container } = render(<SearchInput value="test" onChange={() => {}} />);
    expect(container.querySelector('input')).toHaveValue('test');
  });

  /* ---- Clear button ---- */
  it('shows clear button when clearable and has value', () => {
    render(<SearchInput value="test" clearable onClear={() => {}} onChange={() => {}} />);
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
  });

  it('does not show clear button when value is empty', () => {
    const { container } = render(<SearchInput value="" clearable onClear={() => {}} onChange={() => {}} />);
    expect(container.querySelector('[aria-label="Clear search"]')).not.toBeInTheDocument();
  });
});

describe('SearchInput — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<SearchInput aria-label="Search" />);
    await expectNoA11yViolations(container);
  });
});
