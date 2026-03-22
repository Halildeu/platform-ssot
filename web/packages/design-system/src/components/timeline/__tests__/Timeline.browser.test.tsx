import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Timeline } from '../Timeline';

const timelineItems = [
  { key: '1', children: 'Created account' },
  { key: '2', children: 'Verified email' },
  { key: '3', children: 'Completed profile' },
];

describe('Timeline (Browser)', () => {
  it('renders all timeline items', async () => {
    const screen = render(<Timeline items={timelineItems} />);
    await expect.element(screen.getByText('Created account')).toBeVisible();
    await expect.element(screen.getByText('Verified email')).toBeVisible();
    await expect.element(screen.getByText('Completed profile')).toBeVisible();
  });
});
