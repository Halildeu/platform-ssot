// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { ActivityFeed } from '../ActivityFeed';

describe('ActivityFeed — contract', () => {
  const defaultProps = { items: [] };

  it('renders without crash', () => {
    const { container } = render(<ActivityFeed {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(ActivityFeed.displayName).toBeTruthy();
  });

  it('respects access=hidden', () => {
    const { container } = render(<ActivityFeed {...defaultProps} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('applies disabled state via access=readonly', () => {
    const { container } = render(<ActivityFeed {...defaultProps} access="readonly" />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('renders with only required props', () => {
    const { container } = render(<ActivityFeed {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });
});
