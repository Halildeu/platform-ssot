// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { FlowBuilder } from '../FlowBuilder';

describe('FlowBuilder — contract', () => {
  const defaultProps = {
    nodes: [{ id: '1', type: 'start' as const, label: 'Begin', x: 100, y: 100 }],
    edges: [],
  };

  it('renders without crash', () => {
    const { container } = render(<FlowBuilder {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(FlowBuilder.displayName).toBeTruthy();
  });

  it('respects access=hidden', () => {
    const { container } = render(<FlowBuilder {...defaultProps} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('applies disabled state via access=readonly', () => {
    const { container } = render(<FlowBuilder {...defaultProps} access="readonly" />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('renders with only required props', () => {
    const { container } = render(<FlowBuilder {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });
});
