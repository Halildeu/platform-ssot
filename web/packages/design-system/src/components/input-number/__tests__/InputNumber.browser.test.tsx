import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { InputNumber } from '../InputNumber';

describe('InputNumber (Browser)', () => {
  it('renders spinbutton role', async () => {
    const screen = await render(<InputNumber />);
    await expect.element(screen.getByRole('spinbutton')).toBeVisible();
  });

  it('renders increment and decrement buttons', async () => {
    const screen = await render(<InputNumber defaultValue={5} />);
    await expect.element(screen.getByLabelText('Increment')).toBeVisible();
    await expect.element(screen.getByLabelText('Decrement')).toBeVisible();
  });

  it('increments value on button click', async () => {
    const onChange = vi.fn();
    const screen = await render(<InputNumber defaultValue={5} step={1} onChange={onChange} />);
    await screen.getByLabelText('Increment').click();
    expect(onChange).toHaveBeenCalledWith(6);
  });

  it('decrements value on button click', async () => {
    const onChange = vi.fn();
    const screen = await render(<InputNumber defaultValue={5} step={1} onChange={onChange} />);
    await screen.getByLabelText('Decrement').click();
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('respects min boundary', async () => {
    const screen = await render(<InputNumber defaultValue={0} min={0} />);
    // Decrement button should be disabled at min boundary
    const decrementBtn = screen.getByLabelText('Decrement');
    await expect.element(decrementBtn).toBeDisabled();
  });

  it('respects max boundary', async () => {
    const screen = await render(<InputNumber defaultValue={10} max={10} />);
    // Increment button should be disabled at max boundary
    const incrementBtn = screen.getByLabelText('Increment');
    await expect.element(incrementBtn).toBeDisabled();
  });

  it('is disabled when disabled prop is set', async () => {
    const screen = await render(<InputNumber defaultValue={5} disabled />);
    await expect.element(screen.getByRole('spinbutton')).toBeDisabled();
  });

  it('shows error message and aria-invalid', async () => {
    const screen = await render(<InputNumber error="Value too high" />);
    await expect.element(screen.getByText('Value too high')).toBeVisible();
    const input = screen.getByRole('spinbutton');
    await expect.element(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders label', async () => {
    const screen = await render(<InputNumber label="Quantity" />);
    await expect.element(screen.getByText('Quantity')).toBeVisible();
  });

  it('supports custom step', async () => {
    const onChange = vi.fn();
    const screen = await render(<InputNumber defaultValue={0} step={5} onChange={onChange} />);
    await screen.getByLabelText('Increment').click();
    expect(onChange).toHaveBeenCalledWith(5);
  });
});
