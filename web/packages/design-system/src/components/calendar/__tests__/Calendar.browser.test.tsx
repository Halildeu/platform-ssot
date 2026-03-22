import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Calendar } from '../Calendar';

describe('Calendar (Browser)', () => {
  it('renders month view with grid', async () => {
    const screen = render(<Calendar defaultMonth={new Date(2025, 0, 1)} />);
    await expect.element(screen.getByRole('grid')).toBeVisible();
    await expect.element(screen.getByText('Ocak 2025')).toBeVisible();
  });

  it('navigates to next month', async () => {
    const screen = render(<Calendar defaultMonth={new Date(2025, 0, 1)} />);
    await screen.getByLabelText('Sonraki ay').click();
    await expect.element(screen.getByText('Subat 2025')).toBeVisible();
  });
});
