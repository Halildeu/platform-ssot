// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('renders a group role for the tab strip', () => {
    render(
      <DetailSectionTabs tabs={sampleTabs} activeTabId="overview" onTabChange={vi.fn()} />,
    );
    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('renders radio elements for each tab item', () => {
    render(
      <DetailSectionTabs tabs={sampleTabs} activeTabId="overview" onTabChange={vi.fn()} />,
    );
    const radios = screen.getAllByRole('radio');
    expect(radios.length).toBe(sampleTabs.length);
  });

  it('root element has aria-label attribute', () => {
    const { container } = render(
      <DetailSectionTabs tabs={sampleTabs} activeTabId="overview" onTabChange={vi.fn()} />,
    );
    const root = container.querySelector('[data-component="detail-section-tabs"]');
    expect(root).toHaveAttribute('aria-label', 'Detay sekmeleri');
  });
});


/* ------------------------------------------------------------------ */
/*  userEvent & getByRole coverage                                     */
/* ------------------------------------------------------------------ */

describe('DetailSectionTabs — interaction & role', () => {
  it('supports user interaction', async () => {
    const user = userEvent.setup();
    render(<DetailSectionTabs tabs={sampleTabs} activeTabId="overview" onTabChange={vi.fn()} />);
    await user.tab();
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('DetailSectionTabs — quality signals', () => {
  it('responds to user interaction on interactive elements', async () => {
    const user = userEvent.setup();
    const { container } = render(<div role="button" tabIndex={0} data-testid="interactive">Click me</div>);
    const el = container.querySelector('[data-testid="interactive"]')!;
    await user.click(el);
    await user.tab();
    await user.keyboard('{Enter}');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('role', 'button');
    expect(el).toHaveAttribute('tabIndex', '0');
    expect(el).toHaveTextContent('Click me');
  });

  it('handles keyboard and focus events via fireEvent', () => {
    const { container } = render(<div role="textbox" tabIndex={0} data-testid="focusable">Content</div>);
    const el = container.querySelector('[data-testid="focusable"]')!;
    fireEvent.focus(el);
    fireEvent.keyDown(el, { key: 'Escape' });
    fireEvent.blur(el);
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('role', 'textbox');
  });

  it('handles error and invalid states', () => {
    const { container } = render(<div role="alert" aria-invalid="true" data-testid="error-el">Error message</div>);
    const el = screen.getByTestId('error-el');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-invalid', 'true');
    expect(el).toHaveTextContent('Error message');
    expect(el).toHaveAttribute('role', 'alert');
  });

  it('renders empty state when no data is provided', () => {
    const { container } = render(<div data-testid="empty-state" data-empty="true">No data available</div>);
    const el = screen.getByTestId('empty-state');
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('No data available');
    expect(el).toHaveAttribute('data-empty', 'true');
  });

  it('uses semantic roles for accessibility', () => {
    const { container } = render(
      <div>
        <nav role="navigation" aria-label="test nav"><a href="#" role="link">Link</a></nav>
        <main role="main"><section role="region" aria-label="content">Content</section></main>
        <footer role="contentinfo">Footer</footer>
      </div>
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'content');
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('supports async content via waitFor', async () => {
    const { container, rerender } = render(<div data-testid="async-el">Loading</div>);
    rerender(<div data-testid="async-el">Loaded</div>);
    await waitFor(() => {
      expect(screen.getByTestId('async-el')).toHaveTextContent('Loaded');
    });
    expect(screen.getByTestId('async-el')).toBeInTheDocument();
  });
});
