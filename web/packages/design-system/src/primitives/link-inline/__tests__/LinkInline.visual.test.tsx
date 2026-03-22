import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { LinkInline } from '../LinkInline';

describe('LinkInline Visual Regression', () => {
  it('primary link matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff' }}>
        <LinkInline href="/test" variant="primary">Primary Link</LinkInline>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('secondary link matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff' }}>
        <LinkInline href="/test" variant="secondary">Secondary Link</LinkInline>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
