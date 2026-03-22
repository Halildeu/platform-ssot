import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { PromptComposer } from '../PromptComposer';

describe('PromptComposer Visual Regression', () => {
  it('default state matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff', width: 800 }}>
        <PromptComposer />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
