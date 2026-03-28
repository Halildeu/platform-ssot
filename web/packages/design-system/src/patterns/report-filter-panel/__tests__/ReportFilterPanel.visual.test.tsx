/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { ReportFilterPanel } from '../ReportFilterPanel';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('ReportFilterPanel Visual Regression', () => {
  it('filter panel matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 600 }}>
        <ReportFilterPanel onSubmit={() => {}} onReset={() => {}}>
          <input placeholder="Start date" />
          <input placeholder="End date" />
        </ReportFilterPanel>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
