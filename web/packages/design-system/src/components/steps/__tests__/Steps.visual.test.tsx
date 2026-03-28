/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Steps } from '../Steps';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('Steps Visual Regression', () => {
  it('default with 3 steps matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 500 }}>
        <Steps
          items={[
            { key: 'step1', title: 'Step 1' },
            { key: 'step2', title: 'Step 2' },
            { key: 'step3', title: 'Step 3' },
          ]}
          current={1}
        />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
