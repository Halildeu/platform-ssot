/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { DetailSummary } from '../DetailSummary';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('DetailSummary Visual Regression', () => {
  it('default layout matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 800 }}>
        <DetailSummary
          title="Order #1234"
          entity={{
            title: 'Acme Corp',
            items: [
              { key: 'status', label: 'Status', value: 'Active' },
              { key: 'type', label: 'Type', value: 'Enterprise' },
            ],
          }}
        />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
