// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { DetailSectionTabs, type DetailSectionTabItem } from '../DetailSectionTabs';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

const sampleTabs: DetailSectionTabItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'details', label: 'Details' },
  { id: 'history', label: 'History' },
];

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('DetailSectionTabs — temel render', () => {
  it('data-component attribute ile render eder', () => {
    const { container } = render(
      <DetailSectionTabs tabs={sampleTabs} activeTabId="overview" onTabChange={vi.fn()} />,
    );
    expect(container.querySelector('[data-component="detail-section-tabs"]')).toBeInTheDocument();
  });

  it('tum tab etiketlerini gosterir', () => {
    render(
      <DetailSectionTabs tabs={sampleTabs} activeTabId="overview" onTabChange={vi.fn()} />,
    );
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
  });

  it('varsayilan ariaLabel "Detay sekmeleri" dir', () => {
    render(
      <DetailSectionTabs tabs={sampleTabs} activeTabId="overview" onTabChange={vi.fn()} />,
    );
    const elements = screen.getAllByLabelText('Detay sekmeleri');
    expect(elements.length).toBeGreaterThanOrEqual(1);
  });

  it('ozel ariaLabel kullanir', () => {
    render(
      <DetailSectionTabs
        tabs={sampleTabs}
        activeTabId="overview"
        onTabChange={vi.fn()}
        ariaLabel="Custom tabs"
      />,
    );
    const elements = screen.getAllByLabelText('Custom tabs');
    expect(elements.length).toBeGreaterThanOrEqual(1);
  });
});

/* ------------------------------------------------------------------ */
/*  Active tab                                                         */
/* ------------------------------------------------------------------ */

describe('DetailSectionTabs — active tab', () => {
  it('activeTabId ile aktif tab belirlenir', () => {
    const { container } = render(
      <DetailSectionTabs tabs={sampleTabs} activeTabId="details" onTabChange={vi.fn()} />,
    );
    // The SectionTabs internal component should mark the active item
    const activeButton = container.querySelector('[data-state="active"]');
    expect(activeButton).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Sticky                                                             */
/* ------------------------------------------------------------------ */

describe('DetailSectionTabs — sticky', () => {
  it('sticky=true (varsayilan) durumunda sticky class uygular', () => {
    const { container } = render(
      <DetailSectionTabs tabs={sampleTabs} activeTabId="overview" onTabChange={vi.fn()} />,
    );
    const wrapper = container.querySelector('[data-component="detail-section-tabs"]');
    expect(wrapper?.className).toContain('sticky');
  });

  it('sticky=false durumunda sticky class uygulamaz', () => {
    const { container } = render(
      <DetailSectionTabs
        tabs={sampleTabs}
        activeTabId="overview"
        onTabChange={vi.fn()}
        sticky={false}
      />,
    );
    const wrapper = container.querySelector('[data-component="detail-section-tabs"]');
    expect(wrapper?.className).not.toContain('sticky');
  });
});

/* ------------------------------------------------------------------ */
/*  Disabled tabs                                                      */
/* ------------------------------------------------------------------ */

describe('DetailSectionTabs — disabled tabs', () => {
  it('disabled tab icin disabled attribute ayarlanir', () => {
    const tabs: DetailSectionTabItem[] = [
      { id: 'a', label: 'Tab A' },
      { id: 'b', label: 'Tab B', disabled: true },
    ];
    const { container } = render(
      <DetailSectionTabs tabs={tabs} activeTabId="a" onTabChange={vi.fn()} />,
    );
    const buttons = container.querySelectorAll('button');
    const disabledButton = Array.from(buttons).find((btn) => btn.textContent?.includes('Tab B'));
    expect(disabledButton).toBeDisabled();
  });
});

/* ------------------------------------------------------------------ */
/*  Badges                                                             */
/* ------------------------------------------------------------------ */

describe('DetailSectionTabs — badges', () => {
  it('badge prop ile badge gosterir', () => {
    const tabs: DetailSectionTabItem[] = [
      { id: 'a', label: 'Tab A', badge: <span data-testid="tab-badge">3</span> },
    ];
    render(
      <DetailSectionTabs tabs={tabs} activeTabId="a" onTabChange={vi.fn()} />,
    );
    expect(screen.getByTestId('tab-badge')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  testIdPrefix                                                       */
/* ------------------------------------------------------------------ */

describe('DetailSectionTabs — testIdPrefix', () => {
  it('testIdPrefix ile data-testid olusturur', () => {
    const { container } = render(
      <DetailSectionTabs
        tabs={sampleTabs}
        activeTabId="overview"
        onTabChange={vi.fn()}
        testIdPrefix="section"
      />,
    );
    expect(container.querySelector('[data-testid="section-tab-overview"]')).toBeInTheDocument();
  });

  it('tab.dataTestId oncelikli olur', () => {
    const tabs: DetailSectionTabItem[] = [
      { id: 'a', label: 'A', dataTestId: 'custom-test-id' },
    ];
    const { container } = render(
      <DetailSectionTabs
        tabs={tabs}
        activeTabId="a"
        onTabChange={vi.fn()}
        testIdPrefix="prefix"
      />,
    );
    expect(container.querySelector('[data-testid="custom-test-id"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  className                                                          */
/* ------------------------------------------------------------------ */

describe('DetailSectionTabs — className', () => {
  it('className forwarding calisir', () => {
    const { container } = render(
      <DetailSectionTabs
        tabs={sampleTabs}
        activeTabId="overview"
        onTabChange={vi.fn()}
        className="custom-class"
      />,
    );
    const wrapper = container.querySelector('[data-component="detail-section-tabs"]');
    expect(wrapper?.className).toContain('custom-class');
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('DetailSectionTabs — edge cases', () => {
  it('tek tab ile render eder', () => {
    const tabs: DetailSectionTabItem[] = [{ id: 'only', label: 'Only Tab' }];
    render(
      <DetailSectionTabs tabs={tabs} activeTabId="only" onTabChange={vi.fn()} />,
    );
    expect(screen.getByText('Only Tab')).toBeInTheDocument();
  });
});

describe('DetailSectionTabs — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<DetailSectionTabs tabs={[{ id: 'overview', label: 'Overview', content: <div>Content</div> }]} activeTabId="overview" onTabChange={vi.fn()} />);
    await expectNoA11yViolations(container);
  });
});
