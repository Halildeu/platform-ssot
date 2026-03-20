// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotificationDrawer } from '../NotificationDrawer';
import type { NotificationSurfaceItem } from '../NotificationItemCard';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Test data                                                          */
/* ------------------------------------------------------------------ */

const loadingItems: NotificationSurfaceItem[] = [
  { id: 'l1', message: 'Syncing data...', type: 'loading', read: false },
  { id: 'l2', message: 'Processing request...', type: 'loading', read: false },
];

const multipleItems: NotificationSurfaceItem[] = [
  { id: 'n1', message: 'Deployment completed', type: 'success', read: false },
  { id: 'n2', message: 'New policy draft', type: 'info', read: false },
  { id: 'n3', message: 'Disk space warning', type: 'warning', read: true },
  { id: 'n4', message: 'Build failed', type: 'error', read: false },
  { id: 'n5', message: 'User logged in', type: 'info', read: true },
];

/* ------------------------------------------------------------------ */
/*  Contract: Loading state                                            */
/* ------------------------------------------------------------------ */

describe('NotificationDrawer contract — loading state', () => {
  it('renders items with type="loading"', () => {
    render(<NotificationDrawer open items={loadingItems} disablePortal />);
    expect(screen.getByText('Syncing data...')).toBeInTheDocument();
    expect(screen.getByText('Processing request...')).toBeInTheDocument();
  });

  it('displays LOADING badge for loading-type items', () => {
    render(<NotificationDrawer open items={loadingItems} disablePortal />);
    const badges = screen.getAllByText('LOADING');
    expect(badges).toHaveLength(loadingItems.length);
  });

  it('shows unread count in summary for loading items', () => {
    render(<NotificationDrawer open items={loadingItems} disablePortal />);
    expect(screen.getByText(/2 okunmamis/)).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Empty notifications state                                */
/* ------------------------------------------------------------------ */

describe('NotificationDrawer contract — empty notifications', () => {
  it('shows default empty title when items is empty', () => {
    render(<NotificationDrawer open items={[]} disablePortal />);
    expect(screen.getByText('Su anda bildirim yok')).toBeInTheDocument();
  });

  it('shows default empty description when items is empty', () => {
    render(<NotificationDrawer open items={[]} disablePortal />);
    expect(screen.getByText('Yeni olaylar geldiginde burada gorunecek.')).toBeInTheDocument();
  });

  it('accepts custom emptyTitle and emptyDescription', () => {
    render(
      <NotificationDrawer
        open
        items={[]}
        emptyTitle="Nothing here"
        emptyDescription="Check back later"
        disablePortal
      />,
    );
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
    expect(screen.getByText('Check back later')).toBeInTheDocument();
  });

  it('does not render action buttons when items is empty', () => {
    const handleMarkAllRead = vi.fn();
    render(
      <NotificationDrawer
        open
        items={[]}
        onMarkAllRead={handleMarkAllRead}
        disablePortal
      />,
    );
    expect(screen.getByText('Tumunu okundu say')).toBeDisabled();
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Multiple notifications rendering                         */
/* ------------------------------------------------------------------ */

describe('NotificationDrawer contract — multiple notifications', () => {
  it('renders all notification items', () => {
    render(<NotificationDrawer open items={multipleItems} disablePortal />);
    for (const item of multipleItems) {
      expect(screen.getByText(item.message)).toBeInTheDocument();
    }
  });

  it('displays correct unread count in summary', () => {
    render(<NotificationDrawer open items={multipleItems} disablePortal />);
    // 3 unread (n1, n2, n4), 5 total
    expect(screen.getByText(/3 okunmamis/)).toBeInTheDocument();
  });

  it('renders correct type badges for each item', () => {
    render(<NotificationDrawer open items={multipleItems} disablePortal />);
    expect(screen.getByText('SUCCESS')).toBeInTheDocument();
    expect(screen.getAllByText('INFO')).toHaveLength(2);
    expect(screen.getByText('WARNING')).toBeInTheDocument();
    expect(screen.getByText('ERROR')).toBeInTheDocument();
  });

  it('uses custom title', () => {
    render(
      <NotificationDrawer open items={multipleItems} title="System Alerts" disablePortal />,
    );
    expect(screen.getByText('System Alerts')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Mark as read callback                                    */
/* ------------------------------------------------------------------ */

describe('NotificationDrawer contract — mark as read callback', () => {
  it('fires onMarkAllRead when mark-all-read button is clicked', async () => {
    const handleMarkAllRead = vi.fn();
    render(
      <NotificationDrawer
        open
        items={multipleItems}
        onMarkAllRead={handleMarkAllRead}
        disablePortal
      />,
    );
    await userEvent.click(screen.getByText('Tumunu okundu say'));
    expect(handleMarkAllRead).toHaveBeenCalledTimes(1);
  });

  it('mark-all-read button is disabled when access is disabled', () => {
    render(
      <NotificationDrawer
        open
        items={multipleItems}
        onMarkAllRead={() => {}}
        access="disabled"
        disablePortal
      />,
    );
    expect(screen.getByText('Tumunu okundu say')).toBeDisabled();
  });

  it('mark-all-read button is disabled when access is readonly', () => {
    render(
      <NotificationDrawer
        open
        items={multipleItems}
        onMarkAllRead={() => {}}
        access="readonly"
        disablePortal
      />,
    );
    expect(screen.getByText('Tumunu okundu say')).toBeDisabled();
  });

  it('accepts custom markAllReadLabel', () => {
    render(
      <NotificationDrawer
        open
        items={multipleItems}
        onMarkAllRead={() => {}}
        markAllReadLabel="Mark all as read"
        disablePortal
      />,
    );
    expect(screen.getByText('Mark all as read')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Close / dismiss callback                                 */
/* ------------------------------------------------------------------ */

describe('NotificationDrawer contract — close/dismiss callback', () => {
  it('fires onClose with "close-button" reason when close button clicked', async () => {
    const handleClose = vi.fn();
    render(
      <NotificationDrawer open items={multipleItems} onClose={handleClose} disablePortal />,
    );
    await userEvent.click(screen.getByLabelText('Bildirim merkezini kapat'));
    expect(handleClose).toHaveBeenCalledWith('close-button');
  });

  it('close button is disabled when access is disabled', () => {
    render(
      <NotificationDrawer
        open
        items={multipleItems}
        onClose={() => {}}
        access="disabled"
        disablePortal
      />,
    );
    expect(screen.getByLabelText('Bildirim merkezini kapat')).toBeDisabled();
  });

  it('close button uses custom closeLabel', () => {
    render(
      <NotificationDrawer
        open
        items={multipleItems}
        onClose={() => {}}
        closeLabel="Dismiss panel"
        disablePortal
      />,
    );
    expect(screen.getByLabelText('Dismiss panel')).toBeInTheDocument();
  });

  it('fires onClear when clear button is clicked', async () => {
    const handleClear = vi.fn();
    render(
      <NotificationDrawer
        open
        items={multipleItems}
        onClear={handleClear}
        disablePortal
      />,
    );
    await userEvent.click(screen.getByText('Temizle'));
    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it('fires onRemoveItem when individual item remove is clicked', async () => {
    const handleRemoveItem = vi.fn();
    render(
      <NotificationDrawer
        open
        items={[{ id: 'r1', message: 'Removable notification' }]}
        onRemoveItem={handleRemoveItem}
        disablePortal
      />,
    );
    await userEvent.click(screen.getByLabelText('Bildirimi kapat'));
    expect(handleRemoveItem).toHaveBeenCalledWith('r1');
  });
});

describe('NotificationDrawer — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<NotificationDrawer open items={[]} disablePortal />);
    await expectNoA11yViolations(container);
  });
});
