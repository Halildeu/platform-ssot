import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { PromptComposer } from '../PromptComposer';

describe('PromptComposer Visual Regression', () => {
  it('default state matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 800 }}>
        <PromptComposer />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
