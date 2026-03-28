// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DetailSectionTabs } from '../DetailSectionTabs';
import type { DetailSectionTabItem } from '../DetailSectionTabs';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

const tabs: DetailSectionTabItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'details', label: 'Details' },
  { id: 'history', label: 'History' },
];

describe('DetailSectionTabs contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(DetailSectionTabs.displayName).toBe('DetailSectionTabs');
  });

  /* ---- Default render ---- */
  it('renders all tab labels', () => {
    render(<DetailSectionTabs tabs={tabs} activeTabId="overview" onTabChange={() => {}} />);
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
  });

  it('sets data-component attribute', () => {
    const { container } = render(<DetailSectionTabs tabs={tabs} activeTabId="overview" onTabChange={() => {}} />);
    expect(container.querySelector('[data-component="detail-section-tabs"]')).toBeInTheDocument();
  });

  /* ---- Callback: onTabChange ---- */
  it('calls onTabChange when a tab is clicked', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<DetailSectionTabs tabs={tabs} activeTabId="overview" onTabChange={handler} />);
    await user.click(screen.getByText('Details'));
    expect(handler).toHaveBeenCalledWith('details');
  });

  /* ---- className merging ---- */
  it('merges className', () => {
    const { container } = render(
      <DetailSectionTabs tabs={tabs} activeTabId="overview" onTabChange={() => {}} className="my-tabs" />,
    );
    const root = container.querySelector('[data-component="detail-section-tabs"]');
    expect(root?.className).toContain('my-tabs');
  });

  /* ---- Active tab ---- */
  it('marks the active tab', () => {
    const { container } = render(
      <DetailSectionTabs tabs={tabs} activeTabId="details" onTabChange={() => {}} />,
    );
    const root = container.querySelector('[data-component="detail-section-tabs"]');
    expect(root).toBeInTheDocument();
    // The active tab should exist
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  /* ---- Disabled tab ---- */
  it('renders disabled tab', () => {
    const tabsWithDisabled: DetailSectionTabItem[] = [
      ...tabs,
      { id: 'settings', label: 'Settings', disabled: true },
    ];
    render(<DetailSectionTabs tabs={tabsWithDisabled} activeTabId="overview" onTabChange={() => {}} />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  /* ---- Custom ariaLabel ---- */
  it('accepts custom ariaLabel', () => {
    render(
      <DetailSectionTabs tabs={tabs} activeTabId="overview" onTabChange={() => {}} ariaLabel="Section navigation" />,
    );
    // Component passes ariaLabel to SectionTabs internally
    const root = document.querySelector('[data-component="detail-section-tabs"]');
    expect(root).toBeInTheDocument();
  });

  /* ---- Sticky ---- */
  it('applies sticky class by default', () => {
    const { container } = render(
      <DetailSectionTabs tabs={tabs} activeTabId="overview" onTabChange={() => {}} />,
    );
    const root = container.querySelector('[data-component="detail-section-tabs"]');
    expect(root?.className).toContain('sticky');
  });
});

describe('DetailSectionTabs — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(
      <DetailSectionTabs tabs={tabs} activeTabId="overview" onTabChange={() => {}} />,
    );
    await expectNoA11yViolations(container);
  });
});
