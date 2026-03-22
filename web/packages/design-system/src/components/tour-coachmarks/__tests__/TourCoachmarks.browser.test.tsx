import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { TourCoachmarks } from '../TourCoachmarks';

const steps = [
  { id: 'welcome', title: 'Welcome', description: 'This is the first step.' },
  { id: 'feature', title: 'Feature', description: 'Here is a feature.' },
  { id: 'done', title: 'Done', description: 'Tour complete.' },
];

describe('TourCoachmarks (Browser)', () => {
  it('renders tour when open', async () => {
    const screen = render(<TourCoachmarks steps={steps} defaultOpen testIdPrefix="tour" />);
    await expect.element(screen.getByText('Welcome')).toBeVisible();
    await expect.element(screen.getByText('This is the first step.')).toBeVisible();
  });

  it('shows progress counter', async () => {
    const screen = render(<TourCoachmarks steps={steps} defaultOpen />);
    await expect.element(screen.getByText('1 / 3')).toBeVisible();
  });
});
