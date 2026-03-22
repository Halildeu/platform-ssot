import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { DatePicker } from '../DatePicker';

describe('DatePicker (Browser)', () => {
  it('renders with label', async () => {
    const screen = render(<DatePicker label="Start date" />);
    await expect.element(screen.getByText('Start date')).toBeVisible();
  });

  it('renders date input with type="date"', async () => {
    const screen = render(<DatePicker label="Date" />);
    const input = screen.container.querySelector('input[type="date"]');
    expect(input).not.toBeNull();
  });

  it('is disabled when disabled prop is set', async () => {
    const screen = render(<DatePicker label="Disabled date" disabled />);
    const input = screen.container.querySelector('input') as HTMLInputElement;
    expect(input.disabled).toBe(true);
    await expect.element(screen.getByLabelText('Disabled date')).toHaveAttribute('aria-disabled', 'true');
  });

  it('fires onValueChange when date changes', async () => {
    const onValueChange = vi.fn();
    const screen = render(<DatePicker label="Date" onValueChange={onValueChange} />);
    const input = screen.container.querySelector('input[type="date"]') as HTMLInputElement;
    // Simulate native change
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
    nativeInputValueSetter?.call(input, '2025-06-15');
    input.dispatchEvent(new Event('change', { bubbles: true }));
    expect(onValueChange).toHaveBeenCalledWith('2025-06-15', expect.anything());
  });

  it('shows error message and aria-invalid', async () => {
    const screen = render(<DatePicker label="Date" error="Date is required" />);
    await expect.element(screen.getByText('Date is required')).toBeVisible();
    const input = screen.container.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('shows default empty value label', async () => {
    const screen = render(<DatePicker label="Date" />);
    await expect.element(screen.getByText('Tarih secin')).toBeVisible();
  });

  it('displays current value when controlled', async () => {
    const screen = render(<DatePicker label="Date" value="2025-03-15" />);
    await expect.element(screen.getByText('2025-03-15')).toBeVisible();
  });

  it('renders as readonly when access is readonly', async () => {
    const screen = render(<DatePicker label="Date" access="readonly" />);
    const input = screen.container.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('aria-readonly')).toBe('true');
  });
});
