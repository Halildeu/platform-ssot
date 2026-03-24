// @vitest-environment jsdom
// Auto-generated contract test
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { VirtualList } from '../VirtualList';

const defaultProps = {
  items: ['a', 'b', 'c'],
  itemHeight: 40,
  containerHeight: 200,
  renderItem: (item: string, index: number, style: React.CSSProperties) => (
    <div key={index} style={style} data-testid={`item-${index}`}>{item}</div>
  ),
};

describe('VirtualList — contract', () => {
  it('renders without crash', () => {
    const { container } = render(<VirtualList {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('exports a named component', () => {
    expect(typeof VirtualList).toBe('function');
  });

  it('renders children', () => {
    const { container } = render(<VirtualList {...defaultProps} />);
    expect(container.querySelector('[data-testid="item-0"]')).toBeTruthy();
  });
});
