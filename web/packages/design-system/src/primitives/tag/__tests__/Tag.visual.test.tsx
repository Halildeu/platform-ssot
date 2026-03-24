/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Tag } from '../Tag';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('Tag Visual Regression', () => {
  it('default variant matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <Tag>Default</Tag>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('closable variant matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <Tag closable>Closable</Tag>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('color variants match screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, display: 'flex', gap: 8 }}>
        <Tag variant="primary">Primary</Tag>
        <Tag variant="success">Success</Tag>
        <Tag variant="warning">Warning</Tag>
        <Tag variant="error">Error</Tag>
        <Tag variant="info">Info</Tag>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
