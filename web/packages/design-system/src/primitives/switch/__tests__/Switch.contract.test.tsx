// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, fireEvent, within } from '@testing-library/react';
import { Switch } from '../Switch';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('Switch contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Switch.displayName).toBe('Switch');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Switch ref={ref} label="Test" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  /* ---- Label ---- */
  it('renders label text', () => {
    const { container } = render(<Switch label="Enable" />);
    expect(within(container).getByText('Enable')).toBeInTheDocument();
  });

  it('renders description', () => {
    const { container } = render(<Switch label="E" description="Toggle feature" />);
    expect(within(container).getByText('Toggle feature')).toBeInTheDocument();
  });

  /* ---- Controlled ---- */
  it('respects checked prop', () => {
    const { container } = render(<Switch label="C" checked onChange={() => {}} />);
    expect(container.querySelector('input')).toBeChecked();
  });

  it('calls onChange on toggle', () => {
    const onChange = vi.fn();
    const { container } = render(<Switch label="T" onChange={onChange} />);
    fireEvent.click(container.querySelector('input')!);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  /* ---- Uncontrolled ---- */
  it('toggles in uncontrolled mode', () => {
    const { container } = render(<Switch label="U" />);
    const input = container.querySelector('input')!;
    expect(input).not.toBeChecked();
    fireEvent.click(input);
    expect(input).toBeChecked();
  });

  /* ---- Sizes ---- */
  it.each(['sm', 'md', 'lg'] as const)('renders size=%s', (size) => {
    const { container } = render(<Switch label="S" size={size} />);
    expect(container.querySelector('input')).toBeInTheDocument();
  });

  /* ---- Disabled ---- */
  it('respects disabled prop', () => {
    const { container } = render(<Switch label="D" disabled />);
    expect(container.querySelector('input')).toBeDisabled();
  });

  /* ---- Error ---- */
  it('sets aria-invalid when error is truthy', () => {
    const { container } = render(<Switch label="E" error="Invalid" />);
    expect(container.querySelector('input')).toHaveAttribute('aria-invalid', 'true');
  });

  /* ---- Access control ---- */
  it('access=hidden returns null', () => {
    const { container } = render(<Switch label="H" access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('access=disabled disables the switch', () => {
    const { container } = render(<Switch label="D" access="disabled" />);
    expect(container.querySelector('input')).toBeDisabled();
  });

  it('access=readonly sets aria-readonly', () => {
    const { container } = render(<Switch label="R" access="readonly" />);
    const label = container.querySelector('label');
    expect(label).toHaveAttribute('aria-readonly', 'true');
  });
});

describe('Switch — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<Switch label="Enable feature" />);
    await expectNoA11yViolations(container);
  });
});
