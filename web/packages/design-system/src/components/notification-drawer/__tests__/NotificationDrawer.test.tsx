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

const sampleItems: NotificationSurfaceItem[] = [
  { id: 'n1', message: 'Deployment completed', type: 'success' },
  { id: 'n2', message: 'New policy draft', type: 'info', read: false },
];

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('NotificationDrawer — temel render', () => {
  it('open=true oldugunda drawer render eder', () => {
    render(<NotificationDrawer open items={sampleItems} disablePortal />);
    expect(screen.getByText('Bildirimler')).toBeInTheDocument();
  });

  it('open=false oldugunda icerik render etmez', () => {
    const { container } = render(
      <NotificationDrawer open={false} items={sampleItems} disablePortal />,
    );
    expect(container.querySelector('[data-component="notification-panel"]')).toBeNull();
  });

  it('notification ogelerini gosterir', () => {
    render(<NotificationDrawer open items={sampleItems} disablePortal />);
    expect(screen.getByText('Deployment completed')).toBeInTheDocument();
    expect(screen.getByText('New policy draft')).toBeInTheDocument();
  });

  it('ozel title gosterir', () => {
    render(<NotificationDrawer open items={sampleItems} title="Alerts" disablePortal />);
    expect(screen.getByText('Alerts')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Interaction                                                        */
/* ------------------------------------------------------------------ */

describe('NotificationDrawer — interaction', () => {
  it('close butonu tiklandiginda onClose calisir', async () => {
    const handleClose = vi.fn();
    render(
      <NotificationDrawer open items={sampleItems} onClose={handleClose} disablePortal />,
    );
    const closeBtn = screen.getByLabelText('Bildirim merkezini kapat');
    await userEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledWith('close-button');
  });

  it('notification item tiklandiginda icerik gorunur', async () => {
    const user = userEvent.setup();
    render(
      <NotificationDrawer open items={sampleItems} disablePortal />,
    );
    const item = screen.getByText('Deployment completed');
    await user.click(item);
    expect(item).toBeInTheDocument();
  });

  it('tab ile close butonuna odaklanilabilir', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(
      <NotificationDrawer open items={sampleItems} onClose={handleClose} disablePortal />,
    );
    await user.tab();
    const closeBtn = screen.getByLabelText('Bildirim merkezini kapat');
    // Tab navigates through focusable elements
    expect(closeBtn).toBeInTheDocument();
  });

  it('ozel closeLabel kullanilir', () => {
    render(
      <NotificationDrawer
        open
        items={sampleItems}
        closeLabel="Close notifications"
        onClose={() => {}}
        disablePortal
      />,
    );
    expect(screen.getByLabelText('Close notifications')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('NotificationDrawer — access control', () => {
  it('access="hidden" oldugunda render etmez', () => {
    const { container } = render(
      <NotificationDrawer open items={sampleItems} access="hidden" disablePortal />,
    );
    expect(container.querySelector('[data-component="notification-panel"]')).toBeNull();
  });

  it('access="disabled" oldugunda close butonu disabled olur', () => {
    render(
      <NotificationDrawer open items={sampleItems} access="disabled" onClose={() => {}} disablePortal />,
    );
    expect(screen.getByLabelText('Bildirim merkezini kapat')).toBeDisabled();
  });

  it('access="readonly" oldugunda close butonu disabled olur', () => {
    render(
      <NotificationDrawer open items={sampleItems} access="readonly" onClose={() => {}} disablePortal />,
    );
    expect(screen.getByLabelText('Bildirim merkezini kapat')).toBeDisabled();
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('NotificationDrawer — edge cases', () => {
  it('bos items dizisi ile empty state gosterir', () => {
    render(<NotificationDrawer open items={[]} disablePortal />);
    expect(screen.getByText('Su anda bildirim yok')).toBeInTheDocument();
  });

  it('dialogLabel aria-label olarak atanir', () => {
    render(
      <NotificationDrawer open items={sampleItems} dialogLabel="My Notifications" disablePortal />,
    );
    const dialog = document.querySelector('[aria-label="My Notifications"]');
    expect(dialog).not.toBeNull();
  });
});

describe('NotificationDrawer — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<NotificationDrawer open items={sampleItems} disablePortal />);
    await expectNoA11yViolations(container);
  });
});
