import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { DatePicker } from '../DatePicker';

describe('DatePicker (Browser)', () => {
  it('renders with label', async () => {
    const screen = render(<DatePicker label="Start date" />);
    await expect.element(screen.getByText('Start date')).toBeVisible();
  });

  it('renders date input element', async () => {
    const screen = render(<DatePicker label="Date" />);
    const input = screen.container.querySelector('input[type="date"]');
    expect(input).not.toBeNull();
  });

  it('is disabled when disabled prop is set', async () => {
    const screen = render(<DatePicker label="Disabled date" disabled />);
    const input = screen.container.querySelector('input');
    expect(input?.disabled).toBe(true);
  });
});
