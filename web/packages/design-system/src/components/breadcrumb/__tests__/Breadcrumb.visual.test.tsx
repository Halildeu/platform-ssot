/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Breadcrumb } from '../Breadcrumb';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('Breadcrumb Visual Regression', () => {
  it('default with 3 items matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <Breadcrumb
          items={[
            { label: 'Home' },
            { label: 'Category' },
            { label: 'Current Page' },
          ]}
        />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
