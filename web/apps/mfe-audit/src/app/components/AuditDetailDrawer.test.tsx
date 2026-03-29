// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { AuditDetailDrawer, AuditDetailDrawerProps } from './AuditDetailDrawer';
import { AuditEvent } from '../types/audit-event';

// Mock design-system DetailDrawer
vi.mock('@mfe/design-system', () => ({
  DetailDrawer: ({
    open,
    onClose,
    title,
    children,
    tabs,
    extra,
  }: {
    open: boolean;
    onClose: () => void;
    title: string;
    children?: React.ReactNode;
    tabs?: Array<{ key: string; label: string; sections: Array<{ key: string; content: React.ReactNode }> }>;
    extra?: React.ReactNode;
  }) => {
    if (!open) return null;
    return (
      <div data-testid="detail-drawer">
        <div data-testid="drawer-title">{title}</div>
        {extra && <div data-testid="drawer-extra">{extra}</div>}
        {children}
        {tabs?.map((tab) => (
          <div key={tab.key} data-testid={`tab-${tab.key}`}>
            <span>{tab.label}</span>
            {tab.sections.map((s) => (
              <div key={s.key}>{s.content}</div>
            ))}
          </div>
        ))}
      </div>
    );
  },
}));

const baseEvent: AuditEvent = {
  id: 'ev-1',
  timestamp: '2024-06-15T10:30:00Z',
  userEmail: 'admin@example.com',
  service: 'auth-service',
  level: 'WARN',
  action: 'SESSION_EXPIRED',
  details: 'Session timed out',
  correlationId: 'corr-abc',
  metadata: { browser: 'Chrome' },
  before: { active: true },
  after: { active: false },
};

afterEach(() => { cleanup(); });

describe('AuditDetailDrawer', () => {
  const defaultProps: AuditDetailDrawerProps = {
    event: baseEvent,
    open: true,
    onClose: vi.fn(),
  };

  it('renders nothing when open is false', () => {
    render(<AuditDetailDrawer {...defaultProps} open={false} />);
    expect(screen.queryByTestId('detail-drawer')).toBeNull();
  });

  it('shows placeholder text when event is null', () => {
    render(<AuditDetailDrawer event={null} open={true} onClose={vi.fn()} />);
    expect(screen.getByText(/Henüz bir kayıt seçilmedi/)).toBeTruthy();
  });

  it('renders the summary tab with event details', () => {
    render(<AuditDetailDrawer {...defaultProps} />);
    expect(screen.getByTestId('audit-detail-summary')).toBeTruthy();
    expect(screen.getByText('admin@example.com')).toBeTruthy();
    expect(screen.getByText('auth-service')).toBeTruthy();
    expect(screen.getByText('WARN')).toBeTruthy();
    expect(screen.getByText('corr-abc')).toBeTruthy();
    expect(screen.getByText('Session timed out')).toBeTruthy();
  });

  it('renders the diff tab when before and after exist', () => {
    render(<AuditDetailDrawer {...defaultProps} />);
    expect(screen.getByTestId('tab-diff')).toBeTruthy();
    expect(screen.getByText('Before')).toBeTruthy();
    expect(screen.getByText('After')).toBeTruthy();
  });

  it('does not render diff tab when before and after are null', () => {
    const eventWithoutDiff: AuditEvent = {
      ...baseEvent,
      before: null,
      after: null,
    };
    render(<AuditDetailDrawer {...defaultProps} event={eventWithoutDiff} />);
    expect(screen.queryByTestId('tab-diff')).toBeNull();
  });

  it('renders the raw JSON tab', () => {
    render(<AuditDetailDrawer {...defaultProps} />);
    expect(screen.getByTestId('audit-detail-raw')).toBeTruthy();
  });

  it('renders metadata when present', () => {
    render(<AuditDetailDrawer {...defaultProps} />);
    expect(screen.getByText('Metadata')).toBeTruthy();
  });

  it('shows the action in the extra slot', () => {
    render(<AuditDetailDrawer {...defaultProps} />);
    expect(screen.getByText('SESSION_EXPIRED')).toBeTruthy();
  });

  it('shows dash for missing correlationId', () => {
    const eventNoCorr: AuditEvent = {
      ...baseEvent,
      correlationId: undefined,
    };
    render(<AuditDetailDrawer {...defaultProps} event={eventNoCorr} />);
    // The correlation ID field should show a dash
    const summaryEl = screen.getByTestId('audit-detail-summary');
    expect(summaryEl.textContent).toContain('—');
  });
});
