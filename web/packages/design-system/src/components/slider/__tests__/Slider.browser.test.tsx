import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { Slider } from '../Slider';

describe('Slider (Browser)', () => {
  it('renders range input', async () => {
    await render(<Slider defaultValue={50} />);
    const input = document.querySelector('input[type="range"]');
    expect(input).not.toBeNull();
  });

  it('shows min and max labels', async () => {
    const screen = await render(<Slider min={0} max={100} defaultValue={50} />);
    await expect.element(screen.getByText('0', { exact: true })).toBeVisible();
    await expect.element(screen.getByText('100', { exact: true })).toBeVisible();
  });

  it('displays current value', async () => {
    const screen = await render(<Slider defaultValue={50} />);
    await expect.element(screen.getByText('50')).toBeVisible();
  });

  it('fires onValueChange when slider changes', async () => {
    const onValueChange = vi.fn();
    await render(<Slider defaultValue={50} onValueChange={onValueChange} />);
    const input = document.querySelector('input[type="range"]') as HTMLInputElement;
    const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
    nativeSetter?.call(input, '75');
    input.dispatchEvent(new Event('change', { bubbles: true }));
    expect(onValueChange).toHaveBeenCalledWith(75, expect.anything());
  });

  it('is disabled when disabled prop is set', async () => {
    await render(<Slider defaultValue={50} disabled />);
    const input = document.querySelector('input[type="range"]') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('renders with label', async () => {
    const screen = await render(<Slider label="Volume" defaultValue={50} />);
    await expect.element(screen.getByText('Volume')).toBeVisible();
  });

  it('renders custom min/max labels', async () => {
    const screen = await render(<Slider defaultValue={50} minLabel="Quiet" maxLabel="Loud" />);
    await expect.element(screen.getByText('Quiet')).toBeVisible();
    await expect.element(screen.getByText('Loud')).toBeVisible();
  });

  it('shows error state', async () => {
    const screen = await render(<Slider defaultValue={50} error="Out of range" />);
    await expect.element(screen.getByText('Out of range')).toBeVisible();
  });

  it('renders as readonly when access is readonly', async () => {
    await render(<Slider defaultValue={50} access="readonly" />);
    const input = document.querySelector('input[type="range"]') as HTMLInputElement;
    expect(input.getAttribute('aria-readonly')).toBe('true');
  });
});
