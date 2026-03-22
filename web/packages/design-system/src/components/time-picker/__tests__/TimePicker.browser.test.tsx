import { describe, it, expect } from 'vitest';
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
});
