// @vitest-environment jsdom
// Auto-generated contract test
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { DirectionProvider } from '../DirectionProvider';

describe('DirectionProvider — contract', () => {
  it('renders without crash', () => {
    const { container } = render(<DirectionProvider><div>child</div></DirectionProvider>);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('exports a named component', () => {
    expect(typeof DirectionProvider).toBe('function');
  });

  it('renders children', () => {
    const { container } = render(<DirectionProvider><span data-testid="inner">inner</span></DirectionProvider>);
    expect(container.querySelector('[data-testid="inner"]')).toBeTruthy();
  });
});
