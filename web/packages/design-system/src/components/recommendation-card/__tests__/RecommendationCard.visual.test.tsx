 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { RecommendationCard } from '../RecommendationCard';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('RecommendationCard Visual Regression', () => {
  it('info tone matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 500 }}>
        <RecommendationCard title="Upgrade" summary="Recommended upgrade" tone="info" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
