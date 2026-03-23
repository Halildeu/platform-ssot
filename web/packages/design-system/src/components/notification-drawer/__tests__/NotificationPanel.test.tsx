// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotificationPanel } from '../NotificationPanel';
import type { NotificationSurfaceItem } from '../NotificationItemCard';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Test data                                                          */
/* ------------------------------------------------------------------ */

const now = Date.now();
const yesterday = now - 86_400_000;
const olderDate = now - 86_400_000 * 5;

const sampleItems: NotificationSurfaceItem[] = [
  { id: 'n1', message: 'Build succeeded', type: 'success', read: false, priority: 'normal', createdAt: now },
  { id: 'n2', message: 'Disk space low', type: 'warning', read: false, priority: 'high', createdAt: now },
  { id: 'n3', message: 'User logged in', type: 'info', read: true, createdAt: yesterday },
  { id: 'n4', message: 'Old event', type: 'info', read: true, pinned: true, createdAt: olderDate },
];

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('NotificationPanel — temel render', () => {
  it('panel render eder', () => {
    render(<NotificationPanel items={sampleItems} />);
    expect(screen.getByText('Bildirimler')).toBeInTheDocument();
  });

  it('ozel title gosterir', () => {
    render(<NotificationPanel items={sampleItems} title="Alerts" />);
    expect(screen.getByText('Alerts')).toBeInTheDocument();
  });

  it('summary label gosterir', () => {
    render(<NotificationPanel items={sampleItems} />);
    // 2 unread, 4 total
    expect(screen.getByText(/2 okunmamis/)).toBeInTheDocument();
  });

  it('ozel summaryLabel gosterir', () => {
    render(<NotificationPanel items={sampleItems} summaryLabel="Custom summary" />);
    expect(screen.getByText('Custom summary')).toBeInTheDocument();
  });

  it('tum notification ogelerini render eder', () => {
    render(<NotificationPanel items={sampleItems} />);
    expect(screen.getByText('Build succeeded')).toBeInTheDocument();
    expect(screen.getByText('Disk space low')).toBeInTheDocument();
    expect(screen.getByText('User logged in')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Empty state                                                        */
/* ------------------------------------------------------------------ */

describe('NotificationPanel — empty state', () => {
  it('bos items ile empty state gosterir', () => {
    render(<NotificationPanel items={[]} />);
    expect(screen.getByText('Su anda bildirim yok')).toBeInTheDocument();
  });

  it('ozel emptyTitle ve emptyDescription gosterir', () => {
    render(<NotificationPanel items={[]} emptyTitle="No alerts" emptyDescription="Everything is fine" />);
    expect(screen.getByText('No alerts')).toBeInTheDocument();
    expect(screen.getByText('Everything is fine')).toBeInTheDocument();
  });

  it('filtreleme sonucu bos oldugunda filteredEmptyTitle gosterir', () => {
    const items: NotificationSurfaceItem[] = [
      { id: 'n1', message: 'Read item', read: true },
    ];
    render(<NotificationPanel items={items} showFilters activeFilter="unread" />);
    expect(screen.getByText('Bu filtre icin bildirim yok')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Filtreler                                                          */
/* ------------------------------------------------------------------ */

describe('NotificationPanel — filtreler', () => {
  it('showFilters=true oldugunda filter butonlari gosterir', () => {
    render(<NotificationPanel items={sampleItems} showFilters />);
    expect(screen.getByText(/Tumu/)).toBeInTheDocument();
    expect(screen.getByText(/Okunmamis/)).toBeInTheDocument();
  });

  it('filter tiklandiginda onFilterChange calisir', async () => {
    const handleFilterChange = vi.fn();
    render(
      <NotificationPanel items={sampleItems} showFilters onFilterChange={handleFilterChange} />,
    );
    await userEvent.click(screen.getByText(/Okunmamis/));
    expect(handleFilterChange).toHaveBeenCalledWith('unread');
  });

  it('ozel filterLabels kullanilir', () => {
    render(
      <NotificationPanel
        items={sampleItems}
        showFilters
        filterLabels={{ all: 'Everything', unread: 'New' }}
      />,
    );
    expect(screen.getByText(/Everything/)).toBeInTheDocument();
    expect(screen.getByText(/New/)).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Aksiyonlar                                                         */
/* ------------------------------------------------------------------ */

describe('NotificationPanel — aksiyonlar', () => {
  it('onMarkAllRead tiklandiginda calisir', async () => {
    const handleMarkAllRead = vi.fn();
    render(<NotificationPanel items={sampleItems} onMarkAllRead={handleMarkAllRead} />);
    await userEvent.click(screen.getByText('Tumunu okundu say'));
    expect(handleMarkAllRead).toHaveBeenCalledTimes(1);
  });

  it('onClear tiklandiginda calisir', async () => {
    const handleClear = vi.fn();
    render(<NotificationPanel items={sampleItems} onClear={handleClear} />);
    await userEvent.click(screen.getByText('Temizle'));
    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it('headerAccessory render eder', () => {
    render(
      <NotificationPanel
        items={sampleItems}
        headerAccessory={<button data-testid="custom-accessory">Custom</button>}
      />,
    );
    expect(screen.getByTestId('custom-accessory')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Gruplama                                                           */
/* ------------------------------------------------------------------ */

describe('NotificationPanel — gruplama', () => {
  it('grouping="priority" ile section etiketleri gosterir', () => {
    render(<NotificationPanel items={sampleItems} grouping="priority" />);
    expect(screen.getByText('Yuksek oncelik')).toBeInTheDocument();
  });

  it('dateGrouping="relative-day" ile tarih etiketleri gosterir', () => {
    render(
      <NotificationPanel
        items={sampleItems}
        dateGrouping="relative-day"
        dateGroupingReferenceTime={now}
      />,
    );
    expect(screen.getByText('Bugun')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Secim (selectable)                                                 */
/* ------------------------------------------------------------------ */

describe('NotificationPanel — secim', () => {
  it('selectable=true oldugunda checkbox render eder', () => {
    render(<NotificationPanel items={sampleItems} selectable />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThanOrEqual(sampleItems.length);
  });

  it('onSelectedIdsChange callback calisir', async () => {
    const handleChange = vi.fn();
    render(
      <NotificationPanel items={sampleItems} selectable onSelectedIdsChange={handleChange} />,
    );
    const checkboxes = screen.getAllByRole('checkbox');
    await userEvent.click(checkboxes[0]);
    expect(handleChange).toHaveBeenCalled();
  });

  it('selectVisibleLabel butonu gorunur', () => {
    render(<NotificationPanel items={sampleItems} selectable />);
    expect(screen.getByText('Gorunenleri sec')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('NotificationPanel — access control', () => {
  it('access="hidden" oldugunda render etmez', () => {
    const { container } = render(<NotificationPanel items={sampleItems} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('access="disabled" oldugunda aksiyon butonlari disabled olur', () => {
    render(<NotificationPanel items={sampleItems} access="disabled" onMarkAllRead={() => {}} />);
    expect(screen.getByText('Tumunu okundu say')).toBeDisabled();
  });

  it('accessReason title olarak atanir', () => {
    render(<NotificationPanel items={sampleItems} accessReason="No access" />);
    const panel = document.querySelector('[data-component="notification-panel"]');
    expect(panel).toHaveAttribute('title', 'No access');
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('NotificationPanel — edge cases', () => {
  it('className forwarding calisir', () => {
    render(<NotificationPanel items={sampleItems} className="custom-panel" />);
    const panel = document.querySelector('[data-component="notification-panel"]');
    expect(panel?.className).toContain('custom-panel');
  });

  it('data-surface-appearance="premium" mevcut', () => {
    render(<NotificationPanel items={sampleItems} />);
    const panel = document.querySelector('[data-component="notification-panel"]');
    expect(panel).toHaveAttribute('data-surface-appearance', 'premium');
  });
});

describe('NotificationPanel — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<NotificationPanel items={sampleItems} />);
    await expectNoA11yViolations(container);
  });

  it('panel section is accessible via role', () => {
    const { container } = render(<NotificationPanel items={sampleItems} />);
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('action buttons are accessible via role', () => {
    render(
      <NotificationPanel items={sampleItems} onMarkAllRead={() => {}} onClear={() => {}} />,
    );
    expect(screen.getByRole('button', { name: /okundu/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /temizle/i })).toBeInTheDocument();
  });

  it('filter buttons are accessible via role when showFilters', () => {
    render(<NotificationPanel items={sampleItems} showFilters />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it('selectable checkboxes have accessible roles', () => {
    render(<NotificationPanel items={sampleItems} selectable />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThanOrEqual(1);
  });
});
