import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { TimePicker } from '../TimePicker';

describe('TimePicker (Browser)', () => {
  it('renders time input', async () => {
    const screen = render(<TimePicker />);
    const input = screen.container.querySelector('input[type="time"]');
    expect(input).not.toBeNull();
  });

  it('renders with label', async () => {
    const screen = render(<TimePicker label="Start Time" />);
    await expect.element(screen.getByText('Start Time')).toBeVisible();
  });

  it('shows default empty value label', async () => {
    const screen = render(<TimePicker />);
    await expect.element(screen.getByText('Saat secin')).toBeVisible();
  });

  it('displays current value when controlled', async () => {
    const screen = render(<TimePicker value="14:30" />);
    await expect.element(screen.getByText('14:30')).toBeVisible();
  });

  it('fires onValueChange when time changes', async () => {
    const onValueChange = vi.fn();
    const screen = render(<TimePicker onValueChange={onValueChange} />);
    const input = screen.container.querySelector('input[type="time"]') as HTMLInputElement;
    const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
    nativeSetter?.call(input, '10:30');
    input.dispatchEvent(new Event('change', { bubbles: true }));
    expect(onValueChange).toHaveBeenCalledWith('10:30', expect.anything());
  });

  it('is disabled when disabled prop is set', async () => {
    const screen = render(<TimePicker label="Time" disabled />);
    const input = screen.container.querySelector('input[type="time"]') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('shows error message', async () => {
    const screen = render(<TimePicker error="Invalid time" />);
    await expect.element(screen.getByText('Invalid time')).toBeVisible();
  });

  it('renders as readonly when access is readonly', async () => {
    const screen = render(<TimePicker access="readonly" />);
    const input = screen.container.querySelector('input[type="time"]') as HTMLInputElement;
    expect(input.getAttribute('aria-readonly')).toBe('true');
  });
});
