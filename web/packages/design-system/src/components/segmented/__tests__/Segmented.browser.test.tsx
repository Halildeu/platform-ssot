import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Segmented } from '../Segmented';

const items = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

describe('Segmented (Browser)', () => {
  it('renders all segments', async () => {
    const screen = render(<Segmented items={items} />);
    await expect.element(screen.getByText('Day')).toBeVisible();
    await expect.element(screen.getByText('Week')).toBeVisible();
    await expect.element(screen.getByText('Month')).toBeVisible();
  });

  it('selects default value', async () => {
    const screen = render(<Segmented items={items} defaultValue="week" />);
    const weekBtn = screen.getByRole('radio', { name: 'Week' });
    await expect.element(weekBtn).toBeVisible();
  });

  it('changes selection on click', async () => {
    const screen = render(<Segmented items={items} defaultValue="day" />);
    await screen.getByText('Month').click();
    const monthBtn = screen.getByRole('radio', { name: 'Month' });
    await expect.element(monthBtn).toHaveAttribute('aria-checked', 'true');
  });
});
