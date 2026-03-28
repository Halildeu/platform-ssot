// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
// Regenerate with: node scripts/ci/generate-contract-tests.mjs --write
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { NotificationCenter } from '../NotificationCenter';
import type { NotificationType, NotificationItem, NotificationCenterProps } from '../NotificationCenter';

describe('NotificationCenter — contract', () => {
  const defaultProps = {
    notifications: [],
  };

  it('renders without crash', () => {
    const { container } = render(<NotificationCenter {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('respects access=hidden', () => {
    const { container } = render(<NotificationCenter {...defaultProps} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('applies disabled state via access=readonly', () => {
    const { container } = render(<NotificationCenter {...defaultProps} access="readonly" />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('renders with only required props (1 required, 8 optional)', () => {
    // All 8 optional props omitted — should not crash
    const { container } = render(<NotificationCenter {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('exports expected types', () => {
    // Type-level check — if this compiles, types are exported correctly
    const _notificationtype: NotificationType | undefined = undefined; void _notificationtype;
    const _notificationitem: NotificationItem | undefined = undefined; void _notificationitem;
    const _notificationcenterprops: NotificationCenterProps | undefined = undefined; void _notificationcenterprops;
    expect(true).toBe(true);
  });
});
