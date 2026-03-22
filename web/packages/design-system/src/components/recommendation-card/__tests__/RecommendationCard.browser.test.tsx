import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { RecommendationCard } from '../RecommendationCard';

describe('RecommendationCard (Browser)', () => {
  it('renders title and summary', async () => {
    const screen = render(
      <RecommendationCard title="Upgrade Node" summary="Node 20 is recommended for stability" />,
    );
    await expect.element(screen.getByText('Upgrade Node')).toBeVisible();
    await expect.element(screen.getByText('Apply')).toBeVisible();
  });

  it('renders action buttons', async () => {
    const screen = render(
      <RecommendationCard title="Test" summary="Test summary" primaryActionLabel="Accept" secondaryActionLabel="Skip" />,
    );
    await expect.element(screen.getByText('Accept')).toBeVisible();
    await expect.element(screen.getByText('Skip')).toBeVisible();
  });
});
