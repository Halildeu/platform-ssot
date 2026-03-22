import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { Segmented } from '../Segmented';

const items = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

describe('Segmented (Browser)', () => {
  it('renders all segments with radiogroup role', async () => {
    const screen = await render(<Segmented items={items} />);
    await expect.element(screen.getByText('Day')).toBeVisible();
    await expect.element(screen.getByText('Week')).toBeVisible();
    await expect.element(screen.getByText('Month')).toBeVisible();
    await expect.element(screen.getByRole('radiogroup')).toBeVisible();
  });

  it('selects default value with aria-checked', async () => {
    const screen = await render(<Segmented items={items} defaultValue="week" />);
    const weekBtn = screen.getByRole('radio', { name: 'Week' });
    await expect.element(weekBtn).toHaveAttribute('aria-checked', 'true');
  });

  it('changes selection on click and fires onValueChange', async () => {
    const onValueChange = vi.fn();
    const screen = await render(
      <Segmented items={items} defaultValue="day" onValueChange={onValueChange} />,
    );
    await screen.getByText('Month').click();
    expect(onValueChange).toHaveBeenCalledWith('month');
    const monthBtn = screen.getByRole('radio', { name: 'Month' });
    await expect.element(monthBtn).toHaveAttribute('aria-checked', 'true');
  });

  it('navigates with ArrowRight keyboard', async () => {
    const screen = await render(<Segmented items={items} defaultValue="day" />);
    const dayBtn = screen.getByRole('radio', { name: 'Day' });
    dayBtn.element().focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'Week' }).element());
  });

  it('disables individual segments', async () => {
    const disabledItems = [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week', disabled: true },
      { value: 'month', label: 'Month' },
    ];
    const screen = await render(<Segmented items={disabledItems} />);
    await expect.element(screen.getByRole('radio', { name: 'Week' })).toBeDisabled();
  });

  it('supports controlled value', async () => {
    const screen = await render(<Segmented items={items} value="month" onValueChange={() => {}} />);
    const monthBtn = screen.getByRole('radio', { name: 'Month' });
    await expect.element(monthBtn).toHaveAttribute('aria-checked', 'true');
    const dayBtn = screen.getByRole('radio', { name: 'Day' });
    await expect.element(dayBtn).toHaveAttribute('aria-checked', 'false');
  });

  it('renders with ariaLabel on the group', async () => {
    const screen = await render(<Segmented items={items} ariaLabel="View mode" />);
    const group = screen.getByRole('radiogroup');
    await expect.element(group).toHaveAttribute('aria-label', 'View mode');
  });

  it('supports vertical orientation', async () => {
    const screen = await render(<Segmented items={items} orientation="vertical" />);
    const root = document.querySelector('[data-orientation="vertical"]');
    expect(root).not.toBeNull();
  });
});
