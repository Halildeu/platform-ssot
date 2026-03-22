import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { DetailSectionTabs } from '../DetailSectionTabs';

describe('DetailSectionTabs Visual Regression', () => {
  it('tabs layout matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff', width: 500 }}>
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
