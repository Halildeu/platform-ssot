 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { PromptComposer } from '../PromptComposer';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('PromptComposer Visual Regression', () => {
  it('default state matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 800 }}>
        <PromptComposer />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
