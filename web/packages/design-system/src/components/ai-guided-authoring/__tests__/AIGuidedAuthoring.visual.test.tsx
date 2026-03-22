import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { AIGuidedAuthoring } from '../AIGuidedAuthoring';

describe('AIGuidedAuthoring Visual Regression', () => {
  it('default state matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 800 }}>
        <AIGuidedAuthoring />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
