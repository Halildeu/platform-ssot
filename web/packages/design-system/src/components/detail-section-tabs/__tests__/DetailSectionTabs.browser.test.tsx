import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { DetailSectionTabs } from '../DetailSectionTabs';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'details', label: 'Details' },
  { id: 'history', label: 'History' },
];

describe('DetailSectionTabs (Browser)', () => {
  it('renders all tabs', async () => {
    render(
      <DetailSectionTabs tabs={tabs} activeTabId="overview" onTabChange={() => {}} />,
    );
    await expect.element(screen.getByText('Overview')).toBeVisible();
    await expect.element(screen.getByText('Details')).toBeVisible();
    await expect.element(screen.getByText('History')).toBeVisible();
  });

  it('renders with badges', async () => {
    render(
      <DetailSectionTabs
        tabs={[{ id: 'tab1', label: 'Tab 1', badge: <span>3</span> }]}
        activeTabId="tab1"
        onTabChange={() => {}}
      />,
    );
    await expect.element(screen.getByText('3')).toBeVisible();
  });

  it('calls onTabChange when a tab is clicked', async () => {
    const onTabChange = vi.fn();
    render(
      <DetailSectionTabs tabs={tabs} activeTabId="overview" onTabChange={onTabChange} />,
    );
    await screen.getByText('Details').click();
    expect(onTabChange).toHaveBeenCalledWith('details');
  });

  it('renders data-component attribute', async () => {
    render(
      <DetailSectionTabs tabs={tabs} activeTabId="overview" onTabChange={() => {}} />,
    );
    const el = document.querySelector('[data-component="detail-section-tabs"]');
    expect(el).not.toBeNull();
  });

  it('renders disabled tab', async () => {
    render(
      <DetailSectionTabs
        tabs={[
          { id: 'active', label: 'Active' },
          { id: 'disabled', label: 'Disabled', disabled: true },
        ]}
        activeTabId="active"
        onTabChange={() => {}}
      />,
    );
    await expect.element(screen.getByText('Disabled')).toBeVisible();
  });

  it('renders with custom ariaLabel', async () => {
    render(
      <DetailSectionTabs
        tabs={tabs}
        activeTabId="overview"
        onTabChange={() => {}}
        ariaLabel="Section navigation"
      />,
    );
    const el = document.querySelector('[data-component="detail-section-tabs"]');
    expect(el).not.toBeNull();
  });

  it('renders with test id prefix', async () => {
    render(
      <DetailSectionTabs
        tabs={[{ id: 'tab1', label: 'Tab 1' }]}
        activeTabId="tab1"
        onTabChange={() => {}}
        testIdPrefix="order"
      />,
    );
    await expect.element(screen.getByText('Tab 1')).toBeVisible();
  });
});
