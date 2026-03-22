import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { DetailSectionTabs } from '../DetailSectionTabs';

describe('DetailSectionTabs (Browser)', () => {
  it('renders tabs with active state', async () => {
    const screen = render(
      <DetailSectionTabs
        tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'details', label: 'Details' },
        ]}
        activeTabId="overview"
        onTabChange={() => {}}
      />,
    );
    await expect.element(screen.getByText('Overview')).toBeVisible();
    await expect.element(screen.getByText('Details')).toBeVisible();
  });

  it('renders with badges', async () => {
    const screen = render(
      <DetailSectionTabs
        tabs={[
          { id: 'tab1', label: 'Tab 1', badge: <span>3</span> },
        ]}
        activeTabId="tab1"
        onTabChange={() => {}}
      />,
    );
    await expect.element(screen.getByText('Tab 1')).toBeVisible();
  });
});
