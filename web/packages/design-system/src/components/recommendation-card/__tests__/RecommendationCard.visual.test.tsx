import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { RecommendationCard } from '../RecommendationCard';

describe('RecommendationCard Visual Regression', () => {
  it('info tone matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 500 }}>
        <RecommendationCard title="Upgrade" summary="Recommended upgrade" tone="info" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
