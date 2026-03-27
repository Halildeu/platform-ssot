/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { DetailSectionTabs } from '../DetailSectionTabs';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('DetailSectionTabs Visual Regression', () => {
  it('tabs layout matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 500 }}>
        <DetailSectionTabs
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'details', label: 'Details' },
            { id: 'history', label: 'History' },
          ]}
          activeTabId="overview"
          onTabChange={() => {}}
        />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
