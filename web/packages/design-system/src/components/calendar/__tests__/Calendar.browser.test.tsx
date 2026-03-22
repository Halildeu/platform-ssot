import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { Calendar } from '../Calendar';

describe('Calendar (Browser)', () => {
  it('renders month view with grid and header', async () => {
    const screen = render(<Calendar defaultMonth={new Date(2025, 0, 1)} />);
    await expect.element(screen.getByRole('grid')).toBeVisible();
    await expect.element(screen.getByText('Ocak 2025')).toBeVisible();
  });

  it('navigates to next month', async () => {
    const screen = render(<Calendar defaultMonth={new Date(2025, 0, 1)} />);
    await screen.getByLabelText('Sonraki ay').click();
    await expect.element(screen.getByText('Subat 2025')).toBeVisible();
  });

  it('navigates to previous month', async () => {
    const screen = render(<Calendar defaultMonth={new Date(2025, 1, 1)} />);
    await screen.getByLabelText('Onceki ay').click();
    await expect.element(screen.getByText('Ocak 2025')).toBeVisible();
  });

  it('selects a date and fires onValueChange', async () => {
    const onValueChange = vi.fn();
    const screen = render(
      <Calendar defaultMonth={new Date(2025, 0, 1)} onValueChange={onValueChange} />,
    );
    await screen.getByText('15').click();
    expect(onValueChange).toHaveBeenCalled();
  });

  it('highlights today date', async () => {
    const today = new Date();
    const screen = render(<Calendar defaultMonth={today} />);
    const todayCell = screen.container.querySelector('[data-today="true"]');
    expect(todayCell).not.toBeNull();
  });

  it('disables dates via disabledDates callback', async () => {
    const onValueChange = vi.fn();
    const screen = render(
      <Calendar
        defaultMonth={new Date(2025, 0, 1)}
        disabledDates={(d) => d.getDate() === 10}
        onValueChange={onValueChange}
      />,
    );
    await screen.getByText('10').click();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('renders weekday headers', async () => {
    const screen = render(<Calendar defaultMonth={new Date(2025, 0, 1)} />);
    const headers = screen.container.querySelectorAll('[role="columnheader"]');
    expect(headers.length).toBe(7);
  });

  it('fires onMonthChange when navigating', async () => {
    const onMonthChange = vi.fn();
    const screen = render(
      <Calendar defaultMonth={new Date(2025, 0, 1)} onMonthChange={onMonthChange} />,
    );
    await screen.getByLabelText('Sonraki ay').click();
    expect(onMonthChange).toHaveBeenCalled();
  });
});
