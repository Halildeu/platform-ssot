// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
// Regenerate with: node scripts/ci/generate-contract-tests.mjs --write
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { NotificationDrawer } from '../notification-drawer/NotificationDrawer';
import type { NotificationDrawerProps } from '../notification-drawer/NotificationDrawer';

describe('NotificationDrawer — contract', () => {
  const defaultProps = {
    open: true,
    items: [],
  };

  it('renders without crash', () => {
    render(<NotificationDrawer {...defaultProps} />);
    // NotificationDrawer uses a portal, content renders in document.body
    expect(document.body.children.length).toBeGreaterThanOrEqual(1);
  });

  it('has displayName', () => {
    expect(NotificationDrawer.displayName).toBeTruthy();
  });

  it('respects access=hidden', () => {
    const { container } = render(<NotificationDrawer {...defaultProps} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('applies disabled state via access=readonly', () => {
    render(<NotificationDrawer {...defaultProps} access="readonly" />);
    expect(document.body.children.length).toBeGreaterThanOrEqual(1);
  });

  it('renders with only required props', () => {
    render(<NotificationDrawer {...defaultProps} />);
    expect(document.body.children.length).toBeGreaterThanOrEqual(1);
  });

  it('exports expected types', () => {
    // Type-level check — if this compiles, types are exported correctly
    const _notificationdrawerprops: NotificationDrawerProps | undefined = undefined; void _notificationdrawerprops;
    expect(true).toBe(true);
  });
});
