// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, fireEvent, within } from '@testing-library/react';
import { Radio, RadioGroup } from '../Radio';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('Radio contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Radio.displayName).toBe('Radio');
  });

  it('forwards ref to <input type=radio>', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Radio ref={ref} label="Test" value="t" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.type).toBe('radio');
  });

  /* ---- Label ---- */
  it('renders label text', () => {
    const { container } = render(<Radio label="Option A" value="a" />);
    expect(within(container).getByText('Option A')).toBeInTheDocument();
  });

  it('renders description', () => {
    const { container } = render(<Radio label="A" description="Desc" value="a" />);
    expect(within(container).getByText('Desc')).toBeInTheDocument();
  });

  /* ---- Sizes ---- */
  it.each(['sm', 'md', 'lg'] as const)('renders size=%s', (size) => {
    const { container } = render(<Radio label="S" value="s" size={size} />);
    expect(container.querySelector('input')).toBeInTheDocument();
  });

  /* ---- Error ---- */
  it('sets aria-invalid when error is truthy', () => {
    const { container } = render(<Radio label="E" value="e" error="Required" />);
    expect(container.querySelector('input')).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets data-error attribute when error is truthy', () => {
    const { container } = render(<Radio label="E" value="e" error />);
    expect(container.querySelector('label')).toHaveAttribute('data-error');
  });

  /* ---- Access control ---- */
  it('access=hidden returns null', () => {
    const { container } = render(<Radio label="H" value="h" access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('access=disabled disables the radio', () => {
    const { container } = render(<Radio label="D" value="d" access="disabled" />);
    expect(container.querySelector('input')).toBeDisabled();
  });

  it('access=readonly sets aria-readonly', () => {
    const { container } = render(<Radio label="R" value="r" access="readonly" />);
    expect(container.querySelector('label')).toHaveAttribute('aria-readonly', 'true');
  });
});

describe('RadioGroup contract', () => {
  it('has displayName', () => {
    expect(RadioGroup.displayName).toBe('RadioGroup');
  });

  it('renders radiogroup role', () => {
    const { container } = render(
      <RadioGroup name="test" value="a" onChange={() => {}}>
        <Radio label="A" value="a" />
        <Radio label="B" value="b" />
      </RadioGroup>,
    );
    expect(within(container).getByRole('radiogroup')).toBeInTheDocument();
  });

  it('checks the radio matching value', () => {
    const { container } = render(
      <RadioGroup name="test" value="b" onChange={() => {}}>
        <Radio label="A" value="a" />
        <Radio label="B" value="b" />
      </RadioGroup>,
    );
    const radios = container.querySelectorAll('input[type="radio"]');
    expect(radios[0]).not.toBeChecked();
    expect(radios[1]).toBeChecked();
  });

  it('calls onChange with selected value', () => {
    const onChange = vi.fn();
    const { container } = render(
      <RadioGroup name="test" value="a" onChange={onChange}>
        <Radio label="A" value="a" />
        <Radio label="B" value="b" />
      </RadioGroup>,
    );
    const radios = container.querySelectorAll('input[type="radio"]');
    fireEvent.click(radios[1]);
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('supports uncontrolled mode with defaultValue', () => {
    const { container } = render(
      <RadioGroup name="test" defaultValue="b">
        <Radio label="A" value="a" />
        <Radio label="B" value="b" />
      </RadioGroup>,
    );
    const radios = container.querySelectorAll('input[type="radio"]');
    expect(radios[1]).toBeChecked();
  });
});

describe('Radio — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(
      <RadioGroup name="a11y-test" value="a" onChange={() => {}}>
        <Radio label="Option A" value="a" />
        <Radio label="Option B" value="b" />
      </RadioGroup>,
    );
    await expectNoA11yViolations(container);
  });
});
