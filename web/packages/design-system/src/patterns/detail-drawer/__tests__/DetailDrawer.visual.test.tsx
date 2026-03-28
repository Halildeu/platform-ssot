/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { DetailDrawer } from '../DetailDrawer';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('DetailDrawer Visual Regression', () => {
  it('open detail drawer matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, minHeight: 400, position: 'relative' }}>
        <DetailDrawer open onClose={() => {}} title="Order #1234" subtitle="Created 2024-01-15">
          <p>Order content</p>
        </DetailDrawer>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('detail drawer with sections matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, minHeight: 400, position: 'relative' }}>
        <DetailDrawer
          open
          onClose={() => {}}
          title="Product Detail"
          sections={[
            { key: 'info', title: 'Information', content: <p>Product info</p> },
            { key: 'pricing', title: 'Pricing', content: <p>Price data</p> },
          ]}
        />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
