import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it, vi } from 'vitest';

import { SessionAuditShortcutsMenu } from './SessionAuditShortcutsMenu';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe('SessionAuditShortcutsMenu', () => {
  it('email yoksa render etmez', () => {
    const { container } = render(<SessionAuditShortcutsMenu email="" label="Denetim" />);

    expect(container).toBeEmptyDOMElement();
  });

  it('tetikleyici ile menuyu acar ve secilen kisayolda navigate eder', () => {
    navigateMock.mockReset();
    render(<SessionAuditShortcutsMenu email="admin@example.com" label="Denetim" />);

    fireEvent.click(screen.getByTestId('session-audit-shortcuts-menu-trigger'));

    expect(screen.getByTestId('session-audit-shortcuts-menu')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('session-audit-shortcuts-menu-item-replay-audit-shortcut'));

    expect(navigateMock).toHaveBeenCalledWith({
      pathname: '/audit/events',
      search: 'service=user-service&action=USER_SESSION_TIMEOUT_SYNCED',
    });
  });
});
