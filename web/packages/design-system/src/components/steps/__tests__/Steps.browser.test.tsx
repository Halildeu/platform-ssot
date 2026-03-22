import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Steps } from '../Steps';

const stepItems = [
  { key: 'info', title: 'Information' },
  { key: 'review', title: 'Review' },
  { key: 'confirm', title: 'Confirm' },
];

describe('Steps (Browser)', () => {
  it('renders all steps', async () => {
    const screen = render(<Steps items={stepItems} current={0} />);
    await expect.element(screen.getByText('Information')).toBeVisible();
    await expect.element(screen.getByText('Review')).toBeVisible();
    await expect.element(screen.getByText('Confirm')).toBeVisible();
  });

  it('highlights the current step', async () => {
    const screen = render(<Steps items={stepItems} current={1} />);
    await expect.element(screen.getByText('Review')).toBeVisible();
  });
});
