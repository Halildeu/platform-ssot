// @vitest-environment jsdom
// Auto-generated contract test
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from '../ThemeProvider';

describe('ThemeProvider — contract', () => {
  it('renders without crash', () => {
    const { container } = render(<ThemeProvider><div>child</div></ThemeProvider>);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('exports a named component', () => {
    expect(typeof ThemeProvider).toBe('function');
  });

  it('renders children', () => {
    const { container } = render(<ThemeProvider><span data-testid="inner">inner</span></ThemeProvider>);
    expect(container.querySelector('[data-testid="inner"]')).toBeTruthy();
  });
});
