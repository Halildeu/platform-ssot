/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Badge } from '../Badge';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('Badge Visual Regression', () => {
  it('default variant matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <Badge>Default</Badge>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('success variant matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <Badge variant="success">Success</Badge>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('warning and error variants match screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, display: 'flex', gap: 8 }}>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="error">Error</Badge>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
