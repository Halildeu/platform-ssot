import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock child component to isolate AuditApp
jest.mock('./AuditEventFeed', () => ({
  AuditEventFeed: () => <div data-testid="mock-audit-event-feed" />,
}));

import { AuditApp } from './AuditApp';

describe('AuditApp', () => {
  it('renders the page with correct test id', () => {
    render(<AuditApp />);
    expect(screen.getByTestId('audit-events-page')).toBeTruthy();
  });

  it('renders the page title', () => {
    render(<AuditApp />);
    expect(screen.getByText('Audit Event Feed')).toBeTruthy();
  });

  it('renders the page description', () => {
    render(<AuditApp />);
    expect(
      screen.getByText('Monitor system-wide audit events, inspect diffs and export reports.'),
    ).toBeTruthy();
  });

  it('renders the AuditEventFeed child component', () => {
    render(<AuditApp />);
    expect(screen.getByTestId('mock-audit-event-feed')).toBeTruthy();
  });

  it('wraps content in a main element', () => {
    render(<AuditApp />);
    const main = screen.getByTestId('audit-events-page');
    expect(main.tagName).toBe('MAIN');
  });

  it('renders a header element inside main', () => {
    render(<AuditApp />);
    const main = screen.getByTestId('audit-events-page');
    const header = main.querySelector('header');
    expect(header).not.toBeNull();
  });
});
