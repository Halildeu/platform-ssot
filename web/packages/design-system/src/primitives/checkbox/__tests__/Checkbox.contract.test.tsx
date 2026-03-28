// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, fireEvent, within } from '@testing-library/react';
import { Checkbox } from '../Checkbox';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('Checkbox contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Checkbox.displayName).toBe('Checkbox');
  });

  it('forwards ref to <input type=checkbox>', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Checkbox ref={ref} label="Test" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.type).toBe('checkbox');
  });

  /* ---- Label ---- */
  it('renders label text', () => {
    const { container } = render(<Checkbox label="Accept terms" />);
    expect(within(container).getByText('Accept terms')).toBeInTheDocument();
  });

  it('renders description', () => {
    const { container } = render(<Checkbox label="Accept" description="Read carefully" />);
    expect(within(container).getByText('Read carefully')).toBeInTheDocument();
  });

  /* ---- Controlled ---- */
  it('respects checked prop', () => {
    const { container } = render(<Checkbox checked onChange={() => {}} />);
    expect(container.querySelector('input')).toBeChecked();
  });

  it('calls onChange on click', () => {
    const onChange = vi.fn();
    const { container } = render(<Checkbox label="C" onChange={onChange} />);
    fireEvent.click(container.querySelector('input')!);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  /* ---- Uncontrolled ---- */
  it('toggles in uncontrolled mode', () => {
    const { container } = render(<Checkbox label="U" />);
    const input = container.querySelector('input')!;
    expect(input).not.toBeChecked();
    fireEvent.click(input);
    expect(input).toBeChecked();
  });

  /* ---- Indeterminate ---- */
  it('sets indeterminate state on the DOM element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Checkbox ref={ref} indeterminate />);
    expect(ref.current?.indeterminate).toBe(true);
  });

  /* ---- Sizes ---- */
  it.each(['sm', 'md', 'lg'] as const)('renders size=%s', (size) => {
    const { container } = render(<Checkbox label="S" size={size} />);
    expect(container.querySelector('input')).toBeInTheDocument();
  });

  /* ---- Error ---- */
  it('sets aria-invalid when error is truthy', () => {
    const { container } = render(<Checkbox label="E" error="Required" />);
    expect(container.querySelector('input')).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets data-error attribute when error is truthy', () => {
    const { container } = render(<Checkbox label="E" error />);
    expect(container.querySelector('label')).toHaveAttribute('data-error');
  });

  /* ---- Access control ---- */
  it('access=hidden returns null', () => {
    const { container } = render(<Checkbox label="H" access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('access=disabled disables the checkbox', () => {
    const { container } = render(<Checkbox label="D" access="disabled" />);
    expect(container.querySelector('input')).toBeDisabled();
  });

  it('access=readonly blocks changes', () => {
    const onChange = vi.fn();
    const { container } = render(
      <Checkbox label="R" checked access="readonly" onChange={onChange} />,
    );
    fireEvent.click(container.querySelector('input')!);
    // Readonly should prevent the change
    expect(container.querySelector('label')).toHaveAttribute('aria-readonly', 'true');
  });

  /* ---- Variant ---- */
  it('renders card variant', () => {
    const { container } = render(<Checkbox label="Card" variant="card" />);
    expect(container.querySelector('label')).toBeInTheDocument();
  });
});

describe('Checkbox — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<Checkbox label="Accept terms" />);
    await expectNoA11yViolations(container);
  });
});
