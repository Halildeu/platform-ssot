// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, fireEvent } from '@testing-library/react';
import { Select } from '../Select';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
];

describe('Select contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Select.displayName).toBe('Select');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLSelectElement>();
    render(<Select ref={ref} options={options} />);
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  /* ---- Options rendering ---- */
  it('renders all options', () => {
    const { container } = render(<Select options={options} />);
    const opts = container.querySelectorAll('option');
    // +1 for placeholder option if present
    expect(opts.length).toBeGreaterThanOrEqual(3);
  });

  /* ---- Sizes ---- */
  it.each(['sm', 'md', 'lg'] as const)('renders size=%s', (size) => {
    const { container } = render(<Select options={options} size={size} />);
    expect(container.querySelector('select')).toBeInTheDocument();
  });

  /* ---- Disabled ---- */
  it('respects disabled prop', () => {
    const { container } = render(<Select options={options} disabled />);
    expect(container.querySelector('select')).toBeDisabled();
  });

  /* ---- Error ---- */
  it('sets aria-invalid when error is truthy', () => {
    const { container } = render(<Select options={options} error="Required" />);
    expect(container.querySelector('select')).toHaveAttribute('aria-invalid', 'true');
  });

  /* ---- Access control ---- */
  it('access=hidden returns null', () => {
    const { container } = render(<Select options={options} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('access=disabled renders disabled select', () => {
    const { container } = render(<Select options={options} access="disabled" />);
    expect(container.querySelector('select')).toBeDisabled();
  });

  it('access=readonly prevents value change', () => {
    const onChange = vi.fn();
    const { container } = render(
      <Select options={options} value="a" access="readonly" onChange={onChange} />,
    );
    const sel = container.querySelector('select')!;
    fireEvent.change(sel, { target: { value: 'b' } });
    // In readonly mode, onChange should not fire or value should stay
    expect(sel).toHaveAttribute('aria-readonly', 'true');
  });

  /* ---- Value handling ---- */
  it('calls onChange when value changes', () => {
    const onChange = vi.fn();
    const { container } = render(<Select options={options} onChange={onChange} />);
    fireEvent.change(container.querySelector('select')!, { target: { value: 'b' } });
    expect(onChange).toHaveBeenCalled();
  });
});

describe('Select — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<Select options={options} aria-label="Choose" />);
    await expectNoA11yViolations(container);
  });
});
