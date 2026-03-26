import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { DatePicker } from '../DatePicker';

describe('DatePicker (Browser)', () => {
  it('renders with label', async () => {
    const screen = await render(<DatePicker label="Start date" />);
    await expect.element(screen.getByText('Start date')).toBeVisible();
  });

  it('renders date input with type="date"', async () => {
    await render(<DatePicker label="Date" />);
    const input = document.querySelector('input[type="date"]');
    expect(input).not.toBeNull();
  });

  it('is disabled when disabled prop is set', async () => {
    const screen = await render(<DatePicker label="Disabled date" disabled />);
    const input = document.querySelector('input') as HTMLInputElement;
    expect(input.disabled).toBe(true);
    await expect.element(screen.getByLabelText('Disabled date')).toHaveAttribute('aria-disabled', 'true');
  });

  it('fires onValueChange when date changes', async () => {
    const onValueChange = vi.fn();
    await render(<DatePicker label="Date" onValueChange={onValueChange} />);
    const input = document.querySelector('input[type="date"]') as HTMLInputElement;
    // Simulate native change
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
    nativeInputValueSetter?.call(input, '2025-06-15');
    input.dispatchEvent(new Event('change', { bubbles: true }));
    expect(onValueChange).toHaveBeenCalledWith('2025-06-15', expect.anything());
  });

  it('shows error message and aria-invalid', async () => {
    const screen = await render(<DatePicker label="Date" error="Date is required" />);
    await expect.element(screen.getByText('Date is required')).toBeVisible();
    const input = document.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('shows default empty value label', async () => {
    const screen = await render(<DatePicker label="Date" />);
    await expect.element(screen.getByText('Tarih secin')).toBeVisible();
  });

  it('displays current value when controlled', async () => {
    const screen = await render(<DatePicker label="Date" value="2025-03-15" />);
    // Value may be in input element or displayed as formatted text
    const input = screen.container.querySelector('input') as HTMLInputElement;
    if (input) {
      expect(input.value).toContain('2025');
    } else {
      // Component renders value as text
      await expect.element(screen.getByText(/2025/)).toBeVisible();
    }
  });

  it('renders as readonly when access is readonly', async () => {
    const screen = await render(<DatePicker label="Date" access="readonly" />);
    const input = screen.container.querySelector('input') as HTMLInputElement;
    if (input) {
      expect(input.readOnly || input.getAttribute('aria-readonly') === 'true').toBe(true);
    }
  });
});
