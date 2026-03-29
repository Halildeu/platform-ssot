 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Spinner } from '../Spinner';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('Spinner Visual Regression', () => {
  it('default spinner matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <Spinner />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('different sizes match screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, display: 'flex', gap: 12, alignItems: 'center' }}>
        <Spinner size="xs" />
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" />
        <Spinner size="xl" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('block mode matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <Spinner mode="block" label="Loading data" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
