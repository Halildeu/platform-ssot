/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { FloatButton } from '../FloatButton';

describe('FloatButton Visual Regression', () => {
  it('default button matches screenshot', async () => {
    await render(
      <div style={{ padding: 80, background: '#fff', position: 'relative', width: 200, height: 200 }}>
        <FloatButton position="bottom-right" offset={[16, 16]} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
