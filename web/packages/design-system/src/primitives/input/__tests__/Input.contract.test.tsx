// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, fireEvent } from '@testing-library/react';
import { Input } from '../Input';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('Input contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Input.displayName).toBe('Input');
  });

  it('forwards ref to <input>', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  /* ---- Sizes ---- */
  it.each(['sm', 'md', 'lg'] as const)('renders size=%s', (size) => {
    const { container } = render(<Input size={size} />);
    expect(container.querySelector('input')).toBeInTheDocument();
  });

  /* ---- Disabled ---- */
  it('respects disabled prop', () => {
    const { container } = render(<Input disabled />);
    expect(container.querySelector('input')).toBeDisabled();
  });

  /* ---- Error ---- */
  it('sets aria-invalid when error=true', () => {
    const { container } = render(<Input error />);
    expect(container.querySelector('input')).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets aria-invalid when error is a string', () => {
    const { container } = render(<Input error="Required field" />);
    expect(container.querySelector('input')).toHaveAttribute('aria-invalid', 'true');
  });

  /* ---- Access control ---- */
  it('access=hidden returns null', () => {
    const { container } = render(<Input access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('access=disabled renders disabled input', () => {
    const { container } = render(<Input access="disabled" />);
    expect(container.querySelector('input')).toBeDisabled();
  });

  it('access=readonly renders read-only input', () => {
    const { container } = render(<Input access="readonly" />);
    expect(container.querySelector('input')).toHaveAttribute('aria-readonly', 'true');
  });

  /* ---- Value handling ---- */
  it('passes value to input', () => {
    const { container } = render(<Input value="hello" onChange={() => {}} />);
    expect(container.querySelector('input')).toHaveValue('hello');
  });

  it('calls onChange', () => {
    const onChange = vi.fn();
    const { container } = render(<Input onChange={onChange} />);
    fireEvent.change(container.querySelector('input')!, { target: { value: 'x' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  /* ---- Prefix/Suffix ---- */
  it('renders prefix content', () => {
    const { container } = render(<Input prefix={<span data-testid="pfx">$</span>} />);
    expect(container.querySelector('[data-testid="pfx"]')).toBeInTheDocument();
  });

  it('renders suffix content', () => {
    const { container } = render(<Input suffix={<span data-testid="sfx">kg</span>} />);
    expect(container.querySelector('[data-testid="sfx"]')).toBeInTheDocument();
  });
});

describe('Input — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<Input aria-label="Test input" />);
    await expectNoA11yViolations(container);
  });
});
