import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { EmptyState } from '../EmptyState';

describe('EmptyState (Browser)', () => {
  it('renders with title and description', async () => {
    const screen = render(
      <EmptyState
        title="No data found"
        description="Try adjusting your filters."
      />,
    );
    await expect.element(screen.getByText('No data found')).toBeVisible();
    await expect.element(screen.getByText('Try adjusting your filters.')).toBeVisible();
  });
});
