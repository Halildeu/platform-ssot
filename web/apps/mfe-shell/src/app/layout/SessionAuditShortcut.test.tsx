// @vitest-environment jsdom
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it, vi } from 'vitest';

import { SessionAuditShortcut } from './SessionAuditShortcut';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe('SessionAuditShortcut', () => {
  it('email varsa deeplink ile audit ekranina gider', () => {
    navigateMock.mockReset();
    render(<SessionAuditShortcut email="admin@example.com" />);

    fireEvent.click(screen.getByTestId('session-audit-shortcut'));

    expect(navigateMock).toHaveBeenCalledWith({
      pathname: '/audit/events',
      search: 'service=auth-service&action=SESSION_CREATED',
    });
  });

  it('replay shortcut user-service success filtresi ile gider', () => {
    navigateMock.mockReset();
    render(<SessionAuditShortcut email="admin@example.com" variant="replay" />);

    fireEvent.click(screen.getByTestId('replay-audit-shortcut'));

    expect(navigateMock).toHaveBeenCalledWith({
      pathname: '/audit/events',
      search: 'service=user-service&action=USER_SESSION_TIMEOUT_SYNCED',
    });
  });

  it('replay conflict shortcut user-service conflict filtresi ile gider', () => {
    navigateMock.mockReset();
    render(<SessionAuditShortcut email="admin@example.com" variant="replay-conflict" />);

    fireEvent.click(screen.getByTestId('replay-conflict-audit-shortcut'));

    expect(navigateMock).toHaveBeenCalledWith({
      pathname: '/audit/events',
      search: 'service=user-service&action=USER_SESSION_TIMEOUT_SYNC_CONFLICT',
    });
  });

  it('notification replay shortcut user-service notification success filtresi ile gider', () => {
    navigateMock.mockReset();
    render(<SessionAuditShortcut email="admin@example.com" variant="notification-replay" />);

    fireEvent.click(screen.getByTestId('notification-replay-audit-shortcut'));

    expect(navigateMock).toHaveBeenCalledWith({
      pathname: '/audit/events',
      search: 'service=user-service&action=USER_NOTIFICATION_PREFERENCE_SYNCED',
    });
  });

  it('notification replay conflict shortcut user-service notification conflict filtresi ile gider', () => {
    navigateMock.mockReset();
    render(<SessionAuditShortcut email="admin@example.com" variant="notification-replay-conflict" />);

    fireEvent.click(screen.getByTestId('notification-replay-conflict-audit-shortcut'));

    expect(navigateMock).toHaveBeenCalledWith({
      pathname: '/audit/events',
      search: 'service=user-service&action=USER_NOTIFICATION_PREFERENCE_SYNC_CONFLICT',
    });
  });

  it('locale replay shortcut user-service locale success filtresi ile gider', () => {
    navigateMock.mockReset();
    render(<SessionAuditShortcut email="admin@example.com" variant="locale-replay" />);

    fireEvent.click(screen.getByTestId('locale-replay-audit-shortcut'));

    expect(navigateMock).toHaveBeenCalledWith({
      pathname: '/audit/events',
      search: 'service=user-service&action=USER_LOCALE_SYNCED',
    });
  });

  it('locale replay conflict shortcut user-service locale conflict filtresi ile gider', () => {
    navigateMock.mockReset();
    render(<SessionAuditShortcut email="admin@example.com" variant="locale-replay-conflict" />);

    fireEvent.click(screen.getByTestId('locale-replay-conflict-audit-shortcut'));

    expect(navigateMock).toHaveBeenCalledWith({
      pathname: '/audit/events',
      search: 'service=user-service&action=USER_LOCALE_SYNC_CONFLICT',
    });
  });

  it('timezone replay shortcut user-service timezone success filtresi ile gider', () => {
    navigateMock.mockReset();
    render(<SessionAuditShortcut email="admin@example.com" variant="timezone-replay" />);

    fireEvent.click(screen.getByTestId('timezone-replay-audit-shortcut'));

    expect(navigateMock).toHaveBeenCalledWith({
      pathname: '/audit/events',
      search: 'service=user-service&action=USER_TIMEZONE_SYNCED',
    });
  });

  it('timezone replay conflict shortcut user-service timezone conflict filtresi ile gider', () => {
    navigateMock.mockReset();
    render(<SessionAuditShortcut email="admin@example.com" variant="timezone-replay-conflict" />);

    fireEvent.click(screen.getByTestId('timezone-replay-conflict-audit-shortcut'));

    expect(navigateMock).toHaveBeenCalledWith({
      pathname: '/audit/events',
      search: 'service=user-service&action=USER_TIMEZONE_SYNC_CONFLICT',
    });
  });

  it('date format replay shortcut user-service date format success filtresi ile gider', () => {
    navigateMock.mockReset();
    render(<SessionAuditShortcut email="admin@example.com" variant="date-format-replay" />);

    fireEvent.click(screen.getByTestId('date-format-replay-audit-shortcut'));

    expect(navigateMock).toHaveBeenCalledWith({
      pathname: '/audit/events',
      search: 'service=user-service&action=USER_DATE_FORMAT_SYNCED',
    });
  });

  it('date format replay conflict shortcut user-service date format conflict filtresi ile gider', () => {
    navigateMock.mockReset();
    render(<SessionAuditShortcut email="admin@example.com" variant="date-format-replay-conflict" />);

    fireEvent.click(screen.getByTestId('date-format-replay-conflict-audit-shortcut'));

    expect(navigateMock).toHaveBeenCalledWith({
      pathname: '/audit/events',
      search: 'service=user-service&action=USER_DATE_FORMAT_SYNC_CONFLICT',
    });
  });

  it('time format replay shortcut user-service time format success filtresi ile gider', () => {
    navigateMock.mockReset();
    render(<SessionAuditShortcut email="admin@example.com" variant="time-format-replay" />);

    fireEvent.click(screen.getByTestId('time-format-replay-audit-shortcut'));

    expect(navigateMock).toHaveBeenCalledWith({
      pathname: '/audit/events',
      search: 'service=user-service&action=USER_TIME_FORMAT_SYNCED',
    });
  });

  it('time format replay conflict shortcut user-service time format conflict filtresi ile gider', () => {
    navigateMock.mockReset();
    render(<SessionAuditShortcut email="admin@example.com" variant="time-format-replay-conflict" />);

    fireEvent.click(screen.getByTestId('time-format-replay-conflict-audit-shortcut'));

    expect(navigateMock).toHaveBeenCalledWith({
      pathname: '/audit/events',
      search: 'service=user-service&action=USER_TIME_FORMAT_SYNC_CONFLICT',
    });
  });

  it('email yoksa render etmez', () => {
    const { container } = render(<SessionAuditShortcut email="" />);

    expect(container).toBeEmptyDOMElement();
  });
});
