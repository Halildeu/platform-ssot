import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { Rating } from '../Rating';

describe('Rating (Browser)', () => {
  it('renders 5 stars with radiogroup role by default', async () => {
    const screen = await render(<Rating />);
    const group = screen.getByRole('radiogroup');
    await expect.element(group).toBeVisible();
    const stars = document.querySelectorAll('[role="radio"]');
    expect(stars).toHaveLength(5);
  });

  it('renders with initial value and showValue', async () => {
    const screen = await render(<Rating defaultValue={3} showValue />);
    await expect.element(screen.getByText('3')).toBeVisible();
  });

  it('renders custom max stars', async () => {
    await render(<Rating max={10} />);
    const stars = document.querySelectorAll('[role="radio"]');
    expect(stars).toHaveLength(10);
  });

  it('fires onValueChange when clicking a star', async () => {
    const onValueChange = vi.fn();
    await render(<Rating onValueChange={onValueChange} />);
    const stars = document.querySelectorAll('[role="radio"]');
    (stars[2] as HTMLElement).click();
    expect(onValueChange).toHaveBeenCalledWith(3);
  });

  it('clears value when clicking same star (allowClear)', async () => {
    const onValueChange = vi.fn();
    await render(<Rating defaultValue={3} onValueChange={onValueChange} />);
    const stars = document.querySelectorAll('[role="radio"]');
    (stars[2] as HTMLElement).click();
    expect(onValueChange).toHaveBeenCalledWith(0);
  });

  it('blocks interaction in readonly mode', async () => {
    const onValueChange = vi.fn();
    const screen = await render(<Rating defaultValue={2} access="readonly" onValueChange={onValueChange} />);
    const stars = document.querySelectorAll('[role="radio"]');
    (stars[3] as HTMLElement).click();
    expect(onValueChange).not.toHaveBeenCalled();
    const group = screen.getByRole('radiogroup');
    await expect.element(group).toHaveAttribute('aria-readonly', 'true');
  });

  it('navigates with ArrowRight keyboard', async () => {
    const onValueChange = vi.fn();
    const screen = await render(<Rating defaultValue={2} onValueChange={onValueChange} />);
    const group = screen.getByRole('radiogroup');
    group.element().focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onValueChange).toHaveBeenCalledWith(3);
  });

  it('renders description labels', async () => {
    const labels = { 1: 'Bad', 3: 'OK', 5: 'Great' };
    const screen = await render(<Rating defaultValue={3} labels={labels} />);
    await expect.element(screen.getByText('OK')).toBeVisible();
  });
});
