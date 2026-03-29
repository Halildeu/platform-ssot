 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { AIGuidedAuthoring } from '../AIGuidedAuthoring';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('AIGuidedAuthoring Visual Regression', () => {
  it('default state matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 800 }}>
        <AIGuidedAuthoring />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
